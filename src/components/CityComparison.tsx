import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface City {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  country: string;
}

interface CityWeather {
  city: City;
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  loading: boolean;
}

const WEATHER_API = 'https://functions.poehali.dev/2e1fb99e-adfb-4041-b171-a245be920e5c';

const getWeatherIcon = (code: number): string => {
  if (code === 0) return 'Sun';
  if (code <= 3) return 'CloudSun';
  if (code <= 48) return 'Cloud';
  if (code <= 67) return 'CloudRain';
  if (code <= 77) return 'CloudSnow';
  if (code <= 82) return 'CloudRain';
  if (code <= 86) return 'CloudSnow';
  return 'CloudLightning';
};

interface CityComparisonProps {
  cities: City[];
  onClose: () => void;
  isDarkTheme: boolean;
}

export default function CityComparison({ cities, onClose, isDarkTheme }: CityComparisonProps) {
  const [citiesWeather, setCitiesWeather] = useState<CityWeather[]>([]);

  const bgGradient = isDarkTheme
    ? 'from-slate-900 via-purple-900 to-slate-900'
    : 'from-blue-50 via-purple-50 to-pink-50';
  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/70';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  useEffect(() => {
    const fetchAllWeather = async () => {
      const weatherPromises = cities.map(async (city) => {
        try {
          const res = await fetch(`${WEATHER_API}?lat=${city.lat}&lon=${city.lon}`);
          const data = await res.json();
          return {
            city,
            temp: data.current.temp,
            condition: data.current.condition,
            humidity: data.current.humidity,
            windSpeed: data.current.windSpeed,
            weatherCode: data.current.weatherCode || 0,
            loading: false,
          };
        } catch (error) {
          return {
            city,
            temp: 0,
            condition: 'Ошибка загрузки',
            humidity: 0,
            windSpeed: 0,
            weatherCode: 0,
            loading: false,
          };
        }
      });

      const results = await Promise.all(weatherPromises);
      setCitiesWeather(results);
    };

    if (cities.length > 0) {
      setCitiesWeather(cities.map(city => ({
        city,
        temp: 0,
        condition: '',
        humidity: 0,
        windSpeed: 0,
        weatherCode: 0,
        loading: true,
      })));
      fetchAllWeather();
    }
  }, [cities]);

  const maxTemp = Math.max(...citiesWeather.map(c => c.temp));
  const minTemp = Math.min(...citiesWeather.map(c => c.temp));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <Card className={`${cardBg} backdrop-blur-xl ${borderColor} p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Icon name="GitCompare" className={textColor} size={32} />
            <h2 className={`text-3xl font-bold ${textColor}`}>Сравнение городов</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 hover:bg-white/20 rounded-xl transition-all`}
          >
            <Icon name="X" className={textColor} size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {citiesWeather.map((cityWeather, index) => (
            <Card
              key={index}
              className={`${cardBg} backdrop-blur-sm ${borderColor} p-6 animate-scale-in relative overflow-hidden`}
            >
              {cityWeather.temp === maxTemp && maxTemp !== minTemp && (
                <Badge className="absolute top-4 right-4 bg-red-500/80 text-white border-none">
                  Самый жаркий
                </Badge>
              )}
              {cityWeather.temp === minTemp && maxTemp !== minTemp && (
                <Badge className="absolute top-4 right-4 bg-blue-500/80 text-white border-none">
                  Самый холодный
                </Badge>
              )}

              <div className="flex items-center gap-2 mb-4">
                <Icon name="MapPin" className={textColor} size={20} />
                <h3 className={`text-xl font-semibold ${textColor}`}>
                  {cityWeather.city.name}
                </h3>
              </div>

              {cityWeather.loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <Icon
                        name={getWeatherIcon(cityWeather.weatherCode)}
                        className={textColor}
                        size={48}
                      />
                      <div>
                        <p className={`text-5xl font-bold ${textColor}`}>
                          {cityWeather.temp}°
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className={`${textSecondary} mb-6`}>{cityWeather.condition}</p>

                  <div className="space-y-3">
                    <div className={`flex items-center justify-between p-3 ${cardBg} rounded-xl backdrop-blur-sm`}>
                      <div className="flex items-center gap-2">
                        <Icon name="Droplets" className={textColor} size={20} />
                        <span className={textSecondary}>Влажность</span>
                      </div>
                      <span className={`font-semibold ${textColor}`}>
                        {cityWeather.humidity}%
                      </span>
                    </div>

                    <div className={`flex items-center justify-between p-3 ${cardBg} rounded-xl backdrop-blur-sm`}>
                      <div className="flex items-center gap-2">
                        <Icon name="Wind" className={textColor} size={20} />
                        <span className={textSecondary}>Ветер</span>
                      </div>
                      <span className={`font-semibold ${textColor}`}>
                        {cityWeather.windSpeed} км/ч
                      </span>
                    </div>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>

        {citiesWeather.length === 0 && (
          <div className="text-center py-12">
            <Icon name="MapPin" className={`${textSecondary} mx-auto mb-4`} size={48} />
            <p className={textSecondary}>Добавьте города в избранное для сравнения</p>
          </div>
        )}
      </Card>
    </div>
  );
}
