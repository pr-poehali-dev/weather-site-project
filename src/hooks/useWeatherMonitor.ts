import { useEffect, useRef } from 'react';

interface City {
  name: string;
  lat: number;
  lon: number;
}

interface WeatherData {
  temp: number;
  windSpeed: number;
  weatherCode: number;
  humidity: number;
}

const WEATHER_API = 'https://functions.poehali.dev/2e1fb99e-adfb-4041-b171-a245be920e5c';
const CHECK_INTERVAL = 30 * 60 * 1000;

interface StoredWeatherData {
  [cityKey: string]: {
    temp: number;
    windSpeed: number;
    weatherCode: number;
    lastChecked: number;
  };
}

export const useWeatherMonitor = (favorites: City[]) => {
  const lastWeatherData = useRef<StoredWeatherData>({});

  const analyzeWeatherChange = (
    cityName: string,
    oldData: WeatherData | null,
    newData: WeatherData
  ) => {
    const addNotification = (window as any).addWeatherNotification;
    if (!addNotification) return;

    if (newData.windSpeed >= 15) {
      addNotification({
        cityName,
        type: 'wind',
        message: `Сильный ветер ${newData.windSpeed} км/ч`,
        severity: newData.windSpeed >= 25 ? 'danger' : 'warning',
      });
    }

    if (newData.weatherCode >= 95) {
      addNotification({
        cityName,
        type: 'storm',
        message: 'Гроза и молнии в районе',
        severity: 'danger',
      });
    }

    if (newData.weatherCode >= 71 && newData.weatherCode <= 77) {
      addNotification({
        cityName,
        type: 'snow',
        message: 'Снегопад',
        severity: 'warning',
      });
    }

    if (newData.weatherCode >= 61 && newData.weatherCode <= 67) {
      addNotification({
        cityName,
        type: 'rain',
        message: 'Дождь',
        severity: 'info',
      });
    }

    if (oldData) {
      const tempDiff = Math.abs(newData.temp - oldData.temp);
      if (tempDiff >= 5) {
        const direction = newData.temp > oldData.temp ? 'повысилась' : 'понизилась';
        addNotification({
          cityName,
          type: 'temperature',
          message: `Температура ${direction} на ${tempDiff.toFixed(1)}°C`,
          severity: tempDiff >= 10 ? 'warning' : 'info',
        });
      }

      if (oldData.windSpeed < 15 && newData.windSpeed >= 15) {
        addNotification({
          cityName,
          type: 'wind',
          message: `Усиление ветра до ${newData.windSpeed} км/ч`,
          severity: 'warning',
        });
      }
    }
  };

  const checkWeather = async () => {
    if (favorites.length === 0) return;

    for (const city of favorites) {
      try {
        const res = await fetch(`${WEATHER_API}?lat=${city.lat}&lon=${city.lon}`);
        const data = await res.json();
        
        const newWeatherData: WeatherData = {
          temp: data.current.temp,
          windSpeed: data.current.windSpeed,
          weatherCode: data.current.weatherCode || 0,
          humidity: data.current.humidity,
        };

        const cityKey = `${city.lat},${city.lon}`;
        const oldData = lastWeatherData.current[cityKey];

        analyzeWeatherChange(
          city.name,
          oldData || null,
          newWeatherData
        );

        lastWeatherData.current[cityKey] = {
          ...newWeatherData,
          lastChecked: Date.now(),
        };
      } catch (error) {
        console.error(`Failed to check weather for ${city.name}:`, error);
      }
    }
  };

  useEffect(() => {
    if (favorites.length === 0) return;

    checkWeather();

    const interval = setInterval(checkWeather, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, [favorites]);

  return { checkWeather };
};
