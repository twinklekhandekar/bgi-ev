import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Map, Navigation } from 'lucide-react';

interface RangeCardProps {
  range: number;
  accuracy: number;
}

export function RangeCard({ range, accuracy }: RangeCardProps) {
  return (
    <Card className="col-span-full lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700/50">
      <CardContent className="flex flex-col h-full justify-between gap-6">
        <div>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">Range Intelligence</h2>
              <p className="text-sm text-slate-400">Based on city conditions & driving habits</p>
            </div>
            <div className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full ring-1 ring-green-500/20">
              {accuracy}% Accuracy
            </div>
          </div>
          
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {range}
            </span>
            <span className="text-xl text-slate-400 font-medium">km</span>
          </div>
        </div>

        <div className="bg-slate-900/50 rounded-xl p-4 ring-1 ring-white/5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Destination: Office</span>
            <span className="text-green-400 font-medium font-mono">Reachable</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-green-400 h-1.5 rounded-full" style={{ width: '45%' }}></div>
          </div>
          <p className="text-xs text-slate-500 text-right">45km away • Takes 20% SoC</p>
        </div>

        <div className="flex gap-3 mt-auto">
          <Button className="flex-1 gap-2 bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)]">
            <Navigation className="w-4 h-4" /> Route Planner
          </Button>
          <Button variant="secondary" className="flex-1 gap-2">
            <Map className="w-4 h-4" /> View Trip Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
