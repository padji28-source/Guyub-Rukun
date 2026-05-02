import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = JSON.parse(fs.readFileSync(path.resolve('./firebase-applet-config.json'), 'utf-8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const DB_DOC = doc(db, 'system', 'users');
const NOTIF_DOC = doc(db, 'system', 'notifications');
const APP_DATA_DOC = doc(db, 'system', 'app_data');

async function initDb() {
  const usersSnap = await getDoc(DB_DOC);
  if (!usersSnap.exists() || !(usersSnap.data().list || []).find((u: any) => u.username === "ketuart")) {
    const list = usersSnap.exists() ? usersSnap.data().list || [] : [];
    if (!list.find((u: any) => u.username === "ketuart")) {
      list.push({
        id: "admin",
        username: "ketuart",
        password: "123456",
        nama: "Ketua RT",
        role: "admin",
        alamat: "Jl. Bahagia No. 12, Kompleks Rukun, Kota Tegal",
        noHp: "0812-3456-7890",
        status: "Ketua RT 04 / RW 01"
      });
      await saveUsers(list);
    }
  }

  const notifSnap = await getDoc(NOTIF_DOC);
  if (!notifSnap.exists()) {
    await saveNotifications([]);
  }

  const appDataSnap = await getDoc(APP_DATA_DOC);
  if (!appDataSnap.exists()) {
    await saveAppData({
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
    });
  }
}

async function getUsers() {
  const snap = await getDoc(DB_DOC);
  return snap.exists() ? (snap.data().list || []) : [];
}

async function saveUsers(users: any) {
  await setDoc(DB_DOC, JSON.parse(JSON.stringify({ list: users })));
}

async function getNotifications() {
  const snap = await getDoc(NOTIF_DOC);
  return snap.exists() ? (snap.data().list || []) : [];
}

async function saveNotifications(notifs: any) {
  await setDoc(NOTIF_DOC, JSON.parse(JSON.stringify({ list: notifs })));
}

async function getAppData() {
  const snap = await getDoc(APP_DATA_DOC);
  const data = snap.exists() ? (snap.data().data || {}) : {};
  if (!data.media) {
    data.media = [
      { id: '1', imageUrl: 'https://images.unsplash.com/photo-1593113511332-15f5ea6c4dcd?auto=format&fit=crop&w=300&q=80', title: 'Kerja Bakti 2024', uploaderName: 'Admin', createdAt: new Date().toISOString() }
    ];
    await saveAppData(data);
  }
  return data;
}

async function saveAppData(data: any) {
  await setDoc(APP_DATA_DOC, JSON.parse(JSON.stringify({ data })));
}

export async function addNotification(title: string, message: string) {
  const notifs = await getNotifications();
  notifs.unshift({ id: Date.now().toString(), title, message, time: new Date().toISOString(), read: false });
  if (notifs.length > 100) notifs.length = 100;
  await saveNotifications(notifs);
}

app.post("/api/register", async (req, res) => {
  const { username, nama, password, alamat, noHp, status, umur } = req.body;
  
  if (!username || !nama || !password) {
    return res.status(400).json({ error: "Username, nama dan password wajib diisi" });
  }

  const users = await getUsers();
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
  await saveUsers(users);

  await addNotification("Warga Baru Terdaftar", `Warga baru ${nama} telah didaftarkan.`);

  res.json({ message: "Registrasi berhasil", user: { ...newUser, role: "warga" } });
});

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

app.put("/api/profile", async (req, res) => {
  const { id, username, nama, alamat, noHp, status, photo } = req.body;

  const users = await getUsers();
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
    await saveUsers(users);
    res.json({ message: "Profile updated successfully", user: users[userIndex] });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.get("/api/warga", async (req, res) => {
  const users = await getUsers();
  res.json({ users: users.filter((u: any) => u.id !== "admin") });
});

app.delete("/api/warga/:id", async (req, res) => {
  const users = await getUsers();
  const user = users.find((u: any) => u.id === req.params.id);
  const newUsers = users.filter((u: any) => u.id !== req.params.id);
  await saveUsers(newUsers);
  if (user) await addNotification("Warga Dihapus", `Data warga ${user.nama} telah dihapus.`);
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
    await addNotification("Anggota Keluarga Bertambah", `Anggota baru ${name} ditambahkan ke KK ${user.nama}.`);
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
    user.members = user.members.filter((m: any) => m.id !== req.params.memberId);
    await saveUsers(users);
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
    res.json({ message: "Role updated successfully", user: users[userIndex] });
  } else {
    res.status(400).json({ error: "Gagal update role" });
  }
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
  if (!data[resource]) return res.status(404).json({ error: "Resource not found" });
  res.json({ data: data[resource] });
});

app.post("/api/data/:resource", async (req, res) => {
  const data = await getAppData();
  const resource = req.params.resource;
  if (!data[resource]) return res.status(404).json({ error: "Resource not found" });
  
  const newItem = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...req.body };
  data[resource].push(newItem);
  await saveAppData(data);
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
      await addNotification('Surat Selesai', `Surat pengajuan untuk ${newItem.keperluan || 'anda'} sudah bisa diambil.`);
    }
    if (resource === 'laporan' && oldItem.status !== newItem.status) {
      await addNotification('Update Laporan', `Laporan ${newItem.judul || 'warga'} kini berstatus: ${newItem.status}.`);
    }
    if (resource === 'iuran' && oldItem.status !== newItem.status && newItem.status === 'verifikasi') {
      await addNotification('Iuran Diverifikasi', `Iuran dari ${newItem.nama || 'warga'} sebesar Rp ${newItem.nominal} telah diverifikasi dan masuk kas.`);
      data['kas'].push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        type: 'Masuk',
        amount: parseInt(newItem.nominal || '0', 10),
        name: newItem.nama,
        message: 'Iuran Warga',
        category: 'Kas RT'
      });
      await saveAppData(data);
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

  data[resource] = data[resource].filter((item: any) => item.id !== req.params.id);
  await saveAppData(data);
  res.json({ message: "Deleted successfully" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

async function startServer() {
  await initDb();

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
