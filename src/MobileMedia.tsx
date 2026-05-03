import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect, useRef } from 'react';
import { icons } from './App';

export const MobileMedia = ({ onBack, currentUser }: { onBack: () => void, currentUser?: any }) => {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdminOrPengurus = currentUser?.role === 'admin' || currentUser?.role === 'pengurus' || currentUser?.role === 'bendahara';

  const fetchData = async () => {
    try {
      const res = await apiFetch('/api/data/media');
      const json = await res.json();
      setData(json.data || []);
    } catch(e) { console.error(e) }
  };

  const setData = (data: any[]) => {
    setMedia(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      const file = e.target.files[0];
      reader.onload = async (ev) => {
        const base64 = ev.target?.result as string;
        try {
          setLoading(true);
          await apiFetch('/api/data/media', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              imageUrl: base64, 
              title: file.name,
              userId: currentUser?.id,
              uploaderName: currentUser?.nama
            })
          });
          alert('Foto berhasil diunggah!');
          fetchData();
        } catch(err) {
          console.error(err);
        }
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus foto ini?")) return;
    try {
      await apiFetch(`/api/data/media/${id}`, { method: 'DELETE' });
      alert('Foto berhasil dihapus!');
      fetchData();
    } catch(e) { console.error(e) }
  };

  return (
    <div className="p-4 pb-24">
       <div className="flex justify-between items-center mb-4">
         <button onClick={onBack} className="text-[10px] text-teal-600 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Beranda</button>
         <button onClick={() => fileInputRef.current?.click()} className="text-[10px] bg-teal-600 text-white font-bold px-3 py-1.5 rounded flex items-center gap-1">
           <icons.media className="w-3 h-3"/> Upload Foto
         </button>
         <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} disabled={loading} />
       </div>
       
       <h3 className="font-bold text-gray-800 text-sm mb-4">Galeri Kegiatan RT 01</h3>
       
       {loading && <p className="text-xs text-center text-teal-600 mb-4 font-bold">Mengunggah...</p>}
       
       <div className="grid grid-cols-2 gap-2">
          {media.reverse().map(item => (
            <div key={item.id} className="aspect-square bg-gray-200 rounded-xl overflow-hidden relative group">
               <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-2">
                  <span className="text-white text-[9px] font-medium leading-tight line-clamp-1">{item.title}</span>
                  <span className="text-white/80 text-[7px]">{item.uploaderName} • {new Date(item.createdAt).toLocaleDateString()}</span>
               </div>
               {(isAdminOrPengurus || item.userId === currentUser?.id) && (
                 <button onClick={() => handleDelete(item.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded font-bold text-[8px] opacity-80">
                   Hapus
                 </button>
               )}
            </div>
          ))}
          {media.length === 0 && (
             <div className="col-span-2 text-center py-10 opacity-50">
               <icons.media className="w-10 h-10 mx-auto text-gray-400 mb-2"/>
               <p className="text-xs text-gray-500 font-medium">Belum ada foto kegiatan.</p>
             </div>
          )}
       </div>
    </div>
  );
};
