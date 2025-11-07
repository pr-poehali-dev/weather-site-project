import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface WeatherDetailsWidgetsProps {
  sunrise: string;
  sunset: string;
  moonPhase: string;
  airQuality: number;
  precipitation: number;
  cloudCover: number;
  isDarkTheme: boolean;
}

const WeatherDetailsWidgets = ({
  sunrise,
  sunset,
  moonPhase,
  airQuality,
  precipitation,
  cloudCover,
  isDarkTheme
}: WeatherDetailsWidgetsProps) => {
  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/40';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  const getAirQualityLevel = (aqi: number) => {
    if (aqi <= 50) return { level: 'Хорошо', color: 'text-green-400', bgColor: 'bg-green-400/20' };
    if (aqi <= 100) return { level: 'Умеренно', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20' };
    if (aqi <= 150) return { level: 'Нездорово для чувствительных', color: 'text-orange-400', bgColor: 'bg-orange-400/20' };
    if (aqi <= 200) return { level: 'Нездорово', color: 'text-red-400', bgColor: 'bg-red-400/20' };
    return { level: 'Опасно', color: 'text-purple-400', bgColor: 'bg-purple-400/20' };
  };

  const getMoonPhaseIcon = (phase: string) => {
    const phases: { [key: string]: string } = {
      'Новолуние': 'Moon',
      'Растущая луна': 'MoonStar',
      'Первая четверть': 'Moon',
      'Прибывающая луна': 'MoonStar',
      'Полнолуние': 'Moon',
      'Убывающая луна': 'Moon',
      'Последняя четверть': 'Moon',
      'Старая луна': 'Moon'
    };
    return phases[phase] || 'Moon';
  };

  const aqiData = getAirQualityLevel(airQuality);

  const calculateDayLength = () => {
    const [sunriseH, sunriseM] = sunrise.split(':').map(Number);
    const [sunsetH, sunsetM] = sunset.split(':').map(Number);
    const totalMinutes = (sunsetH * 60 + sunsetM) - (sunriseH * 60 + sunriseM);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}ч ${minutes}м`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-6 hover:scale-105 transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 ${isDarkTheme ? 'bg-amber-500/20' : 'bg-amber-500/30'} rounded-full`}>
            <Icon name="Sunrise" className="text-amber-500" size={28} />
          </div>
          <h3 className={`text-lg font-semibold ${textColor}`}>Восход и закат</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Sunrise" className={subtextColor} size={20} />
              <span className={subtextColor}>Восход</span>
            </div>
            <span className={`text-xl font-bold ${textColor}`}>{sunrise}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Sunset" className={subtextColor} size={20} />
              <span className={subtextColor}>Закат</span>
            </div>
            <span className={`text-xl font-bold ${textColor}`}>{sunset}</span>
          </div>
          <div className={`pt-3 border-t ${borderColor}`}>
            <div className="flex items-center justify-between">
              <span className={subtextColor}>Длина дня</span>
              <span className={`font-semibold ${textColor}`}>{calculateDayLength()}</span>
            </div>
          </div>
        </div>
      </Card>

      <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-6 hover:scale-105 transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 ${isDarkTheme ? 'bg-indigo-500/20' : 'bg-indigo-500/30'} rounded-full`}>
            <Icon name={getMoonPhaseIcon(moonPhase)} className="text-indigo-400" size={28} />
          </div>
          <h3 className={`text-lg font-semibold ${textColor}`}>Фаза луны</h3>
        </div>
        <div className="text-center py-4">
          <div className={`inline-block p-6 ${isDarkTheme ? 'bg-indigo-500/10' : 'bg-indigo-500/20'} rounded-full mb-3`}>
            <Icon name={getMoonPhaseIcon(moonPhase)} className="text-indigo-400" size={48} />
          </div>
          <p className={`text-2xl font-bold ${textColor} mb-2`}>{moonPhase}</p>
          <p className={`${subtextColor} text-sm`}>Влияет на приливы и отливы</p>
        </div>
      </Card>

      <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-6 hover:scale-105 transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 ${aqiData.bgColor} rounded-full`}>
            <Icon name="Wind" className={aqiData.color} size={28} />
          </div>
          <h3 className={`text-lg font-semibold ${textColor}`}>Качество воздуха</h3>
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${aqiData.color} mb-2`}>{airQuality}</div>
            <div className={`inline-block px-4 py-2 rounded-full ${aqiData.bgColor} mb-2`}>
              <span className={`font-semibold ${aqiData.color}`}>{aqiData.level}</span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full ${aqiData.color.replace('text-', 'bg-')} transition-all duration-500`}
              style={{ width: `${Math.min((airQuality / 200) * 100, 100)}%` }}
            />
          </div>
        </div>
      </Card>

      <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-6 hover:scale-105 transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 ${isDarkTheme ? 'bg-blue-500/20' : 'bg-blue-500/30'} rounded-full`}>
            <Icon name="CloudRain" className="text-blue-500" size={28} />
          </div>
          <h3 className={`text-lg font-semibold ${textColor}`}>Осадки</h3>
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${textColor} mb-2`}>{precipitation}%</div>
            <p className={`${subtextColor} text-sm`}>Вероятность осадков</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${precipitation}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className={subtextColor}>0%</span>
            <span className={subtextColor}>50%</span>
            <span className={subtextColor}>100%</span>
          </div>
        </div>
      </Card>

      <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-6 hover:scale-105 transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 ${isDarkTheme ? 'bg-gray-500/20' : 'bg-gray-500/30'} rounded-full`}>
            <Icon name="Cloud" className="text-gray-400" size={28} />
          </div>
          <h3 className={`text-lg font-semibold ${textColor}`}>Облачность</h3>
        </div>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${textColor} mb-2`}>{cloudCover}%</div>
            <p className={`${subtextColor} text-sm`}>
              {cloudCover < 25 ? 'Ясно' : cloudCover < 50 ? 'Малооблачно' : cloudCover < 75 ? 'Облачно' : 'Пасмурно'}
            </p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gray-500 transition-all duration-500"
              style={{ width: `${cloudCover}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className={subtextColor}>Ясно</span>
            <span className={subtextColor}>Пасмурно</span>
          </div>
        </div>
      </Card>

      <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 p-6 hover:scale-105 transition-all duration-300`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 ${isDarkTheme ? 'bg-purple-500/20' : 'bg-purple-500/30'} rounded-full`}>
            <Icon name="Activity" className="text-purple-500" size={28} />
          </div>
          <h3 className={`text-lg font-semibold ${textColor}`}>Комфорт</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={subtextColor}>Для прогулки</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon 
                  key={star}
                  name="Star" 
                  className={star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} 
                  size={16} 
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={subtextColor}>Для спорта</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon 
                  key={star}
                  name="Star" 
                  className={star <= 3 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} 
                  size={16} 
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={subtextColor}>Для отдыха</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon 
                  key={star}
                  name="Star" 
                  className={star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'} 
                  size={16} 
                />
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WeatherDetailsWidgets;
