import React, { useState, useEffect } from 'react';

export const MobileKas = ({ onBack, currentUser }: { onBack: () => void, currentUser?: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('Masuk');
  const [category, setCategory] = useState('Kas RT');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const isAdminOrBendahara = currentUser?.role === 'admin' || currentUser?.role === 'bendahara';

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data/kas');
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
      await fetch('/api/data/kas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          category,
          amount: parseInt(amount.replace(/\D/g, '') || '0'), 
          message,
          name: currentUser?.nama
        })
      });
      setAmount('');
      setMessage('');
      alert('Kas berhasil ditambahkan!');
      fetchData();
    } catch(e) { console.error(e) }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/data/kas/${id}`, { method: 'DELETE' });
      fetchData();
    } catch(e) { console.error(e) }
  };

  const getSaldo = (cat: string) => {
    const catData = data.filter(d => (d.category || 'Kas RT') === cat);
    const masuk = catData.filter(d => d.type === 'Masuk').reduce((a, b) => a + (b.amount || 0), 0);
    const keluar = catData.filter(d => d.type === 'Keluar').reduce((a, b) => a + (b.amount || 0), 0);
    return masuk - keluar;
  };

  const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });

  return (
    <div className="p-4 pb-24">
      <button onClick={onBack} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Kembali</button>
      
      <div className="grid grid-cols-1 gap-3 mb-6">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 rounded-xl text-white shadow-md relative overflow-hidden">
          <p className="text-[9px] opacity-80 mb-1 uppercase tracking-wider">Saldo Kas RT 01</p>
          <h4 className="text-xl font-bold">{formatter.format(getSaldo('Kas RT'))}</h4>
        </div>
        <div className="flex gap-3">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-500 p-4 rounded-xl text-white shadow-md relative overflow-hidden flex-1">
            <p className="text-[9px] opacity-80 mb-1 uppercase tracking-wider">Dana Kematian</p>
            <h4 className="text-sm font-bold">{formatter.format(getSaldo('Dana Kematian'))}</h4>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-4 rounded-xl text-white shadow-md relative overflow-hidden flex-1">
            <p className="text-[9px] opacity-80 mb-1 uppercase tracking-wider">Dana Sosial</p>
            <h4 className="text-sm font-bold">{formatter.format(getSaldo('Dana Sosial'))}</h4>
          </div>
        </div>
      </div>

      {isAdminOrBendahara && (
        <form onSubmit={handleTambah} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-3">
          <h4 className="font-bold text-gray-800 text-xs border-b pb-2">Catat Kas Baru</h4>
          <div className="flex gap-2">
            <select value={category} onChange={e => setCategory(e.target.value)} className="p-2 text-xs border rounded w-1/2">
              <option value="Kas RT">Kas RT</option>
              <option value="Dana Kematian">Dana Kematian</option>
              <option value="Dana Sosial">Dana Sosial</option>
            </select>
            <select value={type} onChange={e => setType(e.target.value)} className="p-2 text-xs border rounded w-1/2">
              <option value="Masuk">Masuk</option>
              <option value="Keluar">Keluar</option>
            </select>
          </div>
          <input type="number" placeholder="Nominal" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full p-2 text-xs border rounded" />
          <input type="text" placeholder="Keterangan..." value={message} onChange={e => setMessage(e.target.value)} required className="w-full p-2 text-xs border rounded" />
          <button type="submit" disabled={loading} className="w-full py-2 bg-emerald-600 text-white rounded text-xs font-bold">{loading ? 'Menyimpan...' : 'Simpan Kas'}</button>
        </form>
      )}

      <h4 className="font-bold text-gray-800 text-xs mb-3 px-1">Riwayat Transaksi</h4>
      <div className="space-y-2">
        {data.slice().reverse().map(item => (
          <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="font-bold text-xs text-gray-800">{item.message}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">{new Date(item.createdAt).toLocaleDateString('id-ID')} • {item.category || 'Kas RT'} • {item.name}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className={`text-xs font-bold ${item.type === 'Masuk' ? 'text-emerald-600' : 'text-red-600'}`}>
                {item.type === 'Masuk' ? '+' : '-'} {formatter.format(item.amount)}
              </span>
              {isAdminOrBendahara && (
                <button onClick={() => handleDelete(item.id)} className="text-[9px] text-red-500 underline mt-1">Hapus</button>
              )}
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-xs text-center text-gray-400 py-4">Belum ada catatan kas.</p>}
      </div>
    </div>
  );
};
