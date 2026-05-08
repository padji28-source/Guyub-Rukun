import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { icons } from './App'; // Sesuaikan path jika berbeda
import { ConfirmModal } from './ConfirmModal';

export const MobileSuratPengantar = ({ onBack, currentUser }: { onBack: () => void, currentUser: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [keperluan, setKeperluan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const isAdminOrPengurus = currentUser?.role === 'admin' || currentUser?.role === 'pengurus';

  const fetchData = async () => {
    try {
      const res = await apiFetch('/api/data/surat');
      const json = await res.json();
      setData(json.data || []);
    } catch(e) { 
      console.error(e); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    setSuccessMsg('');
    try {
      await apiFetch('/api/data/surat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keperluan,
          keterangan,
          status: 'pending',
          userId: currentUser?.id,
          userName: currentUser?.nama
        })
      });
      setKeperluan('');
      setKeterangan('');
      setShowForm(false); // Tutup form setelah berhasil
      setSuccessMsg('Surat berhasil diajukan');
      setTimeout(() => setSuccessMsg(''), 3000);
      fetchData();
    } catch(e) { 
      console.error(e); 
      setSuccessMsg('Gagal mengajukan surat');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
    setLoading(false);
  };


  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/api/data/surat/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, updaterName: currentUser?.nama })
      });
      fetchData();
    } catch(e) { 
      console.error(e); 
    }
  };

  // Memoisasi filter data agar performa lebih optimal
  const filteredData = useMemo(() => {
    return data
      .filter(d => isAdminOrPengurus || d.userId === currentUser?.id)
      .reverse();
  }, [data, isAdminOrPengurus, currentUser?.id]);

  const getStatusStyle = (status: string) => {
    const s = status?.toLowerCase();
    if (s === 'selesai') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    return 'bg-amber-100 text-amber-700 border-amber-200'; // Pending
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-slate-50 min-h-screen pb-24 w-full"
    >
      <div className="max-w-xl mx-auto w-full">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 backdrop-blur-lg bg-white/70 border-b border-slate-200/50 px-4 py-4 flex items-center gap-4">
          <button 
            onClick={onBack} 
            className="p-2.5 bg-white rounded-full shadow-sm border border-slate-100 text-slate-700 hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all"
          >
            <icons.arrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Surat Pengantar</h2>
        </div>

        <div className="p-4 mt-2 space-y-6">
          
          {/* Pesan Sukses Mengambang */}
          <AnimatePresence>
            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-sm mb-4"
              >
                <div className="bg-emerald-100 p-1.5 rounded-full shrink-0">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold">{successMsg}</h4>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section: Buat Surat (Togglable) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <button 
              onClick={() => setShowForm(!showForm)} 
              className="w-full p-4 flex justify-between items-center bg-teal-50/50 hover:bg-teal-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 text-sm">Ajukan Surat Baru</h3>
                  <p className="text-xs text-slate-500 font-medium">Klik untuk mengisi formulir</p>
                </div>
              </div>
              <motion.div 
                animate={{ rotate: showForm ? 180 : 0 }} 
                className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </motion.div>
            </button>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <form onSubmit={triggerSubmit} className="p-5 border-t border-slate-100 space-y-4 bg-white">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Keperluan</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Pengantar SKCK, Domisili..." 
                        value={keperluan} 
                        onChange={e => setKeperluan(e.target.value)} 
                        required 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-400" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Keterangan Tambahan <span className="text-slate-400 font-normal">(Opsional)</span></label>
                      <textarea 
                        placeholder="Tulis rincian atau persyaratan khusus..." 
                        value={keterangan} 
                        onChange={e => setKeterangan(e.target.value)} 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading || !keperluan.trim()} 
                      className="w-full py-3 mt-2 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-md shadow-teal-200 hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                           <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                           </svg>
                           Memproses...
                        </>
                      ) : 'Kirim Permohonan'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section: Riwayat */}
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-3 ml-1">Riwayat Permohonan</h3>
            {filteredData.length > 0 ? (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredData.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]"
                    >
                      <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-3 gap-3">
                        <div>
                          <h5 className="text-sm font-bold text-slate-800 leading-tight">{item.keperluan}</h5>
                          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1">
                            <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px]">👤</span>
                            {item.userName}
                          </p>
                        </div>
                        <span className={`px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider shrink-0 ${getStatusStyle(item.status)}`}>
                          {item.status || 'PENDING'}
                        </span>
                      </div>
                      
                      {item.keterangan && (
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl mb-1">
                          {item.keterangan}
                        </p>
                      )}
                      
                      {/* Action Khusus Admin */}
                      {isAdminOrPengurus && item.status !== 'selesai' && (
                        <div className="mt-3 pt-3 border-t border-slate-50">
                          <button 
                            onClick={() => handleUpdateStatus(item.id, 'selesai')} 
                            className="w-full py-2.5 px-4 text-xs bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 active:bg-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Tandai Telah Selesai
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50"
              >
                <div className="w-16 h-16 mb-3 bg-white text-slate-300 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-slate-700">Belum ada pengajuan</h3>
                <p className="text-xs text-slate-500 mt-1">Daftar riwayat permohonan surat akan muncul di sini.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Ajukan Surat"
        message="Apakah Anda yakin ingin mengajukan surat pengantar ini?"
        onConfirm={handleConfirmSubmit}
        onCancel={() => setShowConfirm(false)}
      />
    </motion.div>
  );
};