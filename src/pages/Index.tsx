import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import WeatherAnimation from '@/components/WeatherAnimation';
import WeatherAlert from '@/components/WeatherAlert';
import CityComparison from '@/components/CityComparison';
import WeatherNotifications from '@/components/WeatherNotifications';
import WeatherInformers from '@/components/WeatherInformers';
import WeatherDetailsWidgets from '@/components/WeatherDetailsWidgets';
import WeatherCharts from '@/components/WeatherCharts';
import WeeklyForecast from '@/components/WeeklyForecast';
import WeatherMap from '@/components/WeatherMap';
import NotificationSettings from '@/components/NotificationSettings';
import NewsModal from '@/components/NewsModal';
import CitiesGrid from '@/components/CitiesGrid';
import { useWeatherMonitor } from '@/hooks/useWeatherMonitor';
import { usePushNotifications, NotificationSettings as NotificationSettingsType } from '@/hooks/usePushNotifications';
import { notificationService } from '@/utils/notificationService';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';

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
const SEARCH_API = 'https://functions.poehali.dev/0afa56b1-0f02-4dc9-9692-702a4f2e8338';

interface City {
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  country: string;
}

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
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData>({
    temp: 24,
    feelsLike: 22,
    humidity: 65,
    windSpeed: 12,
    condition: 'Переменная облачность',
    location: 'Москва',
  });
  const [currentWeatherCode, setCurrentWeatherCode] = useState(0);

  const [loading, setLoading] = useState(true);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyData[]>([]);
  const [coords, setCoords] = useState({ lat: 55.7558, lon: 37.6173 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [favorites, setFavorites] = useState<City[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettingsType>(() => {
    const saved = localStorage.getItem('weatherNotificationSettings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      temperature: true,
      wind: true,
      storm: true,
      snow: true,
      rain: true,
      tempThreshold: 5,
      windThreshold: 10,
    };
  });
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(
    notificationService.getPermissionStatus()
  );
  const [selectedNews, setSelectedNews] = useState<any>(null);

  useWeatherMonitor(favorites);
  usePushNotifications(weather, notificationSettings);

  useEffect(() => {
    notificationService.checkWeatherAlert(
      'Температура',
      `${weather.temp}°C`,
      weather.condition
    );
    notificationService.checkWeatherAlert(
      'Скорость ветра',
      `${weather.windSpeed} м/с`,
      'Ветер'
    );
    notificationService.checkWeatherAlert(
      'Влажность',
      `${weather.humidity}%`,
      'Влажность воздуха'
    );
  }, [weather]);

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
        setCurrentWeatherCode(weatherData.current.weatherCode || 0);

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

    const savedFavorites = localStorage.getItem('favoriteCities');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedTheme = localStorage.getItem('weatherTheme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (favoritesRef.current && !favoritesRef.current.contains(event.target as Node)) {
        setShowFavorites(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`${SEARCH_API}?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSearchResults(data.cities || []);
        setShowDropdown(data.cities?.length > 0);
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 300);
  };

  const toggleFavorite = (city: City) => {
    const isFavorite = favorites.some(f => f.lat === city.lat && f.lon === city.lon);
    let newFavorites: City[];
    
    if (isFavorite) {
      newFavorites = favorites.filter(f => !(f.lat === city.lat && f.lon === city.lon));
    } else {
      newFavorites = [...favorites, city];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteCities', JSON.stringify(newFavorites));
  };

  const isCityFavorite = (city: City) => {
    return favorites.some(f => f.lat === city.lat && f.lon === city.lon);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('weatherTheme', newTheme ? 'dark' : 'light');
  };

  const selectCity = async (city: City) => {
    setSearchQuery(city.displayName);
    setShowDropdown(false);
    setShowFavorites(false);
    setLoading(true);
    setCoords({ lat: city.lat, lon: city.lon });

    try {
      const weatherRes = await fetch(`${WEATHER_API}?lat=${city.lat}&lon=${city.lon}`);
      const weatherData = await weatherRes.json();

      setWeather({
        temp: weatherData.current.temp,
        feelsLike: weatherData.current.feelsLike,
        humidity: weatherData.current.humidity,
        windSpeed: weatherData.current.windSpeed,
        condition: weatherData.current.condition,
        location: city.displayName,
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

  const news = [
    {
      title: 'Сильные дожди ожидаются в выходные',
      time: '2 часа назад',
      category: 'Предупреждение',
      content: `Синоптики предупреждают о приближении мощного циклона, который принесёт обильные осадки в центральные регионы страны. Ожидается, что дожди начнутся в пятницу вечером и продлятся до воскресенья.\n\nПо прогнозам метеорологов, за выходные может выпасть до 50-70 мм осадков, что составляет месячную норму. Особенно сильные ливни ожидаются в субботу днём и вечером.\n\nВ связи с неблагоприятными погодными условиями рекомендуется воздержаться от поездок на личном транспорте, быть осторожными вблизи водоёмов и не находиться под деревьями во время грозы. Возможны подтопления низин и проблемы с дорожным движением.\n\nЭкстренные службы переведены в режим повышенной готовности. Жителям рекомендуется следить за обновлениями прогноза и соблюдать меры предосторожности.`,
      source: 'Гидрометцентр России',
      image: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800'
    },
    {
      title: 'Температурный рекорд побит в Сочи',
      time: '5 часов назад',
      category: 'Новости',
      content: `В Сочи зафиксирована рекордная температура для ноября - термометры показали +28°C, что на 5 градусов выше предыдущего максимума, установленного в 1987 году.\n\nПо словам метеорологов, такая аномально тёплая погода связана с приходом тропического воздуха из Средиземноморья и антициклоном над Чёрным морем. Тёплая погода сохранится как минимум до конца недели.\n\nНа пляжах курорта наблюдается необычная для ноября активность - сотни людей загорают и купаются в море. Температура воды составляет комфортные +22°C.\n\nОднако климатологи предупреждают, что такие температурные аномалии являются следствием глобального изменения климата и могут привести к непредсказуемым последствиям для экосистемы региона в долгосрочной перспективе.`,
      source: 'Метеостанция Сочи',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'
    },
    {
      title: 'Прогноз погоды на следующую неделю',
      time: '8 часов назад',
      category: 'Прогноз',
      content: `Следующая неделя принесёт значительные изменения в погоде по всей стране. Синоптики прогнозируют похолодание и переход от дождей к первому снегу в северных регионах.\n\nВ понедельник и вторник ожидается переменная облачность с прояснениями, температура воздуха днём составит +8...+12°C. Ветер западный, умеренный, порывами до 15 м/с.\n\nСо среды начнётся заметное похолодание - холодный арктический воздух распространится на европейскую часть России. Температура понизится до +2...+5°C днём и до -2...0°C ночью. В четверг возможен первый снег с дождём.\n\nК выходным установится типичная для ноября погода: облачно, временами осадки, температура около 0°C. Водителям рекомендуется подготовить автомобили к зимнему сезону и сменить резину на зимнюю.`,
      source: 'Росгидромет',
      image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800'
    },
  ];

  const bgGradient = isDarkTheme
    ? 'bg-gradient-to-br from-[#0EA5E9] via-[#8B5CF6] to-[#F97316]'
    : 'bg-gradient-to-br from-[#FEF7CD] via-[#FDE1D3] to-[#FFDEE2]';
  
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkTheme ? 'text-white/80' : 'text-gray-700';
  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/80';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';
  const inputBg = isDarkTheme ? 'bg-white/20 border-white/30' : 'bg-white/60 border-gray-300';

  const handleEnableNotifications = async () => {
    const granted = await notificationService.requestPermission();
    if (granted) {
      setNotificationPermission('granted');
      notificationService.showNotification(
        '🔔 Уведомления включены!',
        { body: 'Вы будете получать оповещения о важных изменениях погоды' }
      );
    } else {
      setNotificationPermission('denied');
    }
  };

  return (
    <>
      <SEO 
        title="Погода в России — точный прогноз погоды на сегодня и неделю"
        description="Актуальная погода в крупнейших городах России: Москва, Санкт-Петербург, Новосибирск, Екатеринбург. Точный прогноз на сегодня, неделю. Температура, влажность, ветер, давление."
        keywords="погода, прогноз погоды, погода в России, температура, влажность, давление, ветер"
        canonical="https://weather-site-project.poehali.dev/"
      />
      <div className={`min-h-screen ${bgGradient} p-4 md:p-8 transition-all duration-500 relative overflow-hidden`}>
        <WeatherAnimation weatherCode={currentWeatherCode} />
      
      {notificationPermission === 'default' && (
        <div className={`fixed top-4 right-4 z-50 ${cardBg} backdrop-blur-xl border ${borderColor} rounded-2xl p-4 shadow-2xl max-w-md animate-slide-in`}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Icon name="Bell" size={24} className="text-blue-500" />
            </div>
            <div className="flex-1">
              <div className={`font-semibold ${textColor} mb-1`}>Включить уведомления?</div>
              <div className={`text-sm ${textSecondary} mb-3`}>
                Получайте оповещения о резких изменениях погоды, экстремальных температурах и сильном ветре
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleEnableNotifications}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  size="sm"
                >
                  <Icon name="Check" size={16} className="mr-2" />
                  Включить
                </Button>
                <Button
                  onClick={() => setNotificationPermission('denied')}
                  variant="outline"
                  size="sm"
                >
                  Позже
                </Button>
              </div>
            </div>
            <button
              onClick={() => setNotificationPermission('denied')}
              className={`${textSecondary} hover:${textColor} transition-colors`}
            >
              <Icon name="X" size={20} />
            </button>
          </div>
        </div>
      )}
      
      <WeatherAlert 
        weatherCode={currentWeatherCode} 
        temp={weather.temp} 
        windSpeed={weather.windSpeed}
        isDarkTheme={isDarkTheme}
      />
      <div className="max-w-7xl mx-auto space-y-6 relative z-10">
        <header className="text-center py-8 animate-fade-in relative">
          <div className="absolute top-4 left-4">
            <button
              onClick={() => navigate('/cities')}
              className={`p-3 ${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-full hover:scale-110 transition-all group`}
              title="Города России"
            >
              <Icon name="MapPin" className={`${textColor} group-hover:text-primary transition-colors`} size={24} />
            </button>
          </div>
          <div className="absolute top-4 right-4 flex items-center gap-3">
            <div className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-full px-4 py-2 flex items-center gap-3 animate-fade-in`}>
              <Icon name={getWeatherIcon(currentWeatherCode)} className={textColor} size={28} />
              <span className={`text-2xl font-bold ${textColor}`}>{Math.round(weather.temp)}°</span>
            </div>
            <WeatherNotifications isDarkTheme={isDarkTheme} />
            <button
              onClick={() => setShowNotificationSettings(true)}
              className={`p-3 ${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-full hover:scale-110 transition-all`}
              title="Настройки уведомлений"
            >
              <Icon name="Bell" className={textColor} size={24} />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-3 ${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-full hover:scale-110 transition-all`}
            >
              <Icon name={isDarkTheme ? "Sun" : "Moon"} className={textColor} size={24} />
            </button>
          </div>

          <h1 className={`text-5xl md:text-7xl font-bold ${textColor} mb-4 tracking-tight`}>
            Прогноз Погоды
          </h1>
          <p className={`${textSecondary} text-lg mb-6`}>Точные данные в режиме реального времени</p>
          
          <div className="max-w-2xl mx-auto relative" ref={dropdownRef}>
            <div className="relative flex gap-2">
              <div className="flex-1 relative">
                <Icon name="Search" className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkTheme ? 'text-white/60' : 'text-gray-600'}`} size={20} />
                <input
                  type="text"
                  placeholder="Поиск города..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                  className={`w-full pl-12 pr-4 py-4 ${inputBg} backdrop-blur-xl border-2 rounded-2xl ${textColor} ${isDarkTheme ? 'placeholder-white/60' : 'placeholder-gray-500'} focus:outline-none ${isDarkTheme ? 'focus:border-white/50' : 'focus:border-gray-400'} transition-all text-lg`}
                />
              </div>
              <button
                onClick={() => setShowFavorites(!showFavorites)}
                className={`px-6 py-4 ${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-2xl hover:bg-white/30 transition-all relative`}
              >
                <Icon name="Star" className={favorites.length > 0 ? "text-yellow-300 fill-yellow-300" : textColor} size={24} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              {favorites.length >= 2 && (
                <button
                  onClick={() => setShowComparison(true)}
                  className={`px-6 py-4 ${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-2xl hover:bg-white/30 transition-all flex items-center gap-2`}
                >
                  <Icon name="GitCompare" className={textColor} size={24} />
                </button>
              )}
            </div>
            
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
                {searchResults.map((city, index) => (
                  <div
                    key={index}
                    className="w-full px-6 py-4 hover:bg-primary/10 transition-colors border-b border-gray-200 last:border-0 flex items-center justify-between"
                  >
                    <button
                      onClick={() => selectCity(city)}
                      className="flex items-center gap-3 flex-1 text-left"
                    >
                      <Icon name="MapPin" className="text-primary" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{city.name}</p>
                        <p className="text-sm text-gray-600">{city.country}</p>
                      </div>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(city);
                      }}
                      className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                      <Icon
                        name="Star"
                        className={isCityFavorite(city) ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}
                        size={20}
                      />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showFavorites && (
              <div ref={favoritesRef} className="absolute top-full mt-2 right-0 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden z-50 animate-scale-in">
                <div className="p-4 border-b border-gray-200 bg-primary/5">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Icon name="Star" className="text-yellow-500 fill-yellow-500" size={20} />
                    Избранные города
                  </h3>
                </div>
                {favorites.length === 0 ? (
                  <div className="p-6 text-center text-gray-600">
                    <p>Нет избранных городов</p>
                    <p className="text-sm mt-2">Добавьте города через поиск</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {favorites.map((city, index) => (
                      <div
                        key={index}
                        className="px-6 py-4 hover:bg-primary/10 transition-colors border-b border-gray-200 last:border-0 flex items-center justify-between"
                      >
                        <button
                          onClick={() => selectCity(city)}
                          className="flex items-center gap-3 flex-1 text-left"
                        >
                          <Icon name="MapPin" className="text-primary" size={20} />
                          <div>
                            <p className="font-medium text-gray-900">{city.name}</p>
                            <p className="text-sm text-gray-600">{city.country}</p>
                          </div>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(city);
                          }}
                          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                        >
                          <Icon name="Trash2" className="text-red-500" size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className={`lg:col-span-2 ${cardBg} backdrop-blur-xl ${borderColor} p-8 animate-scale-in`}>
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="MapPin" className={textColor} size={24} />
                  <h2 className={`text-2xl font-semibold ${textColor}`}>{weather.location}</h2>
                  <button
                    onClick={() => toggleFavorite({
                      name: weather.location,
                      displayName: weather.location,
                      lat: coords.lat,
                      lon: coords.lon,
                      country: ''
                    })}
                    className={`p-2 hover:bg-white/20 rounded-lg transition-all`}
                  >
                    <Icon
                      name="Star"
                      className={isCityFavorite({
                        name: weather.location,
                        displayName: weather.location,
                        lat: coords.lat,
                        lon: coords.lon,
                        country: ''
                      }) ? "text-yellow-300 fill-yellow-300" : textSecondary}
                      size={20}
                    />
                  </button>
                </div>
                <p className={textSecondary}>
                  {loading ? 'Определяем местоположение...' : 'Сегодня'}
                </p>
              </div>
              <Badge className={`${cardBg} ${textColor} border-none`}>Сейчас</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Icon name="CloudSun" className={`${textColor} animate-float`} size={80} />
                  <div>
                    <div className={`text-7xl font-bold ${textColor}`}>{weather.temp}°</div>
                    <p className={`${textSecondary} text-lg`}>{weather.condition}</p>
                  </div>
                </div>
                <p className={textSecondary}>Ощущается как {weather.feelsLike}°</p>
              </div>

              <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 ${cardBg} rounded-2xl backdrop-blur-sm transition-all hover:bg-white/30`}>
                  <Icon name="Droplets" className={textColor} size={32} />
                  <div>
                    <p className={`${textSecondary} text-sm`}>Влажность</p>
                    <p className={`text-2xl font-semibold ${textColor}`}>{weather.humidity}%</p>
                  </div>
                </div>
                <div className={`flex items-center gap-4 p-4 ${cardBg} rounded-2xl backdrop-blur-sm transition-all hover:bg-white/30`}>
                  <Icon name="Wind" className={textColor} size={32} />
                  <div>
                    <p className={`${textSecondary} text-sm`}>Ветер</p>
                    <p className={`text-2xl font-semibold ${textColor}`}>{weather.windSpeed} км/ч</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            {favorites.length > 0 && (
              <Card className={`${cardBg} backdrop-blur-xl ${borderColor} p-6 animate-scale-in`}>
                <h3 className={`text-xl font-semibold ${textColor} mb-4 flex items-center gap-2`}>
                  <Icon name="Star" className="text-yellow-300 fill-yellow-300" size={24} />
                  Избранные города
                </h3>
                <div className="space-y-2">
                  {favorites.slice(0, 4).map((city, index) => (
                    <button
                      key={index}
                      onClick={() => selectCity(city)}
                      className={`w-full p-3 ${cardBg} rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all text-left flex items-center justify-between group`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" className={textColor} size={18} />
                        <span className={`${textColor} font-medium`}>{city.name}</span>
                      </div>
                      <Icon name="ChevronRight" className={`${textSecondary} group-hover:${textColor} transition-colors`} size={18} />
                    </button>
                  ))}
                </div>
              </Card>
            )}

            <Card className={`${cardBg} backdrop-blur-xl ${borderColor} p-6 animate-scale-in`}>
              <h3 className={`text-xl font-semibold ${textColor} mb-4 flex items-center gap-2`}>
                <Icon name="Newspaper" size={24} />
                Новости погоды
              </h3>
              <div className="space-y-4">
                {news.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedNews(item)}
                    className={`p-4 ${cardBg} rounded-xl backdrop-blur-sm hover:bg-white/30 transition-all cursor-pointer group`}
                  >
                    <Badge className="bg-accent/80 text-white border-none mb-2 text-xs">
                      {item.category}
                    </Badge>
                    <p className={`${textColor} font-medium mb-1 group-hover:text-primary transition-colors`}>{item.title}</p>
                    <div className="flex items-center justify-between">
                      <p className={`${textSecondary} text-sm`}>{item.time}</p>
                      <Icon name="ChevronRight" className={`${textSecondary} group-hover:${textColor} transition-all group-hover:translate-x-1`} size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        <WeatherInformers
          humidity={weather.humidity}
          windSpeed={weather.windSpeed}
          pressure={1013}
          visibility={10}
          uvIndex={5}
          dewPoint={weather.feelsLike - 2}
          isDarkTheme={isDarkTheme}
        />

        <WeatherDetailsWidgets
          sunrise="06:24"
          sunset="18:45"
          moonPhase="Растущая луна"
          airQuality={45}
          precipitation={25}
          cloudCover={60}
          isDarkTheme={isDarkTheme}
        />

        <WeatherCharts
          hourlyData={hourlyData}
          isDarkTheme={isDarkTheme}
        />

        <Card className={`${cardBg} backdrop-blur-xl ${borderColor} p-6 animate-fade-in`}>
          <Tabs defaultValue="week" className="w-full">
            <TabsList className={`grid w-full grid-cols-3 ${cardBg} mb-6`}>
              <TabsTrigger value="week" className={`${isDarkTheme ? 'data-[state=active]:bg-white/20' : 'data-[state=active]:bg-white'} ${textColor}`}>
                Неделя
              </TabsTrigger>
              <TabsTrigger value="hourly" className={`${isDarkTheme ? 'data-[state=active]:bg-white/20' : 'data-[state=active]:bg-white'} ${textColor}`}>
                Почасовой
              </TabsTrigger>
              <TabsTrigger value="map" className={`${isDarkTheme ? 'data-[state=active]:bg-white/20' : 'data-[state=active]:bg-white'} ${textColor}`}>
                Карта
              </TabsTrigger>
            </TabsList>

            <TabsContent value="week">
              <WeeklyForecast
                forecast={forecast.map(day => ({
                  day: day.day,
                  date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' }),
                  temp: day.temp,
                  tempMin: day.tempMin,
                  tempMax: day.temp + 4,
                  condition: day.condition,
                  icon: day.icon,
                  humidity: 60,
                  windSpeed: 12,
                  precipitation: 20,
                  uvIndex: 5,
                  sunrise: '06:24',
                  sunset: '18:45'
                }))}
                isDarkTheme={isDarkTheme}
              />
            </TabsContent>

            <TabsContent value="hourly">
              <div className="space-y-4">
                <h4 className={`${textColor} font-semibold mb-4 flex items-center gap-2`}>
                  <Icon name="Clock" size={20} />
                  Почасовой прогноз и осадки
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hourlyData.map((hour, index) => (
                    <div
                      key={index}
                      className={`p-4 ${cardBg} rounded-2xl backdrop-blur-sm hover:bg-white/30 transition-all`}
                    >
                      <p className={`${textSecondary} text-sm mb-2`}>{hour.time}</p>
                      <p className={`text-2xl font-bold ${textColor} mb-3`}>{hour.temp}°</p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Icon name="CloudRain" className={textSecondary} size={16} />
                          <p className={`${textColor} text-sm`}>{hour.rain}%</p>
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
              <WeatherMap
                isDarkTheme={isDarkTheme}
                currentCity={weather.location}
                currentTemp={weather.temp}
              />
            </TabsContent>
          </Tabs>
        </Card>

        <CitiesGrid isDarkTheme={isDarkTheme} />
      </div>

      {showComparison && (
        <CityComparison
          cities={favorites}
          onClose={() => setShowComparison(false)}
          isDarkTheme={isDarkTheme}
        />
      )}

      {showNotificationSettings && (
        <NotificationSettings
          onClose={() => setShowNotificationSettings(false)}
          onSettingsChange={(settings) => {
            setNotificationSettings(settings);
            localStorage.setItem('weatherNotificationSettings', JSON.stringify(settings));
          }}
          currentSettings={notificationSettings}
        />
      )}

      {selectedNews && (
        <NewsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
          isDarkTheme={isDarkTheme}
        />
      )}
      </div>
    </>
  );
};

export default Index;