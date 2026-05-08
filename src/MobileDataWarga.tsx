import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileAvatar } from './App'; 
import { GoogleGenAI, Type } from '@google/genai';

// Icon Set - Diperbarui dan ditambah beberapa icon untuk mendukung UI baru
const icons = {
  search: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  lainnya: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  edit: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  delete: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  back: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  sparkles: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4M4 19h4m13-4v4m-2-2h4m-5-9V5m-2 2h4M9 12a3 3 0 116 0 3 3 0 01-6 0z" /></svg>
};

export const MobileDataWarga = ({ onBack, currentUser }: { onBack: () => void, currentUser: any }) => {
  const [wargaData, setWargaData] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Forms states
  const [showAddWarga, setShowAddWarga] = useState(false);
  const [newWarga, setNewWarga] = useState({ username: '', nama: '', password: '', noHp: '', status: '', umur: '' });
  const [newWargaBlok, setNewWargaBlok] = useState('');
  const [newWargaNomor, setNewWargaNomor] = useState('');

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [activeWargaId, setActiveWargaId] = useState('');
  const [memberForm, setMemberForm] = useState({ name: '', role: '', age: '', tglLahir: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970).toString();
  };

  const handleTglLahirMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tgl = e.target.value;
    setMemberForm({...memberForm, tglLahir: tgl, age: calculateAge(tgl)});
  };

  const [filterBlok, setFilterBlok] = useState('');
  const [previewDocs, setPreviewDocs] = useState<{docs: {url: string, title: string}[], currentIndex: number, wargaName: string} | null>(null);
  const [extractingId, setExtractingId] = useState<string | null>(null);

  const fetchWarga = async () => {
    try {
      const res = await apiFetch('/api/warga');
      const data = await res.json();
      setWargaData(data.users || []);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchWarga();
    const handleUpdate = (e: any) => {
      if (e.detail === 'users' || e.detail === 'online_status') {
        fetchWarga();
      }
    };
    window.addEventListener('app_data_update', handleUpdate);
    return () => window.removeEventListener('app_data_update', handleUpdate);
  }, []);

  const handleAddWarga = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const alamat = `Blok ${newWargaBlok} No. ${newWargaNomor}`;
      await apiFetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({...newWarga, alamat})
      });
      setShowAddWarga(false);
      setNewWarga({ username: '', nama: '', password: '', noHp: '', status: '', umur: '' });
      setNewWargaBlok('');
      setNewWargaNomor('');
      alert('🎉 Warga berhasil ditambahkan!');
      fetchWarga();
    } catch(e) { console.error(e); }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await apiFetch(`/api/warga/${activeWargaId}/members/${editingMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberForm)
        });
      } else {
        await apiFetch(`/api/warga/${activeWargaId}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberForm)
        });
      }
      setShowMemberForm(false);
      setEditingMember(null);
      setMemberForm({ name: '', role: '', age: '', tglLahir: '' });
      alert(editingMember ? '✅ Data anggota keluarga berhasil diubah!' : '✅ Data anggota keluarga berhasil ditambahkan!');
      fetchWarga();
    } catch(e) { console.error(e); }
  };

  const handleDeleteMember = async (wargaId: string, memberId: string) => {
    if(!window.confirm("Yakin ingin menghapus anggota keluarga ini?")) return;
    try {
      await apiFetch(`/api/warga/${wargaId}/members/${memberId}`, { method: 'DELETE' });
      fetchWarga();
    } catch(e) { console.error(e); }
  };

  const handleExtractKK = async (wargaId: string) => {
    setExtractingId(wargaId);
    try {
      const user = wargaData.find(w => w.id === wargaId);
      if (!user || !user.dokumenKk) {
        alert("Warga ini belum mengunggah Kartu Keluarga.");
        setExtractingId(null);
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        alert("API Key Gemini belum dikonfigurasi.");
        setExtractingId(null);
        return;
      }

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

      const base64Data = user.dokumenKk.replace(/^data:image\/\w+;base64,/, "");
      const mimeTypeMatch = user.dokumenKk.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType
            }
          },
          "Extract the family members from this Kartu Keluarga (KK). Exclude the 'Kepala Keluarga' if it matches the current user's name already. Return a JSON Array containing the other family members."
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
               type: Type.OBJECT,
               properties: {
                  name: { type: Type.STRING, description: "Nama Lengkap" },
                  role: { type: Type.STRING, description: "Hubungan Keluarga (e.g. Suami, Istri, Anak, Orang Tua, Kerabat)" },
                  age: { type: Type.STRING, description: "Usia (e.g. '25' atau '10 Tahun')" },
               },
               required: ["name", "role", "age"]
            }
          }
        }
      });

      const parsedText = response.text?.trim() || "[]";
      const membersList = JSON.parse(parsedText);
      
      let addedCount = 0;
      for (const m of membersList) {
        if (m.name.toLowerCase() !== user.nama.toLowerCase() && !user.members?.find((extM: any) => extM.name.toLowerCase() === m.name.toLowerCase())) {
          const res = await apiFetch(`/api/warga/${user.id}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: m.name, role: m.role, age: m.age })
          });
          if (res.ok) {
            addedCount++;
          }
        }
      }

      alert(`✨ Berhasil menambahkan ${addedCount} anggota keluarga baru secara otomatis dari KK!`);
      fetchWarga();
    } catch (e) {
      console.error("Extraction error:", e);
      alert('Terjadi kesalahan saat mengekstrak data dari KK.');
    } finally {
      setExtractingId(null);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  const getAllAges = () => {
    const ages: number[] = [];
    wargaData.forEach(w => {
      if (w.umur) {
        const a = parseInt(String(w.umur).replace(/\D/g, '') || '-1');
        if (a >= 0) ages.push(a);
      }
      if (w.members) {
        w.members.forEach((m: any) => {
          const a = parseInt(String(m.age).replace(/\D/g, '') || '-1');
          if (a >= 0) ages.push(a);
        });
      }
    });
    return ages;
  };

  const allAges = getAllAges();

  return (
    <div className="p-5 pb-24 bg-gray-50 min-h-screen">
      {/* HEADER & NAV */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white px-3 py-2 rounded-full shadow-sm hover:bg-gray-50 transition-colors"
        >
          <icons.back className="w-4 h-4" /> Kembali
        </button>
        <div className="bg-teal-100 text-teal-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm border border-teal-200">
          Total {wargaData.length} KK
        </div>
      </div>

      {showAddWarga ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <h4 className="font-bold text-gray-800 text-lg mb-4">Tambah Warga Baru</h4>
          <form onSubmit={handleAddWarga} className="space-y-4">
            <input type="text" placeholder="Username" value={newWarga.username} onChange={e => setNewWarga({...newWarga, username: e.target.value})} required className="w-full text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none" />
            <input type="text" placeholder="Nama Lengkap" value={newWarga.nama} onChange={e => setNewWarga({...newWarga, nama: e.target.value})} required className="w-full text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none" />
            <input type="password" placeholder="Password Login" value={newWarga.password} onChange={e => setNewWarga({...newWarga, password: e.target.value})} required className="w-full text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none" />
            
            <div className="flex gap-3">
               <select value={newWargaBlok} onChange={e => setNewWargaBlok(e.target.value)} required className="w-1/2 text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none appearance-none">
                 <option value="">Pilih Blok</option>
                 {['A','B','C','D','E','F','G'].map(b => <option key={b} value={b}>Blok {b}</option>)}
               </select>
               <input type="text" placeholder="No Rumah (Cth: 12)" value={newWargaNomor} onChange={e => setNewWargaNomor(e.target.value)} required className="w-1/2 text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none" />
            </div>

            <input type="tel" placeholder="Nomor HP" value={newWarga.noHp} onChange={e => setNewWarga({...newWarga, noHp: e.target.value})} required className="w-full text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none" />
            <input type="number" placeholder="Usia (Tahun)" value={newWarga.umur} onChange={e => setNewWarga({...newWarga, umur: e.target.value})} required className="w-full text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none" />
            
            <select value={newWarga.status} onChange={e => setNewWarga({...newWarga, status: e.target.value})} required className="w-full text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none appearance-none">
              <option value="">Pilih Status Warga</option>
              <option value="Warga Tetap">Warga Tetap</option>
              <option value="Warga Sementara (Kontrak)">Warga Sementara (Kontrak)</option>
            </select>
            
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowAddWarga(false)} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
              <button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all">Simpan Data</button>
            </div>
          </form>
        </motion.div>
      ) : showMemberForm ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-6">
          <h4 className="font-bold text-gray-800 text-lg mb-4">{editingMember ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga'}</h4>
          <form onSubmit={handleSaveMember} className="space-y-4">
            <input type="text" placeholder="Nama Lengkap Anggota" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} required className="w-full text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none" />
            <select value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} required className="w-full text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none appearance-none">
              <option value="">Status Hubungan Keluarga</option>
              <option value="Suami">Suami</option>
              <option value="Istri">Istri</option>
              <option value="Anak">Anak</option>
              <option value="Orang Tua">Orang Tua</option>
              <option value="Kerabat">Kerabat</option>
            </select>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-gray-500 font-medium pl-1">Tanggal Lahir</label>
              <input type="date" value={memberForm.tglLahir} onChange={handleTglLahirMemberChange} required className="w-full text-sm p-3 bg-gray-50 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl transition-all outline-none" />
            </div>
            <input type="text" placeholder="Usia otomatis terisi" value={memberForm.age ? `${memberForm.age} Tahun` : ''} readOnly className="w-full text-sm p-3 bg-gray-100 text-gray-500 rounded-xl cursor-not-allowed outline-none" />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowMemberForm(false)} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
              <button type="submit" className="flex-1 py-3 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl shadow-md hover:scale-[1.02] transition-all">Simpan</button>
            </div>
          </form>
        </motion.div>
      ) : (
        <>
          <h2 className="text-xl font-extrabold text-gray-800 mb-4 tracking-tight">Direktori Warga</h2>

          {/* STATS CARDS */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 p-3 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
              <p className="text-[10px] text-blue-600 font-semibold mb-1">Balita</p>
              <p className="font-extrabold text-blue-800 text-xl leading-none">{allAges.filter((a) => a >= 0 && a <= 4).length}</p>
            </div>
            <div className="bg-gradient-to-b from-green-50 to-white border border-green-100 p-3 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
              <p className="text-[10px] text-green-600 font-semibold mb-1">Anak</p>
              <p className="font-extrabold text-green-800 text-xl leading-none">{allAges.filter((a) => a >= 5 && a <= 12).length}</p>
            </div>
            <div className="bg-gradient-to-b from-purple-50 to-white border border-purple-100 p-3 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
              <p className="text-[10px] text-purple-600 font-semibold mb-1">Remaja</p>
              <p className="font-extrabold text-purple-800 text-xl leading-none">{allAges.filter((a) => a >= 13 && a <= 20).length}</p>
            </div>
            <div className="bg-gradient-to-b from-orange-50 to-white border border-orange-100 p-3 rounded-2xl text-center shadow-sm flex flex-col items-center justify-center">
              <p className="text-[10px] text-orange-600 font-semibold mb-1">Dewasa</p>
              <p className="font-extrabold text-orange-800 text-xl leading-none">{allAges.filter((a) => a > 20).length}</p>
            </div>
          </div>

          {isAdmin && (
            <motion.button 
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddWarga(true)} 
              className="w-full mb-6 bg-gray-900 text-white font-semibold text-sm py-3.5 rounded-2xl shadow-md hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <span className="text-lg leading-none">+</span> Tambah Data Warga Baru
            </motion.button>
          )}

          {/* SEARCH & FILTER */}
          <div className="mb-6 flex gap-3">
            <div className="relative flex-grow">
              <icons.search className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Cari warga / anggota..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all outline-none shadow-sm"
              />
            </div>
            <div className="relative">
              <select
                value={filterBlok}
                onChange={(e) => setFilterBlok(e.target.value)}
                className="px-4 py-3 h-full text-sm bg-white border border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-2 focus:ring-teal-100 outline-none shadow-sm appearance-none pr-8 font-medium"
              >
                <option value="">Semua Blok</option>
                {Array.from(new Set(wargaData.map(w => w.alamat?.match(/Blok\s+([a-zA-Z0-9]+)/i)?.[1]).filter(Boolean))).sort().map(b => (
                  <option key={String(b)} value={String(b)}>Blok {String(b)}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* LIST WARGA */}
          <div className="space-y-4">
            {wargaData.filter(w => {
              const matchName = w.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (w.members || []).some((m: any) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
              const matchBlok = !filterBlok || w.alamat?.match(/Blok\s+([a-zA-Z0-9]+)/i)?.[1] === filterBlok;
              return matchName && matchBlok;
            }).map((warga) => {
              const members = warga.members || [];
              const canEditFamily = isAdmin || currentUser?.id === warga.id;
              const isExpanded = expandedId === warga.id;
              
              return (
              <div key={warga.id} className={`bg-white rounded-3xl border ${isExpanded ? 'border-teal-200 shadow-md' : 'border-gray-100 shadow-sm'} overflow-hidden transition-all duration-300`}>
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer" 
                  onClick={() => setExpandedId(isExpanded ? null : warga.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {/* FOTO PROFIL ATAU INISIAL */}
                      {warga.photo ? (
                        <img 
                          src={warga.photo} 
                          alt={warga.nama} 
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                          {warga.nama.charAt(0)}
                        </div>
                      )}
                      
                      {warga.isOnline && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                        {warga.nama} {currentUser?.id === warga.id && <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">Anda</span>}
                      </h5>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
                        {warga.alamat} 
                        <span className="w-1 h-1 bg-gray-300 rounded-full"></span> 
                        <span className="font-semibold text-teal-600">{members.length + 1} Orang</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${warga.role === 'admin' ? 'bg-amber-100 text-amber-700' : (warga.role === 'pengurus' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600')}`}>
                      {warga.role === 'admin' ? 'Admin' : (warga.role === 'pengurus' ? 'Pengurus' : warga.status)}
                    </span>
                    <div className={`p-1.5 rounded-full transition-colors ${isExpanded ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-400'}`}>
                      <icons.lainnya className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 border-t border-gray-50 bg-gray-50/50"
                    >
                      <div className="pt-4 space-y-4">
                        
                        {/* ADMIN CONTROLS */}
                        {isAdmin && warga.id !== currentUser?.id && (
                          <div className="bg-white p-3 rounded-2xl border border-red-100 flex flex-wrap gap-3 items-end">
                            <div className="flex-1 min-w-[120px]">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Role Akun</label>
                              <select 
                                value={warga.role || 'warga'} 
                                onChange={async (e) => {
                                  await apiFetch(`/api/warga/${warga.id}/role`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({role: e.target.value})});
                                  fetchWarga();
                                }}
                                className="w-full text-xs border border-gray-200 rounded-xl p-2 bg-gray-50 outline-none"
                              >
                                <option value="warga">Warga</option>
                                <option value="pengurus">Pengurus</option>
                                <option value="bendahara">Bendahara</option>
                              </select>
                            </div>
                            <div className="flex-1 min-w-[120px]">
                              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Status</label>
                              <select 
                                value={warga.isApproved ? 'aktif' : 'tidak_aktif'} 
                                onChange={async (e) => {
                                  await apiFetch(`/api/warga/${warga.id}/approval`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({isApproved: e.target.value === 'aktif'})});
                                  fetchWarga();
                                }}
                                className="w-full text-xs border border-gray-200 rounded-xl p-2 bg-gray-50 outline-none"
                              >
                                <option value="aktif">Aktif</option>
                                <option value="tidak_aktif">Tidak Aktif</option>
                              </select>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); apiFetch(`/api/warga/${warga.id}`,{method:'DELETE'}).then(()=> { alert('Warga berhasil dihapus!'); fetchWarga(); }); }} className="text-red-600 bg-red-50 hover:bg-red-100 font-semibold px-3 py-2 rounded-xl text-xs transition-colors h-[34px]">
                              Hapus Warga
                            </button>
                          </div>
                        )}

                        {/* INFO & ACTIONS */}
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100">
                            <div>
                              <p className="text-[10px] font-bold text-gray-500 uppercase">Dokumen Warga</p>
                              <p className="text-xs font-semibold mt-0.5">
                                {(warga.dokumenKk || (Array.isArray(warga.dokumenKtp) ? warga.dokumenKtp.length > 0 : warga.dokumenKtp)) 
                                  ? <span className="text-green-600 flex items-center gap-1">✅ Lengkap</span> 
                                  : <span className="text-orange-500 flex items-center gap-1">⚠️ Belum Lengkap</span>}
                              </p>
                            </div>
                            {isAdmin && (
                              <button onClick={() => {
                                const docs: {url: string, title: string}[] = [];
                                if (warga.dokumenKk) docs.push({ url: warga.dokumenKk, title: 'Kartu Keluarga' });
                                if (Array.isArray(warga.dokumenKtp)) {
                                  warga.dokumenKtp.forEach((ktp: string, i: number) => docs.push({ url: ktp, title: `KTP ${i+1}` }));
                                } else if (warga.dokumenKtp) {
                                  docs.push({ url: warga.dokumenKtp, title: 'KTP' });
                                }
                                if (docs.length > 0) setPreviewDocs({ docs, currentIndex: 0, wargaName: warga.nama });
                                else alert('Belum ada dokumen yang diunggah.');
                              }} className="text-xs text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors">
                                Lihat File
                              </button>
                            )}
                          </div>

                          <div className="flex justify-between items-end">
                            <div>
                              <h6 className="text-sm font-bold text-gray-800">Anggota Keluarga</h6>
                              <p className="text-[10px] text-gray-500 mt-0.5">Kepala Kel: Usia {warga.umur || '-'} Thn</p>
                            </div>
                            <div className="flex gap-2">
                              {canEditFamily && warga.dokumenKk && (
                                <button 
                                  onClick={() => handleExtractKK(warga.id)} 
                                  disabled={extractingId === warga.id} 
                                  className="flex items-center gap-1.5 text-xs text-indigo-700 font-bold bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 hover:bg-indigo-100 disabled:opacity-50 transition-all shadow-sm"
                                >
                                  <icons.sparkles className="w-3.5 h-3.5" />
                                  {extractingId === warga.id ? 'Memproses...' : 'AI Extract KK'}
                                </button>
                              )}
                              {canEditFamily && (
                                <button onClick={() => { setActiveWargaId(warga.id); setMemberForm({name:'', role:'', age:'', tglLahir: ''}); setEditingMember(null); setShowMemberForm(true); }} className="text-xs text-white font-bold bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-xl shadow-sm transition-colors">
                                  + Tambah
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* MEMBER LIST */}
                        {members.length === 0 ? (
                          <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-gray-200">
                            <p className="text-xs text-gray-400 font-medium">Belum ada tanggungan/anggota keluarga.</p>
                          </div>
                        ) : (
                          <div className="grid gap-2">
                            {members.map((member: any) => (
                              <div key={member.id} className="flex justify-between items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                                    {member.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-xs font-bold text-gray-800">{member.name}</p>
                                    <p className="text-[10px] text-gray-500 bg-gray-50 inline-block px-1.5 py-0.5 rounded mt-0.5 border border-gray-100">{member.role}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">{member.age} Thn</span>
                                  {canEditFamily && (
                                    <div className="flex gap-1">
                                      <button onClick={() => { setActiveWargaId(warga.id); setEditingMember(member); setMemberForm({ ...member, tglLahir: member.tglLahir || '', age: member.age || '' }); setShowMemberForm(true); }} className="p-1.5 text-blue-500 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"><icons.edit className="w-4 h-4"/></button>
                                      <button onClick={() => handleDeleteMember(warga.id, member.id)} className="p-1.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"><icons.delete className="w-4 h-4"/></button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )})}
            
            {wargaData.length === 0 && (
               <div className="text-center py-10">
                 <p className="text-gray-400 text-sm">Belum ada data warga terdaftar.</p>
               </div>
            )}
          </div>
        </>
      )}
      
      {/* Document Preview Modal - Diperhalus */}
      <AnimatePresence>
        {previewDocs && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" 
            onClick={() => setPreviewDocs(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] w-full max-w-lg relative overflow-hidden" 
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50/50">
                <div>
                  <h3 className="font-bold text-gray-800 text-sm">Dokumen Warga</h3>
                  <p className="text-xs text-gray-500">{previewDocs.wargaName} - {previewDocs.docs[previewDocs.currentIndex].title}</p>
                </div>
                <button onClick={() => setPreviewDocs(null)} className="text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
              
              <div className="p-4 overflow-auto text-center flex items-center justify-center relative min-h-[50vh] bg-gray-100/50">
                {previewDocs.docs.length > 1 && (
                   <button onClick={() => setPreviewDocs({...previewDocs, currentIndex: (previewDocs.currentIndex - 1 + previewDocs.docs.length) % previewDocs.docs.length})} className="absolute left-2 bg-white/90 p-2.5 rounded-full shadow-md hover:bg-white z-10 transition-transform hover:scale-105">
                     <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                   </button>
                )}
                
                <img src={previewDocs.docs[previewDocs.currentIndex].url} alt="Dokumen" className="max-w-full max-h-[60vh] object-contain rounded-xl shadow-sm" />
                
                {previewDocs.docs.length > 1 && (
                   <button onClick={() => setPreviewDocs({...previewDocs, currentIndex: (previewDocs.currentIndex + 1) % previewDocs.docs.length})} className="absolute right-2 bg-white/90 p-2.5 rounded-full shadow-md hover:bg-white z-10 transition-transform hover:scale-105">
                     <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                   </button>
                )}
              </div>
              
              {previewDocs.docs.length > 1 && (
                <div className="flex justify-center p-3 gap-2 bg-white">
                   {previewDocs.docs.map((_, index) => (
                     <div key={index} className={`h-2.5 rounded-full transition-all duration-300 ${index === previewDocs.currentIndex ? 'w-6 bg-teal-500' : 'w-2.5 bg-gray-200'}`} />
                   ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </div>
  );
};