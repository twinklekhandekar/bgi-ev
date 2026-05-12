'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BatteryChartProps {
  data: { time: string; soc: number; temp: number; voltage: number }[];
}

export function BatteryChart({ data }: BatteryChartProps) {
  const [metric, setMetric] = useState<'soc' | 'temp' | 'voltage'>('soc');
  const [timeframe, setTimeframe] = useState<'Live' | '24h' | '7d'>('Live');

  const configs = {
    soc: { color: '#3b82f6', label: 'State of Charge (%)', domain: [0, 100] },
    temp: { color: '#ef4444', label: 'Temperature (°C)', domain: [10, 50] },
    voltage: { color: '#8b5cf6', label: 'Voltage (V)', domain: [300, 450] },
  };

  return (
    <Card className="col-span-full h-[450px] flex flex-col">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4">
        <h2 className="text-lg font-semibold text-white">Telemetry Data</h2>
        
        <div className="flex flex-wrap items-center gap-3 md:gap-6">
          <div className="flex bg-slate-900 rounded-lg p-1 ring-1 ring-slate-700/50">
            {[
              { id: 'soc', label: 'SoC' },
              { id: 'temp', label: 'Temp' },
              { id: 'voltage', label: 'Voltage' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMetric(m.id as any)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${metric === m.id ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 border-l border-slate-700 pl-4 md:pl-6">
             {['Live', '24h', '7d'].map((t) => (
               <button
                 key={t}
                 onClick={() => setTimeframe(t as any)}
                 className={`text-xs px-2 border-b-2 pb-1 transition-colors ${timeframe === t ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
               >
                 {t}
               </button>
             ))}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 w-full p-2 pt-6 sm:p-6 sm:pt-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={configs[metric].domain}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: configs[metric].color }}
            />
            <Line 
              type="monotone" 
              dataKey={metric} 
              stroke={configs[metric].color} 
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 6, fill: configs[metric].color, stroke: '#1e293b', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
