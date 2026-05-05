import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { icons } from './App';

export const MobileLaporan = ({ onBack, currentUser }: { onBack: () => void, currentUser: any }) => {
  const [data, setData] = useState<any[]>([]);
  const isAdminOrPengurus = currentUser?.role === 'admin' || currentUser?.role === 'pengurus';

  const fetchData = async () => {
    try {
      const res = await apiFetch('/api/data/laporan');
      const json = await res.json();
      setData(json.data || []);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/api/data/laporan/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, updaterName: currentUser?.nama })
      });
      fetchData();
    } catch(e) { console.error(e); }
  };

  const handleDeleteLaporan = async (id: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus laporan ini?')) return;
    try {
      await apiFetch(`/api/data/laporan/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Gagal menghapus laporan');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="p-4 pb-24 bg-gray-50 min-h-screen"
    >
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-100">
          <icons.arrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Riwayat Laporan</h2>
      </div>

      {(isAdminOrPengurus || data.some(d => d.userId === currentUser?.id)) ? (
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
                  {item.status?.toUpperCase() || 'PENDING'}
                </span>
              </div>
              <p className="text-[10px] text-gray-600 mb-3">{item.keterangan}</p>
              
              <div className="flex flex-col gap-2">
                {isAdminOrPengurus && item.status !== 'Selesai' && (
                  <div className="flex gap-2">
                    {item.status === 'Pending' && (
                      <button onClick={() => handleUpdateStatus(item.id, 'Proses')} className="flex-1 py-1 text-xs bg-blue-100 text-blue-700 rounded font-bold">Terima / Proses</button>
                    )}
                    <button onClick={() => handleUpdateStatus(item.id, 'Selesai')} className="flex-1 py-1 text-xs bg-teal-100 text-teal-700 rounded font-bold">Tandai Selesai</button>
                  </div>
                )}
                {(isAdminOrPengurus || item.userId === currentUser?.id) && (
                  <button onClick={() => handleDeleteLaporan(item.id)} className="w-full py-1 text-xs bg-red-50 text-red-600 rounded font-bold hover:bg-red-100 transition">Hapus Laporan</button>
                )}
              </div>
            </div>
          ))}
          {data.filter(d => isAdminOrPengurus || d.userId === currentUser?.id).length === 0 && (
            <p className="text-xs text-gray-400 text-center py-4">Belum ada laporan keluhan.</p>
          )}
        </div>
      ) : (
        <p className="text-xs text-gray-400 text-center py-4">Anda belum memiliki riwayat laporan keluhan.</p>
      )}
    </motion.div>
  );
};
