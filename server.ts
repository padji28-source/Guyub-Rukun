import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const DB_FILE = path.resolve("users.json");
const NOTIF_FILE = path.resolve("notifications.json");
const APP_DATA_FILE = path.resolve("app_data.json");

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([
    {
      id: "admin",
      username: "ketuart",
      password: "123456",
      nama: "Ketua RT",
      role: "admin",
      alamat: "Jl. Bahagia No. 12, Kompleks Rukun, Kota Tegal",
      noHp: "0812-3456-7890",
      status: "Ketua RT 04 / RW 01"
    }
  ], null, 2));
} else {
  // Ensure admin exists in old db
  const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  if (!data.find((u: any) => u.username === "ketuart")) {
    data.push({
      id: "admin",
      username: "ketuart",
      password: "123456",
      nama: "Ketua RT",
      role: "admin",
      alamat: "Jl. Bahagia No. 12, Kompleks Rukun, Kota Tegal",
      noHp: "0812-3456-7890",
      status: "Ketua RT 04 / RW 01"
    });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  }
}

if (!fs.existsSync(NOTIF_FILE)) {
  fs.writeFileSync(NOTIF_FILE, JSON.stringify([]));
}

if (!fs.existsSync(APP_DATA_FILE)) {
  fs.writeFileSync(APP_DATA_FILE, JSON.stringify({
    surat: [],
    laporan: [],
    acara: [],
    umkm: [],
    kas: [],
    iuran: [],
    darurat: [
      { id: "d1", name: 'Ambulance & Gawat Darurat', tel: '118', type: 'Medis' },
      { id: "d2", name: 'Polisi', tel: '110', type: 'Keamanan' },
      { id: "d3", name: 'Pemadam Kebakaran', tel: '113', type: 'Kebakaran' },
      { id: "d4", name: 'Ketua RT 04 (Bpk. Adji)', tel: '081234567890', type: 'Lingkungan' },
      { id: "d5", name: 'Security Pos Depan', tel: '089876543210', type: 'Keamanan' }
    ]
  }, null, 2));
}

function getUsers() {
  const data = fs.readFileSync(DB_FILE, "utf-8");
  return JSON.parse(data);
}

function saveUsers(users: any) {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

function getNotifications() {
  const data = fs.readFileSync(NOTIF_FILE, "utf-8");
  return JSON.parse(data);
}

function saveNotifications(notifs: any) {
  fs.writeFileSync(NOTIF_FILE, JSON.stringify(notifs, null, 2));
}

function getAppData() {
  const data = JSON.parse(fs.readFileSync(APP_DATA_FILE, "utf-8"));
  if (!data.media) {
    data.media = [
      { id: '1', imageUrl: 'https://images.unsplash.com/photo-1593113511332-15f5ea6c4dcd?auto=format&fit=crop&w=300&q=80', title: 'Kerja Bakti 2024', uploaderName: 'Admin', createdAt: new Date().toISOString() }
    ];
    saveAppData(data);
  }
  return data;
}

function saveAppData(data: any) {
  fs.writeFileSync(APP_DATA_FILE, JSON.stringify(data, null, 2));
}

export function addNotification(title: string, message: string) {
  const notifs = getNotifications();
  notifs.unshift({ id: Date.now().toString(), title, message, time: new Date().toISOString(), read: false });
  // Keep only latest 100
  if (notifs.length > 100) notifs.length = 100;
  saveNotifications(notifs);
}

// API Routes
app.post("/api/register", (req, res) => {
  const { username, nama, password, alamat, noHp, status, umur } = req.body;
  
  if (!username || !nama || !password) {
    return res.status(400).json({ error: "Username, nama dan password wajib diisi" });
  }

  const users = getUsers();
  if (users.find((u: any) => u.username === username)) {
    return res.status(400).json({ error: "Username sudah terdaftar" });
  }

  const newUser = {
    id: Date.now().toString(),
    username,
    nama,
    password,
    alamat,
    noHp,
    status,
    umur,
    members: []
  };

  users.push(newUser);
  saveUsers(users);

  addNotification("Warga Baru Terdaftar", `Warga baru ${nama} telah didaftarkan.`);

  res.json({ message: "Registrasi berhasil", user: { ...newUser, role: "warga" } });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const users = getUsers();
  const user = users.find((u: any) => u.username === username && u.password === password);

  if (user) {
    res.json({ message: "Login berhasil", user });
  } else {
    res.status(401).json({ error: "Username atau password salah" });
  }
});

app.put("/api/profile", (req, res) => {
  const { id, username, nama, alamat, noHp, status, photo } = req.body;

  const users = getUsers();
  const userIndex = users.findIndex((u: any) => u.id === id);

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      nama: nama || users[userIndex].nama,
      alamat: alamat || users[userIndex].alamat,
      noHp: noHp || users[userIndex].noHp,
      status: status || users[userIndex].status,
      photo: photo || users[userIndex].photo
    };
    saveUsers(users);
    res.json({ message: "Profile updated successfully", user: users[userIndex] });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/api/warga", (req, res) => {
  const users = getUsers();
  // Filter out admin, or keep it depending on usage. Let's keep all.
  res.json({ users: users.filter((u: any) => u.id !== "admin") });
});

// Admin API to delete a user
app.delete("/api/warga/:id", (req, res) => {
  const users = getUsers();
  const user = users.find((u: any) => u.id === req.params.id);
  const newUsers = users.filter((u: any) => u.id !== req.params.id);
  saveUsers(newUsers);
  if (user) addNotification("Warga Dihapus", `Data warga ${user.nama} telah dihapus.`);
  res.json({ message: "User deleted" });
});

