import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'motion/react';
import { icons } from './App';

const CuteMascot = ({ isFocusedPassword }: { isFocusedPassword?: boolean }) => {
  return (
    <div className="w-32 h-32 mx-auto relative mb-4">
      <motion.svg 
        viewBox="0 0 100 100" 
        className="w-full h-full drop-shadow-md"
        animate={{
          y: [0, -10, 0],
          rotate: isFocusedPassword ? [0, -5, 5, 0] : 0,
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 0.5, ease: "easeInOut" }
        }}
      >
        <motion.circle 
          cx="50" cy="50" r="45" 
          fill="#14B8A6" stroke="#0F766E" strokeWidth="2"
          animate={{ scale: isFocusedPassword ? 0.95 : 1 }}
          transition={{ duration: 0.3 }}
        />
        <motion.path 
          d="M50 20 Q60 40, 50 60 Q40 40, 50 20" 
          fill="#0F766E" 
          animate={{ 
            d: isFocusedPassword ? "M50 30 Q60 45, 50 50 Q40 45, 50 30" : "M50 20 Q60 40, 50 60 Q40 40, 50 20"
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle 
          cx="35" cy="40" r="10" fill="#0F766E"
          animate={{ 
            cx: isFocusedPassword ? 40 : 35,
            cy: isFocusedPassword ? 45 : 40,
            r: isFocusedPassword ? 0 : 10 
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.circle 
          cx="65" cy="40" r="10" fill="#0F766E"
          animate={{ 
            cx: isFocusedPassword ? 60 : 65,
            cy: isFocusedPassword ? 45 : 40,
            r: isFocusedPassword ? 0 : 10 
          }}
          transition={{ duration: 0.3 }}
        />
        {/* Closed Eyes when focused */}
        {isFocusedPassword && (
          <>
            <motion.path d="M35 45Q40 40 45 45" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
            <motion.path d="M55 45Q60 40 65 45" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        )}
      </motion.svg>
      {/* Sparkles */}
      {!isFocusedPassword && (
        <motion.div
           className="absolute -top-2 -right-2 text-yellow-400"
           animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5], rotate: [0, 45, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
        >
          ✨
        </motion.div>
      )}
    </div>
  )
}

export function Login({ onLogin, onNavRegister }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        onLogin(data.user);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan jaringan.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <CuteMascot isFocusedPassword={isFocusedPassword} />
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-600 mb-2">Login</h1>
          <p className="text-sm text-gray-500">Masuk ke aplikasi Guyub Rukun</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} onFocus={() => setIsFocusedPassword(false)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan username Anda"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onFocus={() => setIsFocusedPassword(true)} onBlur={() => setIsFocusedPassword(false)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan password"/>
          </div>
          <button type="submit" disabled={loading} className="w-full h-12 flex items-center justify-center bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            {loading ? (
              <div className="flex items-center justify-center space-x-1">
                <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} />
                <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} />
                <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
              </div>
            ) : 'Masuk'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-500">Belum punya akun? <button type="button" onClick={onNavRegister} className="text-teal-600 font-bold hover:underline">Daftar</button></p>
      </motion.div>
    </div>
  );
}

export function Register({ onRegister, onNavLogin }: any) {
  const [formData, setFormData] = useState({ username: '', nama: '', password: '', noHp: '', status: '', umur: '', tglLahir: '' });
  const [blok, setBlok] = useState('');
  const [nomorRumah, setNomorRumah] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970).toString();
  };

  const handleTglLahirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tgl = e.target.value;
    setFormData({...formData, tglLahir: tgl, umur: calculateAge(tgl)});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const alamat = `Blok ${blok} No. ${nomorRumah}`;
      const res = await apiFetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...formData, alamat})
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registrasi berhasil! Silahkan masuk terlebih dahulu.');
        onNavLogin();
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan jaringan.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
        <CuteMascot isFocusedPassword={isFocusedPassword} />
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-600 mb-2">Daftar Akun</h1>
          <p className="text-sm text-gray-500">Bergabung dengan Guyub Rukun</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
            <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} onFocus={() => setIsFocusedPassword(false)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan username Anda"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} onFocus={() => setIsFocusedPassword(false)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan nama Anda"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} onFocus={() => setIsFocusedPassword(true)} onBlur={() => setIsFocusedPassword(false)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan password"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Blok Rumah</label>
            <input type="text" value={blok} onChange={e => setBlok(e.target.value)} onFocus={() => setIsFocusedPassword(false)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Cth: Blok A" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nomor Rumah</label>
            <input type="text" value={nomorRumah} onChange={e => setNomorRumah(e.target.value)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Cth: 12" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">No. HP</label>
            <input type="tel" value={formData.noHp} onChange={e => setFormData({...formData, noHp: e.target.value})} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="0812..."/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Status Warga</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500">
              <option value="">Pilih Status</option>
              <option value="Warga Tetap">Warga Tetap</option>
              <option value="Warga Sementara (Kontrak)">Warga Sementara (Kontrak)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Tanggal Lahir</label>
            <input type="date" value={formData.tglLahir} onChange={handleTglLahirChange} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Umur</label>
            <input type="number" value={formData.umur} readOnly className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl text-sm outline-none cursor-not-allowed" placeholder="Otomatis terisi" min="0"/>
          </div>
          <button type="submit" disabled={loading} className="w-full h-12 flex items-center justify-center bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors mt-2">
            {loading ? (
              <div className="flex items-center justify-center space-x-1">
                <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0 }} />
                <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} />
                <motion.div className="w-2 h-2 bg-white rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} />
              </div>
            ) : 'Daftar Sekarang'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-500">Sudah punya akun? <button type="button" onClick={onNavLogin} className="text-teal-600 font-bold hover:underline">Masuk</button></p>
      </motion.div>
    </div>
  );
}
