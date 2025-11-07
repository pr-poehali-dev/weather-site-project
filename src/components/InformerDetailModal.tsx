import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Area, AreaChart } from 'recharts';

interface InformerDetailModalProps {
  informer: {
    icon: string;
    label: string;
    value: string;
    description: string;
    tooltip?: string;
    valueColor?: string;
  };
  isDarkTheme: boolean;
  onClose: () => void;
}

const InformerDetailModal = ({ informer, isDarkTheme, onClose }: InformerDetailModalProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>('24h');

  const generateHistoryData = (period: '24h' | '7d' | '30d') => {
    const points = period === '24h' ? 24 : period === '7d' ? 7 : 30;
    const data = [];
    
    for (let i = 0; i < points; i++) {
      const baseValue = parseFloat(informer.value) || 50;
      const variation = (Math.random() - 0.5) * 20;
      const value = Math.max(0, baseValue + variation);
      
      let label = '';
      if (period === '24h') {
        label = `${i}:00`;
      } else if (period === '7d') {
        const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        label = days[i % 7];
      } else {
        label = `${i + 1}`;
      }
      
      data.push({ time: label, value: Math.round(value * 10) / 10 });
    }
    
    return data;
  };

  const historyData = useMemo(() => generateHistoryData(selectedPeriod), [selectedPeriod, informer.value]);

  const getStats = () => {
    const values = historyData.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const current = parseFloat(informer.value) || avg;
    
    return { min, max, avg: Math.round(avg * 10) / 10, current };
  };

  const stats = getStats();

  const cardBg = isDarkTheme ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200';
  const chartColor = isDarkTheme ? '#60A5FA' : '#3B82F6';
  const gridColor = isDarkTheme ? '#374151' : '#E5E7EB';

  const getRecommendations = () => {
    const label = informer.label.toLowerCase();
    
    if (label.includes('влажность')) {
      return [
        'Оптимальная влажность в помещении: 40-60%',
        'При высокой влажности используйте осушитель',
        'При низкой влажности - увлажнитель воздуха',
        'Регулярное проветривание помогает нормализовать влажность'
      ];
    }
    
    if (label.includes('ветер')) {
      return [
        'При сильном ветре избегайте высоких открытых мест',
        'Закрепите легкие предметы на балконе',
        'Будьте осторожны при вождении',
        'Ветер усиливает ощущение холода'
      ];
    }
    
    if (label.includes('давление')) {
      return [
        'Нормальное давление: 740-760 мм рт.ст.',
        'При низком давлении возможна головная боль',
        'Высокое давление может вызывать усталость',
        'Метеозависимым людям рекомендуется больше отдыхать'
      ];
    }
    
    if (label.includes('уф')) {
      return [
        'Используйте солнцезащитный крем SPF 30+',
        'Носите солнцезащитные очки',
        'Избегайте прямого солнца в 11:00-16:00',
        'Надевайте головной убор в жаркую погоду'
      ];
    }

    return [
      'Следите за изменениями этого показателя',
      'Адаптируйте свои планы под погодные условия',
      'Используйте подходящую одежду и снаряжение',
      'Проверяйте прогноз перед выходом'
    ];
  };

  const recommendations = getRecommendations();

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card className={`w-full max-w-4xl ${cardBg} ${textColor} max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className={`p-4 ${isDarkTheme ? 'bg-blue-500/20' : 'bg-blue-100'} rounded-2xl`}>
                <Icon name={informer.icon} size={32} className={informer.valueColor || textColor} />
              </div>
              <div>
                <h2 className={`text-3xl font-bold ${textColor}`}>{informer.label}</h2>
                <p className={subtextColor}>{informer.description}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={24} />
            </Button>
          </div>

          {/* Current Value */}
          <div className={`p-6 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl`}>
            <div className="text-center">
              <div className={`text-6xl font-bold ${informer.valueColor || textColor} mb-2`}>
                {informer.value}
              </div>
              {informer.tooltip && (
                <p className={`${subtextColor} text-sm max-w-2xl mx-auto`}>
                  {informer.tooltip}
                </p>
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
              <div className={`text-xs ${subtextColor} mb-1`}>Текущее</div>
              <div className={`text-2xl font-bold ${textColor}`}>{stats.current}</div>
            </div>
            <div className={`p-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
              <div className={`text-xs ${subtextColor} mb-1`}>Среднее</div>
              <div className={`text-2xl font-bold ${textColor}`}>{stats.avg}</div>
            </div>
            <div className={`p-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
              <div className={`text-xs ${subtextColor} mb-1`}>Минимум</div>
              <div className={`text-2xl font-bold text-blue-400`}>{stats.min}</div>
            </div>
            <div className={`p-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'} rounded-xl`}>
              <div className={`text-xs ${subtextColor} mb-1`}>Максимум</div>
              <div className={`text-2xl font-bold text-red-400`}>{stats.max}</div>
            </div>
          </div>

          {/* Period Selector */}
          <div className="flex gap-2 justify-center">
            <Button
              variant={selectedPeriod === '24h' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('24h')}
              size="sm"
            >
              24 часа
            </Button>
            <Button
              variant={selectedPeriod === '7d' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('7d')}
              size="sm"
            >
              7 дней
            </Button>
            <Button
              variant={selectedPeriod === '30d' ? 'default' : 'outline'}
              onClick={() => setSelectedPeriod('30d')}
              size="sm"
            >
              30 дней
            </Button>
          </div>

          {/* Chart */}
          <div className={`p-6 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4`}>История изменений</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={historyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="time" 
                  stroke={gridColor}
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke={gridColor}
                  style={{ fontSize: '12px' }}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: isDarkTheme ? '#1F2937' : '#FFFFFF',
                    border: `1px solid ${gridColor}`,
                    borderRadius: '8px',
                    color: isDarkTheme ? '#FFFFFF' : '#000000'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={chartColor}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Recommendations */}
          <div className={`p-6 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'} rounded-2xl`}>
            <h3 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
              <Icon name="Lightbulb" size={20} className="text-yellow-500" />
              Рекомендации
            </h3>
            <ul className="space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className={`flex items-start gap-3 ${subtextColor}`}>
                  <Icon name="CheckCircle2" size={16} className="text-green-500 mt-1 flex-shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button onClick={onClose} size="lg">
              <Icon name="X" size={20} className="mr-2" />
              Закрыть
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default InformerDetailModal;
