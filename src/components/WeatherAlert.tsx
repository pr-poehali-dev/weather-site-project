import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';

interface WeatherAlertProps {
  weatherCode: number;
  temp: number;
  windSpeed: number;
  isDarkTheme: boolean;
}

interface Alert {
  id: string;
  type: 'storm' | 'cold' | 'hot' | 'wind';
  title: string;
  message: string;
  icon: string;
}

const WeatherAlert = ({ weatherCode, temp, windSpeed, isDarkTheme }: WeatherAlertProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const newAlerts: Alert[] = [];

    if (weatherCode >= 95) {
      newAlerts.push({
        id: 'storm',
        type: 'storm',
        title: 'Штормовое предупреждение',
        message: 'Ожидается гроза с молниями. Будьте осторожны!',
        icon: 'CloudLightning',
      });
    }

    if (temp <= -15) {
      newAlerts.push({
        id: 'cold',
        type: 'cold',
        title: 'Экстремальный холод',
        message: `Температура ${Math.round(temp)}°C. Оденьтесь теплее!`,
        icon: 'Snowflake',
      });
    }

    if (temp >= 35) {
      newAlerts.push({
        id: 'hot',
        type: 'hot',
        title: 'Экстремальная жара',
        message: `Температура ${Math.round(temp)}°C. Избегайте солнца!`,
        icon: 'Flame',
      });
    }

    if (windSpeed >= 15) {
      newAlerts.push({
        id: 'wind',
        type: 'wind',
        title: 'Сильный ветер',
        message: `Скорость ветра ${Math.round(windSpeed)} м/с. Будьте осторожны!`,
        icon: 'Wind',
      });
    }

    setAlerts(newAlerts);
    setVisible(true);
  }, [weatherCode, temp, windSpeed]);

  if (alerts.length === 0 || !visible) return null;

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'storm':
        return isDarkTheme ? 'bg-yellow-500/20 border-yellow-500/40' : 'bg-yellow-100 border-yellow-400';
      case 'cold':
        return isDarkTheme ? 'bg-blue-500/20 border-blue-500/40' : 'bg-blue-100 border-blue-400';
      case 'hot':
        return isDarkTheme ? 'bg-red-500/20 border-red-500/40' : 'bg-red-100 border-red-400';
      case 'wind':
        return isDarkTheme ? 'bg-gray-500/20 border-gray-500/40' : 'bg-gray-100 border-gray-400';
      default:
        return isDarkTheme ? 'bg-white/20 border-white/40' : 'bg-white border-gray-300';
    }
  };

  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkTheme ? 'text-white/80' : 'text-gray-700';

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm animate-fade-in">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`${getAlertColor(alert.type)} backdrop-blur-xl border-2 rounded-2xl p-4 shadow-lg animate-slide-in-right`}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <Icon name={alert.icon as any} className={textColor} size={24} />
            </div>
            <div className="flex-1">
              <h4 className={`font-bold ${textColor} mb-1`}>{alert.title}</h4>
              <p className={`text-sm ${textSecondary}`}>{alert.message}</p>
            </div>
            <button
              onClick={() => setVisible(false)}
              className={`flex-shrink-0 ${textSecondary} hover:${textColor} transition-colors`}
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WeatherAlert;
