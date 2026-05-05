import { apiFetch } from './apiInterceptor';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { icons } from './App';

export const MobileDokumen = ({ onBack, currentUser, onUpdateUser }: { onBack: () => void, currentUser: any, onUpdateUser: (u: any) => void }) => {
  const [loading, setLoading] = useState(false);
  const [dokumenKk, setDokumenKk] = useState<string>(currentUser?.dokumenKk || '');
  const [dokumenKtp, setDokumenKtp] = useState<string[]>(
    Array.isArray(currentUser?.dokumenKtp) ? currentUser.dokumenKtp : (currentUser?.dokumenKtp ? [currentUser.dokumenKtp] : [])
  );
  const [hasUploaded, setHasUploaded] = useState(!!currentUser?.dokumenKk || !!currentUser?.dokumenKtp);

  const [successMsg, setSuccessMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'kk' | 'ktp') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Resize image logic to avoid MongoDB 16MB document limit
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        if (type === 'kk') {
            setDokumenKk(dataUrl);
        } else {
            setDokumenKtp(prev => [...prev, dataUrl]);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removeKtp = (index: number) => {
    setDokumenKtp(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menyimpan dokumen ini?")) return;
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await apiFetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: currentUser.id,
          dokumenKk,
          dokumenKtp
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        onUpdateUser(data.user);
        setHasUploaded(true);
        setSuccessMsg('Dokumen berhasil disimpan!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        alert(data.error || 'Gagal mengunggah dokumen');
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan sistem');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="pb-24 pt-4 px-4 bg-gray-50 min-h-screen text-gray-800"
    >
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm text-gray-600 hover:bg-gray-100">
          <icons.arrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">Upload Dokumen</h2>
      </div>

      {successMsg && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm font-medium animate-in fade-in slide-in-from-top-2">
          {successMsg}
        </div>
      )}

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-4">
        <h3 className="font-bold text-gray-800 mb-2">Upload Kartu Keluarga (KK)</h3>
        {dokumenKk && (
          <div className="mb-3 border rounded overflow-hidden relative">
            <img src={dokumenKk} alt="Preview KK" className="w-full h-auto object-cover max-h-48" />
            <button onClick={() => setDokumenKk('')} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold shadow">X</button>
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleFileUpload(e, 'kk')} 
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
        />
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h3 className="font-bold text-gray-800 mb-2">Upload KTP (Bisa lebih dari 1)</h3>
        {dokumenKtp.length > 0 && (
          <div className="mb-3 grid grid-cols-2 gap-2">
            {dokumenKtp.map((ktp, idx) => (
              <div key={idx} className="border rounded overflow-hidden relative">
                <img src={ktp} alt={`Preview KTP ${idx+1}`} className="w-full h-24 object-cover" />
                <button onClick={() => removeKtp(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shadow">X</button>
              </div>
            ))}
          </div>
        )}
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => handleFileUpload(e, 'ktp')} 
          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
        />
      </div>

      <button 
        onClick={handleSave} 
        disabled={loading}
        className="w-full py-3 bg-teal-600 text-white font-bold rounded-xl shadow-md hover:bg-teal-700 active:scale-95 transition-all text-sm disabled:opacity-50"
      >
        {loading ? 'Menyimpan...' : (hasUploaded ? 'Edit Dokumen' : 'Simpan Dokumen')}
      </button>

    </motion.div>
  );
};
