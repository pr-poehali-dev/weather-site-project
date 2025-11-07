import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface WeatherMapProps {
  isDarkTheme: boolean;
  currentCity: string;
  currentTemp: number;
}

type MapLayer = 'precipitation' | 'temperature' | 'wind' | 'clouds';

const WeatherMap = ({ isDarkTheme, currentCity, currentTemp }: WeatherMapProps) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('precipitation');
  const [opacity, setOpacity] = useState(70);

  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/80';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkTheme ? 'text-white/70' : 'text-gray-600';

  const layers = [
    { id: 'precipitation', name: 'Осадки', icon: 'CloudRain', color: 'from-blue-500 to-blue-700' },
    { id: 'temperature', name: 'Температура', icon: 'Thermometer', color: 'from-orange-500 to-red-600' },
    { id: 'wind', name: 'Ветер', icon: 'Wind', color: 'from-cyan-400 to-teal-600' },
    { id: 'clouds', name: 'Облачность', icon: 'Cloud', color: 'from-gray-400 to-gray-600' },
  ];

  const precipitationData = [
    { x: 20, y: 30, intensity: 80, size: 120 },
    { x: 45, y: 50, intensity: 60, size: 90 },
    { x: 65, y: 25, intensity: 95, size: 140 },
    { x: 30, y: 70, intensity: 40, size: 70 },
    { x: 75, y: 60, intensity: 70, size: 100 },
  ];

  const temperatureData = [
    { x: 25, y: 35, temp: 28, size: 100 },
    { x: 50, y: 55, temp: 24, size: 120 },
    { x: 70, y: 30, temp: 22, size: 90 },
    { x: 35, y: 65, temp: 26, size: 110 },
    { x: 80, y: 70, temp: 23, size: 95 },
  ];

  const windData = [
    { x: 15, y: 25, speed: 15, direction: 45 },
    { x: 40, y: 45, speed: 22, direction: 90 },
    { x: 60, y: 20, speed: 18, direction: 135 },
    { x: 25, y: 60, speed: 12, direction: 180 },
    { x: 75, y: 65, speed: 20, direction: 225 },
    { x: 85, y: 40, speed: 16, direction: 270 },
  ];

  const cloudData = [
    { x: 10, y: 20, coverage: 70, size: 150 },
    { x: 40, y: 50, coverage: 85, size: 180 },
    { x: 70, y: 30, coverage: 60, size: 130 },
    { x: 30, y: 75, coverage: 50, size: 120 },
  ];

  const getLayerColor = (value: number) => {
    if (activeLayer === 'precipitation') {
      if (value > 80) return 'bg-blue-700';
      if (value > 60) return 'bg-blue-500';
      if (value > 40) return 'bg-blue-400';
      return 'bg-blue-300';
    }
    if (activeLayer === 'temperature') {
      if (value > 26) return 'bg-red-600';
      if (value > 24) return 'bg-orange-500';
      if (value > 22) return 'bg-yellow-500';
      return 'bg-green-500';
    }
    if (activeLayer === 'wind') {
      if (value > 20) return 'bg-teal-700';
      if (value > 15) return 'bg-teal-500';
      return 'bg-cyan-400';
    }
    if (value > 80) return 'bg-gray-700';
    if (value > 60) return 'bg-gray-500';
    return 'bg-gray-400';
  };

  const renderMapLayer = () => {
    switch (activeLayer) {
      case 'precipitation':
        return precipitationData.map((point, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${getLayerColor(point.intensity)} animate-pulse`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: `${point.size}px`,
              height: `${point.size}px`,
              opacity: opacity / 100,
              filter: 'blur(20px)',
            }}
          />
        ));
      
      case 'temperature':
        return temperatureData.map((point, index) => (
          <div key={index} className="absolute" style={{ left: `${point.x}%`, top: `${point.y}%` }}>
            <div
              className={`rounded-full ${getLayerColor(point.temp)} flex items-center justify-center font-bold text-white shadow-lg`}
              style={{
                width: `${point.size}px`,
                height: `${point.size}px`,
                opacity: opacity / 100,
              }}
            >
              {point.temp}°
            </div>
          </div>
        ));
      
      case 'wind':
        return windData.map((point, index) => (
          <div
            key={index}
            className="absolute flex flex-col items-center"
            style={{ left: `${point.x}%`, top: `${point.y}%`, opacity: opacity / 100 }}
          >
            <Icon
              name="ArrowUp"
              className={`${getLayerColor(point.speed)} text-white p-2 rounded-full`}
              size={32}
              style={{ transform: `rotate(${point.direction}deg)` }}
            />
            <span className={`${textColor} text-xs font-bold mt-1`}>{point.speed} м/с</span>
          </div>
        ));
      
      case 'clouds':
        return cloudData.map((point, index) => (
          <div
            key={index}
            className={`absolute rounded-full ${getLayerColor(point.coverage)}`}
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              width: `${point.size}px`,
              height: `${point.size}px`,
              opacity: opacity / 100,
              filter: 'blur(15px)',
            }}
          />
        ));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {layers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id as MapLayer)}
            className={`p-4 rounded-xl transition-all ${
              activeLayer === layer.id
                ? `bg-gradient-to-br ${layer.color} text-white shadow-lg scale-105`
                : `${cardBg} ${textColor} hover:scale-102`
            }`}
          >
            <Icon name={layer.icon as any} className="mx-auto mb-2" size={28} />
            <p className="text-sm font-semibold">{layer.name}</p>
          </button>
        ))}
      </div>

      <Card className={`${cardBg} backdrop-blur-xl p-6`}>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className={`${textColor} text-xl font-bold mb-1`}>Радар погоды</h3>
            <p className={`${textSecondary} text-sm`}>{currentCity}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${textSecondary} text-sm`}>Прозрачность</span>
            <input
              type="range"
              min="20"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-32"
            />
            <span className={`${textColor} text-sm font-semibold`}>{opacity}%</span>
          </div>
        </div>

        <div className="relative w-full h-[500px] bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className={textColor} />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" style={{ width: '24px', height: '24px' }}></div>
              <div className="relative bg-red-600 rounded-full border-4 border-white shadow-lg" style={{ width: '24px', height: '24px' }}></div>
            </div>
            <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 ${cardBg} px-3 py-1 rounded-full whitespace-nowrap`}>
              <span className={`${textColor} text-sm font-bold`}>{currentCity}</span>
            </div>
          </div>

          {renderMapLayer()}

          <div className={`absolute bottom-4 left-4 ${cardBg} backdrop-blur-xl rounded-lg p-3`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon name={layers.find(l => l.id === activeLayer)?.icon as any} size={20} className={textColor} />
              <span className={`${textColor} font-semibold`}>{layers.find(l => l.id === activeLayer)?.name}</span>
            </div>
            <div className="space-y-1 text-xs">
              {activeLayer === 'precipitation' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-700 rounded"></div>
                    <span className={textSecondary}>Сильные осадки (80-100%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className={textSecondary}>Умеренные (60-80%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-400 rounded"></div>
                    <span className={textSecondary}>Слабые (40-60%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-300 rounded"></div>
                    <span className={textSecondary}>Очень слабые (&lt;40%)</span>
                  </div>
                </>
              )}
              {activeLayer === 'temperature' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded"></div>
                    <span className={textSecondary}>Жарко (&gt;26°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className={textSecondary}>Тепло (24-26°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className={textSecondary}>Комфортно (22-24°C)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className={textSecondary}>Прохладно (&lt;22°C)</span>
                  </div>
                </>
              )}
              {activeLayer === 'wind' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-teal-700 rounded"></div>
                    <span className={textSecondary}>Сильный (&gt;20 м/с)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-teal-500 rounded"></div>
                    <span className={textSecondary}>Умеренный (15-20 м/с)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-cyan-400 rounded"></div>
                    <span className={textSecondary}>Слабый (&lt;15 м/с)</span>
                  </div>
                </>
              )}
              {activeLayer === 'clouds' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-700 rounded"></div>
                    <span className={textSecondary}>Пасмурно (80-100%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-500 rounded"></div>
                    <span className={textSecondary}>Облачно (60-80%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded"></div>
                    <span className={textSecondary}>Малооблачно (&lt;60%)</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={`absolute top-4 right-4 ${cardBg} backdrop-blur-xl rounded-lg p-3 text-center`}>
            <Icon name="Thermometer" className={`${textColor} mx-auto mb-1`} size={24} />
            <p className={`${textColor} text-2xl font-bold`}>{currentTemp}°</p>
            <p className={`${textSecondary} text-xs`}>Сейчас</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WeatherMap;
