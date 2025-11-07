import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { russianCities, searchCities } from '@/data/russianCities';
import { Input } from '@/components/ui/input';

const Cities = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(russianCities.map(city => city.region)));
    return uniqueRegions.sort();
  }, []);

  const filteredCities = useMemo(() => {
    let cities = russianCities;

    if (searchQuery) {
      cities = searchCities(searchQuery);
    }

    if (selectedRegion !== 'all') {
      cities = cities.filter(city => city.region === selectedRegion);
    }

    return cities.sort((a, b) => b.population - a.population);
  }, [searchQuery, selectedRegion]);

  const formatPopulation = (pop: number) => {
    if (pop >= 1000000) {
      return `${(pop / 1000000).toFixed(2)} млн`;
    }
    return `${(pop / 1000).toFixed(0)} тыс`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0EA5E9] via-[#8B5CF6] to-[#F97316] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-3 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-full hover:scale-110 transition-all"
          >
            <Icon name="ArrowLeft" className="text-white" size={24} />
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white">Города России</h1>
            <p className="text-white/80 text-lg mt-1">
              {filteredCities.length} {filteredCities.length === 1 ? 'город' : filteredCities.length < 5 ? 'города' : 'городов'}
            </p>
          </div>
        </div>

        <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
              <Input
                type="text"
                placeholder="Поиск города или региона..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 bg-white/20 border-white/30 text-white placeholder-white/60 focus:border-white/50"
              />
            </div>

            <div className="relative">
              <Icon name="MapPin" className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-white/20 border-2 border-white/30 rounded-xl text-white focus:outline-none focus:border-white/50 cursor-pointer"
              >
                <option value="all">Все регионы</option>
                {regions.map(region => (
                  <option key={region} value={region} className="text-gray-900">
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCities.map((city) => (
            <Card
              key={city.id}
              onClick={() => navigate(`/cities/${city.id}`)}
              className="bg-white/10 backdrop-blur-xl border-white/20 p-6 hover:scale-105 hover:bg-white/20 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-yellow-300 transition-colors">
                    {city.name}
                  </h3>
                  <p className="text-white/70 text-sm">{city.region}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {city.isCapital && (
                    <Badge className="bg-yellow-500/80 text-white border-none text-xs">
                      Столица
                    </Badge>
                  )}
                  {city.isMajor && !city.isCapital && (
                    <Badge className="bg-blue-500/80 text-white border-none text-xs">
                      Крупный
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Users" size={16} className="text-white/60" />
                  <span>{formatPopulation(city.population)} человек</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Calendar" size={16} className="text-white/60" />
                  <span>Основан в {city.founded} году</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={16} className="text-white/60" />
                  <span>{city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
                <span className="text-white/60 text-xs">Подробнее о городе</span>
                <Icon name="ChevronRight" size={18} className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </Card>
          ))}
        </div>

        {filteredCities.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-12 text-center">
            <Icon name="Search" size={48} className="text-white/40 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Ничего не найдено</h3>
            <p className="text-white/70">Попробуйте изменить параметры поиска</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Cities;
