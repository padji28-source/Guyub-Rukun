import express from "express";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

export const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Point 2: ROTATE & HIDE DATABASE CREDENTIALS (NO HARDCODING)
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/guyubrukun";

// Legacy fallback model for auto-migration
const SystemDataSchema = new mongoose.Schema({
  _id: String,
  data: mongoose.Schema.Types.Mixed
}, { strict: false });
const SystemDataModel: mongoose.Model<any> = mongoose.models.SystemData || mongoose.model("SystemData", SystemDataSchema);

// ==========================================
// POINT 3: DEDICATED GRANULAR COLLECTION SCHEMAS
// ==========================================

// 1. User Schema
const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  nama: { type: String, required: true },
  password: { type: String, required: true },
  alamat: { type: String },
  noHp: { type: String },
  status: { type: String },
  role: { type: String, enum: ['admin', 'warga', 'bendahara', 'sekretaris', 'pengurus'], default: 'warga' },
  isApproved: { type: Boolean, default: false },
  rtId: { type: String, required: true },
  umur: { type: Number },
  members: [{
    id: String,
    name: String,
    role: String,
    age: Number,
    tglLahir: String
  }],
  photo: String,
  dokumenKk: String,
  dokumenKtp: String,
}, { timestamps: true });
const UserModel: mongoose.Model<any> = mongoose.models.User || mongoose.model("User", UserSchema);

// 2. Iuran Schema
const IuranSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  nama: { type: String, required: true },
  nominal: { type: Number, required: true, min: 0 },
  jenis: { type: String, required: true },
  status: { type: String, required: true }, // 'verifikasi', 'lunas', 'butuh_konfirmasi'
  rtId: { type: String, required: true },
  createdAt: { type: String, required: true },
  proofUrl: { type: String }
}, { timestamps: true });
const IuranModel: mongoose.Model<any> = mongoose.models.Iuran || mongoose.model("Iuran", IuranSchema);

// 3. Kas Schema
const KasSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  type: { type: String, enum: ['Masuk', 'Keluar'], required: true },
  amount: { type: Number, required: true, min: 0 },
  name: { type: String, required: true },
  message: { type: String, required: true },
  category: { type: String, required: true }, // 'Kas RT', 'Dana Kematian', 'Lainnya'
  iuranId: { type: String },
  rtId: { type: String, required: true },
  status: { type: String, enum: ['setuju', 'butuh_konfirmasi', 'selesai'], default: 'selesai' },
  createdAt: { type: String, required: true }
}, { timestamps: true });
const KasModel: mongoose.Model<any> = mongoose.models.Kas || mongoose.model("Kas", KasSchema);

// 4. Voting Schema
const VotingSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  options: [{ id: String, text: String, count: Number }],
  votes: [{
    userId: { type: String, required: true },
    optionId: { type: String, required: true },
    date: { type: String, required: true }
  }],
  status: { type: String, enum: ['aktif', 'selesai'], default: 'aktif' },
  createdBy: { type: String },
  rtId: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });
const VotingModel: mongoose.Model<any> = mongoose.models.Voting || mongoose.model("Voting", VotingSchema);

// 5. Acara Schema
const AcaraSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  desc: { type: String },
  date: { type: String, required: true },
  time: { type: String },
  location: { type: String },
  rtId: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });
const AcaraModel: mongoose.Model<any> = mongoose.models.Acara || mongoose.model("Acara", AcaraSchema);

// 6. Laporan Schema
const LaporanSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  judul: { type: String, required: true },
  deskripsi: { type: String, required: true },
  status: { type: String, default: 'baru' }, // 'baru', 'proses', 'selesai'
  nama: { type: String },
  rtId: { type: String, required: true },
  createdAt: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number }
}, { timestamps: true });
const LaporanModel: mongoose.Model<any> = mongoose.models.Laporan || mongoose.model("Laporan", LaporanSchema);

// 7. Surat Schema
const SuratSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  jenis: { type: String, required: true },
  keperluan: { type: String },
  status: { type: String, default: 'proses' }, // 'proses', 'selesai'
  nama: { type: String },
  tempatLahir: { type: String },
  tanggalLahir: { type: String },
  statusPerkawinan: { type: String },
  jenisKelamin: { type: String },
  agama: { type: String },
  pekerjaan: { type: String },
  noKtpKk: { type: String },
  alamatSekarang: { type: String },
  alamatAsal: { type: String },
  mohonDibuatkan: { type: String },
  nomorSurat: { type: String },
  signaturePemohon: { type: String },
  signatureKetuaRt: { type: String },
  userId: { type: String },
  userName: { type: String },
  rtId: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });
const SuratModel: mongoose.Model<any> = mongoose.models.Surat || mongoose.model("Surat", SuratSchema);

// 8. UMKM Schema
const UmkmSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  owner: { type: String, required: true },
  category: { type: String, required: true },
  phone: { type: String },
  desc: { type: String },
  price: { type: String },
  rtId: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });
const UmkmModel: mongoose.Model<any> = mongoose.models.Umkm || mongoose.model("Umkm", UmkmSchema);

// 9. Tamu Schema
const TamuSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  keperluan: { type: String },
  durasi: { type: String },
  alamatAsal: { type: String },
  rtId: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });
const TamuModel: mongoose.Model<any> = mongoose.models.Tamu || mongoose.model("Tamu", TamuSchema);

// 10. Media Schema
const MediaSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: true },
  title: { type: String },
  uploaderName: { type: String },
  rtId: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });
const MediaModel: mongoose.Model<any> = mongoose.models.Media || mongoose.model("Media", MediaSchema);

// 11. Darurat Schema
const DaruratSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  tel: { type: String, required: true },
  type: { type: String },
  rtId: { type: String, required: true }
});
const DaruratModel: mongoose.Model<any> = mongoose.models.Darurat || mongoose.model("Darurat", DaruratSchema);

// 12. Audit Log Schema (POINT 7)
const AuditLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  user: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  before: mongoose.Schema.Types.Mixed,
  after: mongoose.Schema.Types.Mixed,
  rtId: { type: String, required: true },
  timestamp: { type: String, required: true }
});
const AuditLogModel: mongoose.Model<any> = mongoose.models.AuditLog || mongoose.model("AuditLog", AuditLogSchema);

// 13. Notification Schema
const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  updaterName: { type: String },
  resource: { type: String },
  resourceId: { type: String },
  time: { type: String },
  read: { type: Boolean, default: false },
  rtId: { type: String, required: true }
});
const NotificationModel: mongoose.Model<any> = mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);

// 14. Dokumen Schema
const DokumenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true }, // 'KK', 'KTP', 'Surat RT', 'Peraturan', 'Lainnya'
  fileUrl: { type: String, required: true }, // base64 or URL
  uploaderId: { type: String },
  uploaderName: { type: String },
  rtId: { type: String, required: true }
}, { timestamps: true });
const DokumenModel: mongoose.Model<any> = mongoose.models.Dokumen || mongoose.model("Dokumen", DokumenSchema);

