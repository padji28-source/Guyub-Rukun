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
    const adminUser = users.find((u: any) => u.username === "ketuart");
    if (!adminUser) {
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
    } else if (adminUser.role !== "admin" || !adminUser.isApproved) {
      adminUser.role = "admin";
      adminUser.isApproved = true;
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

app.get("/api/notifications", async (req, res) => {
  res.json({ notifications: await getNotifications() });
});

app.post("/api/notifications/read", async (req, res) => {
  const notifs = await getNotifications();
  const updated = notifs.map((n: any) => ({ ...n, read: true }));
  await saveNotifications(updated);
  res.json({ success: true });
});

app.post("/api/register", async (req, res) => {
  const { username, nama, password, alamat, noHp, status, umur } = req.body;
  if (!username || !nama || !password) return res.status(400).json({ error: "Username, nama dan password wajib diisi" });

  const users = await getUsers();
  if (users.find((u: any) => u.username === username)) return res.status(400).json({ error: "Username sudah terdaftar" });

  const newUser = { id: Date.now().toString(), username, nama, password, alamat, noHp, status, role: "warga", isApproved: false, umur, members: [] };
  users.push(newUser);
  await saveUsers(users);

  await addNotification("Warga Baru Terdaftar", `Warga baru ${nama} telah didaftarkan. Menunggu verifikasi.`, req.body.updaterName || nama, "warga", newUser.id);
  res.json({ message: "Registrasi berhasil", user: { ...newUser, role: "warga" } });
});

app.post("/api/ping", (req, res) => {
  res.json({ success: true });
});

app.post("/api/logout", (req, res) => {
  res.json({ success: true });
});

app.put("/api/password", async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const users = await getUsers();
  const userIndex = users.findIndex((u: any) => u.id === id);

  if (userIndex !== -1) {
    if (users[userIndex].password !== oldPassword) return res.status(400).json({ error: "Password lama salah" });
    users[userIndex].password = newPassword;
    await saveUsers(users);
    res.json({ message: "Password berhasil diganti" });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.put("/api/profile", async (req, res) => {
  const { id, username, nama, alamat, noHp, status, photo, umur, dokumenKk, dokumenKtp } = req.body;
  const users = await getUsers();
  const userIndex = users.findIndex((u: any) => u.id === id);

  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], nama: nama || users[userIndex].nama, alamat: alamat || users[userIndex].alamat, noHp: noHp || users[userIndex].noHp, status: status || users[userIndex].status, photo: photo || users[userIndex].photo, umur: umur !== undefined ? umur : users[userIndex].umur, dokumenKk: dokumenKk !== undefined ? dokumenKk : users[userIndex].dokumenKk, dokumenKtp: dokumenKtp !== undefined ? dokumenKtp : users[userIndex].dokumenKtp };
    await saveUsers(users);
    const updater = req.body.updaterName || nama || users[userIndex].nama || 'Sistem';
    await addNotification("Profil Diperbarui", `Warga ${users[userIndex].nama} memperbarui profil.`, updater, "warga", id);
    res.json({ message: "Profile updated successfully", user: users[userIndex] });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.delete("/api/warga/:id", async (req, res) => {
  const users = await getUsers();
  const user = users.find((u: any) => u.id === req.params.id);
  const newUsers = users.filter((u: any) => u.id !== req.params.id);
  await saveUsers(newUsers);
  if (user) await addNotification("Warga Dihapus", `Data warga ${user.nama} telah dihapus.`, req.body.updaterName || 'Admin', "warga", req.params.id);
  res.json({ message: "User deleted" });
});

app.post("/api/warga/:id/members", async (req, res) => {
  const { name, role, age } = req.body;
  const users = await getUsers();
  const user = users.find((u: any) => u.id === req.params.id);
  if (user) {
    if (!user.members) user.members = [];
    const newMember = { id: Date.now().toString(), name, role, age };
    user.members.push(newMember);
    await saveUsers(users);
    await addNotification("Anggota Keluarga Bertambah", `Anggota baru ${name} ditambahkan ke KK ${user.nama}.`, req.body.updaterName || user.nama, "warga", user.id);
    res.json({ message: "Family member added", member: newMember, user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.put("/api/warga/:id/members/:memberId", async (req, res) => {
  const { name, role, age } = req.body;
  const users = await getUsers();
  const user = users.find((u: any) => u.id === req.params.id);
  if (user && user.members) {
    const memberIndex = user.members.findIndex((m: any) => m.id === req.params.memberId);
    if (memberIndex !== -1) {
      user.members[memberIndex] = { ...user.members[memberIndex], name, role, age };
      await saveUsers(users);
      const updater = req.body.updaterName || user.nama || 'Sistem';
      await addNotification("Anggota Keluarga Diperbarui", `Data anggota ${name} di KK ${user.nama} diperbarui.`, updater, "warga", user.id);
      res.json({ message: "Family member updated", user });
    } else {
      res.status(404).json({ error: "Member not found" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.delete("/api/warga/:id/members/:memberId", async (req, res) => {
  const users = await getUsers();
  const user = users.find((u: any) => u.id === req.params.id);
  if (user && user.members) {
    const member = user.members.find((m: any) => m.id === req.params.memberId);
    user.members = user.members.filter((m: any) => m.id !== req.params.memberId);
    await saveUsers(users);
    const updater = req.body.updaterName || user.nama || 'Sistem';
    if (member) await addNotification("Anggota Keluarga Dihapus", `Anggota ${member.name} dihapus dari KK ${user.nama}.`, updater, "warga", user.id);
    res.json({ message: "Family member deleted", user });
  } else {
    res.status(404).json({ error: "User or member not found" });
  }
});

app.put("/api/warga/:id/role", async (req, res) => {
  const { role } = req.body;
  const users = await getUsers();
  const userIndex = users.findIndex((u: any) => u.id === req.params.id);
  if (userIndex !== -1 && users[userIndex].id !== "admin") {
    users[userIndex].role = role;
    await saveUsers(users);
    const updater = req.body.updaterName || 'Admin';
    await addNotification("Peran Warga Diperbarui", `Peran warga ${users[userIndex].nama} diubah menjadi ${role}.`, updater, "warga", users[userIndex].id);
    res.json({ message: "Role updated successfully", user: users[userIndex] });
  } else {
    res.status(400).json({ error: "Gagal update role" });
  }
});

app.put("/api/warga/:id/approval", async (req, res) => {
  const { isApproved } = req.body;
  const users = await getUsers();
  const userIndex = users.findIndex((u: any) => u.id === req.params.id);
  if (userIndex !== -1 && users[userIndex].id !== "admin") {
    users[userIndex].isApproved = isApproved;
    await saveUsers(users);
    const updater = req.body.updaterName || 'Admin';
    const statusText = isApproved ? 'disetujui' : 'dibatalkan';
    await addNotification("Status Warga Diperbarui", `Status warga ${users[userIndex].nama} ${statusText}.`, updater, "warga", users[userIndex].id);
    res.json({ message: "Status approval updated successfully", user: users[userIndex] });
  } else {
    res.status(400).json({ error: "Gagal update status approval" });
  }
});

app.post("/api/transactions", async (req, res) => {
  const { type, amount, name, message } = req.body;
  const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
  const formattedAmount = formatter.format(amount || 0);

  let notifTitle = `Transaksi ${type || 'Baru'}`;
  let notifMessage = message || `Terdapat transaksi ${type ? type.toLowerCase() : 'baru'} masuk sebesar ${formattedAmount} dari ${name || 'Warga'}.`;

  await addNotification(notifTitle, notifMessage);
  res.json({ success: true, message: "Transaksi berhasil dan notifikasi dikirim" });
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
  
  if (resource === 'iuran' && newItem.status === 'verifikasi') {
    const nominal = parseInt(newItem.nominal || '0', 10);
    if (newItem.jenis === 'Wifi') {
      const kasRTAmount = 10000;
        data['kas'].push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        type: 'Masuk',
        amount: kasRTAmount,
        name: newItem.nama,
        message: 'Pembayaran Wifi (Kas RT)',
        category: 'Kas RT',
        iuranId: newItem.id
      });
    } else {
      const isSplit = nominal >= 5000;
      const danaKematianAmount = isSplit ? 5000 : 0;
      const kasRTAmount = nominal - danaKematianAmount;
      if (kasRTAmount > 0) {
        data['kas'].push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          createdAt: new Date().toISOString(),
          type: 'Masuk',
          amount: kasRTAmount,
          name: newItem.nama,
          message: 'Iuran Warga (Kas RT)',
          category: 'Kas RT',
          iuranId: newItem.id
        });
      }
      if (danaKematianAmount > 0) {
        data['kas'].push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          createdAt: new Date().toISOString(),
          type: 'Masuk',
          amount: danaKematianAmount,
          name: newItem.nama,
          message: 'Iuran Warga (Dana Kematian)',
          category: 'Dana Kematian',
          iuranId: newItem.id
        });
      }
    }
  }

  await saveAppData(data);

  const creator = req.body.nama || req.body.name || req.body.uploaderName || req.body.pembuat || req.body.updaterName || 'Sistem';
  let title = `Input Baru: ${resource}`;
  if (resource === 'laporan') title = 'Laporan Baru';
  if (resource === 'iuran') title = 'Iuran Baru';
  if (resource === 'kas') title = 'Kas Baru';
  if (resource === 'darurat') title = 'Panggilan Darurat';
  if (resource === 'acara') title = 'Acara Baru';
  if (resource === 'surat') title = 'Surat Keluar Baru';

  await addNotification(title, `Terdapat data baru pada modul ${resource} oleh ${creator}.`, creator, resource, newItem.id);

  res.json({ message: "Created successfully", item: newItem });
});

app.put("/api/data/:resource/:id", async (req, res) => {
  const data = await getAppData();
  const resource = req.params.resource;
  if (!data[resource]) return res.status(404).json({ error: "Resource not found" });

  const index = data[resource].findIndex((item: any) => item.id === req.params.id);
  if (index !== -1) {
    const oldItem = data[resource][index];
    const newItem = { ...oldItem, ...req.body };
    data[resource][index] = newItem;
    await saveAppData(data);

    if (resource === 'surat' && oldItem.status !== newItem.status && newItem.status === 'selesai') {
      await addNotification('Surat Selesai', `Surat pengajuan untuk ${newItem.keperluan || 'anda'} sudah bisa diambil.`, req.body.updaterName || 'Admin', resource, newItem.id);
    } else if (resource === 'laporan' && oldItem.status !== newItem.status) {
      await addNotification('Update Laporan', `Laporan ${newItem.judul || 'warga'} kini berstatus: ${newItem.status}.`, req.body.updaterName || 'Admin', resource, newItem.id);
    } else if (resource === 'iuran' && oldItem.status !== newItem.status && newItem.status === 'verifikasi') {
      await addNotification('Iuran Diverifikasi', `Iuran dari ${newItem.nama || 'warga'} sebesar Rp ${newItem.nominal} telah diverifikasi dan masuk kas.`, req.body.updaterName || 'Admin', resource, newItem.id);
      const nominal = parseInt(newItem.nominal || '0', 10);
      
      if (newItem.jenis === 'Wifi') {
        const kasRTAmount = 10000;
        data['kas'].push({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          createdAt: new Date().toISOString(),
          type: 'Masuk',
          amount: kasRTAmount,
          name: newItem.nama,
          message: 'Pembayaran Wifi (Kas RT)',
          category: 'Kas RT',
          iuranId: newItem.id
        });
      } else {
        const isSplit = nominal >= 5000;
        const danaKematianAmount = isSplit ? 5000 : 0;
        const kasRTAmount = nominal - danaKematianAmount;

        if (kasRTAmount > 0) {
          data['kas'].push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            createdAt: new Date().toISOString(),
            type: 'Masuk',
            amount: kasRTAmount,
            name: newItem.nama,
            message: 'Iuran Warga (Kas RT)',
            category: 'Kas RT',
            iuranId: newItem.id
          });
        }
        if (danaKematianAmount > 0) {
          data['kas'].push({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            createdAt: new Date().toISOString(),
            type: 'Masuk',
            amount: danaKematianAmount,
            name: newItem.nama,
            message: 'Iuran Warga (Dana Kematian)',
            category: 'Dana Kematian',
            iuranId: newItem.id
          });
        }
      }
      await saveAppData(data);
    } else {
      const updater = req.body.updaterName || 'Sistem';
      await addNotification(`Data Diupdate: ${resource}`, `Terdapat perubahan data pada modul ${resource} oleh ${updater}.`, updater, resource, newItem.id);
    }

    res.json({ message: "Updated successfully", item: newItem });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.delete("/api/data/:resource/:id", async (req, res) => {
  const data = await getAppData();
  const resource = req.params.resource;
  if (!data[resource]) return res.status(404).json({ error: "Resource not found" });

  const itemToDelete = data[resource].find((item: any) => item.id === req.params.id);

  if (resource === 'kas' && itemToDelete && itemToDelete.iuranId) {
    if (data['iuran']) {
      data['iuran'] = data['iuran'].filter((i: any) => i.id !== itemToDelete.iuranId);
    }
    data['kas'] = data['kas'].filter((k: any) => k.iuranId !== itemToDelete.iuranId);
  } else if (resource === 'iuran') {
    if (data['kas']) {
      data['kas'] = data['kas'].filter((k: any) => k.iuranId !== req.params.id);
    }
  }

  data[resource] = data[resource].filter((item: any) => item.id !== req.params.id);
  await saveAppData(data);
  const updater = req.body?.updaterName || 'Sistem';
  await addNotification(`Data Dihapus: ${resource}`, `Terdapat penghapusan data pada modul ${resource} oleh ${updater}.`, updater);
  res.json({ message: "Deleted successfully" });
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