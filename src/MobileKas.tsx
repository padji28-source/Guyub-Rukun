import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// --- Ikon Tambahan ---
const Icons = {
  back: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>,
  wallet: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  trendUp: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  trendDown: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  transfer: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>,
  edit: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  delete: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

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
    if (!window.confirm("Apakah Anda yakin ingin menyimpan data ini?")) return;
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
      alert('✅ Kas berhasil dicatat!');
      fetchData();
    } catch(e) { console.error(e) }
    setLoading(false);
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => setShowConfirmDelete(id);
  const cancelDelete = () => setShowConfirmDelete(null);

  const confirmDelete = async () => {
    if (!showConfirmDelete) return;
    try {
      await apiFetch(`/api/data/kas/${showConfirmDelete}`, { method: 'DELETE' });
      fetchData();
    } catch(e) { console.error(e) }
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
    if (!window.confirm("Apakah Anda yakin ingin mentransfer dana ini?")) return;
    setLoading(true);
    const nominal = parseInt(transferAmount.replace(/\D/g, '') || '0');
    if (nominal <= 0) {
      alert("Nominal transfer tidak valid.");
      setLoading(false);
      return;
    }
    if (nominal > getSaldo('Kas RT')) {
      alert("Saldo Kas RT tidak mencukupi.");
      setLoading(false);
      return;
    }
    
    try {
      await apiFetch('/api/data/kas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Keluar', category: 'Kas RT', amount: nominal, message: 'Transfer ke Dana Sosial', name: currentUser?.nama })
      });
      await apiFetch('/api/data/kas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'Masuk', category: 'Dana Sosial', amount: nominal, message: 'Transfer dari Kas RT', name: currentUser?.nama })
      });
      setTransferAmount('');
      setShowTransfer(false);
      alert('💸 Transfer antar dana berhasil!');
      fetchData();
    } catch(e) { console.error(e) }
    setLoading(false);
  };

  const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

  return (
    <div className="min-h-screen bg-slate-50 p-5 pb-28">
      {/* HEADER NAV */}
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
          <Icons.back className="w-5 h-5" />
        </button>
        <h2 className="ml-4 text-lg font-extrabold text-slate-800 tracking-tight">Buku Kas Warga</h2>
      </div>
      
      {/* SALDO UTAMA CARD (Modern Wallet Style) */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 p-6 rounded-[2rem] text-white shadow-xl shadow-teal-200 mb-5 relative overflow-hidden"
      >
        {/* Dekorasi Latar Belakang Abstrak */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 right-10 w-24 h-24 bg-teal-900 opacity-20 rounded-full translate-y-10"></div>
        
        <div className="relative z-10 flex justify-between items-start mb-2">
          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <Icons.wallet className="w-4 h-4" />
            <p className="text-[10px] font-bold uppercase tracking-wider">Kas Utama RT 01</p>
          </div>
        </div>
        <h4 className="text-4xl font-extrabold mt-3 tracking-tight drop-shadow-sm relative z-10">
          {formatter.format(getSaldo('Kas RT'))}
        </h4>
      </motion.div>

      {/* SALDO SUB-FUNDS */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-1">
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center mb-1">
             <span className="text-rose-500 font-bold text-xs">☠️</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dana Kematian</p>
          <h4 className="text-base font-extrabold text-slate-800">{formatter.format(getSaldo('Dana Kematian'))}</h4>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col gap-1">
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mb-1">
             <span className="text-amber-500 font-bold text-xs">🤝</span>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Dana Sosial</p>
          <h4 className="text-base font-extrabold text-slate-800">{formatter.format(getSaldo('Dana Sosial'))}</h4>
        </motion.div>
      </div>

      {isAdminOrBendahara && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          {/* SEGMENTED CONTROL / TABS */}
          <div className="bg-slate-200/60 p-1 rounded-2xl flex mb-4 relative">
            <button 
              onClick={() => setShowTransfer(false)} 
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all z-10 ${!showTransfer ? 'text-slate-800 shadow-sm bg-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Catat Arus Kas
            </button>
            <button 
              onClick={() => setShowTransfer(true)} 
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all z-10 ${showTransfer ? 'text-slate-800 shadow-sm bg-white' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Transfer Antar Dana
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!showTransfer ? (
              <motion.form 
                key="catat" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}
                onSubmit={handleTambah} className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4"
              >
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Kategori Pos</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 p-3 text-sm font-semibold bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl outline-none appearance-none transition-all">
                      <option value="Kas RT">Kas Utama RT</option>
                      <option value="Dana Kematian">Dana Kematian</option>
                      <option value="Dana Sosial">Dana Sosial</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Jenis</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full mt-1 p-3 text-sm font-semibold bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl outline-none appearance-none transition-all">
                      <option value="Masuk">Pemasukan (+)</option>
                      <option value="Keluar">Pengeluaran (-)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Nominal (Rp)</label>
                  <input type="number" placeholder="Contoh: 50000" value={amount} onChange={e => setAmount(e.target.value)} required className="w-full mt-1 p-3 text-sm font-bold bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl outline-none transition-all" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Keterangan / Catatan</label>
                  <input type="text" placeholder="Tuliskan keperluan transaksi..." value={message} onChange={e => setMessage(e.target.value)} required className="w-full mt-1 p-3 text-sm font-medium bg-slate-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl outline-none transition-all" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                  {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
              </motion.form>
            ) : (
              <motion.form 
                key="transfer" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.2 }}
                onSubmit={handleTransfer} className="bg-white p-5 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 space-y-4"
              >
                <div className="flex items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                   <div className="flex-1 text-center">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dari</p>
                     <p className="font-extrabold text-slate-800 text-sm mt-1">Kas RT</p>
                   </div>
                   <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 shrink-0">
                     <Icons.transfer className="w-4 h-4"/>
                   </div>
                   <div className="flex-1 text-center">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ke</p>
                     <p className="font-extrabold text-teal-600 text-sm mt-1">Dana Sosial</p>
                   </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1">Nominal Transfer (Rp)</label>
                  <input type="number" placeholder="Maks. sesuai saldo Kas RT" value={transferAmount} onChange={e => setTransferAmount(e.target.value)} required className="w-full mt-1 p-3 text-sm font-bold bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl outline-none transition-all" min="1" max={getSaldo('Kas RT')} />
                </div>
                <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all active:scale-[0.98]">
                  {loading ? 'Memproses...' : 'Transfer Dana Sekarang'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* RIWAYAT TRANSAKSI */}
      <h4 className="font-extrabold text-slate-800 text-base mb-4 px-1">Riwayat Transaksi</h4>
      <div className="space-y-3">
        {data.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-dashed border-slate-200">
            <Icons.wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-medium">Belum ada catatan transaksi.</p>
          </div>
        ) : (
          <AnimatePresence>
            {data.slice().reverse().map(item => (
              <motion.div 
                key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-4 rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.02)] border border-slate-100 flex gap-4 items-center group"
              >
                {/* Ikon Indikator Masuk/Keluar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${item.type === 'Masuk' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                   {item.type === 'Masuk' ? <Icons.trendDown className="w-6 h-6"/> : <Icons.trendUp className="w-6 h-6"/>}
                </div>
                
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-sm text-slate-800 truncate">{item.message}</p>
                  <p className="text-[10px] text-slate-500 font-medium mt-1 truncate flex items-center gap-1.5">
                     <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.category || 'Kas RT'}</span> 
                     • {new Date(item.createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                  </p>
                  {item.status === 'butuh_konfirmasi' && (
                    <span className="inline-block text-[9px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full mt-1.5 border border-amber-100">⏳ Butuh Konfirmasi RT</span>
                  )}
                  
                  {/* Action Buttons for Admins */}
                  <div className="flex gap-2 mt-2">
                    {currentUser?.role === 'admin' && item.status === 'butuh_konfirmasi' && (
                      <button onClick={async () => {
                         await apiFetch(`/api/data/kas/${item.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ status: 'selesai' }) });
                         fetchData();
                      }} className="text-[10px] text-white bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded-full font-bold transition-colors">Setujui</button>
                    )}
                    {isAdminOrBendahara && (
                      <button onClick={() => {
                        const newNominalStr = prompt('Masukkan nominal koreksi (angka saja):', item.amount);
                        if (newNominalStr) {
                          const newAmount = parseInt(newNominalStr.replace(/\D/g, ''), 10);
                          if (!isNaN(newAmount) && newAmount !== item.amount) {
                             const newStatus = currentUser?.role === 'admin' ? 'selesai' : 'butuh_konfirmasi';
                             apiFetch(`/api/data/kas/${item.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ amount: newAmount, status: newStatus }) }).then(fetchData);
                          }
                        }
                      }} className="text-[10px] text-blue-500 bg-blue-50 px-2 py-1 rounded flex items-center gap-1 font-bold hover:bg-blue-100 transition-colors">
                        <Icons.edit className="w-3 h-3"/> Koreksi
                      </button>
                    )}
                    {currentUser?.role === 'admin' && (
                      <button onClick={() => handleDeleteClick(item.id)} className="text-[10px] text-rose-500 bg-rose-50 px-2 py-1 rounded flex items-center gap-1 font-bold hover:bg-rose-100 transition-colors">
                        <Icons.delete className="w-3 h-3"/> Hapus
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  <span className={`text-sm font-extrabold block ${item.type === 'Masuk' ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {item.type === 'Masuk' ? '+' : '-'} {formatter.format(item.amount)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block mt-1">Oleh: {item.name?.split(' ')[0]}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* CONFIRM DELETE MODAL */}
      <AnimatePresence>
        {showConfirmDelete && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-5"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 rounded-[2rem] w-full max-w-sm text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Icons.delete className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="font-extrabold text-slate-800 text-lg mb-2">Hapus Transaksi?</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">Data yang telah dihapus akan memengaruhi saldo kas dan tidak dapat dipulihkan. Yakin ingin melanjutkan?</p>
              <div className="flex gap-3 justify-center">
                <button onClick={cancelDelete} className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm flex-1 hover:bg-slate-200 transition-colors">
                  Batal
                </button>
                <button onClick={confirmDelete} className="px-5 py-3 bg-rose-600 text-white rounded-xl font-bold text-sm flex-1 hover:bg-rose-700 transition-colors shadow-md shadow-rose-200">
                  Ya, Hapus
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};