// 15. Inventaris Schema
const InventarisSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true }, // 'Tenda', 'Kursi', 'Alat Kebersihan', 'Lainnya'
  quantity: { type: Number, default: 1 },
  condition: { type: String, enum: ['baik', 'rusak_ringan', 'rusak_berat'], default: 'baik' },
  location: { type: String },
  status: { type: String, enum: ['tersedia', 'dipinjam'], default: 'tersedia' },
  notes: { type: String },
  rtId: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { timestamps: true });
const InventarisModel: mongoose.Model<any> = mongoose.models.Inventaris || mongoose.model("Inventaris", InventarisSchema);



// ==========================================
// MIGRATOR: BACKWARD COMPATIBLE SYSTEM
// ==========================================
async function migrateLegacyDataIfAny(rtId: string) {
  try {
    // 1. Migrate Users
    const legacyDocId = rtId ? `users_${rtId}` : 'users';
    const legacyDoc = await SystemDataModel.findById(legacyDocId);
    if (legacyDoc && legacyDoc.data && legacyDoc.data.list) {
      console.log(`[Migration] Legacy users found for ${rtId}. Upgrading to dedicated UserModel...`);
      for (const u of legacyDoc.data.list) {
        const exists = await UserModel.findOne({ id: u.id });
        if (!exists) {
          await UserModel.create({
            ...u,
            rtId: rtId || 'rt01'
          });
        }
      }
      await SystemDataModel.findByIdAndDelete(legacyDocId);
    }

    // 2. Migrate Other App Resources
    const legacyAppId = rtId ? `app_data_${rtId}` : 'app_data';
    const legacyApp = await SystemDataModel.findById(legacyAppId);
    if (legacyApp && legacyApp.data) {
      const data = legacyApp.data;
      console.log(`[Migration] Legacy App Data found for ${rtId}. Separating into collection modules...`);
      
      const map: { [key: string]: mongoose.Model<any> } = {
        surat: SuratModel,
        laporan: LaporanModel,
        acara: AcaraModel,
        umkm: UmkmModel,
        kas: KasModel,
        iuran: IuranModel,
        darurat: DaruratModel,
        tamu: TamuModel,
        media: MediaModel,
        voting: VotingModel,
        dokumen: DokumenModel,
        inventaris: InventarisModel
      };

      for (const [key, model] of Object.entries(map)) {
        if (data[key] && Array.isArray(data[key])) {
          for (const item of data[key]) {
            const exists = await model.findOne({ id: item.id });
            if (!exists) {
              await model.create({
                ...item,
                rtId: rtId || 'rt01'
              });
            }
          }
        }
      }
      await SystemDataModel.findByIdAndDelete(legacyAppId);
    }
  } catch (error) {
    console.error(`[Migration Error] Fault migrating legacy documents of ${rtId}:`, error);
  }
}

// Global DB Connection marker
let isDbConnected = false;

async function connectDB() {
  if (isDbConnected) return;
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log("Connected securely to MongoDB database system.");
  } catch (err) {
    console.error("MongoDB connection exception:", err);
  }
}

