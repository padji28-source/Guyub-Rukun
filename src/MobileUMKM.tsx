import React, { useState, useEffect } from 'react';

export const MobileUMKM = ({ onBack, currentUser }: { onBack: () => void, currentUser?: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nama, setNama] = useState('');
  const [desc, setDesc] = useState('');
  const [kontak, setKontak] = useState('');

  const isAdminOrPengurus = currentUser?.role === 'admin' || currentUser?.role === 'pengurus';

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data/umkm');
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
      await fetch('/api/data/umkm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, desc, kontak })
      });
      setNama(''); setDesc(''); setKontak('');
      alert('Data UMKM berhasil ditambah!');
      fetchData();
    } catch(e) { console.error(e) }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/data/umkm/${id}`, { method: 'DELETE' });
      fetchData();
    } catch(e) { console.error(e) }
  };

  return (
    <div className="p-4 pb-24">
      <button onClick={onBack} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Kembali</button>
      <h3 className="font-bold text-gray-800 text-sm mb-4">Direktori UMKM Warga</h3>
      
      {isAdminOrPengurus && (
        <form onSubmit={handleTambah} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-3">
          <h4 className="font-bold text-gray-800 text-xs border-b pb-2">Tambah UMKM</h4>
          <input type="text" placeholder="Nama Usaha" value={nama} onChange={e => setNama(e.target.value)} required className="w-full p-2 text-xs border rounded" />
          <textarea placeholder="Deskripsi Singkat" value={desc} onChange={e => setDesc(e.target.value)} required className="w-full p-2 text-xs border rounded"></textarea>
          <input type="text" placeholder="Nomor Kontak / WA" value={kontak} onChange={e => setKontak(e.target.value)} required className="w-full p-2 text-xs border rounded" />
          <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-bold">{loading ? 'Menyimpan...' : 'Tambah'}</button>
        </form>
      )}

      <div className="grid grid-cols-2 gap-3">
        {data.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="h-20 bg-gray-200"></div>
            <div className="p-3">
              <h5 className="font-bold text-xs text-gray-800 mb-1">{item.nama}</h5>
              <p className="text-[9px] text-gray-500 line-clamp-2 leading-relaxed h-6">{item.desc}</p>
              <button className="w-full mt-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg border border-blue-100">{item.kontak}</button>
              {isAdminOrPengurus && (
                <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 bg-white/80 p-1 rounded text-red-500 text-[10px] font-bold">X</button>
              )}
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-xs text-center text-gray-400 py-4 col-span-2">Belum ada data UMKM.</p>}
      </div>
    </div>
  );
};
