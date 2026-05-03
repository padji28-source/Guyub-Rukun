import { apiFetch } from './apiInterceptor';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { icons } from './App'; // Note: I'll need to export icons from App if needed, but I don't really need icons here. Or just no icons.

export function Login({ onLogin, onNavRegister }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-600 mb-2">Login</h1>
          <p className="text-sm text-gray-500">Masuk ke aplikasi Guyub Rukun</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan username Anda"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan password"/>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-500">Belum punya akun? <button type="button" onClick={onNavRegister} className="text-teal-600 font-bold hover:underline">Daftar</button></p>
      </motion.div>
    </div>
  );
}

export function Register({ onRegister, onNavLogin }: any) {
  const [formData, setFormData] = useState({ username: '', nama: '', password: '', alamat: '', noHp: '', status: '', umur: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-teal-600 mb-2">Daftar Akun</h1>
          <p className="text-sm text-gray-500">Bergabung dengan Guyub Rukun</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Username</label>
            <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan username Anda"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Nama Lengkap</label>
            <input type="text" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan nama Anda"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan password"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Alamat</label>
            <textarea value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500 h-20" placeholder="Blok A / No. 12"></textarea>
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
              <option value="Kos/Kontrak">Kos/Kontrak</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Umur</label>
            <input type="number" value={formData.umur} onChange={e => setFormData({...formData, umur: e.target.value})} required className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-teal-500" placeholder="Masukkan Umur Anda" min="0"/>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors mt-2">
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-gray-500">Sudah punya akun? <button type="button" onClick={onNavLogin} className="text-teal-600 font-bold hover:underline">Masuk</button></p>
      </motion.div>
    </div>
  );
}