// Audit trail injection
async function logAudit(rtId: string, user: string, action: string, details: string, before?: any, after?: any) {
  try {
    await AuditLogModel.create({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      user: user || "Sistem / Tamu",
      action,
      details,
      before,
      after,
      rtId: rtId || "rt01",
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.error("Failed to write audit trail log:", e);
  }
}


// ==========================================
// COMPATIBILITY HOOKS FOR API HANDLERS
// ==========================================
async function getUsers(rtId: string = '') {
  await connectDB();
  const q = rtId ? { rtId } : {};
  return await UserModel.find(q).lean();
}

async function saveUsers(rtId: string = '', users: any[]) {
  await connectDB();
  for (const user of users) {
    await UserModel.findOneAndUpdate(
      { id: user.id },
      { ...user, rtId: rtId || user.rtId || 'rt01' },
      { upsert: true, new: true }
    );
  }
  const currentIds = users.map(u => u.id);
  if (rtId) {
    await UserModel.deleteMany({ rtId, id: { $nin: currentIds } });
  }
  broadcastEvent('update', { type: 'users', rtId });
}

async function getNotifications(rtId: string = '') {
  await connectDB();
  const q = rtId ? { rtId } : {};
  return await NotificationModel.find(q).sort({ time: -1 }).limit(100).lean();
}

async function saveNotifications(rtId: string = '', notifs: any[]) {
  await connectDB();
  if (rtId) {
    await NotificationModel.deleteMany({ rtId });
  }
  for (const n of notifs) {
    await NotificationModel.create({ ...n, rtId: rtId || 'rt01' });
  }
  broadcastEvent('update', { type: 'notifications', rtId });
}

async function getAppData(rtId: string = '') {
  await connectDB();
  const [surat, laporan, acara, umkm, kas, iuran, darurat, tamu, media, voting, dokumen, inventaris] = await Promise.all([
    SuratModel.find({ rtId }).lean(),
    LaporanModel.find({ rtId }).lean(),
    AcaraModel.find({ rtId }).lean(),
    UmkmModel.find({ rtId }).lean(),
    KasModel.find({ rtId }).lean(),
    IuranModel.find({ rtId }).lean(),
    DaruratModel.find({ rtId }).lean(),
    TamuModel.find({ rtId }).lean(),
    MediaModel.find({ rtId }).lean(),
    VotingModel.find({ rtId }).lean(),
    DokumenModel.find({ rtId }).lean(),
    InventarisModel.find({ rtId }).lean()
  ]);

  return {
    surat: surat || [],
    laporan: laporan || [],
    acara: acara || [],
    umkm: umkm || [],
    kas: kas || [],
    iuran: iuran || [],
    darurat: darurat || [],
    tamu: tamu || [],
    media: media || [],
    voting: voting || [],
    dokumen: dokumen || [],
    inventaris: inventaris || []
  };
}

async function saveAppData(rtId: string = '', data: any) {
  await connectDB();
  const map: { [key: string]: mongoose.Model<any> } = {
    surat: SuratModel,
    laporan: LaporanModel,
    acara: AcaraModel,
    umkm: UmkmModel,
    kas: KasModel,
    iuran: IuranModel,
    darurat: DaruratModel,
    tamu: TamuModel,
    media: MediaModel,
    voting: VotingModel,
    dokumen: DokumenModel,
    inventaris: InventarisModel
  };

  for (const [key, model] of Object.entries(map)) {
    if (data[key] && Array.isArray(data[key])) {
      const ids = data[key].map((item: any) => item.id);
      if (rtId) {
        await model.deleteMany({ rtId, id: { $nin: ids } });
      }
      for (const item of data[key]) {
        await model.findOneAndUpdate(
          { id: item.id },
          { ...item, rtId: rtId || 'rt01' },
          { upsert: true, new: true }
        );
      }
    }
  }
  broadcastEvent('update', { type: 'app_data', rtId });
}

async function initDb(rtId: string = '') {
  await connectDB();
  try {
    // Run automated legacy migrations to preserve old database states
    await migrateLegacyDataIfAny(rtId);

    let list = await getUsers(rtId);
    let adminUsername = "ketuart1";
    let adminPassword = "rt12345";
    let statusText = "Ketua RT 01 / RW 21";
    let namaKetua = "Ketua RT 01";

    if (rtId === 'rt02') {
      adminUsername = "ketuart2";
      adminPassword = "rt12345";
      statusText = "Ketua RT 02 / RW 21";
      namaKetua = "Ketua RT 02";
    } else if (rtId === 'rt03') {
      adminUsername = "ketuart3";
      adminPassword = "rt12345";
      statusText = "Ketua RT 03 / RW 21";
      namaKetua = "Ketua RT 03";
    }

    // Clean duplicate admins
    let cleanedList = list.filter((u: any) => u.role !== 'admin' || u.username === adminUsername);
    if (cleanedList.length !== list.length) {
      list = cleanedList;
      await saveUsers(rtId, list);
    }

    if (!list.find((u: any) => u.username === adminUsername)) {
      await UserModel.create({
        id: "admin_" + adminUsername,
        username: adminUsername,
        password: adminPassword,
        nama: namaKetua,
        role: "admin",
        alamat: "Jl. Bahagia No. 12, Kompleks Rukun",
        noHp: "0812-3456-7890",
        status: statusText,
        isApproved: true,
        rtId: rtId || 'rt01'
      });
    }

    // Seed Darurat contacts if none exist
    const daruratCount = await DaruratModel.countDocuments({ rtId });
    if (daruratCount === 0) {
      const initialDarurat = [
        { id: `${rtId}_d1`, name: 'Ambulance & Gawat Darurat', tel: '118', type: 'Medis', rtId: rtId || 'rt01' },
        { id: `${rtId}_d2`, name: 'Polisi', tel: '110', type: 'Keamanan', rtId: rtId || 'rt01' },
        { id: `${rtId}_d3`, name: 'Pemadam Kebakaran', tel: '113', type: 'Kebakaran', rtId: rtId || 'rt01' },
        { id: `${rtId}_d4`, name: 'Ketua RT', tel: '081234567890', type: 'Lingkungan', rtId: rtId || 'rt01' },
        { id: `${rtId}_d5`, name: 'Security Pos Depan', tel: '089876543210', type: 'Keamanan', rtId: rtId || 'rt01' }
      ];
      await DaruratModel.insertMany(initialDarurat);
    }

    // Seed default media for interactive showcase
    const mediaCount = await MediaModel.countDocuments({ rtId });
    if (mediaCount === 0) {
      await MediaModel.create({
        id: `${rtId}_media1`,
        imageUrl: 'https://images.unsplash.com/photo-1593113511332-15f5ea6c4dcd?auto=format&fit=crop&w=300&q=80',
        title: 'Kerja Bakti 2024',
        uploaderName: 'Admin',
        rtId: rtId || 'rt01',
        createdAt: new Date().toISOString()
      });
    }

  } catch (e: any) {
    console.error("DB Initialization Error:", e);
  }
}

const clients = new Set<any>();

function broadcastEvent(event: string, data: any) {
  for (const client of clients) {
    try {
      client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    } catch(e) {
      clients.delete(client);
    }
  }
}

export async function addNotification(rtId: string = '', title: string, message: string, updaterName: string = 'Sistem', resource?: string, resourceId?: string) {
  const notifs = await getNotifications(rtId);
  if (notifs.length > 0) {
    const lastNotif = notifs[0];
    if (lastNotif.title === title && lastNotif.message === message && lastNotif.resourceId === resourceId) {
      return;
    }
  }
  const newNotif = {
    id: Date.now().toString(),
    title,
    message,
    updaterName,
    resource,
    resourceId,
    time: new Date().toISOString(),
    read: false,
    rtId: rtId || 'rt01'
  };
  await NotificationModel.create(newNotif);
  broadcastEvent('update', { type: 'notifications', rtId });
}

// ==========================================
// POINT 6: REQUESTS VALIDATION (ZOD SYSTEM)
// ==========================================
const RegisterValidator = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  nama: z.string().min(2, "Nama minimal 2 karakter"),
  password: z.string().min(5, "Password minimal 5 karakter"),
  alamat: z.string().optional(),
  noHp: z.string().optional(),
  status: z.string().optional(),
  umur: z.any().optional()
});

const LoginValidator = z.object({
  username: z.string(),
  password: z.string()
});

const KasTransactionValidator = z.object({
  type: z.enum(['Masuk', 'Keluar']),
  amount: z.number().positive("Jumlah kas harus bilangan bernilai positif"),
  name: z.string(),
  message: z.string().min(1, "Berikan deksrispi transaksi"),
  category: z.string(),
  status: z.enum(['setuju', 'butuh_konfirmasi', 'selesai']).optional()
});

const IuranValidator = z.object({
  nama: z.string(),
  nominal: z.number().positive("Nominal iuran harus positif"),
  jenis: z.string(),
  status: z.string()
});

// Middleware helper validation
function validateRequest(schema: z.ZodObject<any>) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e: any) {
      res.status(400).json({ error: e.errors?.[0]?.message || "Input validation failed!" });
    }
  };
}

// ==========================================
// POINT 4: ROLE BASED PERMISSION ENFORCER
// ==========================================
function enforceRoles(allowed: string[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const role = (req.headers['x-user-role'] as string) || 'warga';
    if (allowed.includes(role)) {
      next();
    } else {
      res.status(403).json({ error: `Akses ditolak: role '${role}' tidak memiliki authorize di resource ini.` });
    }
  };
}


// ==========================================
// API REST ROUTES GROUPINGS (POINT 5)
// ==========================================

// --- AUTH & SIGNUP ---
app.post("/api/register", validateRequest(RegisterValidator), async (req, res) => {
  const { username, nama, password, alamat, noHp, status, umur } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';

  const userExists = await UserModel.findOne({ rtId, username });
  if (userExists) {
    return res.status(400).json({ error: "Username sudah terdaftar" });
  }

  const newUser = await UserModel.create({
    id: Date.now().toString(),
    username,
    nama,
    password,
    alamat,
    noHp,
    status,
    role: "warga",
    isApproved: false,
    umur: Number(umur) || undefined,
    rtId,
    members: []
  });

  await logAudit(rtId, nama, "REGISTER_WARGA", `Warga baru ${nama} mendaftarkan dengan role warga`, null, newUser);
  await addNotification(rtId, "Warga Baru Terdaftar", `Warga baru ${nama} telah didaftarkan. Menunggu verifikasi.`, nama, "warga", newUser.id);

  res.json({ message: "Registrasi sukses", user: newUser });
});

