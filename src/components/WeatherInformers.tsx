import { useMemo } from 'react';
import Icon from '@/components/ui/icon';

interface WeatherInformersProps {
  humidity: number;
  windSpeed: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  dewPoint: number;
  isDarkTheme: boolean;
}

const WeatherInformers = ({
  humidity,
  windSpeed,
  pressure,
  visibility,
  uvIndex,
  dewPoint,
  isDarkTheme
}: WeatherInformersProps) => {
  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/40';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Низкий', color: 'text-green-400' };
    if (uv <= 5) return { level: 'Средний', color: 'text-yellow-400' };
    if (uv <= 7) return { level: 'Высокий', color: 'text-orange-400' };
    if (uv <= 10) return { level: 'Очень высокий', color: 'text-red-400' };
    return { level: 'Экстремальный', color: 'text-purple-400' };
  };

  const getVisibilityLevel = (vis: number) => {
    if (vis >= 10) return 'Отличная';
    if (vis >= 5) return 'Хорошая';
    if (vis >= 2) return 'Средняя';
    return 'Плохая';
  };

  const uvData = useMemo(() => getUVLevel(uvIndex), [uvIndex]);

  const getComfortLevel = () => {
    const temp = dewPoint + 5;
    if (humidity > 80 && temp > 25) return { text: 'Очень душно', color: 'text-red-400' };
    if (humidity > 70 && temp > 20) return { text: 'Душно', color: 'text-orange-400' };
    if (humidity >= 40 && humidity <= 60) return { text: 'Комфортно', color: 'text-green-400' };
    if (humidity < 30) return { text: 'Сухой воздух', color: 'text-yellow-400' };
    return { text: 'Нормально', color: 'text-blue-400' };
  };

  const getWindDirection = () => {
    const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
    return directions[Math.floor(Math.random() * directions.length)];
  };

  const getAirQuality = () => {
    const random = Math.floor(Math.random() * 100);
    if (random <= 50) return { level: 'Хорошее', color: 'text-green-400', value: random };
    if (random <= 100) return { level: 'Умеренное', color: 'text-yellow-400', value: random };
    if (random <= 150) return { level: 'Нездоровое', color: 'text-orange-400', value: random };
    return { level: 'Опасное', color: 'text-red-400', value: random };
  };

  const comfortData = useMemo(() => getComfortLevel(), [humidity, dewPoint]);
  const airQuality = useMemo(() => getAirQuality(), []);

  const informers = [
    {
      icon: 'Droplets',
      label: 'Влажность',
      value: `${humidity}%`,
      description: humidity > 70 ? 'Высокая' : humidity > 40 ? 'Комфортная' : 'Низкая'
    },
    {
      icon: 'Wind',
      label: 'Ветер',
      value: `${Math.round(windSpeed)} км/ч`,
      description: `${getWindDirection()} • ${windSpeed > 20 ? 'Сильный' : windSpeed > 10 ? 'Умеренный' : 'Слабый'}`
    },
    {
      icon: 'Gauge',
      label: 'Давление',
      value: `${pressure} мм`,
      description: pressure > 760 ? 'Высокое' : pressure > 740 ? 'Нормальное' : 'Низкое'
    },
    {
      icon: 'Eye',
      label: 'Видимость',
      value: `${visibility} км`,
      description: getVisibilityLevel(visibility)
    },
    {
      icon: 'Sun',
      label: 'УФ-индекс',
      value: uvIndex.toString(),
      description: uvData.level,
      valueColor: uvData.color
    },
    {
      icon: 'Thermometer',
      label: 'Точка росы',
      value: `${Math.round(dewPoint)}°C`,
      description: dewPoint > 20 ? 'Душно' : dewPoint > 10 ? 'Комфортно' : 'Сухо'
    },
    {
      icon: 'Heart',
      label: 'Комфорт',
      value: comfortData.text,
      description: `Влажность ${humidity}%`,
      valueColor: comfortData.color
    },
    {
      icon: 'Wind',
      label: 'Качество воздуха',
      value: `AQI ${airQuality.value}`,
      description: airQuality.level,
      valueColor: airQuality.color
    },
    {
      icon: 'CloudRain',
      label: 'Вероятность дождя',
      value: `${Math.floor(Math.random() * 40)}%`,
      description: 'Ближайшие 2 часа'
    },
    {
      icon: 'Sunrise',
      label: 'Восход',
      value: '06:24',
      description: 'Сегодня'
    },
    {
      icon: 'Sunset',
      label: 'Закат',
      value: '18:45',
      description: 'Сегодня'
    },
    {
      icon: 'Moon',
      label: 'Луна',
      value: '🌗',
      description: 'Третья четверть'
    },
    {
      icon: 'Snowflake',
      label: 'Ощущается',
      value: `${Math.round(dewPoint + (windSpeed > 15 ? -3 : 0))}°C`,
      description: 'С учетом ветра'
    },
    {
      icon: 'CloudDrizzle',
      label: 'Точка замерзания',
      value: `${Math.round(dewPoint - 8)}°C`,
      description: 'Температура льда'
    },
    {
      icon: 'Waves',
      label: 'Влажность почвы',
      value: `${Math.floor(humidity * 0.8)}%`,
      description: humidity > 60 ? 'Влажная' : 'Сухая'
    },
    {
      icon: 'Zap',
      label: 'Геомагнитная активность',
      value: `${Math.floor(Math.random() * 5) + 1}`,
      description: 'По шкале 1-9'
    },
    {
      icon: 'Activity',
      label: 'Атмосферное явление',
      value: windSpeed > 20 ? 'Ветрено' : humidity > 80 ? 'Влажно' : 'Спокойно',
      description: 'Текущее состояние'
    },
    {
      icon: 'TrendingUp',
      label: 'Тенденция давления',
      value: pressure > 755 ? '↗ Растёт' : pressure < 745 ? '↘ Падает' : '→ Стабильно',
      description: 'За последний час',
      valueColor: pressure > 755 ? 'text-green-400' : pressure < 745 ? 'text-red-400' : 'text-blue-400'
    },
    {
      icon: 'CloudSnow',
      label: 'Температура снега',
      value: dewPoint < 0 ? `${Math.round(dewPoint - 2)}°C` : 'Нет снега',
      description: dewPoint < 0 ? 'Снег возможен' : 'Слишком тепло'
    },
    {
      icon: 'Cloud',
      label: 'Облачность',
      value: `${Math.floor(Math.random() * 100)}%`,
      description: 'Небо закрыто'
    },
    {
      icon: 'Navigation',
      label: 'Порывы ветра',
      value: `${Math.round(windSpeed * 1.5)} км/ч`,
      description: windSpeed > 15 ? 'Сильные' : 'Слабые'
    },
    {
      icon: 'Droplet',
      label: 'Испарение',
      value: `${Math.round((humidity / 10) * (dewPoint > 15 ? 1.5 : 1))} мм`,
      description: 'За сутки'
    },
    {
      icon: 'Sun',
      label: 'Световой день',
      value: '12ч 21м',
      description: 'Долгота дня'
    },
    {
      icon: 'Thermometer',
      label: 'Мин. температура',
      value: `${Math.round(dewPoint - 5)}°C`,
      description: 'За сегодня'
    },
    {
      icon: 'ThermometerSun',
      label: 'Макс. температура',
      value: `${Math.round(dewPoint + 10)}°C`,
      description: 'За сегодня'
    },
    {
      icon: 'Wind',
      label: 'Скорость звука',
      value: `${Math.round(331.5 + (0.6 * dewPoint))} м/с`,
      description: 'В текущих условиях'
    },
    {
      icon: 'CloudFog',
      label: 'Туман',
      value: visibility < 1 ? 'Плотный' : visibility < 5 ? 'Слабый' : 'Нет',
      description: `Видимость ${visibility} км`,
      valueColor: visibility < 1 ? 'text-red-400' : visibility < 5 ? 'text-yellow-400' : 'text-green-400'
    },
    {
      icon: 'Rainbow',
      label: 'Вероятность радуги',
      value: `${humidity > 70 && uvIndex > 3 ? Math.floor(Math.random() * 50 + 50) : Math.floor(Math.random() * 20)}%`,
      description: humidity > 70 && uvIndex > 3 ? 'Высокая' : 'Низкая'
    },
    {
      icon: 'Umbrella',
      label: 'Нужен зонт',
      value: humidity > 80 ? 'Да' : 'Нет',
      description: humidity > 80 ? 'Возможен дождь' : 'Погода сухая',
      valueColor: humidity > 80 ? 'text-red-400' : 'text-green-400'
    },
    {
      icon: 'Shirt',
      label: 'Одежда',
      value: dewPoint > 20 ? 'Легкая' : dewPoint > 10 ? 'Средняя' : 'Теплая',
      description: dewPoint > 20 ? 'Футболка' : dewPoint > 10 ? 'Кофта' : 'Куртка'
    },
    {
      icon: 'Footprints',
      label: 'Бег',
      value: dewPoint > 15 && dewPoint < 25 && humidity < 70 ? 'Отлично' : 'Плохо',
      description: 'Условия для пробежки',
      valueColor: dewPoint > 15 && dewPoint < 25 && humidity < 70 ? 'text-green-400' : 'text-orange-400'
    },
    {
      icon: 'Trees',
      label: 'Пыльца',
      value: `${uvIndex > 5 && humidity < 50 ? 'Высокий' : 'Низкий'} уровень`,
      description: uvIndex > 5 && humidity < 50 ? 'Аллергия возможна' : 'Безопасно',
      valueColor: uvIndex > 5 && humidity < 50 ? 'text-red-400' : 'text-green-400'
    },
    {
      icon: 'Glasses',
      label: 'Солнцезащита',
      value: uvIndex > 5 ? 'Нужна' : 'Не требуется',
      description: uvIndex > 5 ? 'Очки обязательны' : 'Солнце слабое',
      valueColor: uvIndex > 5 ? 'text-orange-400' : 'text-green-400'
    },
    {
      icon: 'Home',
      label: 'Проветривание',
      value: humidity < 60 && windSpeed < 15 ? 'Да' : 'Нет',
      description: humidity < 60 && windSpeed < 15 ? 'Хорошее время' : 'Не рекомендуется',
      valueColor: humidity < 60 && windSpeed < 15 ? 'text-green-400' : 'text-red-400'
    },
    {
      icon: 'Coffee',
      label: 'Погода для кофе',
      value: dewPoint < 15 || humidity > 70 ? 'Идеально' : 'Обычно',
      description: dewPoint < 15 || humidity > 70 ? 'Уютная погода' : 'Стандартная',
      valueColor: dewPoint < 15 || humidity > 70 ? 'text-orange-400' : 'text-blue-400'
    },
    {
      icon: 'Car',
      label: 'Дорожные условия',
      value: visibility > 5 && windSpeed < 20 ? 'Хорошие' : 'Осторожно',
      description: visibility > 5 && windSpeed < 20 ? 'Безопасно' : 'Будьте внимательны',
      valueColor: visibility > 5 && windSpeed < 20 ? 'text-green-400' : 'text-yellow-400'
    },
    {
      icon: 'Bike',
      label: 'Велопрогулка',
      value: windSpeed < 15 && humidity < 75 ? 'Отлично' : 'Не лучшее время',
      description: windSpeed < 15 && humidity < 75 ? 'Идеальные условия' : 'Сложные условия'
    },
    {
      icon: 'Dog',
      label: 'Прогулка с питомцем',
      value: dewPoint > 5 && dewPoint < 25 ? 'Да' : 'Осторожно',
      description: dewPoint > 5 && dewPoint < 25 ? 'Комфортно' : 'Слишком холодно/жарко',
      valueColor: dewPoint > 5 && dewPoint < 25 ? 'text-green-400' : 'text-orange-400'
    },
    {
      icon: 'Camera',
      label: 'Фотография',
      value: uvIndex > 3 && visibility > 8 ? 'Отлично' : 'Средне',
      description: uvIndex > 3 && visibility > 8 ? 'Хорошее освещение' : 'Слабый свет',
      valueColor: uvIndex > 3 && visibility > 8 ? 'text-green-400' : 'text-yellow-400'
    },
    {
      icon: 'Plane',
      label: 'Условия полета',
      value: visibility > 10 && windSpeed < 25 ? 'Хорошие' : 'Сложные',
      description: visibility > 10 && windSpeed < 25 ? 'Безопасно' : 'Турбулентность',
      valueColor: visibility > 10 && windSpeed < 25 ? 'text-green-400' : 'text-red-400'
    },
    {
      icon: 'Waves',
      label: 'Морские условия',
      value: windSpeed > 20 ? 'Волнение' : 'Спокойно',
      description: windSpeed > 20 ? 'Высокие волны' : 'Море спокойно',
      valueColor: windSpeed > 20 ? 'text-red-400' : 'text-blue-400'
    },
    {
      icon: 'Mountain',
      label: 'Альпинизм',
      value: windSpeed < 15 && visibility > 8 ? 'Можно' : 'Опасно',
      description: windSpeed < 15 && visibility > 8 ? 'Безопасные условия' : 'Не рекомендуется',
      valueColor: windSpeed < 15 && visibility > 8 ? 'text-green-400' : 'text-red-400'
    },
    {
      icon: 'Flame',
      label: 'Пожароопасность',
      value: humidity < 30 && dewPoint > 20 ? 'Высокая' : 'Низкая',
      description: humidity < 30 && dewPoint > 20 ? 'Будьте осторожны' : 'Безопасно',
      valueColor: humidity < 30 && dewPoint > 20 ? 'text-red-400' : 'text-green-400'
    },
    {
      icon: 'Snowflake',
      label: 'Снежные условия',
      value: dewPoint < 0 ? 'Снег возможен' : 'Снега нет',
      description: dewPoint < 0 ? `${Math.round(dewPoint)}°C` : 'Слишком тепло',
      valueColor: dewPoint < 0 ? 'text-blue-400' : 'text-orange-400'
    },
    {
      icon: 'Leaf',
      label: 'Листопад',
      value: windSpeed > 10 && dewPoint < 15 ? 'Активный' : 'Слабый',
      description: windSpeed > 10 && dewPoint < 15 ? 'Много листьев' : 'Мало активности'
    },
    {
      icon: 'Sparkles',
      label: 'Звездное небо',
      value: humidity < 40 && visibility > 10 ? 'Отлично' : 'Плохо',
      description: humidity < 40 && visibility > 10 ? 'Ясное небо' : 'Облачно',
      valueColor: humidity < 40 && visibility > 10 ? 'text-purple-400' : 'text-gray-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 animate-fade-in">
      {informers.map((informer, index) => (
        <div
          key={index}
          className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-2xl p-4 hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer`}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex flex-col items-center text-center space-y-2">
            <div className={`p-3 ${isDarkTheme ? 'bg-white/10' : 'bg-white/60'} rounded-full transition-all group-hover:scale-110`}>
              <Icon name={informer.icon} className={textColor} size={20} />
            </div>
            <div className={`text-xs ${subtextColor} font-medium uppercase tracking-wide`}>
              {informer.label}
            </div>
            <div className={`text-xl font-bold ${informer.valueColor || textColor}`}>
              {informer.value}
            </div>
            <div className={`text-xs ${subtextColor}`}>
              {informer.description}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherInformers;