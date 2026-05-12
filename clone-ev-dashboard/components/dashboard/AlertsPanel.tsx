'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { AlertTriangle, AlertCircle, ChevronRight, CheckCircle2 } from 'lucide-react';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'High' | 'Medium' | 'Resolved';
  action: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Cell Overvoltage',
    description: 'Cell block 4 experiencing voltage spike above threshold (4.2V).',
    severity: 'High',
    action: 'Initiate Balancing',
  },
  {
    id: '2',
    title: 'Thermal Anomaly',
    description: 'Cooling system efficiency dropped by 12% in the last hour.',
    severity: 'Medium',
    action: 'Run Diagnostics',
  },
  {
    id: '3',
    title: 'Low SoC Warning',
    description: 'Battery capacity reached below 20%.',
    severity: 'Resolved',
    action: 'View Log',
  }
];

export function AlertsPanel({ liveAlerts = [] }: { liveAlerts?: Alert[] }) {
  const [filter, setFilter] = useState<'All' | 'High' | 'Medium' | 'Resolved'>('All');

  const combinedAlerts = [...liveAlerts, ...mockAlerts];
  const filteredAlerts = combinedAlerts.filter(a => filter === 'All' || a.severity === filter);

  return (
    <Card className="col-span-full lg:col-span-1 h-[450px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold text-white">Critical Alerts</h2>
        </div>
        <div className="flex gap-2">
          {['All', 'High', 'Resolved'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors ${filter === f ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {filteredAlerts.map(alert => (
          <div key={alert.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 hover:bg-slate-800/80 transition-colors group">
            <div className="flex gap-3">
              <div className="mt-0.5">
                {alert.severity === 'High' && <AlertCircle className="w-5 h-5 text-red-400" />}
                {alert.severity === 'Medium' && <AlertTriangle className="w-5 h-5 text-yellow-400" />}
                {alert.severity === 'Resolved' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium text-slate-200">{alert.title}</h4>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border uppercase tracking-wider ${
                    alert.severity === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                    alert.severity === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                    'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3">{alert.description}</p>
                <div className="flex gap-2">
                  {alert.severity !== 'Resolved' && (
                    <Button variant="outline" size="sm" className="h-7 text-xs bg-slate-800 border-slate-600">
                      {alert.action}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" className="h-7 text-xs px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Details <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredAlerts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <CheckCircle2 className="w-8 h-8 mb-2 opacity-20" />
            <p className="text-sm">No alerts found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
