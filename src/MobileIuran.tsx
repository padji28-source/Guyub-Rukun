import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';

export const MobileIuran = ({ onBack, currentUser }: { onBack: () => void, currentUser?: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nominal, setNominal] = useState('50000');
  const [bulan, setBulan] = useState('Januari');
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [wargaList, setWargaList] = useState<any[]>([]);

  // admin form state
  const [adminSelectedUserId, setAdminSelectedUserId] = useState('');
  
  const [showBayarForm, setShowBayarForm] = useState(false);
  const [buktiBase64, setBuktiBase64] = useState('');
  const [viewBuktiUrl, setViewBuktiUrl] = useState<string | null>(null);

  const isAdminOrBendahara = currentUser?.role === 'admin' || currentUser?.role === 'bendahara';

  const fetchData = async () => {
    try {
      const res = await apiFetch('/api/data/iuran');
      const json = await res.json();
      setData(json.data || []);
      
      if (isAdminOrBendahara) {
        const resWarga = await apiFetch('/api/warga');
        const jsonWarga = await resWarga.json();
        setWargaList(jsonWarga.users || []);
        if (jsonWarga.users?.length > 0) {
          setAdminSelectedUserId(jsonWarga.users[0].id);
        }
      }
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setBuktiBase64(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const submitPembayaran = async () => {
    if (!buktiBase64) {
      alert('Harap unggah bukti pembayaran terlebih dahulu.');
      return;
    }
    setLoading(true);
    try {
      await apiFetch('/api/data/iuran', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nominal, 
          bulan: `${bulan} ${tahun}`,
          status: 'menunggu', // menunggu verifikasi
          userId: currentUser?.id,
          nama: currentUser?.nama,
          buktiUrl: buktiBase64
        })
      });
      alert('Pembayaran iuran berhasil dicatat! Menunggu verifikasi pengurus.');
      setShowBayarForm(false);
      setBuktiBase64('');
      fetchData();
    } catch(e) { console.error(e) }
    setLoading(false);
  };

  const handleTambahAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSelectedUserId) return;
    
    setLoading(true);
    try {
      const targetUsers = adminSelectedUserId === 'all' 
        ? wargaList 
        : [wargaList.find(w => w.id === adminSelectedUserId)].filter(Boolean);

      const period = `${bulan} ${tahun}`;

      await Promise.all(targetUsers.map(selectedUser => 
        apiFetch('/api/data/iuran', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            nominal, 
            bulan: period,
            status: 'verifikasi', // langsung masuk kalau diinput admin
            userId: selectedUser.id,
            nama: selectedUser.nama
          })
        })
      ));

      alert('Iuran berhasil ditambahkan.');
      setNominal('50000');
      fetchData();
    } catch(e) { console.error(e) }
    setLoading(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/api/data/iuran/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      fetchData();
    } catch(e) { console.error(e) }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiFetch(`/api/data/iuran/${id}`, { method: 'DELETE' });
      fetchData();
    } catch(e) { console.error(e) }
  };

  if (showBayarForm) {
    return (
      <div className="p-4 pb-24">
        <button onClick={() => setShowBayarForm(false)} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Kembali</button>
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm mb-4 border-b pb-2">Pembayaran Iuran</h3>
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-1">Silahkan transfer Tagihan Bulan Ini sebesar <span className="font-bold text-teal-600">Rp 50.000</span> ke:</p>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <p className="text-xs font-bold text-gray-800">Bank BCA</p>
              <p className="text-sm font-mono text-teal-700 tracking-wider">1234 5678 90</p>
              <p className="text-[10px] text-gray-500 uppercase">A.N. Bendahara RT 01</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Pilih Bulan</label>
            <div className="flex gap-2">
              <select value={bulan} onChange={e => setBulan(e.target.value)} disabled={loading} className="w-1/2 p-2 text-xs border rounded-xl outline-none">
                {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select value={tahun} onChange={e => setTahun(e.target.value)} disabled={loading} className="w-1/2 p-2 text-xs border rounded-xl outline-none">
                {[2024, 2025, 2026, 2027, 2028].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Upload Bukti Transfer</label>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={loading} className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" />
            {buktiBase64 && (
              <div className="mt-3 aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                <img src={buktiBase64} alt="Bukti" className="w-full h-full object-contain" />
              </div>
            )}
          </div>
          <button onClick={submitPembayaran} disabled={loading || !buktiBase64} className="w-full py-3 bg-teal-600 text-white rounded-xl text-xs font-bold disabled:opacity-50">
            {loading ? 'Menyimpan...' : 'Kirim Bukti Pembayaran'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24">
      <button onClick={onBack} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Beranda</button>
      
      {!isAdminOrBendahara && (
        <div className="bg-teal-600 p-5 rounded-2xl text-white mb-6 shadow-md relative overflow-hidden">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-[10px] opacity-80 uppercase">Tagihan Bulan Ini</p>
              <h4 className="text-xl font-bold">Rp 50.000</h4>
            </div>
            <button onClick={() => setShowBayarForm(true)} disabled={loading} className="px-3 py-1 bg-white text-teal-600 rounded-lg text-xs font-bold shadow-sm">Bayar</button>
          </div>
          <p className="text-[10px] opacity-80">Mohon bayar sebelum tanggal 10 agar terhindar dari denda.</p>
        </div>
      )}

      {isAdminOrBendahara && (
        <form onSubmit={handleTambahAdmin} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-3">
          <h4 className="font-bold text-gray-800 text-xs border-b pb-2">Tambah Iuran Warga</h4>
          <div>
            <label className="block text-[10px] font-semibold text-gray-700 mb-1">Nama Warga</label>
            <select value={adminSelectedUserId} onChange={e => setAdminSelectedUserId(e.target.value)} required className="w-full p-2 text-xs border rounded">
              <option value="" disabled>Pilih Warga</option>
              <option value="all">Semua Warga</option>
              {wargaList.map(w => (
                <option key={w.id} value={w.id}>{w.nama}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3">
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Bulan</label>
              <select value={bulan} onChange={e => setBulan(e.target.value)} required className="w-full p-2 text-xs border rounded">
                {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="w-1/3">
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Tahun</label>
              <select value={tahun} onChange={e => setTahun(e.target.value)} required className="w-full p-2 text-xs border rounded">
                {[2024, 2025, 2026, 2027, 2028].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="w-1/3">
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Nominal (Rp)</label>
              <input type="number" placeholder="Nominal" value={nominal} onChange={e => setNominal(e.target.value)} required className="w-full p-2 text-xs border rounded" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-teal-600 text-white rounded text-xs font-bold">{loading ? 'Menyimpan...' : 'Simpan Iuran'}</button>
        </form>
      )}

      <h4 className="font-bold text-gray-800 text-xs mb-3 px-1">Riwayat Iuran {isAdminOrBendahara ? 'Warga' : 'Saya'}</h4>
      <div className="space-y-2">
        {data.filter(d => isAdminOrBendahara || d.userId === currentUser?.id).reverse().map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-gray-800">{item.nama} - {item.bulan}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">Nominal: Rp {item.nominal}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border 
                ${item.status === 'verifikasi' ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                {item.status === 'verifikasi' ? 'LUNAS' : (item.status === 'menunggu' ? 'MENUNGGU VERIFIKASI' : item.status.toUpperCase())}
              </span>
              {isAdminOrBendahara && (
                <div className="flex gap-1 mt-1 flex-wrap justify-end">
                  {item.buktiUrl && (
                    <button onClick={() => setViewBuktiUrl(item.buktiUrl)} className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">Lihat Bukti</button>
                  )}
                  {item.status !== 'verifikasi' && (
                    <button onClick={() => handleUpdateStatus(item.id, 'verifikasi')} className="text-[9px] bg-teal-100 text-teal-700 font-bold px-1.5 py-0.5 rounded">Verifikasi</button>
                  )}
                  <button onClick={() => handleDelete(item.id)} className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">Hapus</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {data.filter(d => isAdminOrBendahara || d.userId === currentUser?.id).length === 0 && (
          <p className="text-xs text-center text-gray-400 py-4">Belum ada riwayat iuran.</p>
        )}
      </div>

      {viewBuktiUrl && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden relative">
            <button onClick={() => setViewBuktiUrl(null)} className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex justify-center items-center font-bold text-xs">X</button>
            <div className="p-2 border-b"><h3 className="text-xs font-bold text-center">Bukti Pembayaran</h3></div>
            <div className="p-4 flex justify-center bg-gray-100">
              <img src={viewBuktiUrl} alt="Bukti" className="max-h-[60vh] object-contain rounded" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
