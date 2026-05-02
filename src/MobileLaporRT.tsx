import React, { useState, useEffect } from 'react';

export const MobileLaporRT = ({ onBack, currentUser }: { onBack: () => void, currentUser: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [judul, setJudul] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [loading, setLoading] = useState(false);

  const isAdminOrPengurus = currentUser?.role === 'admin' || currentUser?.role === 'pengurus';

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data/laporan');
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
      await fetch('/api/data/laporan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          judul,
          keterangan,
          status: 'Pending',
          userId: currentUser?.id,
          userName: currentUser?.nama
        })
      });
      setJudul('');
      setKeterangan('');
      alert('Laporan berhasil dikirim');
      fetchData();
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/data/laporan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch(e) { console.error(e); }
  };

  return (
    <div className="p-4 pb-24">
      <button onClick={onBack} className="text-[10px] text-red-600 mb-4 font-bold inline-flex items-center gap-1 bg-red-50 px-2 py-1 rounded">← Batal Lapor</button>
      
      <>
        <h3 className="font-bold text-gray-800 text-sm mb-3">Lapor Keluhan ke RT</h3>
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 mb-6">
          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">Judul Laporan</label>
            <input type="text" placeholder="Contoh: Lampu Jalan Mati" value={judul} onChange={e => setJudul(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
          </div>
          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">Keterangan / Lokasi</label>
            <textarea placeholder="Tulis keluhan..." value={keterangan} onChange={e => setKeterangan(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg text-xs h-16"></textarea>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 mt-2 bg-red-600 text-white rounded-lg text-xs font-semibold">{loading ? 'Mengirim...' : 'Kirim Laporan'}</button>
        </form>
      </>

      {(isAdminOrPengurus || data.some(d => d.userId === currentUser?.id)) && (
        <div>
          <h3 className="font-bold text-gray-800 text-sm mb-3">Riwayat Laporan</h3>
          <div className="space-y-3">
            {data.filter(d => isAdminOrPengurus || d.userId === currentUser?.id).reverse().map(item => (
              <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-start mb-2 border-b border-gray-50 pb-2">
                  <div>
                    <h5 className="text-xs font-semibold text-gray-800">{item.judul}</h5>
                    <p className="text-[9px] text-gray-500 mt-0.5">Pelapor: {item.userName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded border text-[9px] font-bold 
                    ${item.status === 'Selesai' ? 'bg-teal-50 text-teal-700 border-teal-100' : 
                      item.status === 'Proses' ? 'bg-blue-50 text-blue-700 border-blue-100' : 
                      'bg-orange-50 text-orange-700 border-orange-100'}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-[10px] text-gray-600 mb-3">{item.keterangan}</p>
                
                {isAdminOrPengurus && item.status !== 'Selesai' && (
                  <div className="flex gap-2">
                    {item.status === 'Pending' && (
                      <button onClick={() => handleUpdateStatus(item.id, 'Proses')} className="flex-1 py-1 text-xs bg-blue-100 text-blue-700 rounded font-bold">Terima / Proses</button>
                    )}
                    <button onClick={() => handleUpdateStatus(item.id, 'Selesai')} className="flex-1 py-1 text-xs bg-teal-100 text-teal-700 rounded font-bold">Tandai Selesai</button>
                  </div>
                )}
              </div>
            ))}
            {data.filter(d => isAdminOrPengurus || d.userId === currentUser?.id).length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">Belum ada laporan keluhan.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
