import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ProfileAvatar } from './App'; // Assuming we can export it or copy it
// Need icons as well... let's just use some simple SVGs or import them from lucide-react?
// App.tsx uses an `icons` object. Let's just create standard SVG icons.

const icons = {
  search: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  lainnya: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
  edit: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  delete: (props: any) => <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
};

export const MobileDataWarga = ({ onBack, currentUser }: { onBack: () => void, currentUser: any }) => {
  const [wargaData, setWargaData] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Forms states
  const [showAddWarga, setShowAddWarga] = useState(false);
  const [newWarga, setNewWarga] = useState({ username: '', nama: '', password: '', alamat: '', noHp: '', status: '', umur: '' });

  const [showMemberForm, setShowMemberForm] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [activeWargaId, setActiveWargaId] = useState('');
  const [memberForm, setMemberForm] = useState({ name: '', role: '', age: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDocs, setPreviewDocs] = useState<{docs: {url: string, title: string}[], currentIndex: number, wargaName: string} | null>(null);

  const fetchWarga = async () => {
    try {
      const res = await apiFetch('/api/warga');
      const data = await res.json();
      setWargaData(data.users || []);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchWarga();
  }, []);

  const handleAddWarga = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWarga)
      });
      setShowAddWarga(false);
      setNewWarga({ username: '', nama: '', password: '', alamat: '', noHp: '', status: '', umur: '' });
      alert('Warga berhasil ditambahkan!');
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
      setMemberForm({ name: '', role: '', age: '' });
      alert(editingMember ? 'Data anggota keluarga berhasil diubah!' : 'Data anggota keluarga berhasil ditambahkan!');
      fetchWarga();
    } catch(e) { console.error(e); }
  };

  const handleDeleteMember = async (wargaId: string, memberId: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    try {
      await apiFetch(`/api/warga/${wargaId}/members/${memberId}`, { method: 'DELETE' });
      alert('Data anggota keluarga berhasil dihapus!');
      fetchWarga();
    } catch(e) { console.error(e); }
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
    <div className="p-4 pb-24">
      <button onClick={onBack} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Kembali</button>

      {showAddWarga ? (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
          <h4 className="font-bold text-sm mb-3">Tambah Warga Baru</h4>
          <form onSubmit={handleAddWarga} className="space-y-3">
            <input type="text" placeholder="Username" value={newWarga.username} onChange={e => setNewWarga({...newWarga, username: e.target.value})} required className="w-full text-xs p-2 border rounded-lg" />
            <input type="text" placeholder="Nama Lengkap" value={newWarga.nama} onChange={e => setNewWarga({...newWarga, nama: e.target.value})} required className="w-full text-xs p-2 border rounded-lg" />
            <input type="password" placeholder="Password Login" value={newWarga.password} onChange={e => setNewWarga({...newWarga, password: e.target.value})} required className="w-full text-xs p-2 border rounded-lg" />
            <input type="text" placeholder="Alamat (Cth: Blok A/1)" value={newWarga.alamat} onChange={e => setNewWarga({...newWarga, alamat: e.target.value})} required className="w-full text-xs p-2 border rounded-lg" />
            <input type="tel" placeholder="No HP" value={newWarga.noHp} onChange={e => setNewWarga({...newWarga, noHp: e.target.value})} required className="w-full text-xs p-2 border rounded-lg" />
            <input type="number" placeholder="Usia (Tahun)" value={newWarga.umur} onChange={e => setNewWarga({...newWarga, umur: e.target.value})} required className="w-full text-xs p-2 border rounded-lg" />
            <select value={newWarga.status} onChange={e => setNewWarga({...newWarga, status: e.target.value})} required className="w-full text-xs p-2 border rounded-lg">
              <option value="">Pilih Status</option>
              <option value="Warga Tetap">Warga Tetap</option>
              <option value="Kos/Kontrak">Kos/Kontrak</option>
            </select>
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => setShowAddWarga(false)} className="flex-1 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg">Batal</button>
              <button type="submit" className="flex-1 py-2 text-xs font-bold text-white bg-teal-600 rounded-lg">Simpan</button>
            </div>
          </form>
        </div>
      ) : showMemberForm ? (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
          <h4 className="font-bold text-sm mb-3">{editingMember ? 'Edit Anggota Keluarga' : 'Tambah Anggota Keluarga'}</h4>
          <form onSubmit={handleSaveMember} className="space-y-3">
            <input type="text" placeholder="Nama Anggota" value={memberForm.name} onChange={e => setMemberForm({...memberForm, name: e.target.value})} required className="w-full text-xs p-2 border rounded-lg" />
            <select value={memberForm.role} onChange={e => setMemberForm({...memberForm, role: e.target.value})} required className="w-full text-xs p-2 border rounded-lg">
              <option value="">Hubungan Keluarga</option>
              <option value="Suami">Suami</option>
              <option value="Istri">Istri</option>
              <option value="Anak">Anak</option>
              <option value="Orang Tua">Orang Tua</option>
              <option value="Kerabat">Kerabat</option>
            </select>
            <input type="text" placeholder="Usia (Cth: 12 Thn atau 12)" value={memberForm.age} onChange={e => setMemberForm({...memberForm, age: e.target.value})} required className="w-full text-xs p-2 border rounded-lg" />
            <div className="flex gap-2 mt-2">
              <button type="button" onClick={() => setShowMemberForm(false)} className="flex-1 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg">Batal</button>
              <button type="submit" className="flex-1 py-2 text-xs font-bold text-white bg-teal-600 rounded-lg">Simpan</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800 text-sm">Data Warga RT 01</h3>
            <span className="text-[9px] bg-teal-50 text-teal-600 font-bold px-2 py-1 rounded-md">Total {wargaData.length} KK</span>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-blue-50 border border-blue-100 p-2 rounded-xl text-center shadow-sm">
              <p className="text-[9px] text-blue-600 font-medium">Balita (0-4)</p>
              <p className="font-bold text-blue-700 text-sm mt-0.5">
                {allAges.filter((a) => a >= 0 && a <= 4).length}
              </p>
            </div>
            <div className="bg-green-50 border border-green-100 p-2 rounded-xl text-center shadow-sm">
              <p className="text-[9px] text-green-600 font-medium">Anak (5-12)</p>
              <p className="font-bold text-green-700 text-sm mt-0.5">
                {allAges.filter((a) => a >= 5 && a <= 12).length}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-100 p-2 rounded-xl text-center shadow-sm">
              <p className="text-[9px] text-purple-600 font-medium">Remaja (13-20)</p>
              <p className="font-bold text-purple-700 text-sm mt-0.5">
                {allAges.filter((a) => a >= 13 && a <= 20).length}
              </p>
            </div>
            <div className="bg-orange-50 border border-orange-100 p-2 rounded-xl text-center shadow-sm">
              <p className="text-[9px] text-orange-600 font-medium">Dewasa ({">"}20)</p>
              <p className="font-bold text-orange-700 text-sm mt-0.5">
                {allAges.filter((a) => a > 20).length}
              </p>
            </div>
          </div>

          {isAdmin && (
            <button onClick={() => setShowAddWarga(true)} className="w-full mb-4 bg-teal-600 text-white font-bold text-xs py-3 rounded-xl shadow-sm hover:bg-teal-700 transition-colors">
              + Tambah Data Warga Baru
            </button>
          )}

          <div className="mb-4 relative">
            <icons.search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Cari nama warga / keluarga..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl"
            />
          </div>

          <div className="space-y-3">
            {wargaData.filter(w => 
              w.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (w.members || []).some((m: any) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
            ).map((warga) => {
              const members = warga.members || [];
              const canEditFamily = isAdmin || currentUser?.id === warga.id;
              
              return (
              <div key={warga.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm overflow-hidden transition-all">
                <div 
                  className="flex items-center justify-between cursor-pointer" 
                  onClick={() => setExpandedId(expandedId === warga.id ? null : warga.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-sm">
                      {warga.nama.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-800">{warga.nama} {currentUser?.id === warga.id && "(Anda)"}</h5>
                      <p className="text-[9px] text-gray-500 mt-0.5">{warga.alamat} • <span className="font-medium text-gray-700">{members.length} Anggota</span></p>
                      <div className="mt-1">
                        {(warga.dokumenKk || (Array.isArray(warga.dokumenKtp) ? warga.dokumenKtp.length > 0 : warga.dokumenKtp)) ? (
                          <span className="text-[8px] bg-green-100 text-green-700 px-1 py-0.5 rounded font-medium">Sudah Upload Dokumen</span>
                        ) : (
                          <span className="text-[8px] bg-red-100 text-red-700 px-1 py-0.5 rounded font-medium">Belum Upload Dokumen</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border bg-teal-50 text-teal-600 border-teal-100`}>{warga.role === 'admin' ? 'Admin' : (warga.role === 'pengurus' ? 'Pengurus' : warga.status)}</span>
                    <span className="text-[9px] text-gray-400 font-medium flex items-center gap-0.5">
                      {isAdmin && warga.id !== currentUser?.id && (
                        <button onClick={(e) => { e.stopPropagation(); if (window.confirm('Apakah Anda yakin ingin menghapus warga ini?')) { apiFetch(`/api/warga/${warga.id}`,{method:'DELETE'}).then(()=> { alert('Warga berhasil dihapus!'); fetchWarga(); }); } }} className="text-red-500 mr-2 p-1 bg-red-50 rounded text-[8px]">Hapus</button>
                      )}
                      {expandedId === warga.id ? 'Tutup' : 'Lihat'} <icons.lainnya className={`w-3 h-3 ${expandedId === warga.id ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </div>
                
                <AnimatePresence>
                  {expandedId === warga.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pt-3 mt-3 border-t border-gray-50"
                    >
                      {isAdmin && warga.id !== currentUser?.id && (
                        <div className="mb-3 px-1 flex gap-2 items-center">
                          <label className="text-[9px] font-bold text-gray-800">Role:</label>
                          <select 
                            value={warga.role || 'warga'} 
                            onChange={async (e) => {
                              await apiFetch(`/api/warga/${warga.id}/role`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({role: e.target.value})});
                              fetchWarga();
                            }}
                            className="text-[9px] border rounded p-1"
                          >
                            <option value="warga">Warga</option>
                            <option value="pengurus">Pengurus</option>
                            <option value="bendahara">Bendahara</option>
                          </select>
                        </div>
                      )}
                      {canEditFamily && (
                        <div className="mb-3 px-1 flex gap-2 items-center">
                          <label className="text-[9px] font-bold text-gray-800">Usia Warga Utama (Tahun):</label>
                          <input 
                            type="number"
                            min="0"
                            placeholder="Belum diisi"
                            defaultValue={warga.umur || ''}
                            onBlur={async (e) => {
                              const newVal = e.target.value;
                              if (newVal !== (warga.umur || '')) {
                                await apiFetch(`/api/profile`, { 
                                  method: 'PUT', 
                                  headers: {'Content-Type': 'application/json'}, 
                                  body: JSON.stringify({ id: warga.id, umur: newVal })
                                });
                                fetchWarga();
                              }
                            }}
                            className="text-[9px] border rounded p-1 w-16"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-center mb-2 px-1">
                        <p className="text-[9px] font-bold text-gray-800">Daftar Anggota Keluarga</p>
                        <div className="flex gap-2">
                        {isAdmin && (
                          <button onClick={() => {
                            const docs: {url: string, title: string}[] = [];
                            if (warga.dokumenKk) docs.push({ url: warga.dokumenKk, title: 'Kartu Keluarga' });
                            if (Array.isArray(warga.dokumenKtp)) {
                              warga.dokumenKtp.forEach((ktp: string, i: number) => docs.push({ url: ktp, title: `KTP ${i+1}` }));
                            } else if (warga.dokumenKtp) {
                              docs.push({ url: warga.dokumenKtp, title: 'KTP' });
                            }
                            if (docs.length > 0) {
                              setPreviewDocs({ docs, currentIndex: 0, wargaName: warga.nama });
                            } else {
                              alert('Warga ini belum mengunggah dokumen.');
                            }
                          }} className="text-[9px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            Lihat Dokumen
                          </button>
                        )}
                        {canEditFamily && (
                          <button onClick={() => { setActiveWargaId(warga.id); setMemberForm({name:'', role:'', age:''}); setEditingMember(null); setShowMemberForm(true); }} className="text-[9px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded stroke-teal-600">+ Tambah</button>
                        )}
                        </div>
                      </div>
                      
                      {members.length === 0 ? (
                        <p className="text-[9px] text-gray-400 italic px-1">Belum ada data anggota keluarga.</p>
                      ) : (
                        <div className="space-y-2">
                          {members.map((member: any) => (
                            <div key={member.id} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-gray-700">{member.name}</p>
                                  <p className="text-[8px] text-gray-500">{member.role}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-medium text-gray-600">{member.age}</span>
                                {canEditFamily && (
                                  <div className="flex gap-1 ml-2">
                                    <button onClick={() => { setActiveWargaId(warga.id); setEditingMember(member); setMemberForm(member); setShowMemberForm(true); }} className="p-1 text-blue-500 hover:bg-blue-50 rounded"><icons.edit className="w-3 h-3"/></button>
                                    <button onClick={() => handleDeleteMember(warga.id, member.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><icons.delete className="w-3 h-3"/></button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )})}
          </div>
        </>
      )}
      
      {/* Document Preview Modal */}
      {previewDocs && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60" onClick={() => setPreviewDocs(null)}>
          <div className="bg-white rounded-xl shadow-lg flex flex-col max-h-[90vh] max-w-[90vw] relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="font-bold text-gray-800 text-sm">Dokumen: {previewDocs.wargaName} - {previewDocs.docs[previewDocs.currentIndex].title}</h3>
              <button onClick={() => setPreviewDocs(null)} className="text-gray-500 font-bold p-1 px-3 bg-gray-100 rounded-full">X</button>
            </div>
            
            <div className="p-2 overflow-auto text-center flex items-center justify-center relative min-h-[50vh]">
              {previewDocs.docs.length > 1 && (
                 <button 
                   onClick={() => setPreviewDocs({...previewDocs, currentIndex: (previewDocs.currentIndex - 1 + previewDocs.docs.length) % previewDocs.docs.length})}
                   className="absolute left-2 bg-white/80 p-2 rounded-full shadow hover:bg-white z-10"
                 >
                   &lt;
                 </button>
              )}
              
              <img src={previewDocs.docs[previewDocs.currentIndex].url} alt="Dokumen" className="max-w-full max-h-[70vh] object-contain rounded-md" />
              
              {previewDocs.docs.length > 1 && (
                 <button 
                   onClick={() => setPreviewDocs({...previewDocs, currentIndex: (previewDocs.currentIndex + 1) % previewDocs.docs.length})}
                   className="absolute right-2 bg-white/80 p-2 rounded-full shadow hover:bg-white z-10"
                 >
                   &gt;
                 </button>
              )}
            </div>
            
            {previewDocs.docs.length > 1 && (
              <div className="flex justify-center p-2 gap-2 border-t">
                 {previewDocs.docs.map((_, index) => (
                   <div key={index} className={`h-2 w-2 rounded-full ${index === previewDocs.currentIndex ? 'bg-teal-600' : 'bg-gray-300'}`} />
                 ))}
              </div>
            )}
            
            <div className="p-3 border-t text-xs text-gray-600 text-center bg-gray-50 rounded-b-xl">
              <p>Hanya Ketua RT (Admin) yang dapat melihat dokumen ini.</p>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};
