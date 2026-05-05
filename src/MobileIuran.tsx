import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';

export const MobileIuran = ({ onBack, currentUser }: { onBack: () => void, currentUser?: any }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [nominal, setNominal] = useState(currentUser?.role === 'admin' ? '65000' : '85000');
  const [bulan, setBulan] = useState('Januari');
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [wargaList, setWargaList] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [showTambahIuran, setShowTambahIuran] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // admin form state
  const [adminSelectedUserId, setAdminSelectedUserId] = useState('');
  
  useEffect(() => {
    if (adminSelectedUserId === 'all') {
      setNominal('85000');
    } else if (adminSelectedUserId) {
      const user = wargaList.find(w => w.id === adminSelectedUserId);
      if (user?.role === 'admin') setNominal('65000');
      else setNominal('85000');
    }
  }, [adminSelectedUserId, wargaList]);
  
  const [showBayarForm, setShowBayarForm] = useState(false);
  const [buktiBase64, setBuktiBase64] = useState('');
  const [viewBuktiUrl, setViewBuktiUrl] = useState<string | null>(null);

  const isAdminOrBendahara = currentUser?.role === 'admin' || currentUser?.role === 'bendahara';
  
  const tagihanList = data.filter(d => d.userId === currentUser?.id && d.status === 'belum dibayar');
  const totalTagihan = tagihanList.reduce((sum, item) => sum + Number(item.nominal || 0), 0);
  const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });

  const [adminStatus, setAdminStatus] = useState('verifikasi');

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
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          setBuktiBase64(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.src = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const submitPembayaran = async () => {
    if (!buktiBase64) {
      alert('Harap unggah bukti pembayaran terlebih dahulu.');
      return;
    }
    setLoading(true);
    const period = `${bulan} ${tahun}`;
    // Check if there is an existing tagihan (belum dibayar) for this month
    const existing = tagihanList.find(t => t.bulan === period);

    try {
      if (existing) {
        await apiFetch(`/api/data/iuran/${existing.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            nominal,
            status: 'menunggu',
            buktiUrl: buktiBase64
          })
        });
      } else {
        await apiFetch('/api/data/iuran', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            nominal, 
            bulan: period,
            status: 'menunggu', // menunggu verifikasi
            userId: currentUser?.id,
            nama: currentUser?.nama,
            buktiUrl: buktiBase64
          })
        });
      }
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

      for (const selectedUser of targetUsers) {
        const userNominal = selectedUser.role === 'admin' ? '65000' : '85000';
        await apiFetch('/api/data/iuran', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            nominal: adminSelectedUserId === 'all' ? userNominal : nominal, 
            bulan: period,
            status: adminStatus,
            userId: selectedUser.id,
            nama: selectedUser.nama
          })
        });
      }

      alert('Iuran berhasil ditambahkan.');
      setShowTambahIuran(false);
      setNominal('50000');
      fetchData();
    } catch(e) { console.error(e) }
    setLoading(false);
  };

  const [showConfirmVerify, setShowConfirmVerify] = useState<{id: string, status: string} | null>(null);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    if (newStatus === 'verifikasi') {
      setShowConfirmVerify({ id, status: newStatus });
    } else {
      await updateStatus(id, newStatus);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await apiFetch(`/api/data/iuran/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, updaterName: currentUser?.nama })
      });
      fetchData();
    } catch(e) { console.error(e) }
  };

  const confirmVerify = async () => {
    if (!showConfirmVerify) return;
    await updateStatus(showConfirmVerify.id, showConfirmVerify.status);
    setShowConfirmVerify(null);
  };

  const cancelVerify = () => {
    setShowConfirmVerify(null);
  };

  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setShowConfirmDelete(id);
  };

  const confirmDelete = async () => {
    if (!showConfirmDelete) return;
    try {
      await apiFetch(`/api/data/iuran/${showConfirmDelete}`, { method: 'DELETE' });
      fetchData();
    } catch(e) { console.error(e) }
    setShowConfirmDelete(null);
  };

  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  if (showBayarForm) {
    return (
      <div className="p-4 pb-24">
        <button onClick={() => setShowBayarForm(false)} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Kembali</button>
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 text-sm mb-4 border-b pb-2">Pembayaran Iuran</h3>
          <div className="mb-4">
            <p className="text-xs text-gray-600 mb-2">Silahkan transfer Tagihan ke bank berikut:</p>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 mb-4">
              <p className="text-xs font-bold text-gray-800">Bank BCA</p>
              <p className="text-sm font-mono text-teal-700 tracking-wider">1234 5678 90</p>
              <p className="text-[10px] text-gray-500 uppercase">A.N. Bendahara RT 01</p>
            </div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Nominal Transfer (Rp)</label>
            <input type="number" value={nominal} onChange={e => setNominal(e.target.value)} disabled={loading} className="w-full p-2 text-xs border rounded-xl outline-none" />
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
      
      <div className="bg-teal-600 p-5 rounded-2xl text-white mb-6 shadow-md relative overflow-hidden">
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <p className="text-[10px] opacity-80 uppercase">Total Tagihan Belum Dibayar</p>
            <h4 className="text-xl font-bold">{formatter.format(totalTagihan)}</h4>
          </div>
          <button onClick={() => {
            if (tagihanList.length > 0) {
              const [b, t] = tagihanList[0].bulan.split(' ');
              setBulan(b);
              setTahun(t);
              setNominal(tagihanList[0].nominal);
            }
            setShowBayarForm(true);
          }} disabled={loading} className="px-3 py-1 bg-white text-teal-600 rounded-lg text-xs font-bold shadow-sm">Bayar</button>
        </div>
        {tagihanList.length > 0 ? (
          <p className="text-[10px] opacity-90 font-medium">Ada {tagihanList.length} tagihan menunggu pembayaran.</p>
        ) : (
          <p className="text-[10px] opacity-80">Tidak ada tagihan tertunggak. Anda dapat menginput pembayaran secara mandiri.</p>
        )}
      </div>

      {isAdminOrBendahara && (
        !showTambahIuran ? (
          <button 
            onClick={() => setShowTambahIuran(true)} 
            className="w-full mb-6 bg-teal-600 text-white font-bold text-xs py-3 rounded-xl shadow-sm hover:bg-teal-700 transition-colors"
          >
            + Buatkan Iuran Warga
          </button>
        ) : (
        <form onSubmit={handleTambahAdmin} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-3 relative">
          <button 
            type="button" 
            onClick={() => setShowTambahIuran(false)} 
            className="absolute top-3 right-3 text-gray-400 font-bold text-[10px] bg-gray-50 px-2 py-1 rounded-full border border-gray-200"
          >
            Tutup
          </button>
          <h4 className="font-bold text-gray-800 text-xs border-b pb-2 mr-10">Buatkan Iuran Warga</h4>
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
            <div className="w-1/4">
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Status</label>
              <select value={adminStatus} onChange={e => setAdminStatus(e.target.value)} required className="w-full p-2 text-xs border rounded">
                <option value="verifikasi">Lunas</option>
                <option value="belum dibayar">Tagihan</option>
              </select>
            </div>
            <div className="w-1/4">
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Bulan</label>
              <select value={bulan} onChange={e => setBulan(e.target.value)} required className="w-full p-2 text-xs border rounded">
                {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="w-1/4">
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Tahun</label>
              <select value={tahun} onChange={e => setTahun(e.target.value)} required className="w-full p-2 text-xs border rounded">
                {[2024, 2025, 2026, 2027, 2028].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="w-1/4">
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Nominal (Rp)</label>
              <input type="number" placeholder="Nominal" value={nominal} onChange={e => setNominal(e.target.value)} required className="w-full p-2 text-xs border rounded" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 bg-teal-600 text-white rounded text-xs font-bold">{loading ? 'Menyimpan...' : 'Simpan Iuran'}</button>
        </form>
        )
      )}

      <div className="mb-4 relative">
        <input 
          type="text" 
          placeholder="Cari nama warga / bulan..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl"
        />
      </div>

      <div className="flex justify-between items-end mb-3 px-1">
        <h4 className="font-bold text-gray-800 text-xs">Riwayat Iuran {isAdminOrBendahara ? 'Warga' : 'Saya'}</h4>
        <div className="flex gap-1 flex-wrap justify-end pl-2">
          {['Semua', 'Belum Bayar', 'Verifikasi', 'Lunas'].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} className={`text-[8px] px-2 py-1 rounded font-bold border ${filterStatus === f ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {data.filter(d => {
          if (!isAdminOrBendahara && d.userId !== currentUser?.id) return false;
          if (filterStatus === 'Belum Bayar') return d.status === 'belum dibayar';
          if (filterStatus === 'Verifikasi') return d.status === 'menunggu';
          if (filterStatus === 'Lunas') return d.status === 'verifikasi';
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchName = d.nama?.toLowerCase().includes(query);
            const matchBulan = d.bulan?.toLowerCase().includes(query);
            if (!matchName && !matchBulan) return false;
          }
          return true;
        }).reverse().map((item) => (
          <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-gray-800">{item.nama} - {item.bulan}</p>
              <p className="text-[9px] text-gray-500 mt-0.5">Nominal: Rp {item.nominal}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border 
                ${item.status === 'verifikasi' ? 'bg-teal-50 text-teal-600 border-teal-100' : item.status === 'butuh_konfirmasi' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                {item.status === 'verifikasi' ? 'LUNAS' : (item.status === 'menunggu' ? 'MENUNGGU VERIFIKASI' : (item.status === 'butuh_konfirmasi' ? 'UPDATE NOMINAL: KONFIRMASI RT' : item.status.toUpperCase()))}
              </span>
              {isAdminOrBendahara && (
                <div className="flex gap-1 mt-1 flex-wrap justify-end items-center">
                  {item.buktiUrl && (
                    <button onClick={() => setViewBuktiUrl(item.buktiUrl)} className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">Lihat Bukti</button>
                  )}
                  {item.status !== 'verifikasi' && item.status !== 'butuh_konfirmasi' && (
                    <button onClick={() => handleUpdateStatus(item.id, 'verifikasi')} className="text-[9px] bg-teal-100 text-teal-700 font-bold px-1.5 py-0.5 rounded">Verifikasi</button>
                  )}
                  {currentUser?.role === 'admin' && item.status === 'butuh_konfirmasi' && (
                    <button onClick={() => handleUpdateStatus(item.id, 'verifikasi')} className="text-[9px] bg-teal-500 text-white font-bold px-1.5 py-0.5 rounded">Sah</button>
                  )}
                  <button onClick={() => {
                    const newNominalStr = prompt('Edit nominal Iuran (hanya angka):', item.amount);
                    if (newNominalStr) {
                      const newAmount = parseInt(newNominalStr.replace(/\D/g, ''), 10);
                      if (!isNaN(newAmount) && newAmount !== item.amount) {
                         const newStatus = currentUser?.role === 'admin' ? 'verifikasi' : 'butuh_konfirmasi';
                         apiFetch(`/api/data/iuran/${item.id}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ amount: newAmount, status: newStatus }) }).then(fetchData);
                      }
                    }
                  }} className="text-[9px] text-blue-500 underline ml-1">Edit</button>
                  {currentUser?.role === 'admin' && (
                    <button onClick={() => handleDeleteClick(item.id)} className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded ml-1">Hapus</button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {data.filter(d => {
          if (!isAdminOrBendahara && d.userId !== currentUser?.id) return false;
          if (filterStatus === 'Belum Bayar') return d.status === 'belum dibayar';
          if (filterStatus === 'Verifikasi') return d.status === 'menunggu';
          if (filterStatus === 'Lunas') return d.status === 'verifikasi';
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const matchName = d.nama?.toLowerCase().includes(query);
            const matchBulan = d.bulan?.toLowerCase().includes(query);
            if (!matchName && !matchBulan) return false;
          }
          return true;
        }).length === 0 && (
          <p className="text-xs text-center text-gray-400 py-4">Belum ada riwayat iuran.</p>
        )}
      </div>

      {viewBuktiUrl && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden relative shadow-lg">
            <button onClick={() => setViewBuktiUrl(null)} className="absolute top-2 right-2 bg-black/50 text-white w-6 h-6 rounded-full flex justify-center items-center font-bold text-xs hover:bg-black/70 transition">X</button>
            <div className="p-3 border-b border-gray-100"><h3 className="text-sm border-0 m-0 font-bold text-center">Bukti Pembayaran</h3></div>
            <div className="p-4 flex justify-center bg-gray-50">
              <img src={viewBuktiUrl} alt="Bukti" className="max-h-[60vh] object-contain rounded-xl shadow-sm border border-gray-200" />
            </div>
          </div>
        </div>
      )}

      {showConfirmVerify && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-lg">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Verifikasi Iuran?</h3>
            <p className="text-xs text-gray-600 mb-6">Iuran yang diverifikasi akan masuk ke Kas RT dan/atau Dana Kematian, dan tidak dapat dibatalkan. Lanjutkan?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={cancelVerify} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs flex-1 hover:bg-gray-200 transition">
                Batal
              </button>
              <button onClick={confirmVerify} className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold text-xs flex-1 hover:bg-teal-700 transition">
                Ya, Verifikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm text-center shadow-lg">
            <h3 className="font-bold text-gray-800 text-lg mb-2">Hapus Data Iuran?</h3>
            <p className="text-xs text-gray-600 mb-6">Data yang dihapus tidak dapat dipulihkan. Lanjutkan?</p>
            <div className="flex gap-3 justify-center">
              <button onClick={cancelDelete} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold text-xs flex-1 hover:bg-gray-200 transition">
                Batal
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-xl font-bold text-xs flex-1 hover:bg-red-700 transition">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
