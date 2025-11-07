import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface WeatherNotification {
  id: string;
  cityName: string;
  type: 'temperature' | 'wind' | 'rain' | 'snow' | 'storm';
  message: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: Date;
}

interface WeatherNotificationsProps {
  isDarkTheme: boolean;
}

const getNotificationIcon = (type: WeatherNotification['type']): string => {
  switch (type) {
    case 'temperature':
      return 'Thermometer';
    case 'wind':
      return 'Wind';
    case 'rain':
      return 'CloudRain';
    case 'snow':
      return 'CloudSnow';
    case 'storm':
      return 'CloudLightning';
    default:
      return 'AlertCircle';
  }
};

const getSeverityColor = (severity: WeatherNotification['severity'], isDark: boolean): string => {
  if (severity === 'danger') return 'bg-red-500';
  if (severity === 'warning') return 'bg-yellow-500';
  return isDark ? 'bg-blue-400' : 'bg-blue-500';
};

export default function WeatherNotifications({ isDarkTheme }: WeatherNotificationsProps) {
  const [notifications, setNotifications] = useState<WeatherNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/70';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  useEffect(() => {
    const savedNotifications = localStorage.getItem('weatherNotifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      })));
    }
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('weatherNotifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (notification: Omit<WeatherNotification, 'id' | 'timestamp'>) => {
    const newNotification: WeatherNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setNotifications(prev => [newNotification, ...prev].slice(0, 10));
  };

  useEffect(() => {
    (window as any).addWeatherNotification = addNotification;
    return () => {
      delete (window as any).addWeatherNotification;
    };
  }, []);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'только что';
    if (minutes < 60) return `${minutes} мин назад`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ч назад`;
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 ${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-xl hover:bg-white/30 transition-all relative`}
      >
        <Icon name="Bell" className={notifications.length > 0 ? "text-yellow-300" : textColor} size={24} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <Card className={`absolute right-0 top-full mt-2 w-96 max-h-[500px] overflow-y-auto ${cardBg} backdrop-blur-xl ${borderColor} shadow-2xl z-50 animate-scale-in`}>
            <div className="p-4 border-b border-white/20 flex items-center justify-between sticky top-0 bg-inherit backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <Icon name="Bell" className={textColor} size={24} />
                <h3 className={`text-lg font-semibold ${textColor}`}>
                  Уведомления
                </h3>
              </div>
              {notifications.length > 0 && (
                <button
                  onClick={clearAll}
                  className={`text-sm ${textSecondary} hover:${textColor} transition-colors`}
                >
                  Очистить все
                </button>
              )}
            </div>

            <div className="p-2">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Icon name="BellOff" className={`${textSecondary} mx-auto mb-3`} size={48} />
                  <p className={textSecondary}>Нет новых уведомлений</p>
                  <p className={`text-sm ${textSecondary} mt-2`}>
                    Мы сообщим о важных изменениях погоды
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 ${cardBg} rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all relative group`}
                    >
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="absolute top-2 right-2 p-1 hover:bg-white/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Icon name="X" className={textSecondary} size={16} />
                      </button>

                      <div className="flex items-start gap-3">
                        <div className={`p-2 ${getSeverityColor(notification.severity, isDarkTheme)} rounded-lg`}>
                          <Icon
                            name={getNotificationIcon(notification.type)}
                            className="text-white"
                            size={20}
                          />
                        </div>

                        <div className="flex-1 pr-6">
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-semibold ${textColor}`}>
                              {notification.cityName}
                            </p>
                            <Badge
                              className={`${getSeverityColor(notification.severity, isDarkTheme)} text-white border-none text-xs`}
                            >
                              {notification.severity === 'danger' && 'Опасно'}
                              {notification.severity === 'warning' && 'Внимание'}
                              {notification.severity === 'info' && 'Инфо'}
                            </Badge>
                          </div>
                          <p className={`text-sm ${textColor} mb-2`}>
                            {notification.message}
                          </p>
                          <p className={`text-xs ${textSecondary}`}>
                            {formatTime(notification.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
