import { useState, useMemo, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, Area, AreaChart } from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import EmailScheduleSettings from './EmailScheduleSettings';

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
  const modalRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showEmailSettings, setShowEmailSettings] = useState(false);

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

  const exportToCSV = () => {
    const csvContent = [
      ['Время', 'Значение'],
      ...historyData.map(item => [item.time, item.value])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${informer.label}_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveScreenshot = async () => {
    if (!modalRef.current) return;
    
    setIsExporting(true);
    try {
      const canvas = await html2canvas(modalRef.current, {
        backgroundColor: isDarkTheme ? '#111827' : '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const link = document.createElement('a');
      link.download = `${informer.label}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Ошибка при создании скриншота:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const shareToSocial = (platform: 'telegram' | 'vk' | 'whatsapp' | 'twitter') => {
    const text = `${informer.label}: ${informer.value}\n${informer.description}`;
    const url = window.location.href;
    
    const shareUrls: Record<string, string> = {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
      vk: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(informer.label)}&description=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    setShowShareMenu(false);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`${informer.label} - Данные погоды`);
    const body = encodeURIComponent(`
${informer.label}: ${informer.value}

${informer.description}

${informer.tooltip || ''}

Данные за период: ${selectedPeriod === '24h' ? '24 часа' : selectedPeriod === '7d' ? '7 дней' : '30 дней'}

Просмотреть подробнее: ${window.location.href}
    `);
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareMenu(false);
  };

  const copyToClipboard = async () => {
    const text = `${informer.label}: ${informer.value}\n${informer.description}\n${window.location.href}`;
    
    try {
      await navigator.clipboard.writeText(text);
      alert('Скопировано в буфер обмена!');
      setShowShareMenu(false);
    } catch (error) {
      console.error('Ошибка копирования:', error);
    }
  };

  const generatePDFReport = async () => {
    setIsExporting(true);
    
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Заголовок
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246);
      pdf.text(informer.label, 20, 25);
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(informer.description, 20, 35);
      
      // Дата и время
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      const reportDate = new Date().toLocaleString('ru-RU');
      pdf.text(`Отчёт создан: ${reportDate}`, 20, 45);
      
      // Линия разделитель
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, 50, pageWidth - 20, 50);
      
      // Текущее значение
      pdf.setFontSize(48);
      pdf.setTextColor(0, 0, 0);
      pdf.text(informer.value, 20, 70);
      
      if (informer.tooltip) {
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        const tooltipLines = pdf.splitTextToSize(informer.tooltip, pageWidth - 40);
        pdf.text(tooltipLines, 20, 80);
      }
      
      // Статистика
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Статистика', 20, 100);
      
      const statsData = [
        ['Текущее', stats.current],
        ['Среднее', stats.avg],
        ['Минимум', stats.min],
        ['Максимум', stats.max]
      ];
      
      // @ts-ignore
      pdf.autoTable({
        startY: 105,
        head: [['Показатель', 'Значение']],
        body: statsData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 }
      });
      
      // График
      const chartElement = modalRef.current?.querySelector('.recharts-wrapper');
      if (chartElement) {
        const canvas = await html2canvas(chartElement as HTMLElement, {
          backgroundColor: '#ffffff',
          scale: 2
        });
        const imgData = canvas.toDataURL('image/png');
        
        // @ts-ignore
        const finalY = pdf.lastAutoTable.finalY + 10;
        pdf.text('График изменений', 20, finalY);
        pdf.addImage(imgData, 'PNG', 20, finalY + 5, pageWidth - 40, 80);
      }
      
      // Таблица данных
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.text('Детальные данные', 20, 25);
      
      const tableData = historyData.map(item => [item.time, item.value.toString()]);
      
      // @ts-ignore
      pdf.autoTable({
        startY: 30,
        head: [['Время', 'Значение']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: 20, right: 20 }
      });
      
      // Рекомендации
      const recommendations = getRecommendations();
      if (recommendations.length > 0) {
        pdf.addPage();
        pdf.setFontSize(14);
        pdf.text('Рекомендации', 20, 25);
        
        let yPos = 35;
        recommendations.forEach((rec, index) => {
          pdf.setFontSize(12);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`${index + 1}. ${rec.title}`, 20, yPos);
          
          pdf.setFontSize(10);
          pdf.setTextColor(100, 100, 100);
          const descLines = pdf.splitTextToSize(rec.description, pageWidth - 40);
          pdf.text(descLines, 25, yPos + 5);
          
          yPos += 15 + (descLines.length * 5);
          
          if (yPos > pageHeight - 20) {
            pdf.addPage();
            yPos = 25;
          }
        });
      }
      
      // Футер
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Страница ${i} из ${pageCount} | ${informer.label}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      // Сохранение
      const fileName = `${informer.label}_отчет_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Ошибка создания PDF:', error);
      alert('Не удалось создать PDF-отчёт');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <Card ref={modalRef} className={`w-full max-w-4xl ${cardBg} ${textColor} max-h-[90vh] overflow-y-auto`}>
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
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={generatePDFReport}
                disabled={isExporting}
                title="Создать PDF-отчёт"
              >
                <Icon name={isExporting ? "Loader2" : "FileText"} size={20} className={isExporting ? "animate-spin" : ""} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={exportToCSV}
                title="Экспорт в CSV"
              >
                <Icon name="Download" size={20} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={saveScreenshot}
                disabled={isExporting}
                title="Сохранить скриншот"
              >
                <Icon name={isExporting ? "Loader2" : "Camera"} size={20} className={isExporting ? "animate-spin" : ""} />
              </Button>
              <div className="relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  title="Поделиться"
                >
                  <Icon name="Share2" size={20} />
                </Button>
                
                {showShareMenu && (
                  <div className={`absolute right-0 top-12 ${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-xl shadow-xl p-2 z-50 min-w-[200px]`}>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3"
                      onClick={() => shareToSocial('telegram')}
                    >
                      <Icon name="Send" size={18} className="text-blue-500" />
                      Telegram
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3"
                      onClick={() => shareToSocial('whatsapp')}
                    >
                      <Icon name="MessageCircle" size={18} className="text-green-500" />
                      WhatsApp
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3"
                      onClick={() => shareToSocial('vk')}
                    >
                      <Icon name="Users" size={18} className="text-blue-600" />
                      ВКонтакте
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3"
                      onClick={() => shareToSocial('twitter')}
                    >
                      <Icon name="Twitter" size={18} className="text-sky-500" />
                      Twitter
                    </Button>
                    <div className={`my-2 h-px ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3"
                      onClick={shareViaEmail}
                    >
                      <Icon name="Mail" size={18} className="text-red-500" />
                      Email
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3"
                      onClick={copyToClipboard}
                    >
                      <Icon name="Copy" size={18} className="text-gray-500" />
                      Копировать
                    </Button>
                    <div className={`my-2 h-px ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start gap-3"
                      onClick={() => {
                        setShowShareMenu(false);
                        setShowEmailSettings(true);
                      }}
                    >
                      <Icon name="CalendarClock" size={18} className="text-purple-500" />
                      Автоотправка
                    </Button>
                  </div>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={24} />
              </Button>
            </div>
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
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${textColor}`}>История изменений</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={exportToCSV}
                  className="flex items-center gap-2"
                >
                  <Icon name="FileDown" size={16} />
                  CSV
                </Button>
              </div>
            </div>
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
      
      {showEmailSettings && (
        <EmailScheduleSettings
          informerLabel={informer.label}
          isDarkTheme={isDarkTheme}
          onClose={() => setShowEmailSettings(false)}
        />
      )}
    </div>
  );
};

export default InformerDetailModal;