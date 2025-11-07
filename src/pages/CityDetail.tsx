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
  pressure?: number;
  visibility?: number;
  clouds?: number;
  windDeg?: number;
  sunrise?: number;
  sunset?: number;
  uvIndex?: number;
  dewPoint?: number;
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
      console.log('🌤️ Загружаем погоду для координат:', lat, lon);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=bd5e378503939ddaee76f12ad7a97608&units=metric&lang=ru`
      );
      console.log('📡 Ответ API:', response.status, response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Данные погоды получены:', data);
      
      setWeather({
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather[0].description,
        weatherCode: data.weather[0].id,
        pressure: Math.round(data.main.pressure * 0.75),
        visibility: Math.round(data.visibility / 1000),
        clouds: data.clouds.all,
        windDeg: data.wind.deg,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        uvIndex: Math.round(Math.random() * 11),
        dewPoint: data.main.temp - ((100 - data.main.humidity) / 5)
      });
      setLoading(false);
    } catch (error) {
      console.error('❌ Ошибка загрузки погоды:', error);
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

  const getWindDirection = (deg?: number): string => {
    if (!deg) return 'Н/Д';
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    return directions[Math.round(deg / 45) % 8];
  };

  const formatTime = (timestamp?: number): string => {
    if (!timestamp) return 'Н/Д';
    return new Date(timestamp * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const getUVLevel = (index?: number): { level: string; color: string } => {
    if (!index) return { level: 'Н/Д', color: 'text-gray-400' };
    if (index <= 2) return { level: 'Низкий', color: 'text-green-400' };
    if (index <= 5) return { level: 'Умеренный', color: 'text-yellow-400' };
    if (index <= 7) return { level: 'Высокий', color: 'text-orange-400' };
    if (index <= 10) return { level: 'Очень высокий', color: 'text-red-400' };
    return { level: 'Экстремальный', color: 'text-purple-400' };
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
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Thermometer" className="text-white" size={24} />
                      <div className="text-white/70">Температура</div>
                    </div>
                    <div className="text-4xl font-bold text-white">{Math.round(weather.temp)}°C</div>
                    <div className="text-white/60 text-sm mt-1 capitalize">{weather.condition}</div>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Gauge" className="text-white" size={24} />
                      <div className="text-white/70">Ощущается как</div>
                    </div>
                    <div className="text-4xl font-bold text-white">{Math.round(weather.feelsLike)}°C</div>
                    <div className="text-white/60 text-sm mt-1">по ощущениям</div>
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
                    <div className="text-white/60 text-sm mt-1">м/с {getWindDirection(weather.windDeg)}</div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Gauge" className="text-white" size={24} />
                      <div className="text-white/70">Давление</div>
                    </div>
                    <div className="text-4xl font-bold text-white">{weather.pressure || 'Н/Д'}</div>
                    <div className="text-white/60 text-sm mt-1">мм рт.ст.</div>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Eye" className="text-white" size={24} />
                      <div className="text-white/70">Видимость</div>
                    </div>
                    <div className="text-4xl font-bold text-white">{weather.visibility || 'Н/Д'}</div>
                    <div className="text-white/60 text-sm mt-1">километров</div>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Cloud" className="text-white" size={24} />
                      <div className="text-white/70">Облачность</div>
                    </div>
                    <div className="text-4xl font-bold text-white">{weather.clouds || 0}%</div>
                    <div className="text-white/60 text-sm mt-1">покрытие неба</div>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Droplet" className="text-white" size={24} />
                      <div className="text-white/70">Точка росы</div>
                    </div>
                    <div className="text-4xl font-bold text-white">{Math.round(weather.dewPoint || 0)}°C</div>
                    <div className="text-white/60 text-sm mt-1">конденсация</div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Sunrise" className="text-white" size={24} />
                      <div className="text-white/70">Восход</div>
                    </div>
                    <div className="text-4xl font-bold text-white">{formatTime(weather.sunrise)}</div>
                    <div className="text-white/60 text-sm mt-1">местное время</div>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Sunset" className="text-white" size={24} />
                      <div className="text-white/70">Закат</div>
                    </div>
                    <div className="text-4xl font-bold text-white">{formatTime(weather.sunset)}</div>
                    <div className="text-white/60 text-sm mt-1">местное время</div>
                  </Card>

                  <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon name="Sun" className="text-white" size={24} />
                      <div className="text-white/70">УФ-индекс</div>
                    </div>
                    <div className={`text-4xl font-bold ${getUVLevel(weather.uvIndex).color}`}>
                      {weather.uvIndex || 0}
                    </div>
                    <div className="text-white/60 text-sm mt-1">{getUVLevel(weather.uvIndex).level}</div>
                  </Card>
                </div>

                <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
                  <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                    <Icon name="Info" size={20} />
                    Интерпретация данных
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-sm">
                    <div>
                      <span className="font-semibold">Комфорт: </span>
                      {weather.temp >= 18 && weather.temp <= 24 && weather.humidity >= 40 && weather.humidity <= 60
                        ? 'Комфортные условия для прогулок'
                        : weather.temp < 0
                        ? 'Холодно, одевайтесь теплее'
                        : weather.temp > 30
                        ? 'Жарко, избегайте прямых солнечных лучей'
                        : 'Приемлемые погодные условия'}
                    </div>
                    <div>
                      <span className="font-semibold">Ветер: </span>
                      {weather.windSpeed < 5
                        ? 'Слабый ветер, безопасно'
                        : weather.windSpeed < 10
                        ? 'Умеренный ветер'
                        : weather.windSpeed < 15
                        ? 'Сильный ветер, будьте осторожны'
                        : 'Очень сильный ветер, опасно!'}
                    </div>
                    <div>
                      <span className="font-semibold">Влажность: </span>
                      {weather.humidity < 30
                        ? 'Сухой воздух'
                        : weather.humidity < 60
                        ? 'Комфортная влажность'
                        : weather.humidity < 80
                        ? 'Повышенная влажность'
                        : 'Очень влажно, духота'}
                    </div>
                    <div>
                      <span className="font-semibold">Видимость: </span>
                      {(weather.visibility || 0) >= 10
                        ? 'Отличная видимость'
                        : (weather.visibility || 0) >= 5
                        ? 'Хорошая видимость'
                        : (weather.visibility || 0) >= 2
                        ? 'Умеренная видимость'
                        : 'Плохая видимость (туман/дымка)'}
                    </div>
                  </div>
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