const activeSessions = new Map<string, number>();

setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [id, lastSeen] of activeSessions.entries()) {
    if (now - lastSeen > 15000) {
      activeSessions.delete(id);
      changed = true;
    }
  }
  if (changed) {
    broadcastEvent('update', { type: 'online_status' });
  }
}, 5000);

app.post("/api/login", validateRequest(LoginValidator), async (req, res) => {
  const { username, password } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';

  await connectDB();
  const user = await UserModel.findOne({ rtId, username, password });

  if (user) {
    if (activeSessions.has(user.id) && Date.now() - activeSessions.get(user.id)! < 10000) {
      return res.status(409).json({ error: "User sedang aktif digunakan pada perangkat lain" });
    }
    activeSessions.set(user.id, Date.now());
    res.json({ message: "Login Berhasil", user });
  } else {
    res.status(401).json({ error: "Username atau password salah" });
  }
});

app.post("/api/ping", (req, res) => {
  const { id } = req.body;
  if (id) {
    const wasOnline = activeSessions.has(id);
    activeSessions.set(id, Date.now());
    if (!wasOnline) {
      broadcastEvent('update', { type: 'online_status' });
    }
  }
  res.json({ success: true });
});

app.post("/api/logout", (req, res) => {
  const { id } = req.body;
  if (id) {
    activeSessions.delete(id);
    broadcastEvent('update', { type: 'online_status' });
  }
  res.json({ success: true });
});

app.get("/api/notifications", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  try {
    const list = await getNotifications(rtId);
    res.json({ notifications: list });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

app.post("/api/notifications/read", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  try {
    await NotificationModel.updateMany({ rtId }, { $set: { read: true } });
    broadcastEvent('update', { type: 'notifications', rtId });
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to mark notifications as read" });
  }
});

app.get("/api/tangerang-logo-proxy", async (req, res) => {
  try {
    const url = "https://tangerangkab.go.id/tangerangkab-web/images/logo_kabupatentangerang_perda.png";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch logo: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=604800"); // 1 week cache
    res.send(buffer);
  } catch (error: any) {
    console.error("Logo proxy error:", error);
    // Return empty 1x1 transparent PNG as fallback to prevent app crashing
    const transparentPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(transparentPngBase64, 'base64'));
  }
});

app.get("/api/stream", (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.add(res);

  req.on('close', () => {
    clients.delete(res);
  });
});

app.put("/api/password", async (req, res) => {
  const { id, oldPassword, newPassword } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';

  const user = await UserModel.findOne({ id, rtId });
  if (user) {
    if (user.password !== oldPassword) {
      return res.status(400).json({ error: "Password lama tidak sesuai" });
    }
    const beforeObj = { password: user.password };
    user.password = newPassword;
    await user.save();
    
    await logAudit(rtId, user.nama, "PASSWORD_UPDATE", `Mengubah password akun`, beforeObj, { password: "*****" });
    res.json({ message: "Password berhasil diganti" });
  } else {
    res.status(404).json({ error: "User tidak ditemukan" });
  }
});

app.put("/api/profile", async (req, res) => {
  const { id, username, nama, alamat, noHp, status, photo, umur, dokumenKk, dokumenKtp } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';

  const user = await UserModel.findOne({ id, rtId });
  if (user) {
    const beforeObj = user.toObject();
    
    user.nama = nama || user.nama;
    user.alamat = alamat || user.alamat;
    user.noHp = noHp || user.noHp;
    user.status = status || user.status;
    user.photo = photo || user.photo;
    user.umur = umur !== undefined ? Number(umur) : user.umur;
    user.dokumenKk = dokumenKk !== undefined ? dokumenKk : user.dokumenKk;
    user.dokumenKtp = dokumenKtp !== undefined ? dokumenKtp : user.dokumenKtp;
    
    const updatedUser = await user.save();
    await logAudit(rtId, user.nama, "PROFILE_UPDATE", `Memperbarui rincian profil`, beforeObj, updatedUser);
    
    const updater = req.body.updaterName || nama || user.nama || 'Sistem';
    await addNotification(rtId, "Profil Diperbarui", `Warga ${user.nama} memperbarui profil.`, updater, "warga", id);
    
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } else {
    res.status(404).json({ error: "User tidak ditemukan" });
  }
});

// --- CITIZEN DATA & APPROVAL MANAGEMENT ---
app.get("/api/warga", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const users = await UserModel.find({ rtId }).lean();
  const sortedUsers = users.map((u: any) => ({
    ...u,
    isOnline: activeSessions.has(u.id) && Date.now() - activeSessions.get(u.id)! < 15000
  }));
  res.json({ users: sortedUsers });
});

app.delete("/api/warga/:id", enforceRoles(['admin']), async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const user = await UserModel.findOne({ id: req.params.id, rtId });
  if (user) {
    const beforeData = user.toObject();
    await UserModel.deleteOne({ id: req.params.id, rtId });
    
    await logAudit(rtId, req.headers['x-user-id'] as string || 'Admin', "DELETE_WARGA", `Menghapus data warga ${user.nama}`, beforeData, null);
    await addNotification(rtId, "Warga Dihapus", `Data warga ${user.nama} telah dihapus.`, 'Admin', "warga", req.params.id);
    res.json({ message: "User deleted" });
  } else {
    res.status(404).json({ error: "Warga tidak ditemukan" });
  }
});

