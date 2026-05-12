import { ReactNode } from 'react';
import { Card, CardContent } from '../ui/Card';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: ReactNode;
  statusColor?: 'green' | 'yellow' | 'red' | 'blue';
}

export function KpiCard({ title, value, subtitle, icon, statusColor = 'blue' }: KpiCardProps) {
  const colorMap = {
    green: 'text-green-400 bg-green-400/10',
    yellow: 'text-yellow-400 bg-yellow-400/10',
    red: 'text-red-400 bg-red-400/10',
    blue: 'text-blue-400 bg-blue-400/10',
  };

  const ringMap = {
    green: 'ring-green-400/20',
    yellow: 'ring-yellow-400/20',
    red: 'ring-red-400/20',
    blue: 'ring-blue-400/20',
  };

  return (
    <Card className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      <CardContent>
        <div className="flex justify-between items-start mb-4">
          <p className="text-slate-400 font-medium text-sm tracking-wide">{title}</p>
          <div className={`p-2 rounded-lg ring-1 ${ringMap[statusColor]} ${colorMap[statusColor]}`}>
            {icon}
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
          <p className="text-sm mt-2 text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${statusColor === 'green' ? 'bg-green-400' : statusColor === 'yellow' ? 'bg-yellow-400' : statusColor === 'red' ? 'bg-red-400' : 'bg-blue-400'}`}></span>
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
