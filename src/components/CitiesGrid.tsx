import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { russianCities } from '@/data/russianCities';

interface CitiesGridProps {
  isDarkTheme: boolean;
}

const CitiesGrid = ({ isDarkTheme }: CitiesGridProps) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/40';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  const displayedCities = useMemo(() => {
    const sorted = [...russianCities].sort((a, b) => b.population - a.population);
    return showAll ? sorted : sorted.slice(0, 12);
  }, [showAll]);

  const formatPopulation = (pop: number) => {
    if (pop >= 1000000) {
      return `${(pop / 1000000).toFixed(1)} млн`;
    }
    return `${(pop / 1000).toFixed(0)} тыс`;
  };

  return (
    <Card className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-2xl p-6 animate-fade-in`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 ${isDarkTheme ? 'bg-white/10' : 'bg-white/60'} rounded-xl`}>
            <Icon name="Map" className={textColor} size={28} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${textColor}`}>Города России</h2>
            <p className={`${subtextColor} text-sm`}>
              {russianCities.length} крупнейших городов страны
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/cities')}
          className={`px-4 py-2 ${cardBg} backdrop-blur-sm ${borderColor} border-2 rounded-xl hover:bg-white/30 transition-all flex items-center gap-2 ${textColor} font-medium`}
        >
          Все города
          <Icon name="ArrowRight" size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {displayedCities.map((city, index) => (
          <div
            key={city.id}
            onClick={() => navigate(`/cities/${city.id}`)}
            className={`${cardBg} backdrop-blur-sm ${borderColor} border-2 rounded-xl p-4 hover:scale-105 hover:bg-white/30 transition-all cursor-pointer group`}
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-bold ${textColor} mb-1 group-hover:text-primary transition-colors truncate`}>
                  {city.name}
                </h3>
                <p className={`${subtextColor} text-xs truncate`}>{city.region}</p>
              </div>
              {city.isCapital && (
                <Badge className="bg-yellow-500/80 text-white border-none text-xs flex-shrink-0 ml-2">
                  <Icon name="Crown" size={12} />
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Users" size={14} className={subtextColor} />
                <span className={`${textColor} text-sm font-medium`}>
                  {formatPopulation(city.population)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Calendar" size={14} className={subtextColor} />
                <span className={`${subtextColor} text-xs`}>
                  с {city.founded} г.
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t ${borderColor} flex items-center justify-between">
              <span className={`${subtextColor} text-xs`}>Подробнее</span>
              <Icon
                name="ChevronRight"
                size={16}
                className={`${subtextColor} group-hover:${textColor} group-hover:translate-x-1 transition-all`}
              />
            </div>
          </div>
        ))}
      </div>

      {!showAll && russianCities.length > 12 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(true)}
            className={`px-6 py-3 ${cardBg} backdrop-blur-sm ${borderColor} border-2 rounded-xl hover:bg-white/30 transition-all ${textColor} font-medium inline-flex items-center gap-2`}
          >
            Показать все {russianCities.length} городов
            <Icon name="ChevronDown" size={18} />
          </button>
        </div>
      )}

      {showAll && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAll(false)}
            className={`px-6 py-3 ${cardBg} backdrop-blur-sm ${borderColor} border-2 rounded-xl hover:bg-white/30 transition-all ${textColor} font-medium inline-flex items-center gap-2`}
          >
            Свернуть
            <Icon name="ChevronUp" size={18} />
          </button>
        </div>
      )}
    </Card>
  );
};

export default CitiesGrid;
