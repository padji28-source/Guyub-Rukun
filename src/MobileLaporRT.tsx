import { apiFetch } from './apiInterceptor';
import React, { useState } from 'react';

export const MobileLaporRT = ({ onBack, currentUser, defaultTab }: { onBack: () => void, currentUser: any, defaultTab?: 'Keluhan' | 'Tamu' }) => {
  const [judul, setJudul] = useState('');
  const [keterangan, setKeterangan] = useState('');
  
  // Tamu states
  const [showFormTamu, setShowFormTamu] = useState(defaultTab === 'Tamu');
  const [hubunganTamu, setHubunganTamu] = useState('');
  const [jumlahTamu, setJumlahTamu] = useState('');
  const [waktuMenginap, setWaktuMenginap] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(defaultTab === 'Keluhan' || !defaultTab);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Apakah Anda yakin ingin mengirim laporan ini?")) return;
    setLoading(true);
    setSuccessMsg('');
    try {
      await apiFetch('/api/data/laporan', {
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
      setSuccessMsg('Laporan Keluhan berhasil dikirim!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setShowForm(false);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleSubmitTamu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!window.confirm("Apakah Anda yakin ingin mengirim laporan tamu ini?")) return;
    setLoading(true);
    setSuccessMsg('');
    try {
      await apiFetch('/api/data/tamu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          namaPelapor: currentUser?.nama,
          alamatPelapor: currentUser?.alamat,
          hubunganTamu,
          jumlahTamu,
          waktuMenginap,
          status: 'Dilaporkan',
          userId: currentUser?.id
        })
      });
      setHubunganTamu('');
      setJumlahTamu('');
      setWaktuMenginap('');
      setSuccessMsg('Laporan Tamu berhasil dikirim!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setShowFormTamu(false);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="p-4 pb-24">
      <button onClick={onBack} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Kembali</button>
      
      {successMsg && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {successMsg}
        </div>
      )}

      <div className="mb-6 space-y-3">
        {!defaultTab && <h3 className="font-bold text-gray-800 text-sm mb-1">Pilih Jenis Laporan</h3>}
        
        {(!defaultTab || defaultTab === 'Keluhan') && (
          <>
            {!defaultTab && (
              <button 
                onClick={() => { setShowForm(!showForm); setShowFormTamu(false); }} 
                className="w-full py-3 bg-teal-50 text-teal-600 rounded-xl text-xs font-bold border border-teal-100 flex justify-between items-center px-4 shadow-sm"
              >
                <span>Lapor Keluhan</span>
                <span className="text-lg leading-none">{showForm ? '−' : '+'}</span>
              </button>
            )}
            {showForm && (
              <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Judul Laporan</label>
                  <input type="text" placeholder="Contoh: Lampu Jalan Mati" value={judul} onChange={e => setJudul(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Keterangan / Lokasi</label>
                  <textarea placeholder="Tulis keluhan..." value={keterangan} onChange={e => setKeterangan(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg text-xs h-16"></textarea>
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 mt-2 bg-teal-600 text-white rounded-lg text-xs font-semibold">{loading ? 'Mengirim...' : 'Kirim Laporan Keluhan'}</button>
              </form>
            )}
          </>
        )}

        {(!defaultTab || defaultTab === 'Tamu') && (
          <>
            {!defaultTab && (
              <button 
                onClick={() => { setShowFormTamu(!showFormTamu); setShowForm(false); }} 
                className="w-full py-3 bg-teal-50 text-teal-600 rounded-xl text-xs font-bold border border-teal-100 flex justify-between items-center px-4 shadow-sm"
              >
                <span>Lapor Tamu</span>
                <span className="text-lg leading-none">{showFormTamu ? '−' : '+'}</span>
              </button>
            )}
            {showFormTamu && (
              <form onSubmit={handleSubmitTamu} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Nama Pelapor</label>
                  <input type="text" value={currentUser?.nama || ''} disabled className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Alamat Pelapor</label>
                  <input type="text" value={currentUser?.alamat || ''} disabled className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-gray-50 text-gray-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-gray-700 mb-1">Hubungan dengan Tamu</label>
                  <select value={hubunganTamu} onChange={e => setHubunganTamu(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg text-xs bg-white">
                     <option value="">Pilih Hubungan</option>
                     <option value="Orang Tua">Orang Tua</option>
                     <option value="Saudara">Saudara</option>
                     <option value="Kerabat Jauh">Kerabat Jauh</option>
                     <option value="Teman">Teman</option>
                     <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-gray-700 mb-1">Jumlah Tamu</label>
                    <input type="number" min="1" placeholder="Contoh: 2" value={jumlahTamu} onChange={e => setJumlahTamu(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] font-semibold text-gray-700 mb-1">Waktu Menginap (Hari)</label>
                    <input type="number" min="1" placeholder="Contoh: 3" value={waktuMenginap} onChange={e => setWaktuMenginap(e.target.value)} required className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-2.5 mt-2 bg-teal-600 text-white rounded-lg text-xs font-semibold">{loading ? 'Mengirim...' : 'Kirim Laporan Tamu'}</button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

