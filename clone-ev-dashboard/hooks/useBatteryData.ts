import { useState, useEffect } from 'react';

export interface BatteryData {
  soc: number; // State of Charge
  soh: number; // State of Health
  temperature: number;
  voltage: number;
  current: number;
  remainingTime: string;
  rangeKm: number;
  rangeAccuracy: number;
  status: 'Charging' | 'Discharging' | 'Idle';
  connectionStatus: 'Connected' | 'Disconnected';
  systemRisk: 'Low' | 'Medium' | 'High';
  history: { time: string; soc: number; temp: number; voltage: number }[];
}

const generateInitialData = (): BatteryData => {
  const currentHour = new Date().getHours();
  const history = Array.from({ length: 12 }).map((_, i) => {
    const time = new Date();
    time.setHours(currentHour - (11 - i));
    time.setMinutes(0);
    return {
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      soc: 40 + Math.random() * 40,
      temp: 20 + Math.random() * 15,
      voltage: 380 + Math.random() * 20,
    };
  });

  return {
    soc: 82,
    soh: 96,
    temperature: 28,
    voltage: 395.2,
    current: -15.4,
    remainingTime: '~2.5 hours remaining',
    rangeKm: 340,
    rangeAccuracy: 92,
    status: 'Discharging',
    connectionStatus: 'Connected',
    systemRisk: 'Low',
    history,
  };
};

export const useBatteryData = () => {
  const [data, setData] = useState<BatteryData>(generateInitialData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        // Simulate small fluctuations
        const socChange = (Math.random() - 0.7) * 0.1; // Mostly draining slowly
        const tempChange = (Math.random() - 0.5) * 0.5;
        const voltageChange = (Math.random() - 0.5) * 1.5;
        const currentChange = (Math.random() - 0.5) * 2;

        const newSoc = Math.max(0, Math.min(100, prev.soc + socChange));
        const newTemp = Math.max(15, Math.min(45, prev.temperature + tempChange));
        const newVoltage = Math.max(300, Math.min(450, prev.voltage + voltageChange));
        const newCurrent = prev.current + currentChange;

        // Add to history every minute
        let newHistory = [...prev.history];
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        if (newHistory.length > 0 && newHistory[newHistory.length - 1].time !== timeString) {
          newHistory.push({
            time: timeString,
            soc: newSoc,
            temp: newTemp,
            voltage: newVoltage,
          });
          if (newHistory.length > 20) newHistory.shift(); // Keep last 20 points
        } else {
          // Update last point to simulate real-time live view
          if(newHistory.length > 0) {
            newHistory[newHistory.length - 1] = {
               time: timeString,
               soc: newSoc,
               temp: newTemp,
               voltage: newVoltage,
            }
          }
        }

        return {
          ...prev,
          soc: Number(newSoc.toFixed(1)),
          temperature: Number(newTemp.toFixed(1)),
          voltage: Number(newVoltage.toFixed(1)),
          current: Number(newCurrent.toFixed(1)),
          rangeKm: Math.floor(newSoc * 4.1), // roughly 4.1 km per %
          history: newHistory,
        };
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return data;
};
