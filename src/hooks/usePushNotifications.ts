import { useEffect, useRef } from 'react';

interface WeatherData {
  temp: number;
  windSpeed: number;
  condition: string;
  location: string;
}

export const usePushNotifications = (weather: WeatherData) => {
  const previousWeather = useRef<WeatherData | null>(null);
  const notificationPermission = useRef<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      notificationPermission.current = Notification.permission;
      
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          notificationPermission.current = permission;
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!previousWeather.current) {
      previousWeather.current = weather;
      return;
    }

    const prev = previousWeather.current;
    const tempDiff = Math.abs(weather.temp - prev.temp);
    const windDiff = Math.abs(weather.windSpeed - prev.windSpeed);

    if (tempDiff >= 5) {
      sendNotification(
        '🌡️ Резкое изменение температуры',
        `Температура изменилась на ${tempDiff.toFixed(1)}°C в ${weather.location}. Сейчас ${weather.temp}°C`
      );
    }

    if (windDiff >= 10) {
      sendNotification(
        '💨 Сильный ветер',
        `Скорость ветра увеличилась до ${weather.windSpeed} км/ч в ${weather.location}`
      );
    }

    if (weather.condition.toLowerCase().includes('гроз') && !prev.condition.toLowerCase().includes('гроз')) {
      sendNotification(
        '⚡ Гроза',
        `Внимание! Началась гроза в ${weather.location}`
      );
    }

    if (weather.condition.toLowerCase().includes('снег') && !prev.condition.toLowerCase().includes('снег')) {
      sendNotification(
        '❄️ Снегопад',
        `Начался снегопад в ${weather.location}`
      );
    }

    previousWeather.current = weather;
  }, [weather]);

  const sendNotification = (title: string, body: string) => {
    if (notificationPermission.current === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'weather-alert',
        requireInteraction: false,
      });
    }
  };
};
