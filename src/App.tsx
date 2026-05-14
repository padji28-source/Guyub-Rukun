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

// --- Modern Icons Set ---
export const icons = {
  dashboard: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  ),
  warga: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  iuran: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  ),
  laporan: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  pengumuman: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 11V9a2 2 0 0 1 2-2h3.93a2 2 0 0 0 1.66-.9l1.1-1.65A2 2 0 0 1 13.35 3h2.15a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-2.15a2 2 0 0 1-1.66-.89l-1.1-1.65a2 2 0 0 0-1.66-.9H5a2 2 0 0 1-2-2v-2Z" />
      <path d="M22 9a6 6 0 0 1 0 6" />
    </svg>
  ),
  umkm: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  pengaturan: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  surat: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" />
      <rect x="3" y="5" width="18" height="14" rx="2" />
    </svg>
  ),
  laporanrt: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  media: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  kas: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  sedekah: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  ),
  darurat: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  lainnya: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="6" height="6" rx="1" />
      <rect x="14" y="4" width="6" height="6" rx="1" />
      <rect x="4" y="14" width="6" height="6" rx="1" />
      <rect x="14" y="14" width="6" height="6" rx="1" />
    </svg>
  ),
  search: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  events: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01" />
    </svg>
  ),
  home: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  profil: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  bell: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  dokumen: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  ),
  arrowLeft: (props: any) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  edit: (props: any) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  )
};

// --- Logo Komunitas Modern ---
// Menggunakan desain gradien yang elegan dan bentuk rumah/orang abstrak bersatu
const LogoCommunityIcon = ({ size = '32', colorAccent = themeColors.accent, colorPrimary = themeColors.primary }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="14" fill="url(#logo-gradient)" />
    <path d="M24 12L10 24V36C10 37.1046 10.8954 38 12 38H36C37.1046 38 38 37.1046 38 36V24L24 12Z" fill="white" fillOpacity="0.1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 38V26C18 24.3431 19.3431 23 21 23H27C28.6569 23 30 24.3431 30 26V38" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="24" cy="18" r="3.5" fill="white" />
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor={colorPrimary} />
        <stop offset="1" stopColor="#0F766E" /> {/* Warna hijau tua estetik */}
      </linearGradient>
    </defs>
  </svg>
);

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
  <aside className="w-20 lg:w-[16rem] h-screen bg-white border-r border-gray-100 flex flex-col p-4 lg:p-6 fixed left-0 top-0 transition-all duration-300 z-50">
    <div className="flex items-center mb-10 gap-2 justify-center lg:justify-start">
      <LogoCommunityIcon size="24"/>
      <span className="hidden lg:inline text-xl font-bold line-clamp-1" style={{ color: themeColors.primary, fontFamily: fontStyle }}>GUYUB RUKUN</span>
    </div>
    <nav className="flex-grow space-y-2 overflow-y-auto w-full no-scrollbar">
      {[
        { name: 'Dashboard', icon: icons.dashboard },
        { name: 'Warga', icon: icons.warga },
        { name: 'Iuran', icon: icons.iuran },
        { name: 'Kas', icon: icons.kas },
        { name: 'Dokumen', icon: icons.dokumen },
        { name: 'Laporan', icon: icons.laporan },
        { name: 'Pengumuman', icon: icons.pengumuman },
        { name: 'Media', icon: icons.media },
        { name: 'UMKM', icon: icons.umkm },
        { name: 'Tamu', icon: icons.warga },
        { name: 'Pengaturan', icon: icons.pengaturan },
      ].map((item) => (
        <button 
          key={item.name} 
          onClick={() => onTabChange(item.name)}
          title={item.name}
          className={`w-full flex items-center justify-center lg:justify-start gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${activeTab === item.name ? 'bg-teal-50 text-teal-800' : 'text-gray-600 hover:bg-gray-50'}`}>
          <item.icon className={`w-6 h-6 lg:w-5 lg:h-5 shrink-0 ${activeTab === item.name ? 'text-teal-600' : 'text-gray-400'}`} />
          <span className="hidden lg:inline">{item.name}</span>
        </button>
      ))}
    </nav>
    <div className="hidden lg:flex w-full mt-auto items-center justify-center h-24 p-2 bg-gray-50 rounded-lg overflow-hidden relative">
      <IllustrationFamilyGroup/>
    </div>
  </aside>
);

