'use client';

import { useEffect, useState, useRef } from 'react';
import { useBatteryData } from '@/hooks/useBatteryData';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { RangeCard } from '@/components/dashboard/RangeCard';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { BatteryChart } from '@/components/dashboard/BatteryChart';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { DeviceStatus } from '@/components/dashboard/DeviceStatus';
import { ActivityLogs } from '@/components/dashboard/ActivityLogs';
import { Zap, Activity, Thermometer, Battery, ActivitySquare, AlertTriangle, X } from 'lucide-react';

export default function DashboardPage() {
  const data = useBatteryData();

  if (!data) {
    return <div className="p-10 text-white">Loading dashboard...</div>;
  }

  const [aiRange, setAiRange] = useState(data.rangeKm);
  const [aiSoh, setAiSoh] = useState(data.soh);
  const [speed, setSpeed] = useState(60); 
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [isDevModeOpen, setIsDevModeOpen] = useState(false);
  const [batteryAge, setBatteryAge] = useState(18);
  const [isRangeAnalyzerOpen, setIsRangeAnalyzerOpen] = useState(false);
  const [rangeMatrix, setRangeMatrix] = useState<{speed: number, range: number}[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAlertIndex(prev => prev + 1);
    }, 10000); // cycle every 10 seconds
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchAIPredictions = async () => {
      // ⚠️ PASTE YOUR EXACT RENDER URL RIGHT HERE ⚠️
      const apiURL = "https://ml-models-5files.onrender.com/api/predict";

      const currentSensorData = {
        soc_percent: data.soc || 85.0,
        speed_kmh: speed,
        current_a: data.current || 22.0,
        batt_temp_c: data.temperature || 38.0,
        cycles: batteryAge * 20,
        age_months: batteryAge,
        fast_charge_ratio: 0.4
      };

      try {
        const response = await fetch(apiURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentSensorData)
        });
        
        const result = await response.json();
        
        if (result.status === "success") {
          setAiRange(result.data.predicted_range_km);
          setAiSoh(result.data.predicted_soh_percent);
        }
      } catch (error) {
        console.error("AI Fetch Error:", error);
      }
    };

    fetchAIPredictions();
    const interval = setInterval(fetchAIPredictions, 5000);
    return () => clearInterval(interval);
  }, [data.soc, data.current, data.temperature, speed, batteryAge]);

  useEffect(() => {
    if (!isRangeAnalyzerOpen) return;

    const fetchRangeMatrix = async () => {
      const apiURL = "https://ml-models-5files.onrender.com/api/predict";
      const targetSpeeds = [20, 40, 60, 80, 100, 120];

      try {
        const promises = targetSpeeds.map(async (targetSpeed) => {
          const currentSensorData = {
            soc_percent: data.soc || 85.0,
            speed_kmh: targetSpeed,
            current_a: data.current || 22.0,
            batt_temp_c: data.temperature || 38.0,
            cycles: batteryAge * 20,
            age_months: batteryAge,
            fast_charge_ratio: 0.4
          };

          const response = await fetch(apiURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(currentSensorData)
          });
          
          const result = await response.json();
          return {
            speed: targetSpeed,
            range: result.status === "success" ? result.data.predicted_range_km : 0
          };
        });

        const matrix = await Promise.all(promises);
        setRangeMatrix(matrix);
      } catch (error) {
        console.error("Matrix Fetch Error:", error);
      }
    };

    fetchRangeMatrix();
    const interval = setInterval(fetchRangeMatrix, 10000);
    return () => clearInterval(interval);
  }, [isRangeAnalyzerOpen, data.soc, data.temperature, batteryAge]);

  const activeAlerts: any[] = [];
  
  if (speed >= 100) {
    activeAlerts.push({
      id: 'live-speed-crit',
      title: 'Overspeed Critical',
      description: 'Speed crossed 100 km/h',
      severity: 'High',
      action: 'Reduce Speed',
    });
  } else if (speed >= 80) {
    activeAlerts.push({
      id: 'live-speed-warn',
      title: 'Speed Warning',
      description: 'Speed reached 80 km/h',
      severity: 'Medium',
      action: 'Monitor',
    });
  }

  if (data.temperature > 28.5) {
    activeAlerts.push({
      id: 'live-temp-crit',
      title: 'Thermal Critical',
      description: 'Battery temperature > 28.5°C',
      severity: 'High',
      action: 'Cooling Required',
    });
  }

  if (data.soc <= 20) {
    activeAlerts.push({
      id: 'live-soc-crit',
      title: 'Low Battery Critical',
      description: 'SOC dropped to 20% or lower',
      severity: 'High',
      action: 'Charge Immediately',
    });
  } else if (data.soc <= 50) {
    activeAlerts.push({
      id: 'live-soc-warn',
      title: 'Battery Warning',
      description: 'SOC dropped to 50% or lower',
      severity: 'Medium',
      action: 'Plan Route',
    });
  }

  const displayedAlert = activeAlerts.length > 0 ? activeAlerts[currentAlertIndex % activeAlerts.length] : null;

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      
      {/* Cycling Floating Alert */}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50">
        {displayedAlert && (
          <div 
            key={displayedAlert.id + (activeAlerts.length > 1 ? currentAlertIndex : '')}
            style={{ animation: 'slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            className={`p-4 rounded-xl shadow-2xl flex items-center justify-between min-w-[340px] border backdrop-blur-xl ${
              displayedAlert.severity === 'High' 
                ? 'bg-black/60 border-red-500/50 text-red-50 shadow-[0_0_20px_rgba(239,68,68,0.25)]' 
                : 'bg-black/60 border-orange-500/50 text-orange-50 shadow-[0_0_20px_rgba(249,115,22,0.25)]'
            }`}
          >
            <div className="flex items-center gap-4">
              {displayedAlert.severity === 'High' ? (
                <div className="p-2 bg-red-500/20 rounded-full border border-red-500/30">
                  <AlertTriangle className="w-5 h-5 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                </div>
              ) : (
                <div className="p-2 bg-orange-500/20 rounded-full border border-orange-500/30">
                  <AlertTriangle className="w-5 h-5 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">
                  {displayedAlert.title}
                </span>
                <p className="font-semibold text-sm tracking-wide">{displayedAlert.description}</p>
              </div>
            </div>
            {activeAlerts.length > 1 && (
              <span className="ml-4 text-[10px] font-bold text-white/50 bg-white/10 px-2 py-1 rounded-full whitespace-nowrap">
                1 OF {activeAlerts.length}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold text-white tracking-tight">System Overview</h1>
           <p className="text-sm text-slate-400 mt-1">Live AI Dashboard Connected!</p>
        </div>
      </div>

      {/* Pro Developer Simulation Panel */}
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 font-mono">
        <button 
          onClick={() => setIsDevModeOpen(!isDevModeOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800/80 transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <h3 className="text-white font-semibold tracking-wide">Developer Simulation Controls</h3>
          </div>
          <span className="text-slate-400 text-sm">
            {isDevModeOpen ? '▼ COLLAPSE' : '▶ EXPAND'}
          </span>
        </button>
        
        {isDevModeOpen && (
          <div className="p-6 border-t border-slate-700/50 bg-black/40 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Speed Simulator */}
            <div className="flex flex-col space-y-3">
              <div>
                <h4 className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Live Speed</h4>
                <p className="text-slate-400 text-xs mt-1">Impacts dynamic range prediction</p>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="120" 
                  value={speed} 
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="flex-1 cursor-pointer accent-emerald-500"
                />
                <span className="text-xl font-bold text-emerald-400 w-20 text-right">{speed} km/h</span>
              </div>
            </div>

            {/* Battery Age Simulator */}
            <div className="flex flex-col space-y-3">
              <div>
                <h4 className="text-purple-400 font-bold text-sm uppercase tracking-wider">Battery Age</h4>
                <p className="text-slate-400 text-xs mt-1">Impacts SOH & Cycles logic ({batteryAge * 20} cycles)</p>
              </div>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="120" 
                  value={batteryAge} 
                  onChange={(e) => setBatteryAge(Number(e.target.value))}
                  className="flex-1 cursor-pointer accent-purple-500"
                />
                <span className="text-xl font-bold text-purple-400 w-20 text-right">{batteryAge} mo</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Speed vs. Range Analyzer Panel */}
      <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl overflow-hidden shadow-lg transition-all duration-300 font-mono">
        <button 
          onClick={() => setIsRangeAnalyzerOpen(!isRangeAnalyzerOpen)}
          className="w-full flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800/80 transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <h3 className="text-white font-semibold tracking-wide">Speed vs. Range Analyzer</h3>
          </div>
          <span className="text-slate-400 text-sm">
            {isRangeAnalyzerOpen ? '▼ COLLAPSE' : '▶ EXPAND'}
          </span>
        </button>

        {isRangeAnalyzerOpen && (
          <div className="p-6 border-t border-slate-700/50 bg-black/40 min-h-[140px] flex flex-col justify-center">
            {rangeMatrix.length === 0 ? (
              <div className="text-center text-slate-400 py-8 animate-pulse">Analyzing AI Range Matrix...</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {(() => {
                  const closestSpeed = rangeMatrix.reduce((prev, curr) => Math.abs(curr.speed - speed) < Math.abs(prev.speed - speed) ? curr : prev).speed;
                  
                  return rangeMatrix.map((item) => {
                    const isClosest = item.speed === closestSpeed;
                    return (
                      <div 
                        key={item.speed} 
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                          isClosest 
                            ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)] transform scale-105 z-10' 
                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-700/50'
                        }`}
                      >
                        <span className="text-slate-400 text-xs font-semibold mb-2">{item.speed} km/h</span>
                        <span className={`text-2xl font-bold ${isClosest ? 'text-emerald-400' : 'text-white'}`}>
                          {item.range.toFixed(0)} <span className="text-xs font-normal opacity-70">km</span>
                        </span>
                      </div>
                    );
                  });
                })()}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard 
          title="State of Charge" 
          value={`${data.soc}%`} 
          subtitle={data.remainingTime}
          icon={<Battery className="w-5 h-5" />} 
          statusColor={data.soc > 20 ? 'green' : 'red'}
        />
        <KpiCard 
          title="State of Health" 
          value={`${aiSoh}%`} 
          subtitle="AI Predicted"
          icon={<ActivitySquare className="w-5 h-5" />} 
          statusColor="blue"
        />
        <KpiCard 
          title="Temperature" 
          value={`${data.temperature}°C`} 
          subtitle="Stable cooling"
          icon={<Thermometer className="w-5 h-5" />} 
          statusColor={data.temperature > 40 ? 'red' : data.temperature > 35 ? 'yellow' : 'green'}
        />
        <KpiCard 
          title="Voltage" 
          value={`${data.voltage}V`} 
          subtitle="Nominal range"
          icon={<Zap className="w-5 h-5" />} 
          statusColor="blue"
        />
        <KpiCard 
          title="Current" 
          value={`${data.current}A`} 
          subtitle={data.status}
          icon={<Activity className="w-5 h-5" />} 
          statusColor={data.current > 0 ? 'green' : 'yellow'}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <RangeCard range={aiRange} accuracy={data.rangeAccuracy} /> 
          <BatteryChart data={data.history} />
          <ActivityLogs speed={speed} temperature={data.temperature} soc={data.soc} />
        </div>
        <div className="xl:col-span-1 space-y-6">
          <DeviceStatus connectionStatus={data.connectionStatus} systemRisk={data.systemRisk} />
          <AlertsPanel liveAlerts={activeAlerts} />
          <AIInsights speed={speed} temperature={data.temperature} soc={data.soc} batteryAge={batteryAge} aiSoh={aiSoh} />
        </div>
      </div>
    </div>
  );
}