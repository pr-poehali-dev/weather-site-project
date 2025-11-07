import { useState } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface DayForecast {
  day: string;
  date: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
  sunrise: string;
  sunset: string;
}

interface WeeklyForecastProps {
  forecast: DayForecast[];
  isDarkTheme: boolean;
}

const WeeklyForecast = ({ forecast, isDarkTheme }: WeeklyForecastProps) => {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/40';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  const defaultForecast: DayForecast[] = [
    { day: 'Понедельник', date: '11 ноября', temp: 18, tempMin: 12, tempMax: 22, condition: 'Солнечно', icon: 'Sun', humidity: 60, windSpeed: 10, precipitation: 10, uvIndex: 6, sunrise: '06:24', sunset: '18:45' },
    { day: 'Вторник', date: '12 ноября', temp: 16, tempMin: 10, tempMax: 20, condition: 'Облачно', icon: 'Cloud', humidity: 65, windSpeed: 15, precipitation: 30, uvIndex: 4, sunrise: '06:25', sunset: '18:44' },
    { day: 'Среда', date: '13 ноября', temp: 14, tempMin: 8, tempMax: 18, condition: 'Дождь', icon: 'CloudRain', humidity: 80, windSpeed: 20, precipitation: 70, uvIndex: 2, sunrise: '06:26', sunset: '18:43' },
    { day: 'Четверг', date: '14 ноября', temp: 12, tempMin: 6, tempMax: 16, condition: 'Переменная облачность', icon: 'CloudSun', humidity: 70, windSpeed: 12, precipitation: 40, uvIndex: 3, sunrise: '06:27', sunset: '18:42' },
    { day: 'Пятница', date: '15 ноября', temp: 15, tempMin: 9, tempMax: 19, condition: 'Солнечно', icon: 'Sun', humidity: 55, windSpeed: 8, precipitation: 5, uvIndex: 7, sunrise: '06:28', sunset: '18:41' },
    { day: 'Суббота', date: '16 ноября', temp: 17, tempMin: 11, tempMax: 21, condition: 'Ясно', icon: 'Sun', humidity: 50, windSpeed: 5, precipitation: 0, uvIndex: 8, sunrise: '06:29', sunset: '18:40' },
    { day: 'Воскресенье', date: '17 ноября', temp: 19, tempMin: 13, tempMax: 23, condition: 'Солнечно', icon: 'Sun', humidity: 45, windSpeed: 7, precipitation: 0, uvIndex: 8, sunrise: '06:30', sunset: '18:39' }
  ];

  const displayForecast = forecast.length > 0 ? forecast : defaultForecast;

  const getUVLevel = (uv: number) => {
    if (uv <= 2) return { level: 'Низкий', color: 'text-green-400' };
    if (uv <= 5) return { level: 'Средний', color: 'text-yellow-400' };
    if (uv <= 7) return { level: 'Высокий', color: 'text-orange-400' };
    return { level: 'Очень высокий', color: 'text-red-400' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {displayForecast.map((day, index) => {
          const isSelected = selectedDay === index;
          const uvData = getUVLevel(day.uvIndex);

          return (
            <Card
              key={index}
              onClick={() => setSelectedDay(isSelected ? null : index)}
              className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-4 cursor-pointer transition-all duration-300 ${
                isSelected ? 'ring-4 ring-primary/50 scale-105' : 'hover:scale-105'
              }`}
            >
              <div className="text-center space-y-3">
                <div>
                  <h3 className={`font-semibold ${textColor} text-sm`}>{day.day}</h3>
                  <p className={`text-xs ${subtextColor}`}>{day.date}</p>
                </div>

                <div className={`py-4 ${isDarkTheme ? 'bg-white/5' : 'bg-white/30'} rounded-lg`}>
                  <Icon name={day.icon} className={textColor} size={40} />
                </div>

                <div>
                  <div className={`text-3xl font-bold ${textColor}`}>{Math.round(day.temp)}°</div>
                  <div className={`text-xs ${subtextColor} mt-1`}>
                    {Math.round(day.tempMin)}° / {Math.round(day.tempMax)}°
                  </div>
                </div>

                <p className={`text-sm ${textColor}`}>{day.condition}</p>

                <div className="flex justify-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Icon name="Droplets" className={subtextColor} size={14} />
                    <span className={subtextColor}>{day.precipitation}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="Wind" className={subtextColor} size={14} />
                    <span className={subtextColor}>{day.windSpeed}</span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {selectedDay !== null && (
        <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-6 animate-fade-in`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className={`text-2xl font-bold ${textColor}`}>
                {displayForecast[selectedDay].day}
              </h3>
              <p className={`${subtextColor}`}>{displayForecast[selectedDay].date}</p>
            </div>
            <button
              onClick={() => setSelectedDay(null)}
              className={`p-2 ${cardBg} rounded-lg hover:bg-white/20 transition-all`}
            >
              <Icon name="X" className={textColor} size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-white/30'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Thermometer" className="text-red-400" size={20} />
                <span className={`text-sm ${subtextColor}`}>Температура</span>
              </div>
              <div className={`text-2xl font-bold ${textColor}`}>{Math.round(displayForecast[selectedDay].temp)}°C</div>
              <div className={`text-xs ${subtextColor} mt-1`}>
                Мин: {Math.round(displayForecast[selectedDay].tempMin)}° / Макс: {Math.round(displayForecast[selectedDay].tempMax)}°
              </div>
            </div>

            <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-white/30'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Droplets" className="text-blue-400" size={20} />
                <span className={`text-sm ${subtextColor}`}>Влажность</span>
              </div>
              <div className={`text-2xl font-bold ${textColor}`}>{displayForecast[selectedDay].humidity}%</div>
              <div className={`text-xs ${subtextColor} mt-1`}>
                {displayForecast[selectedDay].humidity > 70 ? 'Высокая' : displayForecast[selectedDay].humidity > 40 ? 'Комфортная' : 'Низкая'}
              </div>
            </div>

            <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-white/30'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Wind" className="text-cyan-400" size={20} />
                <span className={`text-sm ${subtextColor}`}>Ветер</span>
              </div>
              <div className={`text-2xl font-bold ${textColor}`}>{displayForecast[selectedDay].windSpeed} км/ч</div>
              <div className={`text-xs ${subtextColor} mt-1`}>
                {displayForecast[selectedDay].windSpeed > 20 ? 'Сильный' : displayForecast[selectedDay].windSpeed > 10 ? 'Умеренный' : 'Слабый'}
              </div>
            </div>

            <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-white/30'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CloudRain" className="text-blue-500" size={20} />
                <span className={`text-sm ${subtextColor}`}>Осадки</span>
              </div>
              <div className={`text-2xl font-bold ${textColor}`}>{displayForecast[selectedDay].precipitation}%</div>
              <div className={`text-xs ${subtextColor} mt-1`}>
                {displayForecast[selectedDay].precipitation > 60 ? 'Высокая вероятность' : displayForecast[selectedDay].precipitation > 30 ? 'Возможны' : 'Маловероятно'}
              </div>
            </div>

            <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-white/30'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Sun" className={getUVLevel(displayForecast[selectedDay].uvIndex).color} size={20} />
                <span className={`text-sm ${subtextColor}`}>УФ-индекс</span>
              </div>
              <div className={`text-2xl font-bold ${textColor}`}>{displayForecast[selectedDay].uvIndex}</div>
              <div className={`text-xs ${getUVLevel(displayForecast[selectedDay].uvIndex).color} mt-1`}>
                {getUVLevel(displayForecast[selectedDay].uvIndex).level}
              </div>
            </div>

            <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-white/30'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Sunrise" className="text-amber-400" size={20} />
                <span className={`text-sm ${subtextColor}`}>Восход</span>
              </div>
              <div className={`text-2xl font-bold ${textColor}`}>{displayForecast[selectedDay].sunrise}</div>
            </div>

            <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-white/30'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Sunset" className="text-orange-400" size={20} />
                <span className={`text-sm ${subtextColor}`}>Закат</span>
              </div>
              <div className={`text-2xl font-bold ${textColor}`}>{displayForecast[selectedDay].sunset}</div>
            </div>

            <div className={`${isDarkTheme ? 'bg-white/5' : 'bg-white/30'} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="CloudSun" className="text-yellow-400" size={20} />
                <span className={`text-sm ${subtextColor}`}>Условия</span>
              </div>
              <div className={`text-lg font-bold ${textColor}`}>{displayForecast[selectedDay].condition}</div>
            </div>
          </div>

          <div className={`mt-6 p-4 ${isDarkTheme ? 'bg-blue-500/10' : 'bg-blue-500/20'} rounded-xl`}>
            <div className="flex items-start gap-3">
              <Icon name="Info" className="text-blue-400 mt-1" size={20} />
              <div>
                <h4 className={`font-semibold ${textColor} mb-1`}>Рекомендации на день</h4>
                <p className={`text-sm ${subtextColor}`}>
                  {displayForecast[selectedDay].precipitation > 60 
                    ? 'Возьмите зонт, высокая вероятность дождя.' 
                    : displayForecast[selectedDay].uvIndex > 6 
                    ? 'Используйте солнцезащитный крем, высокий УФ-индекс.' 
                    : displayForecast[selectedDay].windSpeed > 20
                    ? 'Ожидается сильный ветер, одевайтесь теплее.'
                    : 'Отличный день для прогулок и активного отдыха!'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default WeeklyForecast;
