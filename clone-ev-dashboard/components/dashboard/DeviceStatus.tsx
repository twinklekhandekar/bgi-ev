import { Card, CardHeader, CardContent } from '../ui/Card';
import { Wifi, SignalHigh, Server, ShieldCheck, BatteryCharging } from 'lucide-react';

interface DeviceStatusProps {
  connectionStatus: 'Connected' | 'Disconnected';
  systemRisk: 'Low' | 'Medium' | 'High';
}

export function DeviceStatus({ connectionStatus, systemRisk }: DeviceStatusProps) {
  return (
    <Card className="col-span-full md:col-span-1 border-slate-700/50 flex flex-col justify-between">
      <CardHeader className="py-4 pb-0 border-b-0">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-slate-400" />
          Device Status
        </h2>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex flex-col gap-5">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${connectionStatus === 'Connected' ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20' : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'}`}>
               <Wifi className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">Connection</p>
              <p className="text-xs text-slate-400">{connectionStatus}</p>
            </div>
          </div>
          <div className="flex gap-0.5 items-end h-4">
             <div className="w-1 bg-green-500 rounded-sm h-2/5"></div>
             <div className="w-1 bg-green-500 rounded-sm h-3/5"></div>
             <div className="w-1 bg-green-500 rounded-sm h-4/5"></div>
             <div className="w-1 bg-green-500 rounded-sm h-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/30">
            <p className="text-xs text-slate-500 mb-1">Battery ID</p>
            <p className="text-sm font-mono font-medium text-slate-300">EV-BMS-092X</p>
          </div>
          <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/30">
            <p className="text-xs text-slate-500 mb-1">Firmware</p>
            <p className="text-sm font-mono font-medium text-slate-300">v4.2.1-stable</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div className="flex items-center gap-2">
            <ShieldCheck className={`w-4 h-4 ${systemRisk === 'Low' ? 'text-green-400' : 'text-yellow-400'}`} />
            <span className="text-sm text-slate-300">System Risk</span>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${systemRisk === 'Low' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
            {systemRisk}
          </span>
        </div>

      </CardContent>
    </Card>
  );
}
