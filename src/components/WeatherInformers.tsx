import { useMemo } from 'react';
import Icon from '@/components/ui/icon';

interface WeatherInformersProps {
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  dewPoint: number;
  isDarkTheme: boolean;
}

const WeatherInformers = ({
  humidity,
  windSpeed,
  pressure,
  visibility,
  uvIndex,
  dewPoint,
  isDarkTheme
}: WeatherInformersProps) => {
  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/40';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Низкий', color: 'text-green-400' };
    if (uv <= 5) return { level: 'Средний', color: 'text-yellow-400' };
    if (uv <= 7) return { level: 'Высокий', color: 'text-orange-400' };
    if (uv <= 10) return { level: 'Очень высокий', color: 'text-red-400' };
    return { level: 'Экстремальный', color: 'text-purple-400' };
  };

  const getVisibilityLevel = (vis: number) => {
    if (vis >= 10) return 'Отличная';
    if (vis >= 5) return 'Хорошая';
    if (vis >= 2) return 'Средняя';
    return 'Плохая';
  };

  const uvData = useMemo(() => getUVLevel(uvIndex), [uvIndex]);

  const informers = [
    {
      icon: 'Droplets',
      label: 'Влажность',
      value: `${humidity}%`,
      description: humidity > 70 ? 'Высокая' : humidity > 40 ? 'Комфортная' : 'Низкая'
    },
    {
      icon: 'Wind',
      label: 'Ветер',
      value: `${Math.round(windSpeed)} км/ч`,
      description: windSpeed > 20 ? 'Сильный' : windSpeed > 10 ? 'Умеренный' : 'Слабый'
    },
    {
      icon: 'Gauge',
      label: 'Давление',
      value: `${pressure} мм рт.ст.`,
      description: pressure > 760 ? 'Высокое' : pressure > 740 ? 'Нормальное' : 'Низкое'
    },
    {
      icon: 'Eye',
      label: 'Видимость',
      value: `${visibility} км`,
      description: getVisibilityLevel(visibility)
    },
    {
      icon: 'Sun',
      label: 'УФ-индекс',
      value: uvIndex.toString(),
      description: uvData.level,
      valueColor: uvData.color
    },
    {
      icon: 'Thermometer',
      label: 'Точка росы',
      value: `${Math.round(dewPoint)}°C`,
      description: dewPoint > 20 ? 'Душно' : dewPoint > 10 ? 'Комфортно' : 'Сухо'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-fade-in">
      {informers.map((informer, index) => (
        <div
          key={index}
          className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-2xl p-4 hover:scale-105 transition-all duration-300`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`p-3 ${isDarkTheme ? 'bg-white/10' : 'bg-white/60'} rounded-full`}>
              <Icon name={informer.icon} className={textColor} size={24} />
            </div>
            <div className={`text-xs ${subtextColor} font-medium`}>
              {informer.label}
            </div>
            <div className={`text-2xl font-bold ${informer.valueColor || textColor}`}>
              {informer.value}
            </div>
            <div className={`text-xs ${subtextColor}`}>
              {informer.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherInformers;
