import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WeatherChartsProps {
  hourlyData: Array<{
    time: string;
    temp: number;
    precipitation: number;
  }>;
  isDarkTheme: boolean;
}

const WeatherCharts = ({ hourlyData, isDarkTheme }: WeatherChartsProps) => {
  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/40';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  const last24Hours = useMemo(() => {
    if (hourlyData.length === 0) {
      const now = new Date();
      return Array.from({ length: 24 }, (_, i) => {
        const hour = (now.getHours() - 23 + i + 24) % 24;
        return {
          time: `${hour.toString().padStart(2, '0')}:00`,
          temp: 15 + Math.sin(i / 3) * 8 + Math.random() * 3,
          precipitation: Math.random() * 100
        };
      });
    }
    return hourlyData.slice(0, 24);
  }, [hourlyData]);

  const tempStats = useMemo(() => {
    const temps = last24Hours.map(h => h.temp);
    return {
      min: Math.min(...temps),
      max: Math.max(...temps),
      avg: temps.reduce((a, b) => a + b, 0) / temps.length
    };
  }, [last24Hours]);

  const precipStats = useMemo(() => {
    const precips = last24Hours.map(h => h.precipitation);
    return {
      total: precips.reduce((a, b) => a + b, 0),
      max: Math.max(...precips),
      avg: precips.reduce((a, b) => a + b, 0) / precips.length
    };
  }, [last24Hours]);

  const normalizeValue = (value: number, min: number, max: number) => {
    if (max === min) return 50;
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
      <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 ${isDarkTheme ? 'bg-orange-500/20' : 'bg-orange-500/30'} rounded-full`}>
              <Icon name="TrendingUp" className="text-orange-500" size={24} />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${textColor}`}>Температура за 24 часа</h3>
              <p className={`text-sm ${subtextColor}`}>Динамика изменений</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`p-3 ${isDarkTheme ? 'bg-blue-500/10' : 'bg-blue-500/20'} rounded-lg text-center`}>
            <Icon name="ArrowDown" className="text-blue-400 mx-auto mb-1" size={20} />
            <div className={`text-2xl font-bold ${textColor}`}>{Math.round(tempStats.min)}°</div>
            <div className={`text-xs ${subtextColor}`}>Минимум</div>
          </div>
          <div className={`p-3 ${isDarkTheme ? 'bg-yellow-500/10' : 'bg-yellow-500/20'} rounded-lg text-center`}>
            <Icon name="Minus" className="text-yellow-400 mx-auto mb-1" size={20} />
            <div className={`text-2xl font-bold ${textColor}`}>{Math.round(tempStats.avg)}°</div>
            <div className={`text-xs ${subtextColor}`}>Средняя</div>
          </div>
          <div className={`p-3 ${isDarkTheme ? 'bg-red-500/10' : 'bg-red-500/20'} rounded-lg text-center`}>
            <Icon name="ArrowUp" className="text-red-400 mx-auto mb-1" size={20} />
            <div className={`text-2xl font-bold ${textColor}`}>{Math.round(tempStats.max)}°</div>
            <div className={`text-xs ${subtextColor}`}>Максимум</div>
          </div>
        </div>

        <div className="relative h-48 mb-4">
          <div className={`absolute inset-0 flex items-end justify-between gap-1 ${borderColor} border-b-2`}>
            {last24Hours.map((hour, index) => {
              const height = normalizeValue(hour.temp, tempStats.min, tempStats.max);
              const isCurrentHour = index === last24Hours.length - 1;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end group relative">
                  <div 
                    className={`w-full ${isCurrentHour ? 'bg-orange-500' : 'bg-gradient-to-t from-orange-500 to-orange-300'} rounded-t-md transition-all duration-300 hover:opacity-80 relative`}
                    style={{ height: `${Math.max(height, 5)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={`${cardBg} backdrop-blur-xl px-2 py-1 rounded text-xs font-semibold ${textColor} whitespace-nowrap`}>
                        {Math.round(hour.temp)}°C
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between px-1">
          {last24Hours.filter((_, i) => i % 4 === 0).map((hour, index) => (
            <span key={index} className={`text-xs ${subtextColor}`}>{hour.time}</span>
          ))}
        </div>
      </Card>

      <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 ${isDarkTheme ? 'bg-blue-500/20' : 'bg-blue-500/30'} rounded-full`}>
              <Icon name="CloudRain" className="text-blue-500" size={24} />
            </div>
            <div>
              <h3 className={`text-xl font-semibold ${textColor}`}>Осадки за 24 часа</h3>
              <p className={`text-sm ${subtextColor}`}>Вероятность дождя</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className={`p-3 ${isDarkTheme ? 'bg-blue-500/10' : 'bg-blue-500/20'} rounded-lg text-center`}>
            <Icon name="Droplets" className="text-blue-400 mx-auto mb-1" size={20} />
            <div className={`text-2xl font-bold ${textColor}`}>{Math.round(precipStats.total)}%</div>
            <div className={`text-xs ${subtextColor}`}>Суммарно</div>
          </div>
          <div className={`p-3 ${isDarkTheme ? 'bg-cyan-500/10' : 'bg-cyan-500/20'} rounded-lg text-center`}>
            <Icon name="Minus" className="text-cyan-400 mx-auto mb-1" size={20} />
            <div className={`text-2xl font-bold ${textColor}`}>{Math.round(precipStats.avg)}%</div>
            <div className={`text-xs ${subtextColor}`}>Средняя</div>
          </div>
          <div className={`p-3 ${isDarkTheme ? 'bg-indigo-500/10' : 'bg-indigo-500/20'} rounded-lg text-center`}>
            <Icon name="ArrowUp" className="text-indigo-400 mx-auto mb-1" size={20} />
            <div className={`text-2xl font-bold ${textColor}`}>{Math.round(precipStats.max)}%</div>
            <div className={`text-xs ${subtextColor}`}>Максимум</div>
          </div>
        </div>

        <div className="relative h-48 mb-4">
          <div className={`absolute inset-0 flex items-end justify-between gap-1 ${borderColor} border-b-2`}>
            {last24Hours.map((hour, index) => {
              const height = hour.precipitation;
              const isHighPrecip = height > 60;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center justify-end group relative">
                  <div 
                    className={`w-full ${isHighPrecip ? 'bg-blue-600' : 'bg-gradient-to-t from-blue-500 to-blue-300'} rounded-t-md transition-all duration-300 hover:opacity-80 relative`}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={`${cardBg} backdrop-blur-xl px-2 py-1 rounded text-xs font-semibold ${textColor} whitespace-nowrap`}>
                        {Math.round(hour.precipitation)}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-between px-1">
          {last24Hours.filter((_, i) => i % 4 === 0).map((hour, index) => (
            <span key={index} className={`text-xs ${subtextColor}`}>{hour.time}</span>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default WeatherCharts;
