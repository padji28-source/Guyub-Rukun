import { apiFetch } from './apiInterceptor';
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MobileDataWarga } from './MobileDataWarga';
import { MobileSuratPengantar } from './MobileSuratPengantar';
import { MobileLaporRT } from './MobileLaporRT';
import { MobileLaporan } from './MobileLaporan';

import { MobileDarurat } from './MobileDarurat';
import { MobileDokumen } from './MobileDokumen';
import { MobileTamu } from './MobileTamu';
import { MobileAcaraPage } from './MobileAcara';
import { MobileIuran } from './MobileIuran';
import { MobileKas } from './MobileKas';
import { MobileUMKM } from './MobileUMKM';

// --- Simplified Mock Data & Icons ---
export const icons = {
  dashboard: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  warga: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  iuran: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  laporan: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  pengumuman: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  umkm: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  pengaturan: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  // Mobile Quick Action icons (simplified)
  surat: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  laporanrt: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  media: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  kas: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>,
  sedekah: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  darurat: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
  lainnya: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>,
  search: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  // Mobile Nav Icons (simplified)
  events: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  home: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  profil: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  bell: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  dokumen: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  arrowLeft: (props: any) => <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
};

const laporanWargaData = [
  { nama: 'Jalan Rusak', status_laporan: 'Tergenang', status_jalan: 'Normal' },
  { nama: 'Tergenang Air', status_laporan: 'Tergenang', status_jalan: 'Normal' },
];

const mobileEventsData = [
  { day: '10', month: 'SAM', year: '19/700.00', name: 'Sitiinaer Hont Conation', id: 1 },
  { day: '19', month: 'SAM', year: '22/10:00', name: 'Ruhn/iwsal Events', id: 2 },
];

const themeColors = {
  primary: '#1A866A', // Teal green
  accent: '#FBCFCA',  // Soft pink-orange
  neutral: {
    bg: '#F9FAFB',
    text: '#1F2937',
    subtext: '#6B7280',
    muted: '#D1D5DB',
  },
};

const fontStyle = '"Plus Jakarta Sans", sans-serif';

