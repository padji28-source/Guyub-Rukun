import express from "express";
import path from "path";
import mongoose from "mongoose";

export const app = express();
const PORT = Number(process.env.PORT) || 3000;

// 1. Database Connection Management (Optimized for Vercel)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://muhammadadji:28April1996!@guyubrukun.ylesvlo.mongodb.net/guyubrukun?appName=guyubrukun";

let cachedDb: any = null;

async function connectDB() {
  if (cachedDb) return cachedDb;

  if (!MONGODB_URI) {
    console.warn("MONGODB_URI is not set.");
    return null;
  }

  try {
    // Mematikan buffering agar operasi tidak 'hang' saat koneksi lambat
    mongoose.set('bufferCommands', false);
    
    const opts = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      maxPoolSize: 10, // Membatasi pool size untuk serverless
    };

    cachedDb = await mongoose.connect(MONGODB_URI, opts);
    console.log("Connected to MongoDB");
    return cachedDb;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    return null;
  }
}

// 2. Middleware & Config
app.use(express.json({ limit: "10mb" })); // Mengurangi limit agar parsing lebih cepat jika tidak butuh 50mb
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Middleware koneksi DB yang non-blocking untuk request pertama
app.use(async (req, res, next) => {
  if (!cachedDb) {
    connectDB().catch(err => console.error("Background DB connect failed", err));
  }
  next();
});

// 3. Schema & Models
const SystemDataSchema = new mongoose.Schema({
  _id: String,
  data: mongoose.Schema.Types.Mixed
}, { strict: false, timestamps: true });

const SystemDataModel = mongoose.models.SystemData || mongoose.model("SystemData", SystemDataSchema);

// 4. In-Memory Cache
let memoryStorage: Record<string, any> = {};

// 5. Data Access Helpers
async function getDocData(id: string) {
  if (memoryStorage[id]) return memoryStorage[id];

  try {
    await connectDB();
    const doc = await SystemDataModel.findById(id).lean(); // Gunakan lean() agar lebih cepat
    if (doc) {
      memoryStorage[id] = doc.data;
      return doc.data;
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function setDocData(id: string, data: any) {
  memoryStorage[id] = data;
  
  // Background save (tidak memblokir response ke user)
  connectDB().then(() => {
    SystemDataModel.findByIdAndUpdate(id, { data }, { upsert: true }).catch(() => {});
  });
}

// 6. DB Initialization (Optimized)
async function initDb() {
  await connectDB();
  try {
    // Jalankan pengecekan secara paralel (Promise.all)
    const [users, appData] = await Promise.all([
      getUsers(),
      getAppData()
    ]);

    const tasks: Promise<any>[] = [];

    // Init Admin if not exists
    if (!users.find((u: any) => u.username === "ketuart")) {
      users.push({
        id: "admin",
        username: "ketuart",
        password: "123456",
        nama: "Ketua RT",
        role: "admin",
        isApproved: true,
        status: "Ketua RT 04 / RW 01"
      });
      tasks.push(saveUsers(users));
    }

    // Init Emergency Contacts
    if (!appData.darurat || appData.darurat.length === 0) {
      appData.darurat = [
        { id: "d1", name: 'Ambulance & Gawat Darurat', tel: '118', type: 'Medis' },
        { id: "d2", name: 'Polisi', tel: '110', type: 'Keamanan' },
        { id: "d3", name: 'Pemadam Kebakaran', tel: '113', type: 'Kebakaran' },
        { id: "d4", name: 'Ketua RT', tel: '081234567890', type: 'Lingkungan' },
        { id: "d5", name: 'Security Pos Depan', tel: '089876543210', type: 'Keamanan' }
      ];
      tasks.push(saveAppData(appData));
    }

    if (tasks.length > 0) await Promise.all(tasks);
  } catch (e) {
    console.error("Init error ignored for speed");
  }
}

// 7. Core Logic & SSE
const clients = new Set<any>();

function broadcastEvent(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) {
    try {
      client.write(payload);
    } catch {
      clients.delete(client);
    }
  }
}

async function getUsers() {
  const data = await getDocData('users');
  return data?.list || [];
}

async function saveUsers(users: any) {
  await setDocData('users', { list: users });
  broadcastEvent('update', { type: 'users' });
}

async function getNotifications() {
  const data = await getDocData('notifications');
  return data?.list || [];
}

async function saveNotifications(notifs: any) {
  await setDocData('notifications', { list: notifs });
  broadcastEvent('update', { type: 'notifications' });
}

async function getAppData() {
  const doc = await getDocData('app_data');
  const data = doc?.data || doc || {};
  
  const resources = ['surat', 'laporan', 'acara', 'umkm', 'kas', 'iuran', 'darurat', 'tamu', 'media'];
  resources.forEach(res => { if (!data[res]) data[res] = []; });
  
  return data;
}

async function saveAppData(data: any) {
  await setDocData('app_data', { data });
  broadcastEvent('update', { type: 'app_data' });
}

export async function addNotification(title: string, message: string, updaterName: string = 'Sistem', resource?: string, resourceId?: string) {
  const notifs = await getNotifications();
  notifs.unshift({ id: Date.now().toString(), title, message, updaterName, resource, resourceId, time: new Date().toISOString(), read: false });
  if (notifs.length > 50) notifs.length = 50; // Kurangi limit notif agar data lebih ringan
  await saveNotifications(notifs);
}

// 8. API Routes
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const users = await getUsers();
  const user = users.find((u: any) => u.username === username && u.password === password);

  if (user) {
    res.json({ message: "Login berhasil", user });
  } else {
    res.status(401).json({ error: "Username atau password salah" });
  }
});

app.get("/api/stream", (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
  clients.add(res);
  req.on('close', () => clients.delete(res));
});

app.get("/api/warga", async (req, res) => {
  const users = await getUsers();
  res.json({ users });
});

app.get("/api/data/:resource", async (req, res) => {
  const data = await getAppData();
  const resource = req.params.resource;
  res.json({ data: data[resource] || [] });
});

app.post("/api/data/:resource", async (req, res) => {
  const data = await getAppData();
  const resource = req.params.resource;
  if (!data[resource]) data[resource] = [];

  const newItem = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...req.body };
  data[resource].push(newItem);
  
  await saveAppData(data);
  res.json({ message: "Created successfully", item: newItem });
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// 9. Startup Logic
export async function startServer(listen = true) {
  // Hanya jalankan initDb di luar environment Vercel atau saat pertama kali nyala
  if (!process.env.VERCEL) {
    await initDb();
  }

  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await (await import("vite")).createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  if (listen) {
    app.listen(PORT, "0.0.0.0", () => console.log(`Server on port ${PORT}`));
  }
}

if (!process.env.VERCEL) {
  startServer(true);
}

export default app;