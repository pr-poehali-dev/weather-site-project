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
  condition: string;
  icon: string;
}

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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setTimeout(() => setLoading(false), 1000);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const forecast: ForecastDay[] = [
    { day: 'Пн', temp: 26, condition: 'Ясно', icon: 'Sun' },
    { day: 'Вт', temp: 24, condition: 'Облачно', icon: 'Cloud' },
    { day: 'Ср', temp: 22, condition: 'Дождь', icon: 'CloudRain' },
    { day: 'Чт', temp: 23, condition: 'Переменно', icon: 'CloudSun' },
    { day: 'Пт', temp: 25, condition: 'Ясно', icon: 'Sun' },
    { day: 'Сб', temp: 27, condition: 'Жарко', icon: 'Sun' },
    { day: 'Вс', temp: 26, condition: 'Облачно', icon: 'Cloud' },
  ];

  const hourlyData = [
    { time: '00:00', temp: 20, rain: 10 },
    { time: '03:00', temp: 19, rain: 30 },
    { time: '06:00', temp: 18, rain: 60 },
    { time: '09:00', temp: 21, rain: 80 },
    { time: '12:00', temp: 24, rain: 50 },
    { time: '15:00', temp: 26, rain: 20 },
    { time: '18:00', temp: 23, rain: 5 },
    { time: '21:00', temp: 21, rain: 0 },
  ];

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
                    <p className="text-3xl font-bold text-white mb-2">{day.temp}°</p>
                    <p className="text-white/60 text-sm">{day.condition}</p>
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
