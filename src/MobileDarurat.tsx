import React, { useState, useEffect } from 'react';

export const MobileDarurat = ({ onBack, currentUser }: { onBack: () => void, currentUser?: any }) => {
  const [data, setData] = useState<any[]>([]);
  const isAdmin = currentUser?.role === 'admin';

  const fetchData = async () => {
    try {
      const res = await fetch('/api/data/darurat');
      const json = await res.json();
      setData(json.data || []);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (id: string) => {
    const item = data.find(d => d.id === id);
    if (!item) return;
    const newTel = prompt(`Masukkan nomor baru untuk ${item.name}`, item.tel);
    if (!newTel) return;

    try {
      await fetch(`/api/data/darurat/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tel: newTel })
      });
      fetchData();
    } catch(e) { console.error(e) }
  };

  return (
    <div className="p-4 pb-24">
      <button onClick={onBack} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Kembali</button>
      <h3 className="font-bold text-gray-800 text-sm mb-4">Kontak Darurat</h3>
      <div className="space-y-3">
        {data.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold">
                {item.id.charAt(1)}
              </div>
              <div>
                <h5 className="font-bold text-xs text-gray-800">{item.name}</h5>
                <p className="text-[10px] text-gray-500 mt-0.5">{item.type}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <button onClick={() => window.location.href=`tel:${item.tel}`} className="px-3 py-1.5 bg-red-500 text-white font-bold text-[10px] rounded-lg shadow-sm">Hubungi</button>
              {isAdmin && (
                <button onClick={() => handleUpdate(item.id)} className="text-[9px] text-blue-500 underline">Edit No: {item.tel}</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
