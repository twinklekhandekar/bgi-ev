'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Search, Download, Filter } from 'lucide-react';

export function ActivityLogs({ speed, temperature, soc }: any) {
  const [filter, setFilter] = useState<'All' | 'Alerts' | 'System'>('All');
  const [logs, setLogs] = useState<any[]>([
    { id: 'L001', time: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'System Start', desc: 'EV Dashboard initialized successfully', status: 'Success', type: 'System' },
    { id: 'L002', time: new Date(Date.now() - 1800000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), event: 'AI Sync', desc: 'Connected to Render ML Model', status: 'Sync', type: 'System' },
  ]);

  const lastLogRefs = useRef({ speedOver100: false, tempOver28: false, socUnder20: false });

  useEffect(() => {
    const addLog = (event: string, desc: string, status: string, type: string) => {
      setLogs(prev => {
        const newLog = {
          id: `L${Date.now()}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          event, desc, status, type
        };
        return [newLog, ...prev].slice(0, 20); // Keep last 20 logs
      });
    };

    if (speed >= 100 && !lastLogRefs.current.speedOver100) {
      addLog('Overspeed Alert', `Speed crossed 100 km/h threshold`, 'Warning', 'Alerts');
      lastLogRefs.current.speedOver100 = true;
    } else if (speed < 100) {
      lastLogRefs.current.speedOver100 = false;
    }

    if (temperature > 28.5 && !lastLogRefs.current.tempOver28) {
      addLog('Thermal Warning', `Battery temperature rose to ${temperature}°C`, 'Warning', 'Alerts');
      lastLogRefs.current.tempOver28 = true;
    } else if (temperature <= 28.5) {
      lastLogRefs.current.tempOver28 = false;
    }

    if (soc <= 20 && !lastLogRefs.current.socUnder20) {
      addLog('Low SOC', `Battery level critically low at ${soc}%`, 'Warning', 'Alerts');
      lastLogRefs.current.socUnder20 = true;
    } else if (soc > 20) {
      lastLogRefs.current.socUnder20 = false;
    }

  }, [speed, temperature, soc]);

  const filteredLogs = logs.filter(l => filter === 'All' || l.type === filter);

  return (
    <Card className="col-span-full xl:col-span-2">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <h2 className="text-lg font-semibold text-white">Activity Logs</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-9 p-2 transition-all"
            />
          </div>
          
          <div className="flex bg-slate-900 rounded-lg p-1 ring-1 ring-slate-700/50">
            {['All', 'Alerts', 'System'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${filter === f ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {f}
              </button>
            ))}
          </div>

          <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2 border-slate-600 h-[34px]">
            <Download className="w-3.5 h-3.5" /> CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 font-medium">Timestamp</th>
              <th className="px-6 py-3 font-medium">Event Type</th>
              <th className="px-6 py-3 font-medium">Description</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/50 transition-colors group">
                <td suppressHydrationWarning className="px-6 py-4 whitespace-nowrap text-slate-300 font-mono text-xs">{log.time}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{log.event}</td>
                <td className="px-6 py-4 text-slate-400">{log.desc}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ring-1 ${
                    log.status === 'Success' ? 'bg-green-500/10 text-green-400 ring-green-500/20' :
                    log.status === 'Warning' ? 'bg-red-500/10 text-red-400 ring-red-500/20' :
                    'bg-blue-500/10 text-blue-400 ring-blue-500/20'
                  }`}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
