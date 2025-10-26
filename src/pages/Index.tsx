import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  location: string;
}

interface ForecastDay {
  day: string;
  temp: number;
  tempMin: number;
  condition: string;
  icon: string;
}

interface HourlyData {
  time: string;
  temp: number;
  rain: number;
}

const WEATHER_API = 'https://functions.poehali.dev/2e1fb99e-adfb-4041-b171-a245be920e5c';
const GEOCODE_API = 'https://functions.poehali.dev/ab12ed1f-a6b0-4146-8827-fbee7e272262';

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

const Index = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 24,
    feelsLike: 22,
    humidity: 65,
    windSpeed: 12,
    condition: 'Переменная облачность',
    location: 'Москва',
  });

  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [coords, setCoords] = useState({ lat: 55.7558, lon: 37.6173 });

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const [weatherRes, geoRes] = await Promise.all([
          fetch(`${WEATHER_API}?lat=${lat}&lon=${lon}`),
          fetch(`${GEOCODE_API}?lat=${lat}&lon=${lon}`)
        ]);

        const weatherData = await weatherRes.json();
        const geoData = await geoRes.json();

        setWeather({
          temp: weatherData.current.temp,
          feelsLike: weatherData.current.feelsLike,
          humidity: weatherData.current.humidity,
          windSpeed: weatherData.current.windSpeed,
          condition: weatherData.current.condition,
          location: geoData.city || 'Москва',
        });

        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        const forecastDays = weatherData.daily.time.map((dateStr: string, i: number) => {
          const date = new Date(dateStr);
          const dayName = i === 0 ? 'Сегодня' : days[date.getDay()];
          const code = weatherData.daily.weatherCode[i];
          return {
            day: dayName,
            temp: weatherData.daily.tempMax[i],
            tempMin: weatherData.daily.tempMin[i],
            condition: weatherData.current.condition,
            icon: getWeatherIcon(code),
          };
        });
        setForecast(forecastDays);

        const hourly = weatherData.hourly.time.slice(0, 8).map((timeStr: string, i: number) => {
          const hour = new Date(timeStr).getHours();
          return {
            time: `${hour.toString().padStart(2, '0')}:00`,
            temp: weatherData.hourly.temperature[i],
            rain: weatherData.hourly.precipitation[i] || 0,
          };
        });
        setHourlyData(hourly);

        setLoading(false);
      } catch (error) {
        console.error('Weather fetch error:', error);
        setLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          fetchWeather(latitude, longitude);
        },
        () => {
          fetchWeather(coords.lat, coords.lon);
        }
      );
    } else {
      fetchWeather(coords.lat, coords.lon);
    }
  }, []);

  const news = [
    {
      title: 'Сильные дожди ожидаются в выходные',
      time: '2 часа назад',
      category: 'Предупреждение',
    },
    {
      title: 'Температурный рекорд побит в Сочи',
      time: '5 часов назад',
      category: 'Новости',
    },
    {
      title: 'Прогноз погоды на следующую неделю',
      time: '8 часов назад',
      category: 'Прогноз',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#8B5CF6] to-[#F97316] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="text-center py-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-2 tracking-tight">
            Прогноз Погоды
          </h1>
          <p className="text-white/80 text-lg">Точные данные в режиме реального времени</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-white/10 backdrop-blur-xl border-white/20 p-8 animate-scale-in">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="MapPin" className="text-white" size={24} />
                  <h2 className="text-2xl font-semibold text-white">{weather.location}</h2>
                </div>
                <p className="text-white/60">
                  {loading ? 'Определяем местоположение...' : 'Сегодня'}
                </p>
              </div>
              <Badge className="bg-white/20 text-white border-none">Сейчас</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Icon name="CloudSun" className="text-white animate-float" size={80} />
                  <div>
                    <div className="text-7xl font-bold text-white">{weather.temp}°</div>
                    <p className="text-white/80 text-lg">{weather.condition}</p>
                  </div>
                </div>
                <p className="text-white/60">Ощущается как {weather.feelsLike}°</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm transition-all hover:bg-white/20">
                  <Icon name="Droplets" className="text-white" size={32} />
                  <div>
                    <p className="text-white/60 text-sm">Влажность</p>
                    <p className="text-2xl font-semibold text-white">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm transition-all hover:bg-white/20">
                  <Icon name="Wind" className="text-white" size={32} />
                  <div>
                    <p className="text-white/60 text-sm">Ветер</p>
                    <p className="text-2xl font-semibold text-white">{weather.windSpeed} км/ч</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 animate-scale-in">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Icon name="Newspaper" size={24} />
              Новости погоды
            </h3>
            <div className="space-y-4">
              {news.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Badge className="bg-accent/80 text-white border-none mb-2 text-xs">
                    {item.category}
                  </Badge>
                  <p className="text-white font-medium mb-1">{item.title}</p>
                  <p className="text-white/60 text-sm">{item.time}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6 animate-fade-in">
          <Tabs defaultValue="week" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-white/10 mb-6">
              <TabsTrigger value="week" className="data-[state=active]:bg-white/20">
                Неделя
              </TabsTrigger>
              <TabsTrigger value="hourly" className="data-[state=active]:bg-white/20">
                Почасовой
              </TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-white/20">
                Карта
              </TabsTrigger>
            </TabsList>

            <TabsContent value="week">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {forecast.map((day, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all hover:scale-105 cursor-pointer text-center"
                  >
                    <p className="text-white font-semibold mb-3">{day.day}</p>
                    <Icon name={day.icon as any} className="text-white mx-auto mb-3 animate-pulse-glow" size={40} />
                    <p className="text-3xl font-bold text-white mb-1">{day.temp}°</p>
                    {day.tempMin !== undefined && (
                      <p className="text-white/60 text-sm">↓ {day.tempMin}°</p>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hourly">
              <div className="space-y-4">
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Icon name="Clock" size={20} />
                  Почасовой прогноз и осадки
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hourlyData.map((hour, index) => (
                    <div
                      key={index}
                      className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all"
                    >
                      <p className="text-white/60 text-sm mb-2">{hour.time}</p>
                      <p className="text-2xl font-bold text-white mb-3">{hour.temp}°</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon name="CloudRain" className="text-white/60" size={16} />
                          <p className="text-white/80 text-sm">{hour.rain}%</p>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${hour.rain}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="map">
              <div className="bg-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
                <Icon name="Map" className="text-white mx-auto mb-4 animate-pulse-glow" size={80} />
                <h4 className="text-2xl font-semibold text-white mb-2">Интерактивная карта погоды</h4>
                <p className="text-white/60 mb-6">
                  Радар осадков и температурная карта региона
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-white/10 rounded-xl">
                    <Icon name="Navigation" className="text-white mx-auto mb-2" size={32} />
                    <p className="text-white font-medium">Навигация</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl">
                    <Icon name="Layers" className="text-white mx-auto mb-2" size={32} />
                    <p className="text-white font-medium">Слои карты</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl">
                    <Icon name="Zap" className="text-white mx-auto mb-2" size={32} />
                    <p className="text-white font-medium">Грозы</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Index;