// Add Family members to Kartu Keluarga
app.post("/api/warga/:id/members", async (req, res) => {
  const { name, role, age, tglLahir } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';

  const user = await UserModel.findOne({ id: req.params.id, rtId });
  if (user) {
    const beforeObj = JSON.parse(JSON.stringify(user.members || []));
    if (!user.members) user.members = [];
    const newMember = { id: Date.now().toString(), name, role, age: Number(age) || 0, tglLahir };
    user.members.push(newMember);
    await user.save();

    await logAudit(rtId, user.nama, "ADD_FAMILY_MEMBER", `Menambahkan anggota keluarga baru ${name} ke KK`, beforeObj, user.members);
    await addNotification(rtId, "Anggota Keluarga Bertambah", `Anggota baru ${name} ditambahkan ke KK ${user.nama}.`, user.nama, "warga", user.id);
    
    res.json({ message: "Family member added", member: newMember, user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.put("/api/warga/:id/members/:memberId", async (req, res) => {
  const { name, role, age, tglLahir } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';

  const user = await UserModel.findOne({ id: req.params.id, rtId });
  if (user && user.members) {
    const beforeObj = JSON.parse(JSON.stringify(user.members));
    const memberIndex = user.members.findIndex((m: any) => m.id === req.params.memberId);
    if (memberIndex !== -1) {
      user.members[memberIndex] = { ...user.members[memberIndex], name, role, age: Number(age) || 0, tglLahir };
      await user.save();
      
      await logAudit(rtId, user.nama, "UPDATE_FAMILY_MEMBER", `Memperbarui rincian keluarga ${name}`, beforeObj, user.members);
      await addNotification(rtId, "Anggota Keluarga Diperbarui", `Data anggota ${name} di KK ${user.nama} diperbarui.`, user.nama || 'Sistem', "warga", user.id);
      
      res.json({ message: "Family member updated", user });
    } else {
      res.status(404).json({ error: "Member not found" });
    }
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.delete("/api/warga/:id/members/:memberId", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const user = await UserModel.findOne({ id: req.params.id, rtId });
  if (user && user.members) {
    const beforeObj = JSON.parse(JSON.stringify(user.members));
    const member = user.members.find((m: any) => m.id === req.params.memberId);
    user.members = user.members.filter((m: any) => m.id !== req.params.memberId);
    await user.save();

    if (member) {
      await logAudit(rtId, user.nama, "DELETE_FAMILY_MEMBER", `Menghapus anggota keluarga ${member.name}`, beforeObj, user.members);
      await addNotification(rtId, "Anggota Keluarga Dihapus", `Anggota ${member.name} dihapus dari KK ${user.nama}.`, user.nama, "warga", user.id);
    }
    res.json({ message: "Family member deleted", user });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

app.put("/api/warga/:id/role", enforceRoles(['admin']), async (req, res) => {
  const { role } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';

  const user = await UserModel.findOne({ id: req.params.id, rtId });
  if (user && user.id !== "admin") {
    const beforeRole = user.role;
    user.role = role;
    await user.save();

    await logAudit(rtId, "Admin", "PROMOTED_ROLE", `Mengubah peran warga ${user.nama} dari ${beforeRole} ke ${role}`, { role: beforeRole }, { role });
    await addNotification(rtId, "Peran Warga Diperbarui", `Peran warga ${user.nama} diubah menjadi ${role}.`, 'Admin', "warga", user.id);
    res.json({ message: "Role updated successfully", user });
  } else {
    res.status(400).json({ error: "Gagal update role" });
  }
});

app.put("/api/warga/:id/approval", enforceRoles(['admin']), async (req, res) => {
  const { isApproved } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';

  const user = await UserModel.findOne({ id: req.params.id, rtId });
  if (user && user.id !== "admin") {
    const beforeState = user.isApproved;
    user.isApproved = isApproved;
    await user.save();

    await logAudit(rtId, "Admin", "WARGA_APPROVAL", `Verifikasi pendaftaran warga ${user.nama}: ${isApproved ? 'SETUJU' : 'BATAL'}`, { isApproved: beforeState }, { isApproved });
    
    const statusText = isApproved ? 'disetujui' : 'dibatalkan';
    await addNotification(rtId, "Status Warga Diperbarui", `Status warga ${user.nama} ${statusText}.`, 'Admin', "warga", user.id);
    res.json({ message: "Status approval updated successfully", user });
  } else {
    res.status(400).json({ error: "Gagal update status approval" });
  }
});

// --- AUDIO/TRANSACTION PING ---
app.post("/api/transactions", async (req, res) => {
  const { type, amount, name, message } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
  const formattedAmount = formatter.format(amount || 0);

  let notifTitle = `Transaksi ${type || 'Baru'}`;
  let notifMessage = message || `Terdapat transaksi ${type ? type.toLowerCase() : 'baru'} masuk sebesar ${formattedAmount} dari ${name || 'Warga'}.`;

  await addNotification(rtId, notifTitle, notifMessage);
  res.json({ success: true, message: "Transaksi berhasil dan notifikasi dikirim" });
});

// --- BROADCAST MESSAGES ---
app.post("/api/broadcast", enforceRoles(['admin', 'pengurus', 'sekretaris']), async (req, res) => {
  const { title, message, updaterName } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  if (!message) return res.status(400).json({ error: "Pesan tidak boleh kosong" });

  await logAudit(rtId, updaterName || 'Admin', "BROADCAST", `Mengirimkan pengumuman broadcast: ${title || 'No Title'}`, null, { title, message });
  await addNotification(rtId, title || "📢 Pengumuman RT", message, updaterName || 'Admin', "broadcast");
  res.json({ success: true, message: "Pesan broadcast berhasil dikirim ke semua warga" });
});

// --- COMPATIBLE APP_DATA / MULTI-MODULE ENDPOINTS ---
app.get("/api/data/:resource", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const resource = req.params.resource;
  const data = await getAppData(rtId);
  if (!data[resource as keyof typeof data]) return res.status(404).json({ error: "Resource not found" });
  res.json({ data: data[resource as keyof typeof data] });
});

// POINT 6: VALIDATE CREATION VIA ZOD AND AUDIT TRAIL LOGGING
app.post("/api/data/:resource", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const resource = req.params.resource;
  
  const map: { [key: string]: mongoose.Model<any> } = {
    surat: SuratModel,
    laporan: LaporanModel,
    acara: AcaraModel,
    umkm: UmkmModel,
    kas: KasModel,
    iuran: IuranModel,
    darurat: DaruratModel,
    tamu: TamuModel,
    media: MediaModel,
    dokumen: DokumenModel,
    inventaris: InventarisModel
  };

  const model = map[resource];
  if (!model) return res.status(404).json({ error: "Resource not found" });

  // Input Validation (Point 6 Constraints)
  if (resource === 'iuran') {
    try {
      IuranValidator.parse(req.body);
    } catch(e: any) {
      return res.status(400).json({ error: e.errors?.[0]?.message || "Validasi nominal iuran gagal." });
    }
  }
  if (resource === 'kas') {
    try {
      KasTransactionValidator.parse(req.body);
    } catch(e: any) {
      return res.status(400).json({ error: e.errors?.[0]?.message || "Validasi transaksi kas gagal." });
    }
  }

  const itemId = Date.now().toString() + Math.random().toString(36).substr(2, 5);
  const newItemData = {
    id: itemId,
    rtId,
    createdAt: new Date().toISOString(),
    ...req.body
  };

  // Auto numbering list for surat
  if (resource === 'surat') {
    const count = await SuratModel.countDocuments({ rtId });
    const sequence = String(count + 1).padStart(2, '0');
    
    // Extract digit numbers from rtId
    const rtNum = rtId.match(/\d+/)?.[0] || '1';
    const formattedRt = `RT-${String(rtNum).padStart(3, '0')}`;
    
    // Bulan Roma (standard Indonesian letter numbering) & Tahun
    const d = new Date();
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const currentMonth = months[d.getMonth()];
    const year = d.getFullYear();
    
    // Format: (berurutan dimulai dari 01)/RT-001/RW-021/(Bulan pembuatan)/(Tahun pembuatan)
    const generatedNomor = `${sequence}/${formattedRt}/RW-021/${currentMonth}/${year}`;
    newItemData.nomorSurat = generatedNomor;
  }

  // Enforce values to numbers if needed
  if (resource === 'iuran' && typeof newItemData.nominal === 'string') {
    newItemData.nominal = Number(newItemData.nominal);
  }
  if (resource === 'kas' && typeof newItemData.amount === 'string') {
    newItemData.amount = Number(newItemData.amount);
  }

  const createdItem = await model.create(newItemData);

  // audit logging
  const creator = req.body.nama || req.body.name || req.body.uploaderName || req.body.pembuat || req.body.updaterName || 'Sistem';
  await logAudit(rtId, creator, `CREATE_${resource.toUpperCase()}`, `Memasukkan record baru ke modul ${resource}`, null, createdItem);

  // Dynamic automatic fund split allocations on verified warga payments
  if (resource === 'iuran' && createdItem.status === 'verifikasi') {
    const nominal = parseInt(createdItem.nominal || '0', 10);
    if (createdItem.jenis === 'Wifi') {
      const kasRTAmount = 10000;
      await KasModel.create({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        type: 'Masuk',
        amount: kasRTAmount,
        name: createdItem.nama,
        message: 'Pembayaran Wifi (Kas RT)',
        category: 'Kas RT',
        iuranId: createdItem.id,
        rtId,
        status: 'selesai'
      });
    } else {
      const isSplit = nominal >= 5000;
      const danaKematianAmount = isSplit ? 5000 : 0;
      const kasRTAmount = nominal - danaKematianAmount;
      if (kasRTAmount > 0) {
        await KasModel.create({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          createdAt: new Date().toISOString(),
          type: 'Masuk',
          amount: kasRTAmount,
          name: createdItem.nama,
          message: 'Iuran Warga (Kas RT)',
          category: 'Kas RT',
          iuranId: createdItem.id,
          rtId,
          status: 'selesai'
        });
      }
      if (danaKematianAmount > 0) {
        await KasModel.create({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          createdAt: new Date().toISOString(),
          type: 'Masuk',
          amount: danaKematianAmount,
          name: createdItem.nama,
          message: 'Iuran Warga (Dana Kematian)',
          category: 'Dana Kematian',
          iuranId: createdItem.id,
          rtId,
          status: 'selesai'
        });
      }
    }
  }

  let title = `Input Baru: ${resource}`;
  if (resource === 'laporan') title = 'Laporan Baru';
  if (resource === 'iuran') title = 'Iuran Baru';
  if (resource === 'kas') title = 'Kas Baru';
  if (resource === 'darurat') title = 'Panggilan Darurat';
  if (resource === 'acara') title = 'Acara Baru';
  if (resource === 'surat') title = 'Surat Keluar Baru';

  await addNotification(rtId, title, `Terdapat data baru pada modul ${resource} oleh ${creator}.`, creator, resource, createdItem.id);
  res.json({ message: "Created successfully", item: createdItem });
});

app.put("/api/data/:resource/:id", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const resource = req.params.resource;

  const map: { [key: string]: mongoose.Model<any> } = {
    surat: SuratModel,
    laporan: LaporanModel,
    acara: AcaraModel,
    umkm: UmkmModel,
    kas: KasModel,
    iuran: IuranModel,
    darurat: DaruratModel,
    tamu: TamuModel,
    media: MediaModel,
    dokumen: DokumenModel,
    inventaris: InventarisModel
  };

  const model = map[resource];
  if (!model) return res.status(404).json({ error: "Resource not found" });

  const oldItem = await model.findOne({ id: req.params.id, rtId });
  if (!oldItem) return res.status(404).json({ error: "Item not found" });

  const beforeDataObj = oldItem.toObject();
  const updatePayload = { ...req.body };
  if (updatePayload.nominal !== undefined) updatePayload.nominal = Number(updatePayload.nominal);
  if (updatePayload.amount !== undefined) updatePayload.amount = Number(updatePayload.amount);

  const updatedItem = await model.findOneAndUpdate({ id: req.params.id, rtId }, updatePayload, { new: true });

  const updater = req.body.updaterName || 'Sistem';
  await logAudit(rtId, updater, `UPDATE_${resource.toUpperCase()}`, `Mengupdate record modul ${resource}`, beforeDataObj, updatedItem);

  // Verification handling to autoallocate on verifying citizens iuran payments
  if (resource === 'surat' && oldItem.status !== updatedItem.status && updatedItem.status === 'selesai') {
    await addNotification(rtId, 'Surat Selesai', `Surat pengajuan untuk ${updatedItem.keperluan || 'anda'} sudah bisa diambil.`, updater, resource, updatedItem.id);
  } else if (resource === 'laporan' && oldItem.status !== updatedItem.status) {
    await addNotification(rtId, 'Update Laporan', `Laporan ${updatedItem.judul || 'warga'} kini berstatus mohon diproses: ${updatedItem.status}.`, updater, resource, updatedItem.id);
  } else if (resource === 'iuran' && oldItem.status !== updatedItem.status && updatedItem.status === 'verifikasi') {
    await addNotification(rtId, 'Iuran Diverifikasi', `Iuran dari ${updatedItem.nama || 'warga'} sebesar Rp ${updatedItem.nominal} telah diverifikasi dan masuk kas.`, updater, resource, updatedItem.id);
    const nominal = parseInt(updatedItem.nominal || '0', 10);
    
    if (updatedItem.jenis === 'Wifi') {
      const kasRTAmount = 10000;
      await KasModel.create({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        createdAt: new Date().toISOString(),
        type: 'Masuk',
        amount: kasRTAmount,
        name: updatedItem.nama,
        message: 'Pembayaran Wifi (Kas RT)',
        category: 'Kas RT',
        iuranId: updatedItem.id,
        rtId,
        status: 'selesai'
      });
    } else {
      const isSplit = nominal >= 5000;
      const danaKematianAmount = isSplit ? 5000 : 0;
      const kasRTAmount = nominal - danaKematianAmount;

      if (kasRTAmount > 0) {
        await KasModel.create({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          createdAt: new Date().toISOString(),
          type: 'Masuk',
          amount: kasRTAmount,
          name: updatedItem.nama,
          message: 'Iuran Warga (Kas RT)',
          category: 'Kas RT',
          iuranId: updatedItem.id,
          rtId,
          status: 'selesai'
        });
      }
      if (danaKematianAmount > 0) {
        await KasModel.create({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          createdAt: new Date().toISOString(),
          type: 'Masuk',
          amount: danaKematianAmount,
          name: updatedItem.nama,
          message: 'Iuran Warga (Dana Kematian)',
          category: 'Dana Kematian',
          iuranId: updatedItem.id,
          rtId,
          status: 'selesai'
        });
      }
    }
  } else {
    await addNotification(rtId, `Data Diupdate: ${resource}`, `Terdapat perubahan data pada modul ${resource} oleh ${updater}.`, updater, resource, updatedItem.id);
  }

  res.json({ message: "Updated successfully", item: updatedItem });
});

app.delete("/api/data/:resource/:id", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const resource = req.params.resource;

  const map: { [key: string]: mongoose.Model<any> } = {
    surat: SuratModel,
    laporan: LaporanModel,
    acara: AcaraModel,
    umkm: UmkmModel,
    kas: KasModel,
    iuran: IuranModel,
    darurat: DaruratModel,
    tamu: TamuModel,
    media: MediaModel,
    dokumen: DokumenModel,
    inventaris: InventarisModel
  };

  const model = map[resource];
  if (!model) return res.status(404).json({ error: "Resource not found" });

  const oldItem = await model.findOne({ id: req.params.id, rtId });
  if (!oldItem) return res.status(404).json({ error: "Item not found" });

  const beforeDataObj = oldItem.toObject();
  await model.deleteOne({ id: req.params.id, rtId });

  const updater = req.body?.updaterName || 'Sistem';
  await logAudit(rtId, updater, `DELETE_${resource.toUpperCase()}`, `Menghapus record dari modul ${resource}`, beforeDataObj, null);

  // Cascase delete iuran connections to kas logs and vice versa
  if (resource === 'kas' && oldItem.iuranId) {
    await IuranModel.deleteOne({ id: oldItem.iuranId, rtId });
    await KasModel.deleteMany({ iuranId: oldItem.iuranId, rtId });
  } else if (resource === 'iuran') {
    await KasModel.deleteMany({ iuranId: req.params.id, rtId });
  }

  await addNotification(rtId, `Data Dihapus: ${resource}`, `Terdapat penghapusan data pada modul ${resource} oleh ${updater}.`, updater);
  res.json({ message: "Deleted successfully" });
});


// ==========================================
// POINT 9: SECURE CONSTANTE VOTING MECHANICS
// ==========================================
app.get("/api/voting", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const data = await VotingModel.find({ rtId }).sort({ createdAt: -1 });
  res.json({ data });
});

app.post("/api/voting", enforceRoles(['admin', 'pengurus']), async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const { title, description, options, status, createdBy } = req.body;

  const newVote = await VotingModel.create({
    id: Date.now().toString(),
    title,
    description,
    options: options.map((opt: any) => ({ ...opt, count: 0 })),
    votes: [],
    status: status || 'aktif',
    createdBy: createdBy || 'Pengurus',
    rtId,
    createdAt: new Date().toISOString()
  });

  await logAudit(rtId, createdBy || 'Admin', "CREATE_VOTING", `Membuat polling voting baru: ${title}`, null, newVote);
  await addNotification(rtId, `Voting Baru: ${title}`, `Mari berpartisipasi pada voting baru: ${title}`, createdBy || 'Pengurus');
  res.json({ message: "Voting created", data: newVote });
});

app.put("/api/voting/:id", enforceRoles(['admin', 'pengurus']), async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const voteDoc = await VotingModel.findOne({ id: req.params.id, rtId });
  if (voteDoc) {
    const beforeObj = voteDoc.toObject();
    await VotingModel.updateOne({ id: req.params.id, rtId }, { $set: req.body });
    const afterObj = await VotingModel.findOne({ id: req.params.id, rtId });
    await logAudit(rtId, "Admin", "UPDATE_VOTING", `Mengupdate satus/parameter voting: ${afterObj?.title}`, beforeObj, afterObj);
    res.json({ message: "Voting updated" });
  } else {
    res.status(404).json({ error: "Voting tidak ditemukan" });
  }
});

// SUBMIT VOTE WITH UNIQUE 1-PERSON-1-VOTE CONSTRAINT CHECK
app.post("/api/voting/:id/vote", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  const { optionId, userId } = req.body;

  if (!userId || !optionId) {
    return res.status(400).json({ error: "Missing required voter specifications." });
  }

  const voteDoc = await VotingModel.findOne({ id: req.params.id, rtId });
  if (!voteDoc) {
    return res.status(404).json({ error: "Sesi voting tidak ditemukan!" });
  }

  if (voteDoc.status === 'selesai') {
    return res.status(400).json({ error: "Sesi voting ini sudah berakhir dan ditutup." });
  }

  // CONSTRAINT CHECK: Ensure voter only registers ONE unique voice
  const existingVoteIndex = voteDoc.votes.findIndex((vt: any) => vt.userId === userId);
  
  const beforeObj = voteDoc.toObject();

  if (existingVoteIndex !== -1) {
    // If they already voted: edit their existing vote cleanly (or block if desired, here we allow them to update their choice)
    voteDoc.votes[existingVoteIndex].optionId = optionId;
    voteDoc.votes[existingVoteIndex].date = new Date().toISOString();
  } else {
    // Registered new vote
    voteDoc.votes.push({ userId, optionId, date: new Date().toISOString() });
  }

  // Recalculate options counters to reflect truth
  voteDoc.options = voteDoc.options.map((opt: any) => {
    const totalCount = voteDoc.votes.filter((v: any) => v.optionId === opt.id).length;
    return { ...opt, count: totalCount };
  });

  const updatedVote = await voteDoc.save();
  await logAudit(rtId, userId, "CAST_VOTE", `Warga menempatkan suara pada voting ${voteDoc.title}`, beforeObj, updatedVote);

  res.json({ message: "Suara berhasil dikirimkan", data: updatedVote });
});


// ==========================================
// POINT 7: AUDIT LOGS RETRIEVAL ENDPOINT
// ==========================================
app.get("/api/audit-logs", async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  try {
    const logs = await AuditLogModel.find({ rtId }).sort({ timestamp: -1 }).limit(150);
    res.json({ data: logs });
  } catch (e: any) {
    res.status(500).json({ error: "Failed to read logs" });
  }
});


// ==========================================
// POINT 10: AUTOMATIC DATABASE BACKUP EXPORTER
// ==========================================
app.get("/api/backup/export", enforceRoles(['admin']), async (req, res) => {
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  try {
    // Extract full snapshots of all collections
    const [users, kas, iuran, voting, acara, laporan, surat, umkm, tamu, media, darurat, logs] = await Promise.all([
      UserModel.find({ rtId }).lean(),
      KasModel.find({ rtId }).lean(),
      IuranModel.find({ rtId }).lean(),
      VotingModel.find({ rtId }).lean(),
      AcaraModel.find({ rtId }).lean(),
      LaporanModel.find({ rtId }).lean(),
      SuratModel.find({ rtId }).lean(),
      UmkmModel.find({ rtId }).lean(),
      TamuModel.find({ rtId }).lean(),
      MediaModel.find({ rtId }).lean(),
      DaruratModel.find({ rtId }).lean(),
      AuditLogModel.find({ rtId }).lean()
    ]);

    const snapshot = {
      rtId,
      exportedAt: new Date().toISOString(),
      formatVersion: "1.0",
      stats: {
        users: users.length,
        kas: kas.length,
        iuran: iuran.length,
        voting: voting.length,
        laporan: laporan.length,
        auditLogs: logs.length
      },
      collections: {
        users,
        kas,
        iuran,
        voting,
        acara,
        laporan,
        surat,
        umkm,
        tamu,
        media,
        darurat,
        auditLogs: logs
      }
    };

    await logAudit(rtId, "Admin", "EXPORT_DATABASE", "Melakukan ekspor penuh database cadangan RT", null, null);

    // Prompt user download attachment flow
    res.setHeader("Content-disposition", `attachment; filename=CADANGAN_DATABASE_RT_${rtId.toUpperCase()}_${new Date().toISOString().split('T')[0]}.json`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(snapshot, null, 2));

  } catch (e: any) {
    res.status(500).json({ error: "Failed to export database cadangan." });
  }
});


// --- SMART RT AI API (USING @GOOGLE/GENAI) ---
app.post("/api/gemini/action", async (req, res) => {
  const { action, payload } = req.body;
  const rtId = req.headers['x-rt-id'] as string || 'rt01';
  
  if (!process.env.GEMINI_API_KEY) {
    return res.status(400).json({ error: "Kunci API Gemini (GEMINI_API_KEY) belum dikonfigurasi di Settings > Secrets." });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    let prompt = "";
    let systemInstruction = "Anda adalah Smart RT AI, asisten pemerintahan RT pintar di Indonesia yang membantu Ketua RT mengelola warga, kas, dokumen, rapat, dan laporan secara profesional.";

    if (action === "ringkasan_rapat") {
      prompt = `Buatlah ringkasan rapat formal, terstruktur, dan rapi berdasarkan transkrip atau catatan kasar berikut dalam Bahasa Indonesia:\n\nCatatan:\n${payload.notes}\n\nFormat keluaran:\n- **Judul Rapat** (buat menarik & formal)\n- **Tanggal & Waktu**\n- **Poin-Poin Pembahasan Penting**\n- **Keputusan Utama**\n- **Daftar Tindak Lanjut (Action Items) & Penanggung Jawab**\n\nBerikan format Markdown yang sangat elegan.`;
    } else if (action === "analisa_kas") {
      // Fetch latest kas records
      await connectDB();
      const kasRecords = await KasModel.find({ rtId }).sort({ createdAt: -1 }).limit(100).lean();
      const recordsStr = kasRecords.map((k: any) => `- [${k.type}] ${k.name || 'Warga'}: Rp ${(k.amount || 0).toLocaleString('id-ID')} (${k.category || 'Kas RT'}) - ${k.message || 'Tanpa keterangan'}`).join("\n");
      prompt = `Analisalah transaksi keuangan/kas berikut dari RT kami dan berikan wawasan finansial, peringatan, potensi masalah, serta saran penghematan atau alokasi anggaran berikutnya:\n\nTransaksi Terbaru:\n${recordsStr || "Tidak ada transaksi terbaru untuk dianalisis."}\n\nBerikan keluaran dalam format Markdown yang rapi dengan ringkasan status kas (Pemasukan, Pengeluaran, Saldo), tren kategori keuangan, serta rekomendasi aksi konkret.`;
    } else if (action === "draft_surat") {
      prompt = `Buatlah draf surat formal tingkat Rukun Tetangga (RT) berdasarkan informasi berikut dalam Bahasa Indonesia:\n\nKategori Surat: ${payload.jenis}\nNama Warga: ${payload.nama || "................"}\nKeperluan: ${payload.keperluan || "................"}\nKeterangan Tambahan: ${payload.keterangan || "Tidak ada"}\n\nSurat harus mengikuti format resmi surat pengantar/keterangan RT di Indonesia (termasuk KOP Surat RT, nomor surat placeholder, isi surat yang santun, paragraf penutup, serta bagian tanda tangan Ketua RT). Gunakan format Markdown yang presisi dan profesional.`;
    } else if (action === "klasifikasi_laporan") {
      prompt = `Klasifikasikan laporan keluhan warga berikut ke dalam kategori yang sesuai (Keamananan / Kebersihan / Infrastruktur / Sosial / Lainnya) serta tingkat prioritas (Tinggi / Sedang / Rendah) dengan penjelasan singkat dan usulan langkah penanganan konkret pertama dari pengurus RT:\n\nJudul: ${payload.judul}\nDeskripsi: ${payload.deskripsi}\n\nBerikan keluaran dalam format teks Markdown terstruktur dengan bagian Kategori, Prioritas, Alasan Klasifikasi, dan Rekomendasi Penanganan.`;
    } else {
      return res.status(400).json({ error: "Aksi tidak dikenal" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2,
      }
    });

    res.json({ result: response.text });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message || "Gagal memproses permintaan AI" });
  }
});


