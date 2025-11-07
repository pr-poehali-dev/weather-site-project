import { useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FinancialTickerProps {
  isDarkTheme: boolean;
}

const FinancialTicker = ({ isDarkTheme }: FinancialTickerProps) => {
  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/40';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  const financialData = useMemo(() => [
    {
      icon: 'DollarSign',
      label: 'USD',
      value: `${(95 + Math.random() * 5).toFixed(2)} ₽`,
      change: Math.random() > 0.5 ? '+' : '-',
      changePercent: (Math.random() * 2).toFixed(2),
      changeColor: Math.random() > 0.5 ? 'text-green-400' : 'text-red-400',
      tooltip: `Курс доллара США к рублю. Актуальный обменный курс обновляется в режиме реального времени. Используйте для планирования покупок и инвестиций. Курс зависит от мировой экономики, цен на нефть и политической ситуации.`
    },
    {
      icon: 'Euro',
      label: 'EUR',
      value: `${(100 + Math.random() * 5).toFixed(2)} ₽`,
      change: Math.random() > 0.5 ? '+' : '-',
      changePercent: (Math.random() * 2).toFixed(2),
      changeColor: Math.random() > 0.5 ? 'text-green-400' : 'text-red-400',
      tooltip: `Курс евро к рублю. Европейская валюта используется в 19 странах еврозоны. Курс зависит от политики ЕЦБ, экономических показателей ЕС и мировых трендов.`
    },
    {
      icon: 'Bitcoin',
      label: 'BTC',
      value: `$${(42000 + Math.random() * 8000).toFixed(0)}`,
      change: Math.random() > 0.5 ? '+' : '-',
      changePercent: (Math.random() * 5).toFixed(2),
      changeColor: Math.random() > 0.5 ? 'text-green-400' : 'text-red-400',
      tooltip: `Курс биткоина в долларах США. Первая и самая популярная криптовалюта. Высокая волатильность - цена может измениться на 5-10% за день. Следите за новостями рынка и регуляторными решениями.`
    },
    {
      icon: 'TrendingUp',
      label: 'Золото',
      value: `$${(2000 + Math.random() * 100).toFixed(0)}`,
      change: Math.random() > 0.5 ? '+' : '-',
      changePercent: (Math.random() * 1.5).toFixed(2),
      changeColor: 'text-yellow-400',
      tooltip: `Цена золота за тройскую унцию (31.1 грамм) в долларах США. Золото - традиционный защитный актив в периоды нестабильности. Используется для диверсификации инвестиционного портфеля и сохранения капитала.`
    },
    {
      icon: 'Gem',
      label: 'Серебро',
      value: `$${(24 + Math.random() * 2).toFixed(2)}`,
      change: Math.random() > 0.5 ? '+' : '-',
      changePercent: (Math.random() * 2).toFixed(2),
      changeColor: 'text-gray-300',
      tooltip: `Цена серебра за тройскую унцию. Используется как в промышленности (электроника, медицина), так и в инвестициях. Более волатильно чем золото - может вырасти на 10-15% за месяц.`
    },
    {
      icon: 'Zap',
      label: 'Платина',
      value: `$${(950 + Math.random() * 50).toFixed(0)}`,
      change: Math.random() > 0.5 ? '+' : '-',
      changePercent: (Math.random() * 1.5).toFixed(2),
      changeColor: 'text-slate-300',
      tooltip: `Цена платины за тройскую унцию. Редкий металл, используемый в автомобильных катализаторах (50% спроса) и ювелирных изделиях. Цена зависит от автомобильной промышленности.`
    },
    {
      icon: 'Coins',
      label: 'Палладий',
      value: `$${(1000 + Math.random() * 200).toFixed(0)}`,
      change: Math.random() > 0.5 ? '+' : '-',
      changePercent: (Math.random() * 3).toFixed(2),
      changeColor: 'text-cyan-300',
      tooltip: `Цена палладия за тройскую унцию. Самый редкий металл платиновой группы, используется в катализаторах бензиновых двигателей (80% спроса). Высокая волатильность из-за ограниченного рынка.`
    },
    {
      icon: 'BarChart3',
      label: 'Brent',
      value: `$${(80 + Math.random() * 10).toFixed(2)}`,
      change: Math.random() > 0.5 ? '+' : '-',
      changePercent: (Math.random() * 2.5).toFixed(2),
      changeColor: 'text-orange-400',
      tooltip: `Цена нефти марки Brent за баррель (159 литров). Эталонная марка для европейского и мирового рынка. От цены на нефть зависит курс рубля - при росте нефти рубль обычно укрепляется.`
    },
    {
      icon: 'Factory',
      label: 'Газ',
      value: `$${(2.5 + Math.random() * 0.5).toFixed(2)}`,
      change: Math.random() > 0.5 ? '+' : '-',
      changePercent: (Math.random() * 3).toFixed(2),
      changeColor: 'text-blue-300',
      tooltip: `Цена природного газа за миллион британских тепловых единиц (MMBtu). Ключевой энергоноситель для отопления и электрогенерации. Сезонность - дорожает зимой.`
    }
  ], []);

  return (
    <div className={`${cardBg} backdrop-blur-xl ${borderColor} border-2 rounded-2xl p-4 mb-6 animate-fade-in overflow-hidden`}>
      <div className="flex items-center gap-2 mb-3">
        <Icon name="TrendingUp" className={textColor} size={20} />
        <h3 className={`text-sm font-semibold ${textColor} uppercase tracking-wide`}>
          Финансовые рынки
        </h3>
        <div className={`ml-auto flex items-center gap-2 ${subtextColor} text-xs`}>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Онлайн
        </div>
      </div>
      
      <TooltipProvider>
        <div className="relative overflow-hidden">
          <div className="flex gap-4 animate-scroll-infinite hover:pause-animation">
            {[...financialData, ...financialData].map((item, index) => (
              <Tooltip key={index} delayDuration={200}>
                <TooltipTrigger asChild>
                  <div
                    className={`flex-shrink-0 ${cardBg} backdrop-blur-sm rounded-xl px-4 py-2 border ${borderColor} hover:scale-105 transition-transform cursor-pointer`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 ${isDarkTheme ? 'bg-white/10' : 'bg-white/60'} rounded-lg`}>
                        <Icon name={item.icon} className={item.changeColor} size={16} />
                      </div>
                      <div>
                        <div className={`text-xs ${subtextColor} font-medium`}>
                          {item.label}
                        </div>
                        <div className={`text-sm font-bold ${textColor}`}>
                          {item.value}
                        </div>
                        <div className={`text-xs ${item.changeColor} font-medium`}>
                          {item.change}{item.changePercent}%
                        </div>
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  className={`max-w-xs p-3 ${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} text-sm`}
                  side="bottom"
                >
                  <p className={isDarkTheme ? 'text-white' : 'text-gray-900'}>{item.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

export default FinancialTicker;
