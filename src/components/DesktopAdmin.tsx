import React from 'react';
import {
  LayoutDashboard, Users, Wallet, FileText, Megaphone,
  Store, Settings, Mail, Bell, Search, ChevronDown,
  TrendingUp, CircleChevronUp
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const chartData = [
  { name: 'Jan', value: 40000 },
  { name: 'Feb', value: 70000 },
  { name: 'Mar', value: 45000 },
  { name: 'Apr', value: 80000 },
  { name: 'May', value: 110000 },
  { name: 'Jun', value: 120000 },
];

export default function DesktopAdmin() {
  return (
    <div className="flex h-full w-full bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col pt-6 pb-4">
        {/* Logo */}
        <div className="px-6 mb-8 flex items-center gap-3">
          <div className="flex items-center justify-center text-teal-600">
            {/* Custom SVG approximating the logo */}
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 5C17.7909 5 16 6.79086 16 9C16 11.2091 17.7909 13 20 13C22.2091 13 24 11.2091 24 9C24 6.79086 22.2091 5 20 5Z" fill="#14b8a6"/>
              <path d="M25 21C22.7909 21 21 22.7909 21 25C21 27.2091 22.7909 29 25 29C27.2091 29 29 27.2091 29 25C29 22.7909 27.2091 21 25 21Z" fill="#f97316"/>
              <path d="M15 21C12.7909 21 11 22.7909 11 25C11 27.2091 12.7909 29 15 29C17.2091 29 19 27.2091 19 25C19 22.7909 17.2091 21 15 21Z" fill="#14b8a6"/>
              <path d="M20 15C16.9205 15 13.9749 15.6599 11.3323 16.8524C10.1557 17.383 9.48834 18.6653 9.87329 19.897C10.7417 22.6775 12.3929 25.1017 14.6186 26.9669C15.6576 27.838 17.1852 27.7997 18.2384 26.945C19.7424 25.7246 21.6888 25 23.75 25C24.4984 25 25.218 25.121 25.8953 25.3444..." fill="#0f766e"/>
              <path d="M8 20C8 16.91 9.43 14.15 11.66 12.35C13.88 10.55 16.8 9.5 20 9.5C23.2 9.5 26.12 10.55 28.34 12.35C30.57 14.15 32 16.91 32 20C32 23.09 30.57 25.85 28.34 27.65C26.12 29.45 23.2 30.5 20 30.5V28.5C22.61 28.5 25 27.64 26.83 26.15C28.66 24.66 29.82 22.45 29.98 20H32C31.84 23.36 30.34 26.37 28.08 28.49L28.08 28.49C28.08 28.49 28.08 28.49 28.08 28.49Z" fill="#14b8a6"/>
            </svg>
          </div>
          <div className="font-bold text-[1.1rem] leading-tight text-teal-900 tracking-tight">
            GUYUB <br /> RUKUN
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-teal-50 text-teal-700 font-medium">
            <LayoutDashboard size={20} />
            Dashboard
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium">
            <Users size={20} />
            Warga
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium">
            <Wallet size={20} />
            <span className="flex-1">Iuran</span>
            <span className="text-xs text-slate-400 font-normal">(Rp 4.5M)</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium">
            <FileText size={20} />
            Laporan
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium">
            <Megaphone size={20} />
            Pengumuman
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium">
            <Store size={20} />
            UMKM
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium">
            <Settings size={20} />
            Pengaturan
          </a>
        </nav>

        {/* Sidebar Illustration Placeholder */}
        <div className="px-6 mt-auto">
          <div className="h-32 rounded-xl bg-gradient-to-t from-orange-50 to-teal-50 flex items-end justify-center pb-2">
            <Users size={64} className="text-orange-200" />
            <Users size={48} className="text-teal-200 -ml-4" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white shrink-0 px-8 flex items-center justify-end gap-6 shadow-sm z-10">
          <button className="text-slate-400 hover:text-slate-600">
            <Mail size={20} />
          </button>
          <div className="relative">
            <button className="text-slate-400 hover:text-slate-600">
              <Bell size={20} />
            </button>
            <span className="absolute -top-1 -right-1 w-2h-2 bg-red-500 rounded-full w-2 h-2"></span>
          </div>
          
          <div className="flex items-center gap-3 border-l border-slate-200 pl-6 cursor-pointer">
            <img 
              src={`https://ui-avatars.com/api/?name=Adji&background=14b8a6&color=fff`} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full border border-slate-200"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-700">Halo, Bpk. <strong>Adji</strong></span>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Minimal Background Decoration for Dashboard */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-teal-50 to-white rounded-2xl p-8 border border-teal-100 flex items-center justify-between shadow-sm relative overflow-hidden">
              <div className="z-10 relative">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Halo, Admin RT 04!</h1>
                <p className="text-slate-500">Website Guyub Rukun Admin Dashboard (Web View)</p>
              </div>
              <div className="absolute right-0 bottom-0 top-0 w-80 opacity-60 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-multiply"></div>
              <div className="relative z-10 flex text-teal-600">
                <Users size={120} className="opacity-20 translate-y-6 translate-x-4" />
                <Users size={100} className="text-orange-500 opacity-20 translate-y-8 -translate-x-8" />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="font-medium">Warga</span>
                  <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                    <Users size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800 mb-2">358</div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="font-medium">Laporan</span>
                  <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                    <FileText size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800 flex items-baseline gap-2">
                    12 <span className="text-sm font-medium text-red-500">Baru</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="font-medium">Saldo Kas</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Wallet size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800">Rp 4,500,000</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between h-[120px]">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="font-medium">Iuran</span>
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                    <CircleChevronUp size={16} />
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-slate-800 mb-1">92% Lunas</div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                    <div className="bg-orange-400 h-1.5 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
              
              {/* Laporan Table */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800">Laporan Warga Terbaru</h3>
                  <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-700">View all</a>
                </div>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-medium">Name</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium text-right">Privacy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <tr>
                        <td className="py-4 font-medium text-slate-700">Jalan Rusak</td>
                        <td className="py-4 text-slate-500">Tergenang</td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                            Normal
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 font-medium text-slate-700">Tergenang Air</td>
                        <td className="py-4 text-slate-500">Tergenang</td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-100">
                            Normal
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-4 font-medium text-slate-700">Lampu Padam</td>
                        <td className="py-4 text-slate-500">Mati Total</td>
                        <td className="py-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                            Urgent
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-800 mb-6">Tren Iuran Bulanan</h3>
                <div className="w-full h-64 flex-1 mt-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        dy={10} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value) => [`Rp ${value}`, 'Total']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#14b8a6" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: '#14b8a6', strokeWidth: 2, stroke: '#fff' }} 
                        activeDot={{ r: 6, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
