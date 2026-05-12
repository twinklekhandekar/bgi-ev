import { Card, CardHeader, CardContent } from '../ui/Card';
import { BrainCircuit, TrendingUp, Cpu, Thermometer, Battery, ActivitySquare } from 'lucide-react';

export function AIInsights({ speed, soc, temperature, batteryAge, aiSoh }: any) {
  const insights = [];

  // Generate dynamic insights based on live simulated data
  if (speed > 80) {
    insights.push({
      id: 'speed-insight',
      title: 'Aerodynamic Drag Impact',
      explanation: `Current speed of ${speed} km/h is reducing efficiency by ~${Math.floor((speed - 80) * 0.4)}%. Lower speed to 80 km/h to optimize range.`,
      recommendation: 'Enable Eco Cruise',
      confidence: 92,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10'
    });
  }

  if (temperature > 28.5) {
    insights.push({
      id: 'temp-insight',
      title: 'Thermal Management Active',
      explanation: `Battery temperature is elevated (${temperature}°C). AI predicts cooling system will consume ~2.1 kWh over the next hour.`,
      recommendation: 'Pre-condition Cabin',
      confidence: 88,
      icon: Thermometer,
      color: 'text-red-400',
      bg: 'bg-red-400/10'
    });
  }

  if (soc <= 50) {
    insights.push({
      id: 'soc-insight',
      title: 'Optimal Charging Route',
      explanation: `Based on your current trajectory and ${soc}% SOC, a fast charger is available 15 km ahead. AI suggests a 20-min top-up.`,
      recommendation: 'Route to Charger',
      confidence: 95,
      icon: Battery,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10'
    });
  }

  if (batteryAge > 24 || aiSoh < 95) {
    insights.push({
      id: 'age-insight',
      title: 'Cell Degradation Analysis',
      explanation: `At ${batteryAge} months and ${aiSoh}% SOH, minor degradation is expected. Limit DC fast charging to preserve longevity.`,
      recommendation: 'View Charging Tips',
      confidence: 85,
      icon: ActivitySquare,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10'
    });
  }

  // Fallback insight if no critical conditions
  if (insights.length === 0) {
    insights.push({
      id: 'optimal-insight',
      title: 'System Optimal',
      explanation: 'All battery metrics are within ideal operating ranges. AI predicts maximum efficiency for the current drive cycle.',
      recommendation: 'View Full Analysis',
      confidence: 98,
      icon: Cpu,
      color: 'text-green-400',
      bg: 'bg-green-400/10'
    });
  }

  const displayedInsights = insights.slice(0, 2);

  return (
    <Card className="col-span-full xl:col-span-1 h-[450px] flex flex-col">
      <CardHeader className="flex flex-row items-center gap-2 py-4">
        <BrainCircuit className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">AI Insights</h2>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {displayedInsights.map((insight) => (
          <div key={insight.id} className="p-4 rounded-xl relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 group hover:border-slate-600 transition-colors">
            
            {/* Sparkle effects */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity group-hover:opacity-100 opacity-50"></div>
            
            <div className="flex items-start justify-between mb-2 relative z-10">
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${insight.bg}`}>
                  <insight.icon className={`w-4 h-4 ${insight.color}`} />
                </div>
                <h3 className="font-medium text-slate-200">{insight.title}</h3>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-300">{insight.confidence}%</span>
                <span className="text-[10px] text-slate-500 uppercase">Conf</span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 mb-4 leading-relaxed relative z-10">
              {insight.explanation}
            </p>
            
            <button className="text-sm font-medium text-purple-400 hover:text-purple-300 relative z-10 flex items-center gap-1 group/btn transition-colors">
              {insight.recommendation}
              <span className="transition-transform group-hover/btn:translate-x-1">→</span>
            </button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
