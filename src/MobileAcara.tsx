import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';

export const MobileAcaraPage = ({ currentUser }: { currentUser?: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');

  const isAdminOrPengurus = currentUser?.role === 'admin' || currentUser?.role === 'pengurus';

  const fetchData = async () => {
    try {
      const res = await apiFetch('/api/data/acara');
      const json = await res.json();
      setData(json.data || []);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTambah = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch('/api/data/acara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, desc, date })
      });
      setTitle(''); setDesc(''); setDate('');
      alert('Acara berhasil ditambah!');
      fetchData();
    } catch(e) { console.error(e) }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/api/data/acara/${id}`, { method: 'DELETE' });
      fetchData();
    } catch(e) { console.error(e) }
  };

  return (
    <div className="p-4 space-y-4 pb-24">
      <h3 className="font-bold text-gray-800 text-sm mb-2">Manajemen Acara Mendatang</h3>
      
      {isAdminOrPengurus && (
        <form onSubmit={handleTambah} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
          <h4 className="font-bold text-gray-800 text-xs border-b pb-2">Tambah Acara Baru</h4>
          <input type="text" placeholder="Nama Acara" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 text-xs border rounded" />
          <textarea placeholder="Deskripsi Acara" value={desc} onChange={e => setDesc(e.target.value)} required className="w-full p-2 text-xs border rounded"></textarea>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 text-xs border rounded" />
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-bold">{loading ? 'Menyimpan...' : 'Tambah'}</button>
        </form>
      )}

      <div className="space-y-3 mt-4">
        {data.slice().reverse().map(item => {
          const dateObj = new Date(item.date);
          const month = dateObj.toLocaleString('id-ID', { month: 'short' });
          const day = dateObj.getDate();
          return (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-3 items-center relative">
              <div className="flex flex-col items-center justify-center text-center p-1 rounded-md bg-teal-50 border border-teal-100 min-w-[36px]">
                <span className="text-[10px] font-bold text-teal-600">{month}</span>
                <span className="text-sm font-bold text-teal-700 leading-none">{day}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-gray-800 mb-0.5">{item.title}</h4>
                <p className="text-[10px] text-gray-500 line-clamp-1">{item.desc}</p>
              </div>
              {isAdminOrPengurus && (
                <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 text-red-500 font-bold p-1 text-[10px]">Hapus</button>
              )}
            </div>
          );
        })}
        {data.length === 0 && <p className="text-xs text-center text-gray-400 py-4">Belum ada acara.</p>}
      </div>
    </div>
  );
};