// Status checking API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: "modular-tables", isDbConnected });
});

export async function startServer(listen = true) {
  await connectDB();
  
  if (!process.env.VERCEL) {
    await initDb('rt01');
    await initDb('rt02');
    await initDb('rt03');
  }

  const distPath = path.join(process.cwd(), 'dist');

  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const viteDynamic = "vite";
    const viteModule = await import(viteDynamic);
    const vite = await viteModule.createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Explicit endpoints for PWA files to ensure correct MIME types and headers for PWABuilder
    app.get('/sw.js', (req, res) => {
      res.sendFile(path.join(distPath, 'sw.js'), {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'no-cache',
          'Service-Worker-Allowed': '/'
        }
      });
    });

    app.get('/manifest.json', (req, res) => {
      res.sendFile(path.join(distPath, 'manifest.json'), {
        headers: {
          'Content-Type': 'application/manifest+json; charset=utf-8',
          'Cache-Control': 'no-cache'
        }
      });
    });

    app.get('/workbox-*.js', (req, res) => {
      res.sendFile(path.join(distPath, req.url.split('?')[0]), {
        headers: {
          'Content-Type': 'application/javascript; charset=utf-8',
          'Cache-Control': 'public, max-age=31536000'
        }
      });
    });

    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (listen) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server launched successfully on port ${PORT}`);
    });
  }
}

if (!process.env.VERCEL) {
  startServer(true);
}

export default app;
