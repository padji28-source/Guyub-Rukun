import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const DB_DOC = doc(db, 'system', 'users');
const NOTIF_DOC = doc(db, 'system', 'notifications');
const APP_DATA_DOC = doc(db, 'system', 'app_data');

// Add error handling around firestore interactions so they don't break UI on offline/quota
async function initDb() {
  try {
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
  } catch (e) {
    console.error("Firebase init DB Error:", e);
  }
}

initDb();

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

async function addNotification(title: string, message: string) {
  const notifs = await getNotifications();
  notifs.unshift({ id: Date.now().toString(), title, message, time: new Date().toISOString(), read: false });
  if (notifs.length > 100) notifs.length = 100;
  await saveNotifications(notifs);
}

const originalFetch = window.fetch;

export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = typeof input === 'string' ? input : input instanceof Request ? input.url : '';
  
  if (url.startsWith('/api/')) {
    const method = init?.method || 'GET';
    const body = init?.body ? JSON.parse(init.body as string) : {};
    
    const sendResponse = (data: any, status = 200) => {
      return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    };

    try {
      if (url === '/api/register' && method === 'POST') {
        const { username, nama, password, alamat, noHp, status, umur } = body;
        if (!username || !nama || !password) return sendResponse({ error: "Username, nama dan password wajib diisi" }, 400);
        
        const users = await getUsers();
        if (users.find((u: any) => u.username === username)) {
          return sendResponse({ error: "Username sudah terdaftar" }, 400);
        }

        const newUser = {
          id: Date.now().toString(),
          username, nama, password, alamat, noHp, status, umur, members: []
        };
        users.push(newUser);
        await saveUsers(users);
        await addNotification("Warga Baru Terdaftar", `Warga baru ${nama} telah didaftarkan.`);
        return sendResponse({ message: "Registrasi berhasil", user: { ...newUser, role: "warga" } });
      }

      if (url === '/api/login' && method === 'POST') {
        const { username, password } = body;
        const users = await getUsers();
        const user = users.find((u: any) => u.username === username && u.password === password);
        if (user) return sendResponse({ message: "Login berhasil", user });
        return sendResponse({ error: "Username atau password salah" }, 401);
      }

      if (url === '/api/profile' && method === 'PUT') {
        const { id, username, nama, alamat, noHp, status, photo, umur } = body;
        const users = await getUsers();
        const userIndex = users.findIndex((u: any) => u.id === id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], nama: nama || users[userIndex].nama, alamat: alamat || users[userIndex].alamat, noHp: noHp || users[userIndex].noHp, status: status || users[userIndex].status, photo: photo || users[userIndex].photo, umur: umur !== undefined ? umur : users[userIndex].umur };
          await saveUsers(users);
          return sendResponse({ message: "Profile updated successfully", user: users[userIndex] });
        }
        return sendResponse({ error: "User not found" }, 404);
      }

      if (url === '/api/warga' && method === 'GET') {
        const users = await getUsers();
        return sendResponse({ users });
      }

      const wargaMatch = url.match(/^\/api\/warga\/([^\/]+)$/);
      if (wargaMatch && method === 'DELETE') {
        const id = wargaMatch[1];
        const users = await getUsers();
        const user = users.find((u: any) => u.id === id);
        const newUsers = users.filter((u: any) => u.id !== id);
        await saveUsers(newUsers);
        if (user) await addNotification("Warga Dihapus", `Data warga ${user.nama} telah dihapus.`);
        return sendResponse({ message: "User deleted" });
      }

      const roleMatch = url.match(/^\/api\/warga\/([^\/]+)\/role$/);
      if (roleMatch && method === 'PUT') {
        const id = roleMatch[1];
        const { role } = body;
        const users = await getUsers();
        const userIndex = users.findIndex((u: any) => u.id === id);
        if (userIndex !== -1 && users[userIndex].id !== "admin") {
          users[userIndex].role = role;
          await saveUsers(users);
          return sendResponse({ message: "Role updated successfully", user: users[userIndex] });
        }
        return sendResponse({ error: "Gagal update role" }, 400);
      }

      const memberMatch = url.match(/^\/api\/warga\/([^\/]+)\/members$/);
      if (memberMatch && method === 'POST') {
        const id = memberMatch[1];
        const { name, role, age } = body;
        const users = await getUsers();
        const user = users.find((u: any) => u.id === id);
        if (user) {
          if (!user.members) user.members = [];
          const newMember = { id: Date.now().toString(), name, role, age };
          user.members.push(newMember);
          await saveUsers(users);
          await addNotification("Anggota Keluarga Bertambah", `Anggota baru ${name} ditambahkan ke KK ${user.nama}.`);
          return sendResponse({ message: "Family member added", member: newMember, user });
        }
        return sendResponse({ error: "User not found" }, 404);
      }
      
      const memberSpecificMatch = url.match(/^\/api\/warga\/([^\/]+)\/members\/([^\/]+)$/);
      if (memberSpecificMatch) {
         const id = memberSpecificMatch[1];
         const memberId = memberSpecificMatch[2];
         if (method === 'PUT') {
            const { name, role, age } = body;
            const users = await getUsers();
            const user = users.find((u: any) => u.id === id);
            if (user && user.members) {
              const memberIndex = user.members.findIndex((m: any) => m.id === memberId);
              if (memberIndex !== -1) {
                user.members[memberIndex] = { ...user.members[memberIndex], name, role, age };
                await saveUsers(users);
                return sendResponse({ message: "Family member updated", user });
              }
            }
            return sendResponse({ error: "Not found" }, 404);
         }
         if (method === 'DELETE') {
            const users = await getUsers();
            const user = users.find((u: any) => u.id === id);
            if (user && user.members) {
              user.members = user.members.filter((m: any) => m.id !== memberId);
              await saveUsers(users);
              return sendResponse({ message: "Family member deleted", user });
            }
            return sendResponse({ error: "Not found" }, 404);
         }
      }

      if (url === '/api/notifications' && method === 'GET') {
        return sendResponse({ notifications: await getNotifications() });
      }

      if (url === '/api/notifications/read' && method === 'POST') {
        const notifs = await getNotifications();
        const updated = notifs.map((n: any) => ({ ...n, read: true }));
        await saveNotifications(updated);
        return sendResponse({ success: true });
      }

      if (url === '/api/transactions' && method === 'POST') {
        const { type, amount, name, message } = body;
        const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
        const formattedAmount = formatter.format(amount || 0);
        let notifTitle = `Transaksi ${type || 'Baru'}`;
        let notifMessage = message || `Terdapat transaksi ${type ? type.toLowerCase() : 'baru'} masuk sebesar ${formattedAmount} dari ${name || 'Warga'}.`;
        await addNotification(notifTitle, notifMessage);
        return sendResponse({ success: true, message: "Transaksi berhasil dan notifikasi dikirim" });
      }

      const resourceMatch = url.match(/^\/api\/data\/([^\/]+)$/);
      if (resourceMatch) {
         const resource = resourceMatch[1];
         if (method === 'GET') {
            const data = await getAppData();
            if (!data[resource]) return sendResponse({ error: "Resource not found" }, 404);
            return sendResponse({ data: data[resource] });
         }
         if (method === 'POST') {
            const data = await getAppData();
            if (!data[resource]) return sendResponse({ error: "Resource not found" }, 404);
            const newItem = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...body };
            data[resource].push(newItem);
            
            if (resource === 'iuran' && newItem.status === 'verifikasi') {
              const totalNominal = parseInt(newItem.nominal || '0', 10);
              const danaKematian = 5000;
              const kasRt = totalNominal - danaKematian;
              
              if (kasRt > 0) {
                data['kas'].push({
                  id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
                  createdAt: new Date().toISOString(),
                  type: 'Masuk',
                  amount: kasRt,
                  name: newItem.nama,
                  message: `Iuran Warga - ${newItem.bulan || ''}`,
                  category: 'Kas RT'
                });
              }
              
              if (totalNominal >= danaKematian) {
                data['kas'].push({
                  id: (Date.now() + 1).toString() + Math.random().toString(36).substring(2, 7),
                  createdAt: new Date().toISOString(),
                  type: 'Masuk',
                  amount: danaKematian,
                  name: newItem.nama,
                  message: `Dana Kematian - ${newItem.bulan || ''}`,
                  category: 'Dana Kematian'
                });
              }
            }
            
            await saveAppData(data);
            return sendResponse({ message: "Created successfully", item: newItem });
         }
      }

      const resourceSpecificMatch = url.match(/^\/api\/data\/([^\/]+)\/([^\/]+)$/);
      if (resourceSpecificMatch) {
         const resource = resourceSpecificMatch[1];
         const id = resourceSpecificMatch[2];
         
         if (method === 'PUT') {
            const data = await getAppData();
            if (!data[resource]) return sendResponse({ error: "Resource not found" }, 404);
            const index = data[resource].findIndex((item: any) => item.id === id);
            if (index !== -1) {
              const oldItem = data[resource][index];
              const newItem = { ...oldItem, ...body };
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
                const totalNominal = parseInt(newItem.nominal || '0', 10);
                const danaKematian = 5000;
                const kasRt = totalNominal - danaKematian;
                
                if (kasRt > 0) {
                  data['kas'].push({
                    id: Date.now().toString() + Math.random().toString(36).substring(2, 7),
                    createdAt: new Date().toISOString(),
                    type: 'Masuk',
                    amount: kasRt,
                    name: newItem.nama,
                    message: `Iuran Warga - ${newItem.bulan || ''}`,
                    category: 'Kas RT'
                  });
                }
                
                if (totalNominal >= danaKematian) {
                  data['kas'].push({
                    id: (Date.now() + 1).toString() + Math.random().toString(36).substring(2, 7),
                    createdAt: new Date().toISOString(),
                    type: 'Masuk',
                    amount: danaKematian,
                    name: newItem.nama,
                    message: `Dana Kematian - ${newItem.bulan || ''}`,
                    category: 'Dana Kematian'
                  });
                }
                await saveAppData(data);
              }
              return sendResponse({ message: "Updated successfully", item: newItem });
            }
            return sendResponse({ error: "Item not found" }, 404);
         }
         
         if (method === 'DELETE') {
            const data = await getAppData();
            if (!data[resource]) return sendResponse({ error: "Resource not found" }, 404);
            data[resource] = data[resource].filter((item: any) => item.id !== id);
            await saveAppData(data);
            return sendResponse({ message: "Deleted successfully" });
         }
      }

      // Fallback 404
      return sendResponse({ error: "Route not found" }, 404);
    } catch (e: any) {
      console.error(`Mock API Error resolving ${method} ${url}:`, e);
      return sendResponse({ error: "Internal server error" }, 500);
    }
  }

  return originalFetch(input, init);
};