// --- Web UI Components (Dashboard Admin) ---
const WebSidebar = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => (
  <aside className="w-[16rem] h-screen bg-white border-r border-gray-100 flex flex-col p-6 fixed left-0 top-0">
    <div className="flex items-center mb-10 gap-2">
      <LogoCommunityIcon size="24"/>
      <span className="text-xl font-bold" style={{ color: themeColors.primary, fontFamily: fontStyle }}>GUYUB RUKUN</span>
    </div>
    <nav className="flex-grow space-y-4">
      {[
        { name: 'Dashboard', icon: icons.dashboard },
        { name: 'Warga', icon: icons.warga },
        { name: 'Iuran', icon: icons.iuran },
        { name: 'Kas', icon: icons.kas },
        { name: 'Dokumen', icon: icons.dokumen },
        { name: 'Laporan', icon: icons.laporan },
        { name: 'Pengumuman', icon: icons.pengumuman },
        { name: 'UMKM', icon: icons.umkm },
        { name: 'Tamu', icon: icons.warga },
        { name: 'Pengaturan', icon: icons.pengaturan },
      ].map((item) => (
        <button 
          key={item.name} 
          onClick={() => onTabChange(item.name)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.name ? 'bg-teal-50 text-teal-800' : 'text-gray-600 hover:bg-gray-50'}`}>
          <item.icon className={`w-5 h-5 ${activeTab === item.name ? 'text-teal-600' : 'text-gray-400'}`} />
          {item.name}
        </button>
      ))}
    </nav>
    <div className="w-full mt-auto flex items-center justify-center h-24 p-2 bg-gray-50 rounded-lg overflow-hidden relative">
      <IllustrationFamilyGroup/>
    </div>
  </aside>
);

const WebHeader = ({ user, onLogout, onUpdateUser }: { user?: any; onLogout?: () => void; onUpdateUser?: (data: any) => void }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    apiFetch('/api/data/laporan').then(r => r.json()).then(d => {
      const items = d.data || [];
      const newItems = items.filter((i: any) => i.status === 'menunggu').reverse().slice(0, 5);
      setNotifs(newItems);
    }).catch(console.error);
  }, []);

  return (
    <>
      <header className="flex items-center justify-between p-6 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm" style={{ marginLeft: '16rem' }}>
        <div>
          <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: fontStyle }}>Halo, {user?.nama || 'Admin RT 01'}!</h1>
          <p className="text-xs text-gray-500 mt-1">Website Guyub Rukun Admin Dashboard (Web View)</p>
        </div>
        <div className="flex items-center gap-6">
          <div 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {user?.photo ? (
               <img src={user.photo} alt="Profile" className="w-10 h-10 rounded-full border border-gray-200 object-cover" />
            ) : (
               <ProfileAvatar size="10"/>
            )}
            <div className="text-right">
              <span className="font-semibold text-sm text-gray-800 block leading-tight">{user?.nama || 'Admin'}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">{user?.role === 'admin' ? 'Ketua RT' : 'Pengurus RT'}</span>
            </div>
          </div>
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)} 
              className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-teal-50 text-teal-600' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <icons.pengumuman className="w-6 h-6" />
              {notifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold ring-2 ring-white">
                  {notifs.length}
                </span>
              )}
            </button>
            
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 transform origin-top-right"
                >
                  <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                    <h4 className="font-bold text-gray-800 text-sm">Notifikasi</h4>
                    <span className="text-[10px] uppercase font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">{notifs.length} Baru</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifs.length > 0 ? notifs.map((n, i) => (
                      <div key={i} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer group">
                        <div className="flex items-start justify-between">
                           <p className="text-xs font-bold text-gray-800 group-hover:text-teal-600 transition-colors">{n.judul}</p>
                           <span className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0"></span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{n.keterangan}</p>
                        <p className="text-[9px] text-gray-400 mt-2 font-medium uppercase tracking-wider">{new Date(n.timestamp || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    )) : (
                      <div className="p-8 flex flex-col items-center justify-center text-center">
                        <icons.laporan className="w-10 h-10 text-gray-200 mb-2" />
                        <p className="text-xs text-gray-500 font-medium">Belum ada notifikasi</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-800">Edit Profil Admin</h3>
                <button onClick={() => setShowProfileModal(false)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-gray-50">×</button>
              </div>
              <div className="p-6 overflow-y-auto w-full relative">
                 <MobileProfilPage user={user} onLogout={() => setShowProfileModal(false)} onUpdateUser={(d) => { if(onUpdateUser) onUpdateUser(d); setShowProfileModal(false); }} />
                 <div className="absolute top-6 left-6 right-6 bottom-6 pointer-events-none" style={{ background: 'linear-gradient(to bottom, transparent, white)', opacity: 0 }}></div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

const WebStatsCards = () => {
  const [stats, setStats] = useState({ warga: 0, totalWarga: 0, laporan: 0, saldo: 0, iuranRef: 0, iuranTotal: 0, kasRT: 0, danaKematian: 0, danaSosial: 0, docUploaded: 0, docNotUploaded: 0 });
  const [showKasDetail, setShowKasDetail] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wargaRes, laporanRes, kasRes, iuranRes] = await Promise.all([
          apiFetch('/api/warga'),
          apiFetch('/api/data/laporan'),
          apiFetch('/api/data/kas'),
          apiFetch('/api/data/iuran')
        ]);
        const wData = await wargaRes.json();
        const lData = await laporanRes.json();
        const kData = await kasRes.json();
        const iData = await iuranRes.json();

        // calc warga
        const totalWarga = wData.users?.length || 0;
        let totalWargaPerson = totalWarga;
        let docUploaded = 0;
        let docNotUploaded = 0;
        (wData.users || []).forEach((u: any) => {
          totalWargaPerson += (u.members?.length || 0);
          if (u.dokumenKk || (Array.isArray(u.dokumenKtp) ? u.dokumenKtp.length > 0 : u.dokumenKtp)) {
            docUploaded++;
          } else {
            docNotUploaded++;
          }
        });
        
        // calc laporan baru
        const laporanBaru = (lData.data || []).filter((l: any) => l.status === 'menunggu').length;
        // calc saldo (Kas RT + Dana Kematian + Dana Sosial)
        const items = kData.data || [];
        const m = items.filter((d: any) => d.type === 'Masuk').reduce((a: number, b: any) => a + (b.amount || 0), 0);
        const k = items.filter((d: any) => d.type === 'Keluar').reduce((a: number, b: any) => a + (b.amount || 0), 0);
        const saldo = m - k;

        const getSaldo = (cat: string) => {
          const catItems = items.filter((d: any) => (d.category || 'Kas RT') === cat);
          const catM = catItems.filter((d: any) => d.type === 'Masuk').reduce((a: number, b: any) => a + (b.amount || 0), 0);
          const catK = catItems.filter((d: any) => d.type === 'Keluar').reduce((a: number, b: any) => a + (b.amount || 0), 0);
          return catM - catK;
        };
        const kasRT = getSaldo('Kas RT');
        const danaKematian = getSaldo('Dana Kematian');
        const danaSosial = getSaldo('Dana Sosial');
        
        // iuran bulan ini
        const currentMonth = new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });
        let iuranTotal = 0;
        let lunas = 0;
        const currentIuran = (iData.data || []).filter((i: any) => i.bulan === currentMonth);
        if (currentIuran.length > 0) {
           iuranTotal = currentIuran.length;
           lunas = currentIuran.filter((i: any) => i.status === 'verifikasi').length;
        } else {
           // fallback to overall if no iuran this month generated yet
           const allIuran = iData.data || [];
           iuranTotal = allIuran.length || 1;
           lunas = allIuran.filter((i: any) => i.status === 'verifikasi').length;
        }
        
        setStats({
          warga: totalWarga,
          totalWarga: totalWargaPerson,
          laporan: laporanBaru,
          saldo,
          iuranRef: lunas,
          iuranTotal,
          kasRT,
          danaKematian,
          danaSosial,
          docUploaded,
          docNotUploaded
        });

      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  const formatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
  const saldoFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
      {[
        { title: 'KK', value: formatter.format(stats.warga), unit: '', icon: icons.warga, accent: '#60A5FA', isWarga: true },
        { title: 'Total Warga', value: formatter.format(stats.totalWarga), unit: 'Orang', icon: icons.warga, accent: '#10B981' },
        { title: 'Laporan', value: formatter.format(stats.laporan), unit: 'Baru', icon: icons.laporan, accent: '#F87171' },
        { title: 'Saldo Kas', value: saldoFormatter.format(stats.saldo), unit: '', icon: icons.iuran, accent: '#FBBF24', isKas: true },
        { title: 'Iuran', value: `${Math.round((stats.iuranRef / Math.max(stats.iuranTotal, 1)) * 100)}%`, unit: 'Lunas', icon: icons.iuran, accent: '#34D399' },
      ].map((card, index) => (
        <div 
          key={index} 
          className={`bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center flex-wrap ${card.isKas ? 'cursor-pointer hover:border-amber-200 transition-colors relative' : 'overflow-hidden'}`}
          onClick={() => card.isKas && setShowKasDetail(!showKasDetail)}
        >
          <div className="p-3 rounded-lg flex-shrink-0" style={{ backgroundColor: `${card.accent}1A` }}>
            <card.icon className="w-7 h-7" style={{ color: card.accent }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-gray-500 font-medium truncate flex items-center justify-between">
              {card.title}
              {card.isKas && <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-400">Detail</span>}
            </p>
            <div className="flex items-baseline gap-1 mt-1 truncate">
              <span className="text-2xl font-bold text-gray-900 truncate" style={{ fontFamily: fontStyle }}>{card.value}</span>
              {card.unit && <span className="text-xs font-medium text-gray-500 flex-shrink-0">{card.unit}</span>}
            </div>
          </div>
          {card.isWarga && (
              <div className="w-full flex gap-2 mt-2 text-[10px] font-medium border-t pt-2">
                <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100">{stats.docUploaded} Upload Dokumen</span>
                <span className="text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">{stats.docNotUploaded} Belum</span>
              </div>
          )}
          
          {card.isKas && showKasDetail && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20" onClick={e => e.stopPropagation()}>
               <h4 className="text-xs font-bold text-gray-800 mb-3 border-b border-gray-50 pb-2">Rincian Saldo Kas</h4>
               <div className="space-y-2">
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-500">Kas RT</span>
                   <span className="font-semibold text-gray-800">{saldoFormatter.format(stats.kasRT)}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-500">Dana Sosial</span>
                   <span className="font-semibold text-gray-800">{saldoFormatter.format(stats.danaSosial)}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                   <span className="text-gray-500">Dana Kematian</span>
                   <span className="font-semibold text-gray-800">{saldoFormatter.format(stats.danaKematian)}</span>
                 </div>
               </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const WebDateWidget = () => {
  const [date, setDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedDateState, setSelectedDateState] = useState<number>(date.getDate());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    apiFetch('/api/data/acara').then(r => r.json()).then(json => {
      setEvents(json.data || []);
    }).catch(console.error);
  }, []);

  const hari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][date.getDay()];
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][date.getMonth()];
  const tanggal = date.getDate();
  const tahun = date.getFullYear();
  const waktu = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const daysInMonth = new Date(tahun, date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(tahun, date.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const selectedDateEvents = events.filter(e => {
    const d = new Date(e.date);
    return d.getDate() === selectedDateState && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
  });

  return (
    <div className="relative col-span-1 xl:col-span-2 select-none z-20">
      <div 
        className="bg-gradient-to-br from-teal-500 to-teal-700 p-6 rounded-xl border border-teal-600 shadow-sm text-white flex items-center justify-between cursor-pointer hover:from-teal-600 hover:to-teal-800 transition group"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        <div>
          <p className="text-teal-100 text-sm font-medium mb-1 flex items-center gap-2">
            {hari}
            <svg className={`w-4 h-4 transition-transform ${showCalendar ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
          </p>
          <h2 className="text-2xl font-bold">{tanggal} {bulan} {tahun}</h2>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/20">
          <span className="text-xl font-bold tracking-wider">{waktu}</span>
        </div>
      </div>
      
      <AnimatePresence>
        {showCalendar && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-lg border border-gray-100 p-6 z-30 transform-gpu flex flex-col md:flex-row gap-6"
          >
            <div className="flex-1">
              <div className="text-center font-bold text-gray-800 text-lg mb-4">{bulan} {tahun}</div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                  <div key={d} className="text-xs font-bold text-gray-400 py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {blanks.map(b => <div key={`blank-${b}`} className="p-2"></div>)}
                {days.map(d => {
                  const hasEvent = events.some(e => {
                    const evD = new Date(e.date);
                    return evD.getDate() === d && evD.getMonth() === date.getMonth() && evD.getFullYear() === date.getFullYear();
                  });
                  return (
                    <div 
                      key={d} 
                      onClick={() => setSelectedDateState(d)}
                      className={`p-2 rounded-lg text-sm font-semibold transition-colors relative cursor-pointer ${d === selectedDateState ? 'bg-teal-600 text-white shadow-sm' : 'text-gray-700 hover:bg-teal-50 hover:text-teal-700'}`}
                    >
                      {d}
                      {hasEvent && (
                        <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${d === selectedDateState ? 'bg-white' : 'bg-teal-500'}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 flex flex-col min-h-[200px]">
              <h3 className="font-bold text-gray-800 text-sm mb-3">Agenda {selectedDateState} {bulan} {tahun}</h3>
              <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((e, idx) => (
                    <div key={idx} className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                      <div className="text-xs font-bold text-orange-600 mb-1">{e.time || 'Waktu tidak ditentukan'}</div>
                      <div className="text-sm font-bold text-gray-800">{e.title}</div>
                      <div className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {e.location || 'Lokasi tidak disebutkan'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 py-6">
                    <svg className="w-8 h-8 text-gray-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <p className="text-xs">Tidak ada agenda pada hari ini</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const WebLaporanTable = () => {
  const [laporanWargaData, setLaporanWargaData] = useState<any[]>([]);
  useEffect(() => {
    apiFetch('/api/data/laporan').then(r => r.json()).then(d => {
      setLaporanWargaData(d.data?.slice(-5).reverse() || []);
    }).catch(console.error);
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Laporan Warga Terbaru</h3>
      </div>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="text-gray-500 border-b border-gray-100">
            <th className="pb-2 font-medium">Pelapor</th>
            <th className="pb-2 font-medium">Judul</th>
            <th className="pb-2 font-medium text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {laporanWargaData.map((item, index) => (
            <tr key={index} className={index < laporanWargaData.length - 1 ? 'border-b border-gray-50' : ''}>
              <td className="py-3 font-medium text-gray-800">{item.nama || 'Warga'}</td>
              <td className="py-3 text-gray-600 truncate max-w-[200px]">{item.judul}</td>
              <td className="py-3 text-right">
                <span className={`px-2 py-1 rounded-md ${item.status === 'selesai' ? 'bg-teal-50 text-teal-700' : (item.status === 'diproses' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700')}`}>{item.status || 'menunggu'}</span>
              </td>
            </tr>
          ))}
          {laporanWargaData.length === 0 && (
            <tr><td colSpan={3} className="text-center py-4 text-gray-400">Belum ada laporan</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const WebIuranChart = () => {
  const [chartData, setChartData] = useState<{bulan: string, value: number}[]>([]);
  useEffect(() => {
    apiFetch('/api/data/kas').then(res => res.json()).then(data => {
      const items = data.data || [];
      const stats: Record<string, number> = {};
      items.forEach((i: any) => {
        if (i.type === 'Masuk') {
          const dateStr = i.createdAt 
            ? new Date(i.createdAt).toLocaleString('id-ID', { month: 'long', year: 'numeric' }) 
            : new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' });
          stats[dateStr] = (stats[dateStr] || 0) + (parseInt(i.amount) || 0);
        }
      });
      const keys = Object.keys(stats).slice(-6);
      setChartData(keys.map(k => ({ bulan: k.split(' ')[0].substring(0,3), value: stats[k] })));
    }).catch(console.error);
  }, []);

  const maxValue = Math.max(...chartData.map(d => d.value), 100000);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-900">Tren Pemasukan Bulanan</h3>
      <div className="flex-grow flex items-end justify-between gap-1 p-2 border border-gray-50 rounded-lg">
        {chartData.length > 0 ? chartData.map((data, index) => (
          <div key={index} className="flex flex-col items-center gap-1 min-h-[100px] justify-end mt-4 w-full">
            <div className="bg-teal-500 w-8 rounded-t-sm" style={{ height: `${(data.value / maxValue) * 100}px` }}></div>
            <span className="text-[9px] text-gray-400 font-medium">{data.bulan}</span>
          </div>
        )) : <div className="text-xs text-gray-400 text-center w-full py-8">Belum ada data pemasukan</div>}
      </div>
    </div>
  );
};

const WebWargaPage = ({ user }: { user: any }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full h-full min-h-[500px] overflow-auto">
    <div className="p-4 md:p-8">
      <MobileDataWarga onBack={() => {}} currentUser={user} />
    </div>
  </div>
);

const WebIuranPage = ({ user }: { user: any }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full h-full min-h-[500px] overflow-auto">
    <div className="p-4 md:p-8">
      <MobileIuran onBack={() => {}} currentUser={user} />
    </div>
  </div>
);

const WebKasPage = ({ user }: { user: any }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full h-full min-h-[500px] overflow-auto">
    <div className="p-4 md:p-8">
      <MobileKas onBack={() => {}} currentUser={user} />
    </div>
  </div>
);

const WebDokumenPage = ({ user, onUpdateUser }: { user: any, onUpdateUser: (u: any) => void }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full h-full min-h-[500px] overflow-auto">
    <div className="p-4 md:p-8">
      <MobileDokumen onBack={() => {}} currentUser={user} onUpdateUser={onUpdateUser} />
    </div>
  </div>
);

const WebLaporanPage = ({ user }: { user: any }) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full h-full min-h-[500px] overflow-auto">
      <div className="p-4 md:p-8 relative">
        {!showForm ? (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowForm(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-teal-700 transition">Tambahkan Laporan</button>
            </div>
            <MobileLaporan onBack={() => {}} currentUser={user} />
          </div>
        ) : (
          <MobileLaporRT onBack={() => setShowForm(false)} currentUser={user} defaultTab="Keluhan" />
        )}
      </div>
    </div>
  );
};

const WebPengumumanPage = ({ user }: { user: any }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full h-full min-h-[500px] overflow-auto">
    <div className="p-4 md:p-8">
      <MobileAcaraPage currentUser={user} />
    </div>
  </div>
);

const WebUMKMPage = ({ user }: { user: any }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full h-full min-h-[500px] overflow-auto">
    <div className="p-4 md:p-8">
      <MobileUMKM onBack={() => {}} currentUser={user} />
    </div>
  </div>
);

const WebTamuPage = ({ user }: { user: any }) => {
  const [showForm, setShowForm] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full h-full min-h-[500px] overflow-auto">
      <div className="p-4 md:p-8 relative">
        {!showForm ? (
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowForm(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-teal-700 transition">Tambahkan Laporan</button>
            </div>
            <MobileTamu onBack={() => {}} currentUser={user} />
          </div>
        ) : (
          <MobileLaporRT onBack={() => setShowForm(false)} currentUser={user} defaultTab="Tamu" />
        )}
      </div>
    </div>
  );
};

const WebPengaturanPage = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPass, setSavingPass] = useState(false);

  const handleUpdatePassword = async () => {
    setPasswordError('');
    setPasswordMsg('');
    if (!oldPassword || !newPassword || !confirmPassword) {
       return setPasswordError('Semua field harus diisi');
    }
    if (newPassword !== confirmPassword) {
       return setPasswordError('Password baru dan konfirmasi tidak cocok');
    }
    setSavingPass(true);
    try {
      const res = await apiFetch('/api/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg('Password berhasil diganti');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordMsg(''), 3000);
      } else {
        setPasswordError(data.error || 'Gagal mengubah password');
      }
    } catch (e) {
      setPasswordError('Terjadi kesalahan sistem');
    }
    setSavingPass(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full min-h-[500px]">
      <div className="p-8 border-b border-gray-50">
        <h2 className="text-xl font-bold text-gray-800">Pengaturan Web</h2>
        <p className="text-sm text-gray-500 mt-1">Kelola preferensi dan sistem aplikasi RT.</p>
      </div>
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Notifikasi Web</h3>
            <p className="text-xs text-gray-500 mt-1">Terima pop-up notifikasi saat ada aktivitas baru.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" defaultChecked />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>
        
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Tema Aplikasi</h3>
            <p className="text-xs text-gray-500 mt-1">Ubah tampilan terang atau gelap.</p>
          </div>
          <select className="text-sm border border-gray-200 rounded-lg bg-white p-2 text-gray-700 outline-none">
            <option>Terang (Default)</option>
            <option>Gelap</option>
            <option>Otomatis</option>
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl space-y-4">
          <div>
             <h3 className="font-semibold text-gray-800 text-sm">Ubah Password</h3>
             <p className="text-xs text-gray-500 mt-1">Ganti password akun anda demi keamanan.</p>
          </div>
          {passwordMsg && <div className="p-2 bg-green-100 text-green-700 text-xs rounded-lg">{passwordMsg}</div>}
          {passwordError && <div className="p-2 bg-red-100 text-red-700 text-xs rounded-lg">{passwordError}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <input type="password" placeholder="Password Lama" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg p-2" />
             <input type="password" placeholder="Password Baru" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg p-2" />
             <input type="password" placeholder="Konfirmasi Password Baru" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full text-sm border border-gray-200 rounded-lg p-2" />
          </div>
          <div className="flex justify-end">
             <button onClick={handleUpdatePassword} disabled={savingPass} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition disabled:opacity-50">
               {savingPass ? 'Menyimpan...' : 'Simpan Password'}
             </button>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl">
          <div>
            <h3 className="font-semibold text-gray-800 text-sm">Logout</h3>
            <p className="text-xs text-gray-500 mt-1">Keluar dari sesi admin web saat ini.</p>
          </div>
          <button onClick={onLogout} className="px-6 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
            Keluar Aplikasi
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Mobile UI Components (Aplikasi Warga Mockup) ---
const MobileHeader = ({ notifications, onShowNotifications }: { notifications: any[], onShowNotifications: () => void }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  return (
  <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
    <div className="flex items-center gap-2">
      <LogoCommunityIcon size="20"/>
      <span className="text-lg font-bold" style={{ color: themeColors.primary, fontFamily: fontStyle }}>GUYUB RUKUN</span>
    </div>
    <div className="relative cursor-pointer" onClick={onShowNotifications}>
      <icons.bell className="w-5 h-5 text-teal-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
        </span>
      )}
    </div>
  </header>
  );
};

const MobileProfile = ({ user }: { user: any }) => {
  const shortName = user?.nama ? user.nama.split(' ').slice(0, 2).join(' ') : 'Warga';
  // Use a fallback so it matches original data visually if unavailable
  const displayAlamat = user?.alamat || 'Jl. Bahagia No. 12, Kompleks Rukun';
  
  return (
  <section className="p-4 bg-teal-50 flex items-center justify-between gap-3 rounded-b-3xl mb-4">
    <div className="flex-grow">
      <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: fontStyle }}>Halo, {shortName}!</h2>
      <p className="text-xs text-gray-600 mt-1">Warga RT 01, {displayAlamat.length > 25 ? displayAlamat.substring(0, 25) + '...' : displayAlamat}</p>
    </div>
    <div className="relative">
      {user?.photo ? (
        <img src={user.photo} alt="Profile" className="w-14 h-14 rounded-full border border-teal-100 object-cover" />
      ) : (
        <ProfileAvatar size="14"/>
      )}
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-teal-50"></div>
    </div>
  </section>
  );
};

const MobileQuickActions = ({ onActionClick }: { onActionClick: (action: string) => void }) => (
  <section className="px-4 mb-6">
    <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-50">
      {quickActions.map((action, index) => (
        <button key={index} onClick={() => onActionClick(action.name)} className="flex flex-col items-center text-center gap-2 cursor-pointer hover:scale-105 transition-transform">
          <div className="p-3 rounded-xl bg-orange-50">
            <action.icon className="w-6 h-6 text-orange-600" />
          </div>
          <span className="text-[10px] font-medium text-gray-700 leading-tight">{action.name}</span>
        </button>
      ))}
    </div>
  </section>
);

const MobileEvents = ({ onActionClick }: { onActionClick: (action: string) => void }) => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<number | null>(today.getDate());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [backendEvents, setBackendEvents] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(true);

  useEffect(() => {
    setLoadingMedia(true);
    apiFetch('/api/data/media').then(r => r.json()).then(json => {
      if (json.data && json.data.length > 0) {
        setMediaList(json.data.slice(-5).reverse());
      } else {
        setMediaList([{
          imageUrl: "https://images.unsplash.com/photo-1593113511332-15f5ea6c4dcd?auto=format&fit=crop&w=600&q=80",
          title: "Kerja Bakti Sambut Ramadhan",
          uploaderName: "Admin",
          desc: "Keseruan warga RT 01 bergotong royong membersihkan selokan dan jalanan."
        }]);
      }
    }).catch(console.error).finally(() => setLoadingMedia(false));

    apiFetch('/api/data/acara').then(r => r.json()).then(json => {
      setBackendEvents(json.data || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (mediaList.length <= 1) return;
    const interval = setInterval(() => {
      setActiveMediaIndex(prev => (prev + 1) % mediaList.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [mediaList.length]);

  const currentMedia = mediaList[activeMediaIndex] || null;

  // Calendar Logic
  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const blanks = Array.from({ length: firstDay }, (_, i) => null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];
  const weeks = [];
  for (let i = 0; i < totalSlots.length; i += 7) weeks.push(totalSlots.slice(i, i + 7));

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  const selectedDateEvents = backendEvents.filter(e => {
    if (!selectedDate) return false;
    const d = new Date(e.date);
    return d.getDate() === selectedDate && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  return (
  <section className="px-4 mb-6 space-y-4">
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden relative group cursor-pointer" onClick={() => onActionClick('Media')}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMediaIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-40"
        >
          {loadingMedia ? (
             <div className="w-full h-full bg-gray-200 animate-pulse"></div>
          ) : currentMedia && (
            <img src={currentMedia.imageUrl} alt={currentMedia.title} className="w-full h-full object-cover" />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4 text-white">
        <div className="flex justify-between items-start w-full mb-2">
          <span className="px-2 py-1 bg-teal-500/80 backdrop-blur-sm text-[9px] font-bold rounded-full w-max">Galeri Terbaru</span>
          {!loadingMedia && currentMedia && (
            <a href={currentMedia.imageUrl} download={currentMedia.title || 'foto-rt'} target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/40 text-white p-1.5 rounded-full backdrop-blur-sm transition z-10" title="Unduh Foto">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            </a>
          )}
        </div>
        {loadingMedia ? (
            <>
               <div className="h-4 w-32 bg-white/30 animate-pulse rounded mb-2"></div>
               <div className="h-3 w-48 bg-white/20 animate-pulse rounded"></div>
            </>
        ) : (
            <>
                <h4 className="text-sm font-bold leading-snug">{currentMedia?.title}</h4>
                {currentMedia?.desc ? (
                  <p className="text-[10px] text-gray-200 mt-1 line-clamp-2">{currentMedia.desc}</p>
                ) : (
                  <p className="text-[10px] text-gray-200 mt-1 line-clamp-2">Diunggah oleh {currentMedia?.uploaderName}</p>
                )}
            </>
        )}
      </div>
      {mediaList.length > 1 && !loadingMedia && (
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
          {mediaList.map((_, idx) => (
            <div key={idx} className={`h-1 rounded-full transition-all ${idx === activeMediaIndex ? 'w-4 bg-teal-400' : 'w-1.5 bg-white/50'}`} />
          ))}
        </div>
      )}
    </div>

    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex justify-between items-center mb-3">
         <div className="flex items-center gap-2">
           <select 
             className="text-xs font-bold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
             value={currentMonth}
             onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
           >
             {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
           </select>
           <select 
             className="text-xs font-bold text-gray-800 bg-transparent border-none outline-none cursor-pointer ml-1"
             value={currentYear}
             onChange={(e) => setCurrentYear(parseInt(e.target.value))}
           >
             {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i).map(y => (
               <option key={y} value={y}>{y}</option>
             ))}
           </select>
         </div>
         <span className="text-[9px] text-teal-600 font-bold cursor-pointer" onClick={() => onActionClick('Acara')}>Kelola Acara</span>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'].map(d => <div key={d} className="text-[8px] font-bold text-gray-400">{d}</div>)}
      </div>
      <div className="space-y-1">
        {weeks.map((week, i) => (
          <div key={i} className="grid grid-cols-7 gap-1 text-center">
            {week.map((date, j) => {
              const isEvent = date && backendEvents.some(e => {
                const d = new Date(e.date);
                return d.getDate() === date && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
              });
              const isSelected = selectedDate === date;
              return (
                <div 
                  key={j} 
                  onClick={() => date && setSelectedDate(date)}
                  className={`text-[10px] aspect-square cursor-pointer flex flex-col items-center justify-center rounded-full font-medium transition-colors ${!date ? '' : isSelected ? 'bg-teal-600 text-white shadow-md' : isEvent ? 'bg-orange-100 text-orange-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {date || ''}
                  {isEvent && !isSelected && <div className="w-1 h-1 bg-orange-500 rounded-full mt-0.5"></div>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-3 border-t border-gray-50 pt-3">
         {selectedDateEvents.map((item) => (
          <div key={item.id} className="flex gap-2 items-center">
            <div className={`w-1 h-full min-h-[30px] rounded-full bg-teal-500`}></div>
            <div className="flex-grow">
              <h5 className="text-[10px] font-bold text-gray-800 leading-tight">{item.title}</h5>
              <p className="text-[8px] text-gray-500 mt-0.5">{new Date(item.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} • {item.desc}</p>
            </div>
          </div>
         ))}
         {selectedDate && selectedDateEvents.length === 0 && (
           <p className="text-[10px] text-center text-gray-400 py-2">Tidak ada acara di tanggal {selectedDate} {monthNames[currentMonth]}</p>
         )}
      </div>
    </div>
  </section>
  );
};

const MobileBottomNav = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => (
  <nav className="flex justify-around items-center p-3 pb-6 bg-white border-t border-gray-100 fixed bottom-0 left-0 right-0 z-10 w-full">
    {mobileNavItems.map((item) => (
      <button 
        key={item.name} 
        onClick={() => onTabChange(item.name)}
        className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.name ? 'text-teal-700' : 'text-gray-400'}`}>
        <item.icon className="w-6 h-6" />
        <span className="text-[10px] font-medium">{item.name}</span>
      </button>
    ))}
  </nav>
);

import { MobileMedia } from './MobileMedia';

// --- Simplified Inline Illustrations (as functional components) ---
const LogoCommunityIcon = ({ size = '24', colorAccent = themeColors.accent, colorPrimary = themeColors.primary }) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="45" fill={colorAccent} stroke={colorPrimary} strokeWidth="2"/>
    <path d="M50 20 Q60 40, 50 60 Q40 40, 50 20" fill={colorPrimary} />
    <circle cx="35" cy="40" r="10" fill={colorPrimary}/>
    <circle cx="65" cy="40" r="10" fill={colorPrimary}/>
    <path d="M40 75 Q50 65, 60 75" stroke={colorPrimary} strokeWidth="3" fill="none" strokeLinecap="round"/>
  </svg>
);

const IllustrationFamilyGroup = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full object-cover">
    <circle cx="90" cy="50" r="25" fill="#fbc4ac" />
    <circle cx="110" cy="50" r="25" fill="#fbc4ac" />
    <ellipse cx="100" cy="90" rx="60" ry="40" fill={themeColors.accent} />
    <rect x="70" y="80" width="10" height="2" rx="1" fill="#f9dcc4" />
    <rect x="120" y="80" width="10" height="2" rx="1" fill="#f9dcc4" />
    <circle cx="85" cy="65" r="12" fill={themeColors.primary}/>
    <circle cx="115" cy="65" r="12" fill={themeColors.primary}/>
  </svg>
);

const IllustrationCommunityActivity = () => (
  <svg viewBox="0 0 350 200" className="w-full h-full object-cover">
    <rect width="350" height="200" fill="#e0f2f1" />
    <circle cx="175" cy="100" r="90" fill={themeColors.accent} />
    <rect x="150" y="150" width="50" height="10" rx="5" fill="#fbe9e7" />
    <path d="M175 70 Q185 85, 175 100 Q165 85, 175 70" fill={themeColors.primary} />
    <circle cx="190" cy="85" r="10" fill={themeColors.primary}/>
    <circle cx="160" cy="85" r="10" fill={themeColors.primary}/>
  </svg>
);

export const ProfileAvatar = ({ size = '10' }: { size?: string }) => (
  <div className={`w-${size} h-${size} rounded-full bg-gray-200 flex items-center justify-center border-2 border-white overflow-hidden`}>
    <icons.profil className={`w-full h-full text-gray-400 mt-1`} />
  </div>
);

const quickActions = [
  { name: 'Surat', icon: icons.surat },
  { name: 'Lapor RT', icon: icons.laporanrt },
  { name: 'Dokumen', icon: icons.dokumen },
  { name: 'Media', icon: icons.media },
  { name: 'Iuran', icon: icons.iuran },
  { name: 'Kas', icon: icons.kas },
  { name: 'Sedekah', icon: icons.sedekah },
  { name: 'Data Warga', icon: icons.warga },
  { name: 'UMKM', icon: icons.umkm },
  { name: 'Darurat', icon: icons.darurat },
  { name: 'Tamu', icon: icons.warga },
];

const MobileSaldoCard = () => {
  const [saldo, setSaldo] = useState(0);
  const [danaKematian, setDanaKematian] = useState(0);
  const [danaSosial, setDanaSosial] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiFetch('/api/data/kas')
      .then(res => res.json())
      .then(json => {
        const data = json.data || [];
        const kasRtData = data.filter((d: any) => (d.category || 'Kas RT') === 'Kas RT');
        const masuk = kasRtData.filter((d: any) => d.type === 'Masuk').reduce((a: number, b: any) => a + (b.amount || 0), 0);
        const keluar = kasRtData.filter((d: any) => d.type === 'Keluar').reduce((a: number, b: any) => a + (b.amount || 0), 0);
        setSaldo(masuk - keluar);

        const getSaldo = (cat: string) => {
          const items = data.filter((d: any) => (d.category || 'Kas RT') === cat);
          const m = items.filter((d: any) => d.type === 'Masuk').reduce((a: number, b: any) => a + (b.amount || 0), 0);
          const k = items.filter((d: any) => d.type === 'Keluar').reduce((a: number, b: any) => a + (b.amount || 0), 0);
          return m - k;
        };

        setDanaKematian(getSaldo('Dana Kematian'));
        setDanaSosial(getSaldo('Dana Sosial'));
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const formatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });

  return (
    <section className="px-4 mb-5 mt-2">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-500 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-12 -translate-y-8"></div>
          <div className="flex justify-between items-center mb-1">
            <p className="text-[11px] font-medium opacity-90 uppercase tracking-widest">Saldo Kas RT 01</p>
            <icons.kas className="w-5 h-5 opacity-80"/>
          </div>
          {loading ? (
             <div className="h-8 w-40 bg-white/20 animate-pulse rounded mt-1 mb-1"></div>
          ) : (
             <h3 className="text-2xl font-bold tracking-tight mt-1 mb-1 text-white" style={{ fontFamily: fontStyle }}>{formatter.format(saldo)}</h3>
          )}
          <div className="flex items-center gap-2 mt-2 truncate">
            {loading ? (
              <>
                <div className="h-4 w-20 bg-white/20 animate-pulse rounded-full"></div>
                <div className="h-4 w-24 bg-white/20 animate-pulse rounded-full"></div>
              </>
            ) : (
              <>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">Sosial: {formatter.format(danaSosial)}</span>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm font-medium">Kematian: {formatter.format(danaKematian)}</span>
              </>
            )}
          </div>
      </div>
    </section>
  );
};

const mobileNavItems = [
  { name: 'Beranda', icon: icons.home, active: true },
  { name: 'Acara', icon: icons.events },
  { name: 'Laporan', icon: icons.laporan },
  { name: 'Profil', icon: icons.profil },
];

const MobileProfilPage = ({ user, onLogout, onUpdateUser }: { user: any; onLogout: () => void; onUpdateUser: (data: any) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [savingPass, setSavingPass] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.nama || 'Admin RT',
    address: user?.alamat || 'Jl. Bahagia No. 12, Kompleks Rukun, Kota Tegal',
    phone: user?.noHp || '0812-3456-7890',
    role: user?.role === 'admin' ? 'Ketua RT 01 / RW 21' : (user?.status || 'Warga RT 01 / RW 21'),
    photo: user?.photo || null as string | null,
    umur: user?.umur || ''
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, photo: e.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await apiFetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id,
          nama: profile.name,
          alamat: profile.address,
          noHp: profile.phone,
          status: profile.role,
          photo: profile.photo,
          umur: profile.umur
        })
      });
      if (res.ok) {
        onUpdateUser({
           nama: profile.name,
           alamat: profile.address,
           noHp: profile.phone,
           status: profile.role,
           photo: profile.photo,
           umur: profile.umur
        });
        setIsEditing(false);
        setSuccessMsg('Profil berhasil disimpan!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch(e) {
      console.error(e);
    }
    setSaving(false);
  };

  const handleUpdatePassword = async () => {
    setPasswordError('');
    setPasswordMsg('');
    if (!oldPassword || !newPassword || !confirmPassword) {
       return setPasswordError('Semua field harus diisi');
    }
    if (newPassword !== confirmPassword) {
       return setPasswordError('Password baru dan konfirmasi tidak cocok');
    }
    setSavingPass(true);
    try {
      const res = await apiFetch('/api/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setIsChangingPass(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMsg('Password berhasil diganti');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setPasswordError(data.error || 'Gagal mengubah password');
      }
    } catch (e) {
      setPasswordError('Terjadi kesalahan sistem');
    }
    setSavingPass(false);
  };

  if (isChangingPass) {
    return (
      <div className="p-4 flex flex-col space-y-4 pb-24">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setIsChangingPass(false)} className="text-[10px] text-teal-600 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">Batal</button>
          <button onClick={handleUpdatePassword} disabled={savingPass} className="text-[10px] text-white font-bold inline-flex items-center gap-1 bg-teal-600 px-3 py-1 rounded">{savingPass ? 'Menyimpan...' : 'Simpan Password'}</button>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
           <h3 className="font-bold text-gray-800 text-sm border-b pb-2">Ubah Password</h3>
           {passwordError && <div className="p-2 bg-red-100 text-red-700 text-[10px] rounded-lg">{passwordError}</div>}
           <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Password Lama</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
           </div>
           <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Password Baru</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
           </div>
           <div>
              <label className="block text-[10px] font-semibold text-gray-700 mb-1">Konfirmasi Password Baru</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
           </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="p-4 flex flex-col space-y-4 pb-24">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setIsEditing(false)} className="text-[10px] text-teal-600 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">Batal</button>
          <button onClick={handleSave} disabled={saving} className="text-[10px] text-white font-bold inline-flex items-center gap-1 bg-teal-600 px-3 py-1 rounded">{saving ? 'Menyimpan...' : 'Simpan'}</button>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative">
            {profile.photo ? (
               <img src={profile.photo} alt="Profile" className="w-20 h-20 rounded-full border border-gray-200 object-cover" />
            ) : (
               <ProfileAvatar size="20"/>
            )}
            <label className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm">
               <icons.media className="w-3 h-3 text-teal-600"/>
               <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <p className="text-[10px] text-teal-600 font-medium mt-2">Ubah Foto Profil</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
            <div>
               <label className="block text-[10px] font-semibold text-gray-700 mb-1">Nama Lengkap</label>
               <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
            </div>
            <div>
               <label className="block text-[10px] font-semibold text-gray-700 mb-1">Peran / Status</label>
               <input type="text" value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
            </div>
            <div>
               <label className="block text-[10px] font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
               <textarea value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs h-16"></textarea>
            </div>
            <div>
               <label className="block text-[10px] font-semibold text-gray-700 mb-1">Nomor Ponsel</label>
               <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs" />
            </div>
            <div>
               <label className="block text-[10px] font-semibold text-gray-700 mb-1">Umur</label>
               <input type="number" value={profile.umur} onChange={e => setProfile({...profile, umur: e.target.value})} className="w-full p-2 border border-gray-200 rounded-lg text-xs" min="0" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col items-center space-y-4 pb-24">
      {successMsg && (
        <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl w-full text-sm font-medium text-center animate-in fade-in slide-in-from-top-2">
          {successMsg}
        </div>
      )}
      <div className="w-full flex justify-end gap-2">
         <button onClick={() => setIsChangingPass(true)} className="text-[10px] text-gray-600 font-bold inline-flex items-center gap-1 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">Ubah Password</button>
         <button onClick={() => setIsEditing(true)} className="text-[10px] text-teal-600 font-bold inline-flex items-center gap-1 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">Edit Profil</button>
      </div>
      <div className="relative mt-2">
        {profile.photo ? (
           <img src={profile.photo} alt="Profile" className="w-20 h-20 rounded-full border-2 border-white shadow-sm object-cover" />
        ) : (
           <ProfileAvatar size="20"/>
        )}
        <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
      </div>
      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: fontStyle }}>{profile.name}</h2>
        <p className="text-xs font-semibold text-teal-600 mt-1 bg-teal-50 inline-block px-2 py-0.5 rounded-full border border-teal-100">{profile.role}</p>
      </div>
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-50 mt-4">
        <div className="p-3 flex justify-between items-center bg-gray-50 rounded-t-xl">
          <span className="text-[10px] font-medium text-gray-500">Alamat Lengkap</span>
        </div>
        <div className="p-3 text-xs text-gray-800 font-medium leading-relaxed">{profile.address}</div>
        <div className="p-3 flex justify-between items-center bg-gray-50">
          <span className="text-[10px] font-medium text-gray-500">Umur</span>
        </div>
        <div className="p-3 text-xs text-gray-800 font-medium">{profile.umur ? `${profile.umur} Tahun` : '-'}</div>
        <div className="p-3 flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700">Nomor Ponsel</span>
          <span className="text-xs text-gray-500 font-medium">{profile.phone}</span>
        </div>
      </div>
      <button onClick={onLogout} className="w-full py-3 bg-red-50 text-red-600 rounded-xl text-xs font-bold mt-4 border border-red-100">Keluar Akun</button>
    </div>
  );
};


const MobileSedekah = ({ onBack, user }: { onBack: () => void, user?: any }) => {
  return (
  <div className="p-4 pb-24">
     <button onClick={onBack} className="text-[10px] text-teal-600 mb-4 font-bold inline-flex items-center gap-1 bg-teal-50 px-2 py-1 rounded">← Kembali</button>
     <h3 className="font-bold text-gray-800 text-sm mb-4">Sedekah Masjid Al Ikhlas</h3>
     
     <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-center">
        <h4 className="font-bold text-gray-800 mb-2">Scan QRIS</h4>
        <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl p-2 border-2 border-teal-500 mb-4 flex items-center justify-center">
            {/* Mock QR instance */}
            <div className="text-gray-400 font-mono text-xs text-center border-4 border-dashed border-gray-300 w-full h-full flex flex-col items-center justify-center rounded-lg">
                <icons.kas className="w-8 h-8 mb-2 opacity-50"/>
                QRIS CODE
            </div>
        </div>
        <p className="text-xs font-semibold text-gray-600 mb-1">DKM MASJID AL IKHLAS</p>
        <p className="text-[10px] text-gray-400">NMID: ID1234567890</p>
     </div>

     <div className="mt-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-800 text-xs mb-3">Transfer Bank</h4>
        <div className="flex items-center justify-between pb-3 border-b border-gray-50 mb-3">
           <div>
              <p className="text-[10px] text-gray-500 mb-0.5">Bank Syariah Indonesia (BSI)</p>
              <p className="font-bold text-gray-800 text-sm">712 345 6789</p>
              <p className="text-[10px] font-medium text-teal-600 mt-1">a.n DKM Masjid Al Ikhlas</p>
           </div>
           <button className="px-3 py-1.5 bg-teal-50 text-teal-600 font-bold text-[10px] rounded-lg">Salin</button>
        </div>
        <div className="flex items-center justify-between">
           <div>
              <p className="text-[10px] text-gray-500 mb-0.5">Bank Mandiri</p>
              <p className="font-bold text-gray-800 text-sm">137 00 1234567 8</p>
              <p className="text-[10px] font-medium text-teal-600 mt-1">a.n DKM Masjid Al Ikhlas</p>
           </div>
           <button className="px-3 py-1.5 bg-teal-50 text-teal-600 font-bold text-[10px] rounded-lg">Salin</button>
        </div>
     </div>
  </div>
  );
};

// --- Main Combined View ---
function MainApp({ user, onLogout, onUpdateUser }: { user: any; onLogout: () => void; onUpdateUser: (updatedData: any) => void }) {
  const [activeWebTab, setActiveWebTab] = useState('Dashboard');
  const [activeMobileTab, setActiveMobileTab] = useState('Beranda');
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch('/api/notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleShowNotifications = async () => {
    setShowNotifications(true);
    setNotifications(prev => prev.map(n => ({...n, read: true})));
    try {
      await apiFetch('/api/notifications/read', { method: 'POST' });
    } catch(e) { console.error(e) }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" style={{ fontFamily: fontStyle }}>
      
      {!isMobile && (
        <div className="fixed inset-0 z-0 opacity-[0.03] flex items-center justify-center p-20 pointer-events-none md:flex hidden">
          <IllustrationFamilyGroup/>
        </div>
      )}

      {/* --- DESKTOP ADMIN VIEW --- */}
      {!isMobile ? (
      <div className="hidden md:flex relative z-10 w-full h-full flex-col">
        <WebSidebar activeTab={activeWebTab} onTabChange={setActiveWebTab} />
        <div className="flex flex-col flex-grow w-full">
          <WebHeader user={user} onLogout={onLogout} onUpdateUser={onUpdateUser} />
          <main className="flex-grow p-8 overflow-y-auto" style={{ marginLeft: '16rem', backgroundColor: themeColors.neutral.bg }}>
            {activeWebTab === 'Dashboard' && (
              <>
                <WebStatsCards/>
                <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
                  <WebDateWidget/>
                  <WebLaporanTable/>
                  <WebIuranChart/>
                </div>
              </>
            )}
            {activeWebTab === 'Warga' && <WebWargaPage user={user} />}
            {activeWebTab === 'Iuran' && <WebIuranPage user={user} />}
            {activeWebTab === 'Kas' && <WebKasPage user={user} />}
            {activeWebTab === 'Dokumen' && <WebDokumenPage user={user} onUpdateUser={onUpdateUser} />}
            {activeWebTab === 'Laporan' && <WebLaporanPage user={user} />}
            {activeWebTab === 'Pengumuman' && <WebPengumumanPage user={user} />}
            {activeWebTab === 'UMKM' && <WebUMKMPage user={user} />}
            {activeWebTab === 'Tamu' && <WebTamuPage user={user} />}
            {activeWebTab === 'Pengaturan' && <WebPengaturanPage user={user} onLogout={onLogout} />}
          </main>
        </div>
      </div>
      ) : (
      <div className="flex md:hidden relative z-20 w-full h-full bg-white flex-col overflow-hidden">
        {/* --- MOBILE USER VIEW --- */}
        <MobileHeader notifications={notifications} onShowNotifications={handleShowNotifications} />
        <MobileProfile user={user} />
        <div className="flex-grow overflow-hidden bg-white relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMobileTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="h-full overflow-y-auto pb-24"
            >
              {activeMobileTab === 'Beranda' && (
                <>
                  <section className="px-4 mb-4 mt-2 relative z-10 transition-all hidden">
                    <div className="flex items-center gap-3 bg-white p-3 rounded-full shadow-sm border border-gray-100">
                      <icons.home className="w-5 h-5 text-gray-400" />
                      <input type="text" placeholder="Search for actions..." className="text-xs text-gray-700 flex-grow outline-none bg-transparent" />
                      <ProfileAvatar size="8" />
                    </div>
                  </section>
                  <MobileSaldoCard/>
                  <MobileQuickActions onActionClick={setActiveMobileTab}/>
                  <MobileEvents onActionClick={setActiveMobileTab} />
                </>
              )}

              {activeMobileTab === 'Acara' && <MobileAcaraPage currentUser={user} />}
              {activeMobileTab === 'Laporan' && (
                  <MobileLaporan onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />
              )}
              {activeMobileTab === 'Profil' && <MobileProfilPage user={user} onLogout={onLogout} onUpdateUser={onUpdateUser} />}
              {activeMobileTab === 'Surat' && <MobileSuratPengantar onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'Surat Pengantar' && <MobileSuratPengantar onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'Iuran' && <MobileIuran onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'Kas' && <MobileKas onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'Sedekah' && <MobileSedekah onBack={() => setActiveMobileTab('Beranda')} user={user} />}
              {activeMobileTab === 'UMKM Warga' && <MobileUMKM onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'UMKM' && <MobileUMKM onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'Lapor RT' && <MobileLaporRT onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'Data Warga' && <MobileDataWarga onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'Media' && <MobileMedia onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'Darurat' && <MobileDarurat onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
              {activeMobileTab === 'Dokumen' && <MobileDokumen onBack={() => setActiveMobileTab('Beranda')} currentUser={user} onUpdateUser={onUpdateUser} />}
              {activeMobileTab === 'Tamu' && <MobileTamu onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}

              {/* Fallback for unrecognized tabs */}
              {!['Beranda', 'Acara', 'Laporan', 'Profil', 'Surat', 'Surat Pengantar', 'Iuran', 'Kas', 'Sedekah', 'UMKM Warga', 'UMKM', 'Lapor RT', 'Data Warga', 'Media', 'Darurat', 'Dokumen', 'Tamu'].includes(activeMobileTab) && (
                <div className="flex flex-col items-center justify-center h-full opacity-50 py-20">
                  <icons.dashboard className="w-12 h-12 text-gray-300 mb-3" />
                  <h2 className="text-lg font-semibold text-gray-500">Halaman {activeMobileTab}</h2>
                  <p className="text-xs text-gray-400 mb-4">Fitur ini dalam pengembangan.</p>
                  <button className="px-4 py-2 border rounded-full text-xs text-gray-600" onClick={() => setActiveMobileTab('Beranda')}>Kembali</button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <MobileBottomNav activeTab={activeMobileTab} onTabChange={setActiveMobileTab} />
        
        {/* Notifications Modal Overlay */}
        {showNotifications && (
          <div className="absolute inset-0 bg-black/50 z-50 flex justify-end flex-col">
            <div className="bg-white rounded-t-3xl min-h-[50%] max-h-[80%] flex flex-col">
               <div className="flex justify-between items-center p-5 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Notifikasi</h3>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-400 font-bold p-2 bg-gray-50 rounded-full">X</button>
               </div>
               <div className="overflow-y-auto p-4 space-y-3 pb-8">
                  {notifications.map(n => (
                    <div key={n.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex items-start gap-3">
                       <div className="p-2 bg-teal-50 text-teal-600 rounded-full shrink-0">
                         <icons.bell className="w-4 h-4"/>
                       </div>
                       <div>
                         <h5 className="text-xs font-bold text-gray-800">{n.title}</h5>
                         <p className="text-[10px] text-gray-600 mt-0.5">{n.message}</p>
                         <span className="text-[8px] font-medium text-gray-400 mt-1 block">{n.time}</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

import { Login, Register } from './Auth';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const handleUpdateUser = (updatedData: any) => {
    setUser({ ...user, ...updatedData });
  };
  
  useEffect(() => {
    if (!user?.id) return;
    
    // Initial ping
    apiFetch('/api/ping', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id }) });
    
    // Heartbeat ping every 5 seconds
    const interval = setInterval(() => {
      apiFetch('/api/ping', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id }) });
    }, 5000);
    
    const handleUnload = () => {
      const blob = new Blob([JSON.stringify({ id: user.id })], { type: 'application/json' });
      navigator.sendBeacon('/api/logout', blob);
    };
    window.addEventListener('beforeunload', handleUnload);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [user]);

  const handleLogout = async () => {
    if (user?.id) {
      try {
        await apiFetch('/api/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id }) });
      } catch (e) {}
    }
    setUser(null);
  };

  if (!user) {
    if (authView === 'login') {
      return <Login onLogin={setUser} onNavRegister={() => setAuthView('register')} />;
    }
    return <Register onRegister={setUser} onNavLogin={() => setAuthView('login')} />;
  }

  return <MainApp user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
}