// Admin or Self API to add family member
app.post("/api/warga/:id/members", (req, res) => {
  const { name, role, age } = req.body;
  const users = getUsers();
  const user = users.find((u: any) => u.id === req.params.id);
  if (user) {
    if (!user.members) user.members = [];
    const newMember = { id: Date.now().toString(), name, role, age };
    user.members.push(newMember);
    saveUsers(users);
    addNotification("Anggota Keluarga Bertambah", `Anggota baru ${name} ditambahkan ke KK ${user.nama}.`);
    res.json({ message: "Family member added", member: newMember, user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Admin or Self API to edit family member
app.put("/api/warga/:id/members/:memberId", (req, res) => {
  const { name, role, age } = req.body;
  const users = getUsers();
  const user = users.find((u: any) => u.id === req.params.id);
  if (user && user.members) {
    const memberIndex = user.members.findIndex((m: any) => m.id === req.params.memberId);
    if (memberIndex !== -1) {
      user.members[memberIndex] = { ...user.members[memberIndex], name, role, age };
      saveUsers(users);
      res.json({ message: "Family member updated", user });
    } else {
      res.status(404).json({ error: "Member not found" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// Admin or Self API to delete family member
app.delete("/api/warga/:id/members/:memberId", (req, res) => {
  const users = getUsers();
  const user = users.find((u: any) => u.id === req.params.id);
  if (user && user.members) {
    user.members = user.members.filter((m: any) => m.id !== req.params.memberId);
    saveUsers(users);
    res.json({ message: "Family member deleted", user });
  } else {
    res.status(404).json({ error: "User or member not found" });
  }
});

app.put("/api/warga/:id/role", (req, res) => {
  const { role } = req.body;
  const users = getUsers();
  const userIndex = users.findIndex((u: any) => u.id === req.params.id);
  if (userIndex !== -1 && users[userIndex].id !== "admin") {
    users[userIndex].role = role;
    saveUsers(users);
    res.json({ message: "Role updated successfully", user: users[userIndex] });
  } else {
    res.status(400).json({ error: "Gagal update role" });
  }
});

app.get("/api/notifications", (req, res) => {
  res.json({ notifications: getNotifications() });
});

app.post("/api/notifications/read", (req, res) => {
  const notifs = getNotifications();
  const updated = notifs.map((n: any) => ({ ...n, read: true }));
  saveNotifications(updated);
  res.json({ success: true });
});

app.post("/api/transactions", (req, res) => {
  const { type, amount, name, message } = req.body;
  // This abstracts kas/iuran/sedekah
  const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
  const formattedAmount = formatter.format(amount || 0);

  let notifTitle = `Transaksi ${type || 'Baru'}`;
  let notifMessage = message || `Terdapat transaksi ${type ? type.toLowerCase() : 'baru'} masuk sebesar ${formattedAmount} dari ${name || 'Warga'}.`;

  addNotification(notifTitle, notifMessage);
  res.json({ success: true, message: "Transaksi berhasil dan notifikasi dikirim" });
});

// --- Generic APP_DATA Routes ---
app.get("/api/data/:resource", (req, res) => {
  const data = getAppData();
  const resource = req.params.resource;
  if (!data[resource]) return res.status(404).json({ error: "Resource not found" });
  res.json({ data: data[resource] });
});

app.post("/api/data/:resource", (req, res) => {
  const data = getAppData();
  const resource = req.params.resource;
  if (!data[resource]) return res.status(404).json({ error: "Resource not found" });
  
  const newItem = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...req.body };
  data[resource].push(newItem);
  saveAppData(data);
  res.json({ message: "Created successfully", item: newItem });
});

app.put("/api/data/:resource/:id", (req, res) => {
  const data = getAppData();
  const resource = req.params.resource;
  if (!data[resource]) return res.status(404).json({ error: "Resource not found" });

  const index = data[resource].findIndex((item: any) => item.id === req.params.id);
  if (index !== -1) {
    const oldItem = data[resource][index];
    const newItem = { ...oldItem, ...req.body };
    data[resource][index] = newItem;
    saveAppData(data);

    // Notifications logic depending on resource
    if (resource === 'surat' && oldItem.status !== newItem.status && newItem.status === 'selesai') {
      addNotification('Surat Selesai', `Surat pengajuan untuk ${newItem.keperluan || 'anda'} sudah bisa diambil.`);
    }
    if (resource === 'laporan' && oldItem.status !== newItem.status) {
      addNotification('Update Laporan', `Laporan ${newItem.judul || 'warga'} kini berstatus: ${newItem.status}.`);
    }
    if (resource === 'iuran' && oldItem.status !== newItem.status && newItem.status === 'verifikasi') {
      addNotification('Iuran Diverifikasi', `Iuran dari ${newItem.nama || 'warga'} sebesar Rp ${newItem.nominal} telah diverifikasi dan masuk kas.`);
      data['kas'].push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        type: 'Masuk',
        amount: parseInt(newItem.nominal || '0', 10),
        name: newItem.nama,
        message: 'Iuran Warga',
        category: 'Kas RT'
      });
      saveAppData(data);
    }

    res.json({ message: "Updated successfully", item: newItem });
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

app.delete("/api/data/:resource/:id", (req, res) => {
  const data = getAppData();
  const resource = req.params.resource;
  if (!data[resource]) return res.status(404).json({ error: "Resource not found" });

  data[resource] = data[resource].filter((item: any) => item.id !== req.params.id);
  saveAppData(data);
  res.json({ message: "Deleted successfully" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