// --- 1. UPDATE: WebHeader ---
const WebHeader = ({ user, onLogout, onUpdateUser, notifications = [], onShowNotifications, onNotificationClick, onOpenBroadcast }: { user?: any; onLogout?: () => void; onUpdateUser?: (data: any) => void; notifications?: any[]; onShowNotifications?: () => void; onNotificationClick?: (n: any) => void; onOpenBroadcast?: () => void; }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-gray-100/50 shadow-sm ml-20 lg:ml-[16rem] transition-all duration-300">
        <div className="flex items-center justify-between py-3 px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <h1 className="text-xl lg:text-2xl font-extrabold text-gray-800 tracking-tight" style={{ fontFamily: fontStyle }}>
              Halo, <span className="text-teal-600">{user?.nama || 'Admin'}</span>! 👋
            </h1>
            <p className="hidden md:block text-xs text-gray-500 font-medium mt-0.5">Pusat Kendali Guyub Rukun RT 01</p>
          </motion.div>

          <div className="flex items-center gap-4 lg:gap-6">
            {/* Notification Bell */}
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                   setShowNotifications(!showNotifications);
                   if (!showNotifications && onShowNotifications) onShowNotifications();
                }} 
                className={`relative p-2.5 rounded-full transition-all duration-300 ${showNotifications ? 'bg-teal-50 text-teal-600 shadow-inner' : 'bg-gray-50/80 hover:bg-teal-50 text-gray-500 hover:text-teal-600 shadow-sm border border-gray-100'}`}
              >
                <icons.bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold ring-2 ring-white animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </motion.button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.9 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 mt-4 w-80 lg:w-96 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                  >
                    <div className="p-4 border-b border-gray-100 bg-white/50 flex justify-between items-center">
                      <h4 className="font-extrabold text-gray-800 text-sm">Notifikasi</h4>
                      <div className="flex items-center gap-2">
                        {user?.role === 'admin' && (
                           <button onClick={(e) => { e.stopPropagation(); setShowNotifications(false); onOpenBroadcast?.(); }} className="text-[10px] uppercase font-bold text-white bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded-full shadow-sm">Kirim Broadcast</button>
                        )}
                        {unreadCount > 0 && <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-100 px-2.5 py-1 rounded-full shadow-sm">{unreadCount} Baru</span>}
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto no-scrollbar">
                      {notifications.length > 0 ? notifications.map((n, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                          onClick={() => {
                            if (onNotificationClick) {
                               onNotificationClick(n);
                            } else {
                               alert(`Dibuat/Diupdate oleh: ${n.updaterName || 'Sistem'}\n\nModul: ${n.resource || 'Umum'}\n\n${n.message}`);
                            }
                            setShowNotifications(false);
                          }}
                          className="p-4 border-b border-gray-50 cursor-pointer group transition-all"
                        >
                          <div className="flex items-start gap-3">
                             <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${n.read ? 'bg-gray-200' : 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]'}`}></div>
                             <div>
                               <p className="text-sm font-bold text-gray-800 group-hover:text-teal-600 transition-colors leading-tight">{n.title}</p>
                               <p className="text-xs text-gray-500 mt-1 leading-relaxed">{n.message}</p>
                               <p className="text-[10px] text-gray-400 mt-2 font-medium flex items-center gap-1.5">
                                  {new Date(n.time || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span className="text-teal-600 font-bold capitalize">{n.updaterName || 'Sistem'}</span>
                               </p>
                             </div>
                          </div>
                        </motion.div>
                      )) : (
                        <div className="p-10 flex flex-col items-center justify-center text-center opacity-70">
                          <icons.laporan className="w-12 h-12 text-gray-300 mb-3" />
                          <p className="text-sm text-gray-500 font-medium">Hore! Semua notifikasi sudah dibaca.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown Trigger */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-3 bg-white pl-2 pr-4 py-1.5 rounded-full border border-gray-200 shadow-sm cursor-pointer hover:border-teal-300 transition-all"
            >
              {user?.photo ? (
                 <img src={user.photo} alt="Profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-50" />
              ) : (
                 <ProfileAvatar size="9"/>
              )}
              <div className="hidden md:flex flex-col text-left">
                <span className="font-extrabold text-sm text-gray-800 leading-none">{user?.nama ? user.nama.split(' ')[0] : 'Admin'}</span>
                <span className="text-[10px] text-teal-600 font-bold uppercase tracking-wider mt-0.5">{user?.role === 'admin' ? 'Ketua RT' : 'Pengurus'}</span>
              </div>
              <svg className="hidden md:block w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </motion.div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] flex flex-col border border-white/20"
            >
              <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-md">
                <h3 className="font-extrabold text-gray-800 text-lg">Menu Pengurus</h3>
                <button onClick={() => setShowProfileModal(false)} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-full text-gray-500 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-all">✕</button>
              </div>
              <div className="p-0 overflow-y-auto w-full relative bg-slate-50">
                 <MobileProfilPage user={user} onLogout={() => { onLogout?.(); setShowProfileModal(false); }} onUpdateUser={(d) => { if(onUpdateUser) onUpdateUser(d); setShowProfileModal(false); }} />
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
    const handleUpdate = () => {
      fetchStats();
    };
    window.addEventListener('app_data_update', handleUpdate);
    return () => window.removeEventListener('app_data_update', handleUpdate);
  }, []);

  const formatter = new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 });
  const saldoFormatter = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
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

// --- 2. UPDATE: WebDateWidget (Kalender) ---
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
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][date.getMonth()];
  const bulanFull = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][date.getMonth()];
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
      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-br from-teal-600 via-teal-700 to-emerald-800 p-6 rounded-2xl shadow-lg text-white flex items-center justify-between cursor-pointer relative overflow-hidden group border border-teal-500/30"
        onClick={() => setShowCalendar(!showCalendar)}
      >
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl translate-y-10 -translate-x-10"></div>

        <div className="relative z-10">
          <p className="text-teal-100 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2 opacity-90">
            {hari}
            <motion.svg 
              animate={{ rotate: showCalendar ? 180 : 0 }} 
              transition={{ duration: 0.3 }}
              className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
            </motion.svg>
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-sm">{tanggal} <span className="text-teal-200">{bulan}</span> {tahun}</h2>
        </div>
        
        <div className="relative z-10 bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
          <span className="text-xl md:text-2xl font-black tracking-wider text-white drop-shadow-md">{waktu}</span>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {showCalendar && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 250, damping: 25 }}
            className="absolute top-full left-0 right-0 mt-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-6 lg:p-8 z-30 flex flex-col md:flex-row gap-8 transform-gpu"
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-extrabold text-gray-800 text-xl">{bulanFull} {tahun}</h3>
                 <span className="px-3 py-1 bg-teal-50 text-teal-600 text-xs font-bold rounded-full">{hari}</span>
              </div>
              <div className="grid grid-cols-7 gap-2 text-center mb-3">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                  <div key={d} className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 text-center">
                {blanks.map(b => <div key={`blank-${b}`} className="p-2"></div>)}
                {days.map(d => {
                  const hasEvent = events.some(e => {
                    const evD = new Date(e.date);
                    return evD.getDate() === d && evD.getMonth() === date.getMonth() && evD.getFullYear() === date.getFullYear();
                  });
                  const isSelected = d === selectedDateState;
                  const isToday = d === date.getDate();

                  return (
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      key={d} 
                      onClick={() => setSelectedDateState(d)}
                      className={`relative aspect-square flex items-center justify-center rounded-xl text-sm font-bold transition-all cursor-pointer border-2
                        ${isSelected ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 
                          isToday ? 'bg-teal-50 text-teal-700 border-teal-200' : 
                          'border-transparent text-gray-700 hover:bg-gray-50'}`}
                    >
                      {d}
                      {hasEvent && (
                        <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-400'}`}></div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8 flex flex-col min-h-[250px]">
              <div className="flex items-center gap-3 mb-5">
                 <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 font-black text-lg shadow-sm">{selectedDateState}</div>
                 <div>
                    <h3 className="font-extrabold text-gray-800 text-sm">Agenda Kegiatan</h3>
                    <p className="text-xs text-gray-500 font-medium">{bulanFull} {tahun}</p>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((e, idx) => (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="relative pl-4 border-l-2 border-orange-400">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-white border-2 border-orange-400"></div>
                      <div className="text-xs font-extrabold text-orange-600 bg-orange-50 inline-block px-2 py-0.5 rounded mb-1">{e.time || 'Waktu tidak ditentukan'}</div>
                      <div className="text-sm font-bold text-gray-800 leading-tight">{e.title}</div>
                      {e.location && (
                        <div className="text-[11px] font-medium text-gray-500 mt-1.5 flex items-start gap-1.5">
                          <svg className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          {e.location}
                        </div>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10 opacity-70">
                    <svg className="w-12 h-12 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                    <p className="text-xs font-bold text-gray-500">Kosong, tidak ada agenda</p>
                    <p className="text-[10px] mt-1">Gunakan waktu ini untuk bersantai.</p>
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


// --- 3. UPDATE: WebMediaSlider ---
const WebMediaSlider = () => {
  const [media, setMedia] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    apiFetch('/api/data/media').then(r => r.json()).then(d => {
      setMedia(d.data || []);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    if (media.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % media.length);
    }, 6000); // Diperlambat sedikit agar animasi zoom terasa
    return () => clearInterval(interval);
  }, [media.length]);

  if (media.length === 0) return null;

  return (
    <div className="bg-slate-900 rounded-3xl shadow-lg border border-gray-100 overflow-hidden relative w-full h-72 md:h-96 mb-8 group">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          src={media[currentIndex].imageUrl}
          alt={media[currentIndex].title}
          className="w-full h-full object-cover absolute inset-0"
        />
      </AnimatePresence>
      
      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent pointer-events-none" />
      
      <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col items-start">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={`tag-${currentIndex}`}
          className="bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm mb-3 uppercase tracking-widest"
        >
          Sorotan Warga
        </motion.div>
        <motion.h3 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={`title-${currentIndex}`}
          className="text-white font-black text-2xl md:text-3xl lg:text-4xl leading-tight line-clamp-2 drop-shadow-lg max-w-2xl"
        >
          {media[currentIndex].title}
        </motion.h3>
        
        {media[currentIndex].uploaderName && (
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} key={`desc-${currentIndex}`}
            className="text-white/80 text-xs md:text-sm font-semibold mt-2 flex items-center gap-2 drop-shadow"
          >
            <span className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-[10px] text-white">
              {media[currentIndex].uploaderName.charAt(0).toUpperCase()}
            </span>
            {media[currentIndex].uploaderName} 
            <span className="text-white/40">•</span> 
            {new Date(media[currentIndex].createdAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year:'numeric'})}
          </motion.p>
        )}
      </div>

      {/* Modern Progress Indicators */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-2 items-center">
        {media.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
            style={{ width: idx === currentIndex ? '32px' : '12px', backgroundColor: 'rgba(255,255,255,0.3)' }}
          >
            {idx === currentIndex && (
              <motion.div 
                layoutId="activeMediaIndicator"
                className="absolute inset-0 bg-teal-400" 
              />
            )}
          </button>
        ))}
      </div>
      
      {/* Navigation Arrows (Optional, appears on hover) */}
      <div className="absolute inset-y-0 left-4 right-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
        <button onClick={() => setCurrentIndex(prev => (prev === 0 ? media.length - 1 : prev - 1))} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 pointer-events-auto transition">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button onClick={() => setCurrentIndex(prev => (prev + 1) % media.length)} className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/30 pointer-events-auto transition">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
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
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[400px] text-left text-xs">
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

const WebMediaPage = ({ user }: { user: any }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full h-full min-h-[500px] overflow-auto">
    <div className="p-4 md:p-8 min-h-screen">
      <MobileMedia onBack={() => {}} currentUser={user} />
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

// --- UPDATE: MobileHeader ---
const MobileHeader = ({ notifications, onShowNotifications }: { notifications: any[], onShowNotifications: () => void }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      // Menggunakan sticky dan backdrop-blur agar terlihat modern saat halaman di-scroll
      className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 bg-white/85 backdrop-blur-xl border-b border-gray-100/50 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]"
    >
      {/* Area Logo */}
      <motion.div 
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2.5 cursor-pointer"
      >
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-1.5 rounded-xl shadow-sm border border-teal-400/30">
          {/* Memastikan warna logo di dalam box menjadi putih agar kontras */}
          <LogoCommunityIcon size="20" colorAccent="#ffffff" colorPrimary="#ffffff" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-extrabold leading-none tracking-tight text-gray-800" style={{ fontFamily: fontStyle }}>
            GUYUB <span className="text-teal-600">RUKUN</span>
          </span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Aplikasi Warga</span>
        </div>
      </motion.div>

      {/* Area Tombol Notifikasi */}
      <motion.button 
        whileTap={{ scale: 0.85 }}
        className="relative p-2.5 bg-slate-50 rounded-full border border-slate-100 shadow-sm active:bg-teal-50 transition-colors"
        onClick={onShowNotifications}
      >
        <icons.bell className="w-5 h-5 text-slate-600" />
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex h-4 w-4"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-500 border-2 border-white text-[8px] font-bold text-white shadow-sm">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.header>
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

const MobileQuickActions = ({ onActionClick }: { onActionClick: (action: string) => void }) => {
  // Setup variasi animasi framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 } // Waktu jeda antar ikon muncul
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 250, damping: 20 } }
  };

  return (
    <section className="px-5 mb-8">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-extrabold text-gray-800 text-sm">Layanan Warga</h3>
        <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-full cursor-pointer active:scale-95 transition-transform">Lihat Semua</span>
      </div>
      
      <motion.div 
        variants={containerVariants} 
        initial="hidden" 
        animate="show" 
        className="grid grid-cols-4 gap-y-5 gap-x-3 bg-white p-5 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100"
      >
        {quickActions.map((action, index) => (
          <motion.button 
            key={index} 
            variants={itemVariants}
            whileTap={{ scale: 0.85 }} // Mengecil saat ditekan
            onClick={() => onActionClick(action.name)} 
            className="flex flex-col items-center text-center gap-2.5 group outline-none"
          >
            {/* Box Ikon Modern */}
            <div className={`p-3.5 w-14 h-14 flex items-center justify-center rounded-[1.1rem] bg-gradient-to-br ${action.color} text-white shadow-md ${action.shadow} group-hover:shadow-lg transition-all relative overflow-hidden`}>
              {/* Efek kilauan cahaya (Shine effect) */}
              <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-white/30 transform -skew-x-12 group-hover:left-[200%] transition-all duration-700 ease-in-out"></div>
              
              {/* Ikon */}
              <action.icon className="w-6 h-6 relative z-10 drop-shadow-sm" />
            </div>
            
            {/* Teks Label */}
            <span className="text-[10px] font-extrabold text-slate-600 leading-tight group-hover:text-teal-600 transition-colors">
              {action.name}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
};

// --- UPDATE: MobileEvents (Widget Beranda) ---
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
          uploaderName: "Admin RT",
          desc: "Keseruan warga RT 01 bergotong royong."
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
    }, 5000);
    return () => clearInterval(interval);
  }, [mediaList.length]);

  const currentMedia = mediaList[activeMediaIndex] || null;

  // Calendar Logic
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
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
    <section className="px-5 mb-8 space-y-6">
      {/* 1. Mobile Media Slider (Modern Story Style) */}
      <motion.div 
        whileTap={{ scale: 0.98 }}
        className="bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden relative group cursor-pointer aspect-[4/3] w-full"
        onClick={() => onActionClick('Media')}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMediaIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {loadingMedia ? (
               <div className="w-full h-full bg-slate-200 animate-pulse"></div>
            ) : currentMedia && (
              <img src={currentMedia.imageUrl} alt={currentMedia.title} className="w-full h-full object-cover" />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress Bars ala Instagram Story */}
        {mediaList.length > 1 && !loadingMedia && (
          <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
            {mediaList.map((_, idx) => (
              <div key={idx} className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden backdrop-blur-sm">
                {idx === activeMediaIndex && (
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "100%" }} 
                    transition={{ duration: 5, ease: "linear" }} 
                    className="h-full bg-white rounded-full"
                  />
                )}
                {idx < activeMediaIndex && <div className="h-full bg-white rounded-full" />}
              </div>
            ))}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-5 text-white z-10">
          <div className="flex justify-between items-end w-full">
            <div className="flex-grow pr-2">
              <span className="px-2.5 py-1 mb-2 bg-teal-500/80 backdrop-blur-md text-[9px] font-extrabold rounded-md inline-block uppercase tracking-wider shadow-sm">Sorotan Warga</span>
              {loadingMedia ? (
                 <>
                    <div className="h-5 w-3/4 bg-white/30 animate-pulse rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-white/20 animate-pulse rounded"></div>
                 </>
              ) : (
                 <>
                    <h4 className="text-lg font-black leading-tight drop-shadow-md mb-1">{currentMedia?.title}</h4>
                    <p className="text-[10px] text-slate-200 font-medium line-clamp-2 drop-shadow">{currentMedia?.desc || `Oleh: ${currentMedia?.uploaderName}`}</p>
                 </>
              )}
            </div>
            
            {!loadingMedia && currentMedia && (
              <a href={currentMedia.imageUrl} download={currentMedia.title || 'foto'} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/40 text-white p-3 rounded-full backdrop-blur-md transition-all shadow-lg active:scale-90 flex-shrink-0" title="Unduh">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* 2. Mobile Calendar Widget */}
      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 p-5">
        <div className="flex justify-between items-center mb-5">
           <div className="flex flex-col">
             <div className="flex items-center gap-1.5">
               <select 
                 className="text-lg font-black text-slate-800 bg-transparent border-none outline-none cursor-pointer appearance-none p-0"
                 value={currentMonth}
                 onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
               >
                 {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
               </select>
               <select 
                 className="text-lg font-black text-teal-600 bg-transparent border-none outline-none cursor-pointer appearance-none p-0"
                 value={currentYear}
                 onChange={(e) => setCurrentYear(parseInt(e.target.value))}
               >
                 {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i).map(y => (
                   <option key={y} value={y}>{y}</option>
                 ))}
               </select>
             </div>
             <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-widest">Jadwal RT</p>
           </div>
           
           <motion.button 
             whileTap={{ scale: 0.9 }}
             onClick={() => onActionClick('Acara')}
             className="w-10 h-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center shadow-sm"
           >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
           </motion.button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center mb-3">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => <div key={d} className="text-[9px] font-extrabold text-slate-400 uppercase">{d}</div>)}
        </div>
        
        <div className="space-y-2">
          {weeks.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-2 text-center">
              {week.map((date, j) => {
                const isEvent = date && backendEvents.some(e => {
                  const d = new Date(e.date);
                  return d.getDate() === date && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                });
                const isSelected = selectedDate === date;
                const isToday = date === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                
                if (!date) return <div key={j} className="aspect-square"></div>;

                return (
                  <motion.div 
                    key={j} 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setSelectedDate(date)}
                    className={`relative aspect-square cursor-pointer flex flex-col items-center justify-center rounded-2xl text-xs font-bold transition-colors border-2 
                      ${isSelected ? 'bg-teal-600 text-white border-teal-600 shadow-md' : 
                        isToday ? 'bg-teal-50 text-teal-700 border-teal-200' : 
                        'border-transparent text-slate-700 hover:bg-slate-50'}`}
                  >
                    {date}
                    {isEvent && (
                      <div className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-orange-500'}`}></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Daftar Acara Hari Terpilih */}
        <div className="mt-6 space-y-3">
           {selectedDateEvents.map((item) => (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={item.id} className="flex gap-3 items-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex flex-col items-center justify-center shrink-0">
                 <span className="text-[10px] font-bold text-orange-600 uppercase">{monthNames[currentMonth].substring(0,3)}</span>
                 <span className="text-sm font-black text-orange-700">{selectedDate}</span>
              </div>
              <div className="flex-grow min-w-0">
                <h5 className="text-xs font-bold text-slate-800 truncate">{item.title}</h5>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.time || 'Sesuai jadwal'} • {item.desc}</p>
              </div>
            </motion.div>
           ))}
           {selectedDate && selectedDateEvents.length === 0 && (
             <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
               <p className="text-[10px] font-bold text-slate-400">Tidak ada agenda di tanggal ini.</p>
             </div>
           )}
        </div>
      </div>
    </section>
  );
};

const MobileBottomNav = ({ activeTab, onTabChange }: { activeTab: string, onTabChange: (tab: string) => void }) => (
  <motion.nav 
    initial={{ y: 50 }} 
    animate={{ y: 0 }} 
    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    // Efek glassmorphism tebal di bagian bawah
    className="flex justify-around items-center px-2 py-2 pb-6 bg-white/90 backdrop-blur-xl border-t border-gray-100/50 fixed bottom-0 left-0 right-0 z-50 w-full shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
  >
    {mobileNavItems.map((item) => {
      const isActive = activeTab === item.name;
      
      return (
        <motion.button 
          key={item.name} 
          whileTap={{ scale: 0.85 }}
          onClick={() => onTabChange(item.name)}
          className={`relative flex flex-col items-center gap-1 transition-all p-2.5 rounded-2xl w-16 ${isActive ? 'text-teal-600' : 'text-slate-400 hover:text-slate-500'}`}
        >
          {/* Active Indicator Melayang (Framer Motion Layout Animation) */}
          {isActive && (
            <motion.div 
              layoutId="bottomNavIndicator" 
              className="absolute inset-0 bg-teal-50 rounded-2xl -z-10" 
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          
          <motion.div
             animate={isActive ? { y: -2 } : { y: 0 }}
             transition={{ type: "spring", stiffness: 300 }}
          >
             <item.icon className={`w-6 h-6 ${isActive ? 'drop-shadow-sm' : ''}`} />
          </motion.div>
          <span className={`text-[10px] ${isActive ? 'font-extrabold' : 'font-semibold'}`}>
            {item.name}
          </span>
        </motion.button>
      );
    })}
  </motion.nav>
);

import { MobileMedia } from './MobileMedia';

// --- Simplified Inline Illustrations (as functional components) ---

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
  { name: 'Surat', icon: icons.surat, color: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200' },
  { name: 'Lapor RT', icon: icons.laporanrt, color: 'from-rose-400 to-red-500', shadow: 'shadow-rose-200' },
  { name: 'Dokumen', icon: icons.dokumen, color: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200' },
  { name: 'Media', icon: icons.media, color: 'from-purple-400 to-fuchsia-500', shadow: 'shadow-purple-200' },
  { name: 'Iuran', icon: icons.iuran, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-200' },
  { name: 'Kas', icon: icons.kas, color: 'from-cyan-400 to-blue-500', shadow: 'shadow-cyan-200' },
  { name: 'Sedekah', icon: icons.sedekah, color: 'from-pink-400 to-rose-500', shadow: 'shadow-pink-200' },
  { name: 'Data Warga', icon: icons.warga, color: 'from-violet-400 to-purple-500', shadow: 'shadow-violet-200' },
  { name: 'UMKM', icon: icons.umkm, color: 'from-yellow-400 to-amber-500', shadow: 'shadow-yellow-200' },
  { name: 'Darurat', icon: icons.darurat, color: 'from-red-500 to-rose-600', shadow: 'shadow-red-200' },
  { name: 'Tamu', icon: icons.warga, color: 'from-sky-400 to-indigo-500', shadow: 'shadow-sky-200' },
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
    address: user?.alamat || '',
    phone: user?.noHp || '0812-3456-7890',
    role: user?.role === 'admin' ? 'Ketua RT 01 / RW 21' : (user?.status || 'Warga Tetap'),
    photo: user?.photo || null as string | null,
    umur: user?.umur || '',
    tglLahir: user?.tglLahir || ''
  });

  const parsedBlokMatch = (user?.alamat || '').match(/Blok\s+([a-zA-Z0-9]+)/i);
  const parsedNoMatch = (user?.alamat || '').match(/No\.\s+([a-zA-Z0-9]+)/i);
  const [profileBlok, setProfileBlok] = useState(parsedBlokMatch ? parsedBlokMatch[1] : '');
  const [profileNomor, setProfileNomor] = useState(parsedNoMatch ? parsedNoMatch[1] : '');

  useEffect(() => {
    if (profileBlok || profileNomor) {
      setProfile(prev => ({...prev, address: `Blok ${profileBlok} No. ${profileNomor}`}));
    }
  }, [profileBlok, profileNomor]);

  const calculateAge = (dob: string) => {
    if (!dob) return '';
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970).toString();
  };

  const handleTglLahirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tgl = e.target.value;
    setProfile({...profile, tglLahir: tgl, umur: calculateAge(tgl)});
  };

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
        setSuccessMsg('✅ Profil berhasil diperbarui!');
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
        setSuccessMsg('🔒 Password berhasil diganti');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        setPasswordError(data.error || 'Gagal mengubah password');
      }
    } catch (e) {
      setPasswordError('Terjadi kesalahan sistem');
    }
    setSavingPass(false);
  };

  // ================= VIEW: UBAH PASSWORD =================
  if (isChangingPass) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 pb-32 min-h-[80vh] bg-slate-50 w-full relative">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setIsChangingPass(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <icons.arrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Keamanan Akun</h2>
          <div className="w-10"></div> {/* Spacer */}
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 space-y-5">
           <div className="text-center mb-6">
             <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-3">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
             </div>
             <h3 className="font-extrabold text-slate-800 text-lg">Buat Password Baru</h3>
             <p className="text-xs text-slate-500 mt-1 font-medium">Gunakan kombinasi yang aman dan mudah diingat.</p>
           </div>

           {passwordError && (
             <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl text-center">
               {passwordError}
             </div>
           )}

           <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">Password Lama</label>
              <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl text-sm font-semibold outline-none transition-all" />
           </div>
           <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">Password Baru</label>
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl text-sm font-semibold outline-none transition-all" />
           </div>
           <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">Ulangi Password Baru</label>
              <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl text-sm font-semibold outline-none transition-all" />
           </div>

           <button onClick={handleUpdatePassword} disabled={savingPass} className="w-full mt-4 py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl text-sm font-extrabold shadow-md hover:shadow-lg transition-all disabled:opacity-50 active:scale-[0.98]">
             {savingPass ? 'Memproses...' : 'Simpan Password'}
           </button>
        </div>
      </motion.div>
    );
  }

  // ================= VIEW: EDIT PROFIL =================
  if (isEditing) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="p-5 pb-32 min-h-screen bg-slate-50 w-full relative">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setIsEditing(false)} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <icons.arrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-extrabold text-slate-800 tracking-tight">Edit Profil</h2>
          <button onClick={handleSave} disabled={saving} className="text-xs text-white bg-teal-600 px-4 py-2 rounded-full font-bold shadow-sm active:scale-95 transition-transform disabled:opacity-50">
            {saving ? '...' : 'Simpan'}
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 relative">
               {profile.photo ? (
                  <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                  <ProfileAvatar size="24"/>
               )}
               {/* Overlay Camera Icon on Hover */}
               <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                 <icons.media className="w-6 h-6 text-white"/>
               </div>
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-teal-600 border-2 border-white rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-teal-700 transition-colors">
               <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
               <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>
          <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase tracking-wider">Ubah Foto Anda</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 space-y-4">
            <div>
               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">Nama Lengkap</label>
               <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl text-sm font-bold text-slate-800 outline-none transition-all" />
            </div>
            <div>
               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">Peran / Status</label>
               <select value={profile.role} onChange={e => setProfile({...profile, role: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl text-sm font-bold text-slate-800 outline-none appearance-none transition-all">
                 <option value="">Pilih Status</option>
                 <option value="Warga Tetap">Warga Tetap</option>
                 <option value="Warga Sementara (Kontrak)">Warga Sementara (Kontrak)</option>
               </select>
            </div>
            <div className="flex gap-3">
               <div className="flex-1">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">Blok Rumah</label>
                 <select value={profileBlok} onChange={e => setProfileBlok(e.target.value)} className="w-full p-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl text-sm font-bold text-slate-800 outline-none appearance-none transition-all">
                   <option value="">Pilih</option>
                   {['A','B','C','D','E','F','G'].map(b => <option key={b} value={b}>Blok {b}</option>)}
                 </select>
               </div>
               <div className="flex-1">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">No. Rumah</label>
                 <input type="text" value={profileNomor} onChange={e => setProfileNomor(e.target.value)} placeholder="Cth: 12" className="w-full p-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl text-sm font-bold text-slate-800 outline-none transition-all" />
               </div>
            </div>
            <div>
               <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">Nomor Ponsel</label>
               <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl text-sm font-bold text-slate-800 outline-none transition-all" />
            </div>
            <div className="flex gap-3">
              <div className="flex-[2]">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">Tanggal Lahir</label>
                 <input type="date" value={profile.tglLahir} onChange={handleTglLahirChange} className="w-full p-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-100 rounded-xl text-sm font-bold text-slate-800 outline-none transition-all" />
              </div>
              <div className="flex-1">
                 <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide ml-1 mb-1.5">Umur</label>
                 <input type="text" value={profile.umur ? `${profile.umur} th` : ''} readOnly className="w-full p-3.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-500 outline-none cursor-not-allowed text-center" placeholder="-" />
              </div>
            </div>
        </div>
      </motion.div>
    );
  }

  // ================= VIEW: PROFIL UTAMA =================
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col w-full min-h-screen bg-slate-50 pb-28">
      
      {/* Absolute Header Background */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-700 rounded-b-[3rem] shadow-lg overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.05] rounded-full translate-x-20 -translate-y-20 blur-2xl"></div>
         <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-300 opacity-20 rounded-full -translate-x-16 translate-y-16 blur-2xl"></div>
      </div>

      <div className="relative z-10 px-5 pt-8 flex flex-col items-center">
        {/* Sukses Alert Dinamis */}
        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-2 left-5 right-5 bg-white/90 backdrop-blur-md border border-emerald-100 shadow-xl text-emerald-700 px-4 py-3 rounded-2xl text-sm font-bold text-center z-50">
              {successMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profil Avatar (Hero) */}
        <div className="relative mt-8">
          <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-slate-100">
             {profile.photo ? (
                <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <ProfileAvatar size="28"/>
             )}
          </div>
          <div className="absolute bottom-1 right-2 w-6 h-6 bg-emerald-400 border-2 border-white rounded-full flex items-center justify-center shadow-sm">
             <div className="w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>

        {/* Info Singkat */}
        <div className="text-center mt-5 text-white drop-shadow-md">
          <h2 className="text-2xl font-extrabold tracking-tight">{profile.name}</h2>
          <div className="inline-flex items-center gap-1.5 mt-2 bg-white/20 backdrop-blur-sm px-3.5 py-1 rounded-full border border-white/20">
             <svg className="w-3.5 h-3.5 text-teal-100" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
             <span className="text-xs font-bold uppercase tracking-wider">{profile.role}</span>
          </div>
        </div>
      </div>

      {/* Konten Data Profil (Kartu Melayang) */}
      <div className="relative z-10 px-5 w-full mt-8">
        
        {/* Tombol Aksi Cepat */}
        <div className="flex gap-3 mb-6">
           <button onClick={() => setIsEditing(true)} className="flex-1 py-3.5 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-teal-600 font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors border border-slate-100">
             <icons.edit className="w-4 h-4"/> Edit Profil
           </button>
           <button onClick={() => setIsChangingPass(true)} className="flex-1 py-3.5 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] text-slate-700 font-extrabold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors border border-slate-100">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg> 
             Password
           </button>
        </div>

        {/* Kartu Informasi Lengkap */}
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden divide-y divide-slate-50">
          <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            </div>
            <div className="flex-grow min-w-0">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alamat Lengkap</p>
               <p className="text-sm font-extrabold text-slate-800 truncate mt-0.5">{profile.address || 'Belum diatur'}</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shrink-0">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </div>
            <div className="flex-grow min-w-0">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nomor Ponsel</p>
               <p className="text-sm font-extrabold text-slate-800 mt-0.5">{profile.phone || '-'}</p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
            <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center shrink-0">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z"/></svg>
            </div>
            <div className="flex-grow min-w-0">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Umur</p>
               <p className="text-sm font-extrabold text-slate-800 mt-0.5">{profile.umur ? `${profile.umur} Tahun` : 'Belum diatur'}</p>
            </div>
          </div>
        </div>

        {/* Tombol Logout */}
        <button onClick={onLogout} className="w-full mt-6 py-4 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-2xl text-sm font-extrabold transition-colors shadow-sm flex justify-center items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Keluar Aplikasi
        </button>
      </div>

    </motion.div>
  );
};


const MobileSedekah = ({ onBack, user }: { onBack: () => void; user?: any }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text.replace(/\s/g, '')); // Hapus spasi saat disalin
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const bankAccounts = [
    {
      id: 'bsi',
      bankName: 'Bank Syariah Indonesia (BSI)',
      accountNumber: '712 345 6789',
      owner: 'a.n DKM Masjid Al Ikhlas',
      themeText: 'text-emerald-700',
      themeBg: 'bg-emerald-50',
    },
    {
      id: 'mandiri',
      bankName: 'Bank Mandiri',
      accountNumber: '137 00 1234567 8',
      owner: 'a.n DKM Masjid Al Ikhlas',
      themeText: 'text-blue-700',
      themeBg: 'bg-blue-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 pb-28 font-sans">
      {/* Header & Back Button */}
      <div className="flex flex-col mb-6 space-y-3">
        <button
          onClick={onBack}
          className="w-fit text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali
        </button>
        <h3 className="font-extrabold text-gray-900 text-xl tracking-tight">
          Sedekah & Infaq
        </h3>
        <p className="text-gray-500 text-xs">Salurkan donasi terbaik Anda untuk operasional dan kemakmuran Masjid Al Ikhlas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
        {/* Card QRIS */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center relative overflow-hidden group">
          {/* Latar Belakang Dekoratif */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-50 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>

          <div className="flex items-center gap-2 mb-4 z-10">
            <h4 className="font-extrabold text-gray-800 text-sm tracking-wide">Scan QRIS</h4>
            <span className="bg-teal-100 text-teal-700 text-[9px] font-bold px-2 py-0.5 rounded-full">Otomatis</span>
          </div>
          
          {/* Area QR Code (Stylized) */}
          <div className="relative w-52 h-52 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 mb-5 z-10 flex items-center justify-center">
            {/* Sudut Frame Scanner */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-teal-500 rounded-tl-xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-teal-500 rounded-tr-xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-teal-500 rounded-bl-xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-teal-500 rounded-br-xl"></div>
            
            {/* Mock QR instance (Ganti dengan gambar QR asli menggunakan tag <img>) */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 w-full h-full flex flex-col items-center justify-center rounded-lg transition-transform group-hover:scale-[1.02]">
              <svg className="w-10 h-10 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              <span className="text-gray-400 font-mono text-[10px] font-semibold tracking-widest">QRIS CODE</span>
            </div>
          </div>

          <div className="z-10">
            <p className="text-xs font-bold text-gray-800 mb-0.5">DKM MASJID AL IKHLAS</p>
            <p className="text-[10px] text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded-md inline-block">NMID: ID1234567890</p>
          </div>
        </div>

        {/* Card Transfer Bank */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-gray-800 text-sm mb-1 px-1">Transfer Manual</h4>
          
          {bankAccounts.map((bank) => (
            <div key={bank.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  {/* Ikon Bank */}
                  <div className={`w-10 h-10 ${bank.themeBg} ${bank.themeText} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1 font-medium">{bank.bankName}</p>
                    <p className="font-extrabold text-gray-900 text-sm tracking-wide">{bank.accountNumber}</p>
                    <p className={`text-[10px] font-bold ${bank.themeText} mt-1.5 inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded`}>
                      {bank.owner}
                    </p>
                  </div>
                </div>

                {/* Tombol Salin */}
                <button
                  onClick={() => handleCopy(bank.accountNumber, bank.id)}
                  className={`px-3 py-2 text-[10px] font-bold rounded-xl transition-all flex items-center gap-1.5 flex-shrink-0
                    ${copiedId === bank.id 
                      ? 'bg-green-500 text-white shadow-sm shadow-green-200' 
                      : 'bg-gray-50 text-gray-600 hover:bg-teal-50 hover:text-teal-600 border border-gray-100'
                    }`}
                >
                  {copiedId === bank.id ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Tersalin
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Salin
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BroadcastModalView = ({ onClose, onSuccess, user }: { onClose: () => void, onSuccess: () => void, user: any }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return alert("Pesan tidak boleh kosong");
    setLoading(true);
    try {
       const res = await apiFetch('/api/broadcast', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ title, message, updaterName: user?.nama || 'Admin' })
       });
       if(res.ok) {
         onSuccess();
         onClose();
       } else {
         alert("Gagal mengirim pesan broadcast.");
       }
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
       <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 font-bold bg-gray-50 p-2 rounded-full hover:bg-gray-100">X</button>
       <h2 className="text-xl font-extrabold text-gray-800 mb-2">Kirim Broadcast</h2>
       <p className="text-xs text-gray-500 mb-5">Pesan ini akan dikirimkan sebagai Notifikasi ke seluruh warga yang terdaftar.</p>
       
       <form onSubmit={handleSend} className="space-y-4">
         <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Judul Pengumuman</label>
            <input 
              type="text" 
              placeholder="Contoh: Info Kerja Bakti"
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              required
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
         </div>
         <div>
            <label className="text-sm font-bold text-gray-700 block mb-1">Isi Pesan</label>
            <textarea 
              rows={4} 
              placeholder="Tulis pesan pengumuman..."
              value={message} 
              onChange={e => setMessage(e.target.value)} 
              required
              className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            />
         </div>
         <button 
           type="submit" 
           disabled={loading}
           className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex justify-center items-center gap-2"
         >
           {loading ? 'Mengirim...' : (
             <>
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
               Kirim Pesan ke Semua Warga
             </>
           )}
         </button>
       </form>
    </div>
  );
};

// --- Main Combined View ---
function MainApp({ user, onLogout, onUpdateUser }: { user: any; onLogout: () => void; onUpdateUser: (updatedData: any) => void }) {
  const [activeWebTab, setActiveWebTab] = useState('Dashboard');
  const [activeMobileTab, setActiveMobileTab] = useState('Beranda');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const prevNotifIds = React.useRef<Set<string>>(new Set());
  const isInitialLoad = React.useRef(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch('/api/notifications');
      const data = await res.json();
      const newNotifs = data.notifications || [];

      if ("Notification" in window && Notification.permission === "granted" && !isInitialLoad.current) {
        newNotifs.forEach((n: any) => {
          if (!n.read && !prevNotifIds.current.has(n.id)) {
             new Notification(n.title, { body: n.message });
             try {
                const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
                audio.play().catch(e => console.log('Autoplay blocked:', e));
             } catch (e) {}
          }
        });
      }

      prevNotifIds.current = new Set(newNotifs.map((n: any) => n.id));
      isInitialLoad.current = false;
      setNotifications(newNotifs);
    } catch(e) { console.error(e); }
  };

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    fetchNotifications();
    
    const source = new EventSource('/api/stream');
    source.addEventListener('update', (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'notifications') {
        fetchNotifications();
      }
      window.dispatchEvent(new CustomEvent('app_data_update', { detail: data.type }));
    });
    
    return () => source.close();
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
      <div className="hidden md:flex relative z-10 w-full h-full">
        <WebSidebar activeTab={activeWebTab} onTabChange={setActiveWebTab} />
        <div className="flex flex-col flex-grow w-full h-full overflow-hidden">
          <WebHeader 
            user={user} 
            onLogout={onLogout} 
            onUpdateUser={onUpdateUser} 
            notifications={notifications} 
            onShowNotifications={handleShowNotifications} 
            onOpenBroadcast={() => setShowBroadcastModal(true)}
            onNotificationClick={(n) => {
               alert(`Dibuat/Diupdate oleh: ${n.updaterName || 'Sistem'}\n\nModul: ${n.resource || 'Umum'}\n\n${n.message}`);
               if (n.resource) {
                  const mod = n.resource.charAt(0).toUpperCase() + n.resource.slice(1);
                  setActiveWebTab(mod === 'Warga' ? 'Data Warga' : mod === 'Surat' ? 'Surat Pengantar' : mod);
                  setActiveMobileTab(mod === 'Warga' ? 'Data Warga' : mod === 'Surat' ? 'Layanan' : mod);
               }
            }}
          />
          <main className="flex-grow p-4 lg:p-8 overflow-y-auto ml-20 lg:ml-[16rem] transition-all duration-300" style={{ backgroundColor: themeColors.neutral.bg }}>
            {!user.isApproved ? (
              <div className="flex flex-col items-center justify-center p-12 mt-20 text-center bg-white rounded-2xl shadow-sm border border-gray-100 max-w-lg mx-auto">
                <icons.dokumen className="w-20 h-20 text-gray-300 mb-6" />
                <h2 className="text-2xl font-bold text-teal-600 mb-3">Akun Belum Aktif</h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-8">Akun Anda sedang diverifikasi atau dinonaktifkan oleh Ketua RT. Harap hubungi Ketua RT untuk akses fitur dalam aplikasi.</p>
                <button onClick={() => window.open(`https://wa.me/`, '_blank')} className="px-8 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-sm hover:bg-teal-700 transition">Hubungi Pengurus / RT</button>
              </div>
            ) : activeWebTab === 'Dashboard' && (
              <>
                <WebStatsCards/>
                <WebMediaSlider/>
                <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
                  <WebDateWidget/>
                  <WebLaporanTable/>
                  <WebIuranChart/>
                </div>
              </>
            )}
            {user.isApproved && activeWebTab === 'Warga' && <WebWargaPage user={user} />}
            {user.isApproved && activeWebTab === 'Iuran' && <WebIuranPage user={user} />}
            {user.isApproved && activeWebTab === 'Kas' && <WebKasPage user={user} />}
            {user.isApproved && activeWebTab === 'Dokumen' && <WebDokumenPage user={user} onUpdateUser={onUpdateUser} />}
            {user.isApproved && activeWebTab === 'Laporan' && <WebLaporanPage user={user} />}
            {user.isApproved && activeWebTab === 'Pengumuman' && <WebPengumumanPage user={user} />}
            {user.isApproved && activeWebTab === 'Media' && <WebMediaPage user={user} />}
            {user.isApproved && activeWebTab === 'UMKM' && <WebUMKMPage user={user} />}
            {user.isApproved && activeWebTab === 'Tamu' && <WebTamuPage user={user} />}
            {user.isApproved && activeWebTab === 'Pengaturan' && <WebPengaturanPage user={user} onLogout={onLogout} />}
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
              {activeMobileTab === 'Profil' ? (
                <MobileProfilPage user={user} onLogout={onLogout} onUpdateUser={onUpdateUser} />
              ) : !user.isApproved ? (
                <div className="flex flex-col items-center justify-center p-8 mt-20 text-center">
                  <icons.dokumen className="w-16 h-16 text-gray-300 mb-4" />
                  <h2 className="text-lg font-bold text-teal-600 mb-2">Akun Belum Aktif</h2>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-[200px] mb-6">Akun Anda sedang diverifikasi atau dinonaktifkan oleh Ketua RT. Harap hubungi Ketua RT untuk akses fitur warga.</p>
                  <button onClick={() => window.open(`https://wa.me/`, '_blank')} className="w-full max-w-[200px] py-3 bg-teal-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-teal-700 transition">Hubungi Pengurus / RT</button>
                </div>
              ) : (
                <>
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
                  {activeMobileTab === 'Laporan' && <MobileLaporan onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
                  {activeMobileTab === 'Surat' || activeMobileTab === 'Surat Pengantar' ? <MobileSuratPengantar onBack={() => setActiveMobileTab('Beranda')} currentUser={user} /> : null}
                  {activeMobileTab === 'Iuran' && <MobileIuran onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
                  {activeMobileTab === 'Kas' && <MobileKas onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
                  {activeMobileTab === 'Sedekah' && <MobileSedekah onBack={() => setActiveMobileTab('Beranda')} user={user} />}
                  {activeMobileTab === 'UMKM' || activeMobileTab === 'UMKM Warga' ? <MobileUMKM onBack={() => setActiveMobileTab('Beranda')} currentUser={user} /> : null}
                  {activeMobileTab === 'Lapor RT' && <MobileLaporRT onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
                  {activeMobileTab === 'Data Warga' && <MobileDataWarga onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
                  {activeMobileTab === 'Media' && <MobileMedia onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
                  {activeMobileTab === 'Darurat' && <MobileDarurat onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}
                  {activeMobileTab === 'Dokumen' && <MobileDokumen onBack={() => setActiveMobileTab('Beranda')} currentUser={user} onUpdateUser={onUpdateUser} />}
                  {activeMobileTab === 'Tamu' && <MobileTamu onBack={() => setActiveMobileTab('Beranda')} currentUser={user} />}

                  {/* Fallback for unrecognized tabs */}
                  {!['Beranda', 'Acara', 'Laporan', 'Surat', 'Surat Pengantar', 'Iuran', 'Kas', 'Sedekah', 'UMKM Warga', 'UMKM', 'Lapor RT', 'Data Warga', 'Media', 'Darurat', 'Dokumen', 'Tamu'].includes(activeMobileTab) && (
                    <div className="flex flex-col items-center justify-center h-full opacity-50 py-20">
                      <icons.dashboard className="w-12 h-12 text-gray-300 mb-3" />
                      <h2 className="text-lg font-semibold text-gray-500">Halaman {activeMobileTab}</h2>
                      <p className="text-xs text-gray-400 mb-4">Fitur ini dalam pengembangan.</p>
                      <button className="px-4 py-2 border rounded-full text-xs text-gray-600" onClick={() => setActiveMobileTab('Beranda')}>Kembali</button>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <MobileBottomNav activeTab={activeMobileTab} onTabChange={setActiveMobileTab} />
        
        {showNotifications && (
          <div className="absolute inset-0 bg-black/50 z-50 flex justify-end flex-col">
            <div className="bg-white rounded-t-3xl min-h-[50%] max-h-[80%] flex flex-col">
               <div className="flex justify-between items-center p-5 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-800">Notifikasi</h3>
                    {user?.role === 'admin' && (
                       <button onClick={() => { setShowNotifications(false); setShowBroadcastModal(true); }} className="text-[10px] uppercase font-bold text-white bg-teal-600 hover:bg-teal-700 px-2.5 py-1 rounded-full shadow-sm">Kirim Broadcast</button>
                    )}
                  </div>
                  <button onClick={() => setShowNotifications(false)} className="text-gray-400 font-bold p-2 bg-gray-50 rounded-full">X</button>
               </div>
               <div className="overflow-y-auto p-4 space-y-3 pb-8">
                  {notifications.map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                         alert(`Dibuat/Diupdate oleh: ${n.updaterName || 'Sistem'}\n\nModul: ${n.resource || 'Umum'}\n\n${n.message}`);
                         if (n.resource && typeof setActiveMobileTab === 'function') {
                            const mod = n.resource.charAt(0).toUpperCase() + n.resource.slice(1);
                            setActiveWebTab(mod === 'Warga' ? 'Data Warga' : mod === 'Surat' ? 'Surat Pengantar' : mod);
                            setActiveMobileTab(mod === 'Warga' ? 'Data Warga' : mod === 'Surat' ? 'Layanan' : mod);
                         }
                         setShowNotifications(false);
                      }}
                      className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm flex items-start gap-3 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    >
                       <div className="p-2 bg-teal-50 text-teal-600 rounded-full shrink-0">
                         <icons.bell className="w-4 h-4"/>
                       </div>
                       <div>
                         <h5 className="text-xs font-bold text-gray-800">{n.title}</h5>
                         <p className="text-[10px] text-gray-600 mt-0.5">{n.message}</p>
                         <span className="text-[8px] font-medium text-gray-400 mt-1 flex items-center gap-1">
                           {new Date(n.time || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                           <span>•</span>
                           <span className="text-teal-600 font-bold capitalize">{n.updaterName || 'Sistem'}</span>
                         </span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}
      </div>
      )}

      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
           <BroadcastModalView 
              user={user} 
              onClose={() => setShowBroadcastModal(false)} 
              onSuccess={() => {
                 fetchNotifications();
                 alert("Broadcast berhasil dikirim ke semua warga!");
              }} 
           />
        </div>
      )}
    </div>
  );
}

import { Login, Register } from './Auth';

export default function App() {
  const [user, setUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  const handleUpdateUser = (updatedData: any) => {
    const newUser = { ...user, ...updatedData };
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
  };
  
  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
  };

  useEffect(() => {
    if (!user?.id) return;
    
    // Initial ping
    apiFetch('/api/ping', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id }) });
    
    // Heartbeat ping every 5 seconds
    const interval = setInterval(() => {
      apiFetch('/api/ping', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id }) });
    }, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [user]);

  const handleLogout = async () => {
    if (user?.id) {
      try {
        await apiFetch('/api/logout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: user.id }) });
      } catch (e) {}
    }
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  if (!user) {
    if (authView === 'login') {
      return <Login onLogin={handleLogin} onNavRegister={() => setAuthView('register')} />;
    }
    return <Register onRegister={handleLogin} onNavLogin={() => setAuthView('login')} />;
  }

  return <MainApp user={user} onLogout={handleLogout} onUpdateUser={handleUpdateUser} />;
}
