import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';

export const MobileKas = ({ onBack, currentUser }: { onBack: () => void, currentUser?: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('Masuk');
  const [category, setCategory] = useState('Kas RT');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [showTransfer, setShowTransfer] = useState(false);

  const isAdminOrBendahara = currentUser?.role === 'admin' || currentUser?.role === 'bendahara';

  const fetchData = async () => {
    try {
      const res = await apiFetch('/api/data/kas');
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
      await apiFetch('/api/data/kas', {
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

  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setShowConfirmDelete(id);
  };

  const confirmDelete = async () => {
    if (!showConfirmDelete) return;
    try {
      await apiFetch(`/api/data/kas/${showConfirmDelete}`, { method: 'DELETE' });
      fetchData();
    } catch(e) { console.error(e) }
    setShowConfirmDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  const getSaldo = (cat: string) => {
    const catData = data.filter(d => (d.category || 'Kas RT') === cat);
    const masuk = catData.filter(d => d.type === 'Masuk').reduce((a, b) => a + (b.amount || 0), 0);
    const keluar = catData.filter(d => d.type === 'Keluar').reduce((a, b) => a + (b.amount || 0), 0);
    return masuk - keluar;
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const nominal = parseInt(transferAmount.replace(/\D/g, '') || '0');
    if (nominal <= 0) {
      alert("Nominal transfer tidak valid.");
      setLoading(false);
      return;
    }
    const saldoKasRt = getSaldo('Kas RT');
    if (nominal > saldoKasRt) {
      alert("Saldo Kas RT tidak mencukupi.");
      setLoading(false);
      return;
    }
    
    try {
      // Keluar dari Kas RT
      await apiFetch('/api/data/kas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'Keluar', 
          category: 'Kas RT',
          amount: nominal, 
          message: 'Transfer ke Dana Sosial',
          name: currentUser?.nama
        })
      });
      // Masuk ke Dana Sosial
      await apiFetch('/api/data/kas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'Masuk', 
          category: 'Dana Sosial',
          amount: nominal, 
          message: 'Transfer dari Kas RT',
          name: currentUser?.nama
        })
      });
      setTransferAmount('');
      setShowTransfer(false);
      alert('Transfer berhasil!');
      fetchData();
    } catch(e) { console.error(e) }
    setLoading(false);
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
        <div className="mb-6 space-y-3">
          <div className="flex gap-2 mb-2">
            <button 
              onClick={() => setShowTransfer(false)} 
              className={`flex-1 py-2 text-xs font-bold rounded-lg border ${!showTransfer ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              Catat Kas Baru
            </button>
            <button 
              onClick={() => setShowTransfer(true)} 
              className={`flex-1 py-2 text-xs font-bold rounded-lg border ${showTransfer ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-700 border-gray-200'}`}
            >
              Transfer Dana
            </button>
          </div>

          {!showTransfer ? (
            <form onSubmit={handleTambah} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="space-y-3">
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
              </div>
            </form>
          ) : (
            <form onSubmit={handleTransfer} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="space-y-3">
                <div className="flex gap-2 items-center text-xs font-medium text-gray-700 p-2 bg-gray-50 rounded">
                  <span className="flex-1 text-center">Kas RT</span>
                  <span>➔</span>
                  <span className="flex-1 text-center">Dana Sosial</span>
                </div>
                <input type="number" placeholder="Nominal Transfer" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} required className="w-full p-2 text-xs border rounded" min="1" max={getSaldo('Kas RT')} />
                <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded text-xs font-bold">{loading ? 'Memproses...' : 'Transfer Sekarang'}</button>
              </div>
            </form>
          )}
        </div>
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
              {item.status === 'butuh_konfirmasi' && <span className="text-[9px] text-orange-500 font-bold bg-orange-50 px-1 py-0.5 rounded mt-1">Butuh Konfirmasi RT</span>}
              <div className="flex gap-2.5 mt-1.5 items-center">
                {currentUser?.role === 'admin' && item.status === 'butuh_konfirmasi' && (
                  <button onClick={async () => {
                     await apiFetch(`/api/data/kas/${item.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: 'selesai' }) });
                     fetchData();
                  }} className="text-[9px] text-white bg-teal-500 px-1.5 py-0.5 rounded font-bold">Konfirmasi Valid</button>
                )}
                {isAdminOrBendahara && (
                  <button onClick={() => {
                    const newNominalStr = prompt('Masukkan nominal baru (hanya angka):', item.amount);
                    if (newNominalStr) {
                      const newAmount = parseInt(newNominalStr.replace(/\D/g, ''), 10);
                      if (!isNaN(newAmount) && newAmount !== item.amount) {
                         const newStatus = currentUser?.role === 'admin' ? 'selesai' : 'butuh_konfirmasi';
                         apiFetch(`/api/data/kas/${item.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ amount: newAmount, status: newStatus }) }).then(fetchData);
                      }
                    }
                  }} className="text-[9px] text-blue-500 underline">Edit Nominal</button>
                )}
                {currentUser?.role === 'admin' && (
                  <button onClick={() => handleDeleteClick(item.id)} className="text-[9px] text-red-500 underline">Hapus</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && <p className="text-xs text-center text-gray-400 py-4">Belum ada catatan kas.</p>}
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-lg">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Hapus Data Kas?</h3>
            <p className="text-xs text-gray-600 mb-6">Data yang dihapus tidak dapat dipulihkan. Lanjutkan?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs flex-1 hover:bg-gray-200">
                Batal
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-xs flex-1 hover:bg-red-700">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
