'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Activity, 
  HeartPulse, 
  MapPin, 
  BrainCircuit, 
  Bell, 
  Settings, 
  LogOut,
  Menu,
  X,
  Zap
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  active: boolean;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation: SidebarItem[] = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, active: pathname === '/dashboard' },
    { name: 'Telemetry', href: '#', icon: Activity, active: pathname === '/dashboard/telemetry' },
    { name: 'Battery Health', href: '#', icon: HeartPulse, active: pathname === '/dashboard/health' },
    { name: 'Trip Planner', href: '#', icon: MapPin, active: pathname === '/dashboard/trip' },
    { name: 'AI Insights', href: '#', icon: BrainCircuit, active: pathname === '/dashboard/insights' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex overflow-hidden font-sans">
      
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/80 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_20px_-3px_rgba(59,130,246,0.7)] transition-shadow">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-widest uppercase">Volt<span className="text-blue-500">_OS</span></span>
          </Link>
          <button className="ml-auto lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Main Menu</p>
          {navigation.map((item) => (
            <Link 
               key={item.name} 
               href={item.href}
               className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${item.active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
               <item.icon className={`w-5 h-5 ${item.active ? 'text-white' : 'text-slate-500'}`} />
               <span className="font-medium text-sm">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800/80 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <Settings className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-sm">Settings</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors">
            <LogOut className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Navbar */}
        <header className="h-16 px-4 lg:px-8 border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-full border border-blue-500/20">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-widest">Live Sync</span>
            </div>
            
            <nav className="hidden md:flex ml-6">
               <ul className="flex space-x-1 border-b border-transparent">
                 {['Overview', 'Telemetry', 'Health', 'History'].map((tab, i) => (
                   <li key={tab}>
                     <a href="#" className={`block px-4 py-3 text-sm font-medium border-b-2 transition-colors ${i === 0 ? 'text-white border-blue-500' : 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-700'}`}>
                       {tab}
                     </a>
                   </li>
                 ))}
               </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 p-0.5 shadow-md cursor-pointer">
              <div className="w-full h-full bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
           {children}
        </main>
      </div>
      
      {/* Global CSS for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}} />
    </div>
  );
}
