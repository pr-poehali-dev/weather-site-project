import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FinancialItem {
  icon: string;
  label: string;
  value: string;
  change: string;
  changePercent: string;
  changeColor: string;
  tooltip: string;
}

interface FinancialTickerProps {
  isDarkTheme: boolean;
}

const FinancialTicker = ({ isDarkTheme }: FinancialTickerProps) => {
  const cardBg = isDarkTheme ? 'bg-white/10' : 'bg-white/40';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-white/70' : 'text-gray-600';
  const borderColor = isDarkTheme ? 'border-white/20' : 'border-gray-200';

  const [financialData, setFinancialData] = useState<FinancialItem[]>([
    {
      icon: 'DollarSign',
      label: 'USD',
      value: '... ₽',
      change: '+',
      changePercent: '0.00',
      changeColor: 'text-green-400',
      tooltip: `Курс доллара США к рублю. Актуальный обменный курс обновляется в режиме реального времени. Используйте для планирования покупок и инвестиций.`
    },
    {
      icon: 'Euro',
      label: 'EUR',
      value: '... ₽',
      change: '+',
      changePercent: '0.00',
      changeColor: 'text-green-400',
      tooltip: `Курс евро к рублю. Европейская валюта используется в 19 странах еврозоны.`
    },
    {
      icon: 'Bitcoin',
      label: 'BTC',
      value: '...',
      change: '+',
      changePercent: '0.00',
      changeColor: 'text-green-400',
      tooltip: `Курс биткоина в долларах США. Первая и самая популярная криптовалюта.`
    },
    {
      icon: 'TrendingUp',
      label: 'Золото',
      value: '...',
      change: '+',
      changePercent: '0.00',
      changeColor: 'text-yellow-400',
      tooltip: `Цена золота за тройскую унцию в долларах США.`
    },
    {
      icon: 'Gem',
      label: 'Серебро',
      value: '...',
      change: '+',
      changePercent: '0.00',
      changeColor: 'text-gray-300',
      tooltip: `Цена серебра за тройскую унцию.`
    },
    {
      icon: 'BarChart3',
      label: 'Brent',
      value: '...',
      change: '+',
      changePercent: '0.00',
      changeColor: 'text-orange-400',
      tooltip: `Цена нефти марки Brent за баррель.`
    }
  ]);

  useEffect(() => {
    const fetchFinancialData = async () => {
      const newData: FinancialItem[] = [];

      try {
        const cbrResponse = await fetch('https://www.cbr-xml-daily.ru/daily_json.js');
        const cbrData = await cbrResponse.json();
        
        const usdRate = cbrData.Valute.USD.Value;
        const usdChange = cbrData.Valute.USD.Value - cbrData.Valute.USD.Previous;
        const usdChangePercent = ((usdChange / cbrData.Valute.USD.Previous) * 100);

        newData.push({
          icon: 'DollarSign',
          label: 'USD',
          value: `${usdRate.toFixed(2)} ₽`,
          change: usdChange >= 0 ? '+' : '',
          changePercent: Math.abs(usdChangePercent).toFixed(2),
          changeColor: usdChange >= 0 ? 'text-green-400' : 'text-red-400',
          tooltip: `Курс доллара США к рублю по данным ЦБ РФ. Обновляется ежедневно.`
        });

        const eurRate = cbrData.Valute.EUR.Value;
        const eurChange = cbrData.Valute.EUR.Value - cbrData.Valute.EUR.Previous;
        const eurChangePercent = ((eurChange / cbrData.Valute.EUR.Previous) * 100);

        newData.push({
          icon: 'Euro',
          label: 'EUR',
          value: `${eurRate.toFixed(2)} ₽`,
          change: eurChange >= 0 ? '+' : '',
          changePercent: Math.abs(eurChangePercent).toFixed(2),
          changeColor: eurChange >= 0 ? 'text-green-400' : 'text-red-400',
          tooltip: `Курс евро к рублю по данным ЦБ РФ. Обновляется ежедневно.`
        });
      } catch (error) {
        console.error('Ошибка загрузки курсов валют:', error);
      }

      try {
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
        const cryptoData = await cryptoResponse.json();
        
        const btcPrice = cryptoData.bitcoin.usd;
        const btcChange = cryptoData.bitcoin.usd_24h_change;

        newData.push({
          icon: 'Bitcoin',
          label: 'BTC',
          value: `$${btcPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          change: btcChange >= 0 ? '+' : '',
          changePercent: Math.abs(btcChange).toFixed(2),
          changeColor: btcChange >= 0 ? 'text-green-400' : 'text-red-400',
          tooltip: `Курс биткоина в долларах США. Данные от CoinGecko.`
        });
      } catch (error) {
        console.error('Ошибка загрузки криптовалют:', error);
      }

      try {
        const metalsResponse = await fetch('https://api.metals.dev/v1/latest?api_key=testkey&currency=USD&unit=toz');
        const metalsData = await metalsResponse.json();
        
        if (metalsData.metals) {
          const goldPrice = metalsData.metals.gold;
          newData.push({
            icon: 'TrendingUp',
            label: 'Золото',
            value: `$${goldPrice.toFixed(0)}`,
            change: '+',
            changePercent: '0.00',
            changeColor: 'text-yellow-400',
            tooltip: `Цена золота за тройскую унцию в долларах США.`
          });

          const silverPrice = metalsData.metals.silver;
          newData.push({
            icon: 'Gem',
            label: 'Серебро',
            value: `$${silverPrice.toFixed(2)}`,
            change: '+',
            changePercent: '0.00',
            changeColor: 'text-gray-300',
            tooltip: `Цена серебра за тройскую унцию в долларах США.`
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки металлов:', error);
      }

      try {
        const oilResponse = await fetch('https://api.oilpriceapi.com/v1/prices/latest');
        const oilData = await oilResponse.json();
        
        if (oilData.data && oilData.data.price) {
          newData.push({
            icon: 'BarChart3',
            label: 'Brent',
            value: `$${oilData.data.price.toFixed(2)}`,
            change: '+',
            changePercent: '0.00',
            changeColor: 'text-orange-400',
            tooltip: `Цена нефти марки Brent за баррель.`
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки цен на нефть:', error);
      }

      if (newData.length > 0) {
        setFinancialData(newData);
      }
    };

    fetchFinancialData();
    const interval = setInterval(fetchFinancialData, 60000);

    return () => clearInterval(interval);
  }, []);

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