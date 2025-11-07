import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { getCityById, type CityData } from '@/data/russianCities';
import WeatherAnimation from '@/components/WeatherAnimation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const WEATHER_API = 'https://functions.poehali.dev/2e1fb99e-adfb-4041-b171-a245be920e5c';

interface WeatherData {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  weatherCode: number;
}

const CityDetail = () => {
  const { cityId } = useParams<{ cityId: string }>();
  const navigate = useNavigate();
  const [city, setCity] = useState<CityData | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cityId) {
      const cityData = getCityById(cityId);
      if (cityData) {
        setCity(cityData);
        fetchWeather(cityData.lat, cityData.lon);
      } else {
        navigate('/cities');
      }
    }
  }, [cityId, navigate]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const response = await fetch(`${WEATHER_API}?lat=${lat}&lon=${lon}`);
      const data = await response.json();
      setWeather({
        temp: data.current.temp,
        feelsLike: data.current.feelsLike,
        humidity: data.current.humidity,
        windSpeed: data.current.windSpeed,
        condition: data.current.condition,
        weatherCode: data.current.weatherCode || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error('Weather fetch error:', error);
      setLoading(false);
    }
  };

  if (!city) {
    return null;
  }

  const formatPopulation = (pop: number) => {
    return new Intl.NumberFormat('ru-RU').format(pop);
  };

  const getAgeOfCity = () => {
    const currentYear = new Date().getFullYear();
    return currentYear - city.founded;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#8B5CF6] to-[#F97316] p-4 md:p-8 relative overflow-hidden">
      <WeatherAnimation weatherCode={weather?.weatherCode || 0} />
      
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/cities')}
            className="p-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-full hover:scale-110 transition-all"
          >
            <Icon name="ArrowLeft" className="text-white" size={24} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-6xl font-bold text-white">{city.name}</h1>
              {city.isCapital && (
                <Badge className="bg-yellow-500/80 text-white border-none">
                  <Icon name="Crown" size={16} className="mr-1" />
                  Столица
                </Badge>
              )}
            </div>
            <p className="text-white/80 text-xl">{city.region}</p>
          </div>
          {weather && (
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 px-6 py-4">
              <div className="flex items-center gap-3">
                <Icon name="CloudSun" className="text-white" size={32} />
                <div>
                  <div className="text-3xl font-bold text-white">{Math.round(weather.temp)}°</div>
                  <div className="text-white/70 text-sm">{weather.condition}</div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8">
          <p className="text-white text-lg leading-relaxed">{city.description}</p>
        </Card>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-xl border-white/20">
            <TabsTrigger value="info" className="data-[state=active]:bg-white/20 text-white">
              <Icon name="Info" size={18} className="mr-2" />
              Информация
            </TabsTrigger>
            <TabsTrigger value="weather" className="data-[state=active]:bg-white/20 text-white">
              <Icon name="Cloud" size={18} className="mr-2" />
              Погода
            </TabsTrigger>
            <TabsTrigger value="facts" className="data-[state=active]:bg-white/20 text-white">
              <Icon name="Sparkles" size={18} className="mr-2" />
              Факты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Icon name="Users" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Население</div>
                    <div className="text-2xl font-bold text-white">{formatPopulation(city.population)}</div>
                    <div className="text-white/60 text-xs mt-1">человек</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Icon name="Calendar" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Основан</div>
                    <div className="text-2xl font-bold text-white">{city.founded}</div>
                    <div className="text-white/60 text-xs mt-1">{getAgeOfCity()} лет назад</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Icon name="Maximize" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Площадь</div>
                    <div className="text-2xl font-bold text-white">{city.area}</div>
                    <div className="text-white/60 text-xs mt-1">км²</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Icon name="MapPin" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Координаты</div>
                    <div className="text-lg font-bold text-white">{city.lat.toFixed(4)}°</div>
                    <div className="text-lg font-bold text-white">{city.lon.toFixed(4)}°</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Icon name="Mountain" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Высота над уровнем моря</div>
                    <div className="text-2xl font-bold text-white">{city.elevation}</div>
                    <div className="text-white/60 text-xs mt-1">метров</div>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/10 rounded-xl">
                    <Icon name="Clock" className="text-white" size={24} />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-1">Часовой пояс</div>
                    <div className="text-lg font-bold text-white">{city.timezone}</div>
                    <div className="text-white/60 text-xs mt-1">UTC+{new Date().toLocaleString('en-US', { timeZone: city.timezone, timeZoneName: 'short' }).split(' ').pop()}</div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="weather" className="mt-6">
            {loading ? (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-12 text-center">
                <div className="animate-spin mx-auto mb-4">
                  <Icon name="Loader2" size={48} className="text-white" />
                </div>
                <p className="text-white">Загрузка погоды...</p>
              </Card>
            ) : weather ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="Thermometer" className="text-white" size={24} />
                    <div className="text-white/70">Температура</div>
                  </div>
                  <div className="text-4xl font-bold text-white">{Math.round(weather.temp)}°C</div>
                  <div className="text-white/60 text-sm mt-1">Ощущается как {Math.round(weather.feelsLike)}°C</div>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="Droplets" className="text-white" size={24} />
                    <div className="text-white/70">Влажность</div>
                  </div>
                  <div className="text-4xl font-bold text-white">{weather.humidity}%</div>
                  <div className="text-white/60 text-sm mt-1">
                    {weather.humidity > 70 ? 'Высокая' : weather.humidity > 40 ? 'Комфортная' : 'Низкая'}
                  </div>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="Wind" className="text-white" size={24} />
                    <div className="text-white/70">Ветер</div>
                  </div>
                  <div className="text-4xl font-bold text-white">{Math.round(weather.windSpeed)}</div>
                  <div className="text-white/60 text-sm mt-1">км/ч</div>
                </Card>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon name="CloudSun" className="text-white" size={24} />
                    <div className="text-white/70">Условия</div>
                  </div>
                  <div className="text-xl font-bold text-white">{weather.condition}</div>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-12 text-center">
                <Icon name="CloudOff" size={48} className="text-white/40 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Нет данных о погоде</h3>
                <p className="text-white/70">Не удалось загрузить информацию о погоде</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="facts" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/20 rounded-lg">
                    <Icon name="Trophy" className="text-yellow-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Рейтинг по населению</h3>
                    <p className="text-white/70">
                      {city.population > 5000000 ? '1-2 место среди городов России' :
                       city.population > 1500000 ? 'Входит в топ-5 крупнейших городов' :
                       city.population > 1000000 ? 'Город-миллионник' :
                       city.population > 500000 ? 'Крупный региональный центр' :
                       'Региональный центр'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Icon name="History" className="text-blue-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Историческое значение</h3>
                    <p className="text-white/70">
                      {city.founded < 1200 ? 'Один из древнейших городов России' :
                       city.founded < 1600 ? 'Город с богатой средневековой историей' :
                       city.founded < 1800 ? 'Основан в эпоху Российской Империи' :
                       'Относительно молодой город'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Icon name="TrendingUp" className="text-green-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Плотность населения</h3>
                    <p className="text-white/70">
                      {Math.round(city.population / city.area)} человек на км²
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      {(city.population / city.area) > 5000 ? 'Очень высокая плотность' :
                       (city.population / city.area) > 3000 ? 'Высокая плотность' :
                       (city.population / city.area) > 2000 ? 'Средняя плотность' :
                       'Низкая плотность'}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Icon name="Compass" className="text-purple-300" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Географическое положение</h3>
                    <p className="text-white/70">
                      {city.lon > 60 ? 'Азиатская часть России' : 'Европейская часть России'}
                    </p>
                    <p className="text-white/60 text-sm mt-1">
                      {city.lat > 60 ? 'Заполярье и северные широты' :
                       city.lat > 55 ? 'Средняя полоса' :
                       city.lat > 50 ? 'Южная часть средней полосы' :
                       'Южные регионы'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Хотите узнать больше?</h3>
              <p className="text-white/70">Исследуйте другие города России</p>
            </div>
            <button
              onClick={() => navigate('/cities')}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 border-2 border-white/30 rounded-xl text-white font-medium transition-all flex items-center gap-2"
            >
              Все города
              <Icon name="ArrowRight" size={20} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CityDetail;
