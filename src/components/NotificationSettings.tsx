import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Slider } from '@/components/ui/slider';

interface NotificationSettings {
  enabled: boolean;
  temperature: boolean;
  wind: boolean;
  storm: boolean;
  snow: boolean;
  rain: boolean;
  tempThreshold: number;
  windThreshold: number;
}

interface NotificationSettingsProps {
  onClose: () => void;
  onSettingsChange: (settings: NotificationSettings) => void;
  currentSettings: NotificationSettings;
}

const NotificationSettings = ({ onClose, onSettingsChange, currentSettings }: NotificationSettingsProps) => {
  const [settings, setSettings] = useState<NotificationSettings>(currentSettings);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleRequestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setSettings({ ...settings, enabled: true });
      }
    }
  };

  const handleToggle = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key as string] };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleThresholdChange = (key: 'tempThreshold' | 'windThreshold', value: number[]) => {
    const newSettings = { ...settings, [key]: value[0] };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleSave = () => {
    localStorage.setItem('weatherNotificationSettings', JSON.stringify(settings));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Icon name="Bell" size={24} className="text-blue-600" />
            Настройки уведомлений
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {permission !== 'granted' && (
          <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <p className="text-sm mb-3">Для получения уведомлений разрешите их в браузере</p>
            <Button onClick={handleRequestPermission} className="w-full">
              <Icon name="Bell" size={16} className="mr-2" />
              Разрешить уведомления
            </Button>
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Bell" size={20} className="text-blue-600" />
              <span className="font-medium">Включить уведомления</span>
            </div>
            <Switch 
              checked={settings.enabled && permission === 'granted'} 
              onCheckedChange={() => handleToggle('enabled')}
              disabled={permission !== 'granted'}
            />
          </div>

          {settings.enabled && permission === 'granted' && (
            <>
              <div className="border-t pt-4 space-y-4">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Типы уведомлений</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="Thermometer" size={20} className="text-orange-600" />
                    <span>Изменение температуры</span>
                  </div>
                  <Switch 
                    checked={settings.temperature} 
                    onCheckedChange={() => handleToggle('temperature')}
                  />
                </div>

                {settings.temperature && (
                  <div className="ml-8 space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Порог изменения: {settings.tempThreshold}°C
                    </label>
                    <Slider
                      value={[settings.tempThreshold]}
                      onValueChange={(value) => handleThresholdChange('tempThreshold', value)}
                      min={1}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="Wind" size={20} className="text-cyan-600" />
                    <span>Сильный ветер</span>
                  </div>
                  <Switch 
                    checked={settings.wind} 
                    onCheckedChange={() => handleToggle('wind')}
                  />
                </div>

                {settings.wind && (
                  <div className="ml-8 space-y-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">
                      Порог скорости: {settings.windThreshold} км/ч
                    </label>
                    <Slider
                      value={[settings.windThreshold]}
                      onValueChange={(value) => handleThresholdChange('windThreshold', value)}
                      min={5}
                      max={30}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="CloudLightning" size={20} className="text-yellow-600" />
                    <span>Гроза</span>
                  </div>
                  <Switch 
                    checked={settings.storm} 
                    onCheckedChange={() => handleToggle('storm')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="CloudSnow" size={20} className="text-blue-400" />
                    <span>Снегопад</span>
                  </div>
                  <Switch 
                    checked={settings.snow} 
                    onCheckedChange={() => handleToggle('snow')}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="CloudRain" size={20} className="text-blue-600" />
                    <span>Дождь</span>
                  </div>
                  <Switch 
                    checked={settings.rain} 
                    onCheckedChange={() => handleToggle('rain')}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            <Icon name="Check" size={16} className="mr-2" />
            Сохранить
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1">
            Отмена
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotificationSettings;
