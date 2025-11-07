import { useEffect, useRef } from 'react';

interface WeatherData {
  temp: number;
  windSpeed: number;
  condition: string;
  location: string;
}

export interface NotificationSettings {
  enabled: boolean;
  temperature: boolean;
  wind: boolean;
  storm: boolean;
  snow: boolean;
  rain: boolean;
  tempThreshold: number;
  windThreshold: number;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  temperature: true,
  wind: true,
  storm: true,
  snow: true,
  rain: true,
  tempThreshold: 5,
  windThreshold: 10,
};

export const usePushNotifications = (weather: WeatherData, settings?: NotificationSettings) => {
  const previousWeather = useRef<WeatherData | null>(null);
  const notificationPermission = useRef<NotificationPermission>('default');
  const activeSettings = settings || DEFAULT_SETTINGS;

  useEffect(() => {
    if ('Notification' in window) {
      notificationPermission.current = Notification.permission;
      
      if (Notification.permission === 'default' && activeSettings.enabled) {
        Notification.requestPermission().then(permission => {
          notificationPermission.current = permission;
        });
      }
    }
  }, [activeSettings.enabled]);

  useEffect(() => {
    if (!activeSettings.enabled || notificationPermission.current !== 'granted') {
      return;
    }

    if (!previousWeather.current) {
      previousWeather.current = weather;
      return;
    }

    const prev = previousWeather.current;
    const tempDiff = Math.abs(weather.temp - prev.temp);
    const windDiff = Math.abs(weather.windSpeed - prev.windSpeed);

    if (activeSettings.temperature && tempDiff >= activeSettings.tempThreshold) {
      sendNotification(
        '🌡️ Резкое изменение температуры',
        `Температура изменилась на ${tempDiff.toFixed(1)}°C в ${weather.location}. Сейчас ${weather.temp}°C`
      );
    }

    if (activeSettings.wind && windDiff >= activeSettings.windThreshold) {
      sendNotification(
        '💨 Сильный ветер',
        `Скорость ветра увеличилась до ${weather.windSpeed} км/ч в ${weather.location}`
      );
    }

    if (activeSettings.storm && weather.condition.toLowerCase().includes('гроз') && !prev.condition.toLowerCase().includes('гроз')) {
      sendNotification(
        '⚡ Гроза',
        `Внимание! Началась гроза в ${weather.location}`
      );
    }

    if (activeSettings.snow && weather.condition.toLowerCase().includes('снег') && !prev.condition.toLowerCase().includes('снег')) {
      sendNotification(
        '❄️ Снегопад',
        `Начался снегопад в ${weather.location}`
      );
    }

    if (activeSettings.rain && weather.condition.toLowerCase().includes('дожд') && !prev.condition.toLowerCase().includes('дожд')) {
      sendNotification(
        '🌧️ Дождь',
        `Начался дождь в ${weather.location}`
      );
    }

    previousWeather.current = weather;
  }, [weather, activeSettings]);

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
