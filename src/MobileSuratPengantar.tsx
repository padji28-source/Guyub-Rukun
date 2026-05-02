import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';

export const MobileSuratPengantar = ({ onBack, currentUser }: { onBack: () => void, currentUser: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [keperluan, setKeperluan] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const isAdminOrPengurus = currentUser?.role === 'admin' || currentUser?.role === 'pengurus';

  const fetchData = async () => {
    try {
      const res = await apiFetch('/api/data/surat');
      const json = await res.json();
      setData(json.data || []);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
      alert('Surat berhasil diajukan');
      fetchData();
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/api/data/surat/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch(e) { console.error(e); }
  };

  return (
    <div className="p-4 pb-24">
      <button onClick={onBack} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Kembali ke Beranda</button>
      
      <div className="mb-6">
        <h3 className="font-bold text-gray-800 text-sm mb-3">Buat Surat Pengantar</h3>
        
        <button 
          onClick={() => setShowForm(!showForm)} 
          className="w-full py-3 bg-teal-50 text-teal-600 rounded-xl text-xs font-bold border border-teal-100 flex justify-between items-center px-4 shadow-sm"
        >
          <span>Ingin Membuat Surat?</span>
          <span className="text-lg leading-none">{showForm ? '−' : '+'}</span>
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Keperluan</label>
              <input type="text" placeholder="Contoh: Pengantar SKCK" value={keperluan} onChange={e => setKeperluan(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Keterangan Tambahan</label>
              <textarea placeholder="Tulis rincian..." value={keterangan} onChange={e => setKeterangan(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs h-16"></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2.5 mt-2 bg-teal-600 text-white rounded-lg text-xs font-semibold">{loading ? 'Memproses...' : 'Kirim Permohonan'}</button>
          </form>
        )}
      </div>

      {(isAdminOrPengurus || data.some(d => d.userId === currentUser?.id)) && (
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-3">Riwayat Permohonan</h3>
          <div className="space-y-3">
            {data.filter(d => isAdminOrPengurus || d.userId === currentUser?.id).reverse().map(item => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2 border-b border-gray-50 pb-2">
                  <div>
                    <h5 className="text-xs font-semibold text-gray-800">{item.keperluan}</h5>
                    <p className="text-[9px] text-gray-500 mt-0.5">Pemohon: {item.userName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded border text-[9px] font-bold ${item.status === 'selesai' ? 'bg-teal-50 text-teal-700 border-teal-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                {item.keterangan && <p className="text-[10px] text-gray-600 mb-2">{item.keterangan}</p>}
                
                {isAdminOrPengurus && item.status !== 'selesai' && (
                  <button onClick={() => handleUpdateStatus(item.id, 'selesai')} className="w-full mt-2 py-1 text-xs bg-teal-100 text-teal-700 rounded font-bold">
                    Tandai Selesai
                  </button>
                )}
              </div>
            ))}
            {data.filter(d => isAdminOrPengurus || d.userId === currentUser?.id).length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">Belum ada data permohonan surat.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
