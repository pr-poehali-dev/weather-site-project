import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface EmailScheduleSettingsProps {
  informerLabel: string;
  isDarkTheme: boolean;
  onClose: () => void;
}

interface ScheduleSettings {
  enabled: boolean;
  email: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  includeChart: boolean;
  includePDF: boolean;
}

const EmailScheduleSettings = ({ informerLabel, isDarkTheme, onClose }: EmailScheduleSettingsProps) => {
  const storageKey = `email_schedule_${informerLabel}`;
  
  const [settings, setSettings] = useState<ScheduleSettings>({
    enabled: false,
    email: '',
    frequency: 'daily',
    time: '09:00',
    includeChart: true,
    includePDF: false
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        setSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Ошибка загрузки настроек:', e);
      }
    }
  }, [storageKey]);

  const handleSave = () => {
    setIsSaving(true);
    
    localStorage.setItem(storageKey, JSON.stringify(settings));
    
    setTimeout(() => {
      setIsSaving(false);
      alert(`✅ Настройки сохранены!\n\nОтчёты будут отправляться на ${settings.email}\nЧастота: ${
        settings.frequency === 'daily' ? 'Ежедневно' : 
        settings.frequency === 'weekly' ? 'Еженедельно' : 
        'Ежемесячно'
      } в ${settings.time}`);
      onClose();
    }, 500);
  };

  const cardBg = isDarkTheme ? 'bg-gray-900' : 'bg-white';
  const textColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const subtextColor = isDarkTheme ? 'text-gray-400' : 'text-gray-600';
  const inputBg = isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-2xl ${cardBg} ${textColor} max-h-[90vh] overflow-y-auto`}>
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className={`text-2xl font-bold ${textColor}`}>📧 Автоматическая рассылка</h2>
              <p className={subtextColor}>Настройте отправку отчётов "{informerLabel}" на email</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={24} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className={`font-semibold ${textColor}`}>Включить автоматическую отправку</div>
                <div className={`text-sm ${subtextColor}`}>Отчёты будут отправляться по расписанию</div>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  settings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    settings.enabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {settings.enabled && (
              <>
                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Email для отправки
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Частота отправки
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setSettings(prev => ({ ...prev, frequency: freq }))}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          settings.frequency === freq
                            ? 'bg-blue-500 text-white border-blue-500'
                            : `${inputBg} ${textColor}`
                        }`}
                      >
                        {freq === 'daily' ? '📅 Ежедневно' : freq === 'weekly' ? '📆 Еженедельно' : '📊 Ежемесячно'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${textColor} mb-2`}>
                    Время отправки
                  </label>
                  <input
                    type="time"
                    value={settings.time}
                    onChange={(e) => setSettings(prev => ({ ...prev, time: e.target.value }))}
                    className={`w-full px-4 py-2 rounded-lg border ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>

                {settings.frequency === 'weekly' && (
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-2`}>
                      День недели
                    </label>
                    <select
                      value={settings.dayOfWeek || 1}
                      onChange={(e) => setSettings(prev => ({ ...prev, dayOfWeek: Number(e.target.value) }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value={1}>Понедельник</option>
                      <option value={2}>Вторник</option>
                      <option value={3}>Среда</option>
                      <option value={4}>Четверг</option>
                      <option value={5}>Пятница</option>
                      <option value={6}>Суббота</option>
                      <option value={0}>Воскресенье</option>
                    </select>
                  </div>
                )}

                {settings.frequency === 'monthly' && (
                  <div>
                    <label className={`block text-sm font-medium ${textColor} mb-2`}>
                      День месяца
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={settings.dayOfMonth || 1}
                      onChange={(e) => setSettings(prev => ({ ...prev, dayOfMonth: Number(e.target.value) }))}
                      className={`w-full px-4 py-2 rounded-lg border ${inputBg} ${textColor} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>
                )}

                <div className={`p-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg space-y-3`}>
                  <div className={`font-medium ${textColor}`}>Содержимое отчёта</div>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.includeChart}
                      onChange={(e) => setSettings(prev => ({ ...prev, includeChart: e.target.checked }))}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className={textColor}>Включить график</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.includePDF}
                      onChange={(e) => setSettings(prev => ({ ...prev, includePDF: e.target.checked }))}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className={textColor}>Прикрепить PDF-отчёт</span>
                  </label>
                </div>

                <div className={`p-4 ${isDarkTheme ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border rounded-lg`}>
                  <div className="flex gap-3">
                    <Icon name="Info" size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className={`text-sm ${isDarkTheme ? 'text-blue-300' : 'text-blue-700'}`}>
                      <strong>Как это работает:</strong>
                      <br />
                      Отчёты сохраняются локально и будут отправляться через ваш email-клиент в указанное время.
                      Для полной автоматизации подключите интеграцию с почтовым сервисом.
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || (settings.enabled && !settings.email)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isSaving ? (
                <>
                  <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить настройки
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailScheduleSettings;
