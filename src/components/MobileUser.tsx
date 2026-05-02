import React from 'react';
import { 
  Bell, Search, Home, List as ListIcon, User, Users,
  FileText, Megaphone, Wallet, Store, Calendar,
  ChevronRight, CheckCircle2
} from 'lucide-react';

export default function MobileUser() {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50 font-sans relative overflow-hidden max-w-md mx-auto shadow-2xl border-x border-slate-200">
      
      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        
        {/* Header Section (Green Background) */}
        <section className="bg-emerald-800 text-white rounded-b-[40px] px-6 pt-12 pb-16 relative">
          {/* Header Top */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-bold text-lg tracking-wide opacity-90">GUYUB RUKUN</h1>
            <div className="relative">
              <button className="bg-white/10 p-2 rounded-full backdrop-blur-sm">
                <Bell size={20} className="text-white" />
              </button>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-emerald-800"></span>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-4 mb-6">
            <img 
              src={`https://ui-avatars.com/api/?name=Adji&background=fff&color=166534`} 
              alt="Avatar" 
              className="w-12 h-12 rounded-full border-2 border-white/20"
            />
            <div>
              <h2 className="text-2xl font-bold">Halo, Bpk. Adji!</h2>
              <p className="text-emerald-100/70 text-sm">RT 04 / RW 01</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full z-10 bottom-[-32px]">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              className="w-full bg-white text-slate-800 rounded-full py-4 pl-12 pr-4 shadow-xl border border-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Search for actions..."
            />
          </div>
        </section>

        {/* Content Body */}
        <section className="px-6 mt-16 space-y-8">
          
          {/* Quick Actions Grid */}
          <div>
            <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-teal-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-teal-100">
                  <FileText className="text-teal-600" size={24} />
                </div>
                <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">Surat<br/>Pengantar</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-red-100">
                  <Megaphone className="text-red-500" size={24} />
                </div>
                <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">Lapor<br/>RT</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-orange-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-orange-100">
                  <Wallet className="text-orange-500" size={24} />
                </div>
                <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">Iuran</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                  <Store className="text-emerald-600" size={24} />
                </div>
                <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">UMKM<br/>Warga</span>
              </div>
            </div>
          </div>

          {/* Hero Banner Component */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200">
            <div className="h-32 bg-emerald-100 rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center group">
              {/* Fallback image if actual is missing */}
              <img 
                src="https://images.unsplash.com/photo-1593113511332-15f5ea6c4dcd?auto=format&fit=crop&w=600&q=80" 
                alt="Community Event" 
                className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent"></div>
              <span className="absolute bottom-3 left-3 bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-full font-medium">Volunteering</span>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg mb-1 leading-tight">Kerja Bakti Sambut Ramadhan</h3>
              <p className="text-emerald-600 text-sm font-medium mb-3">(Hari ini 07:00 WIB, Join!)</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img src="https://ui-avatars.com/api/?name=A&background=random" className="w-8 h-8 rounded-full border-2 border-white" alt="user" />
                  <img src="https://ui-avatars.com/api/?name=B&background=random" className="w-8 h-8 rounded-full border-2 border-white" alt="user" />
                  <img src="https://ui-avatars.com/api/?name=C&background=random" className="w-8 h-8 rounded-full border-2 border-white" alt="user" />
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">+12</div>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
                  Ikut Serta
                </button>
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="space-y-3 pb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-slate-800">Acara Mendatang</h3>
              <button className="text-emerald-600 text-sm font-medium">Lihat Semua</button>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center shrink-0 border border-rose-100">
                <Calendar size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">Sunatan Massal Gratis</h4>
                <p className="text-slate-500 text-xs mt-0.5">Sab 19 / 08:00 WIB</p>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0 border border-amber-100">
                <Users size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-sm">Rapat Rutin Pengurus</h4>
                <p className="text-slate-500 text-xs mt-0.5">Senin 7 / 19:30 WIB</p>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </div>
          </div>

        </section>
      </main>

      {/* Bottom Navigation Navbar */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
        <button className="flex flex-col items-center text-teal-600 gap-1 transition-colors">
          <Home size={24} className="fill-current" />
          <span className="text-[10px] font-semibold">Beranda</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-teal-600 gap-1 transition-colors">
          <ListIcon size={24} />
          <span className="text-[10px] font-medium">Aktivitas</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-teal-600 gap-1 transition-colors relative">
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          <Bell size={24} />
          <span className="text-[10px] font-medium">Notifikasi</span>
        </button>
        <button className="flex flex-col items-center text-slate-400 hover:text-teal-600 gap-1 transition-colors">
          <User size={24} />
          <span className="text-[10px] font-medium">Profil</span>
        </button>
      </nav>

    </div>
  );
}
