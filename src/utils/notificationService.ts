interface NotificationRule {
  informerLabel: string;
  type: 'temperature' | 'wind' | 'humidity' | 'pressure' | 'precipitation';
  condition: 'increase' | 'decrease' | 'threshold';
  value?: number;
  threshold?: number;
  enabled: boolean;
}

class NotificationService {
  private previousValues: Map<string, number> = new Map();
  private lastNotificationTime: Map<string, number> = new Map();
  private readonly NOTIFICATION_COOLDOWN = 30 * 60 * 1000; // 30 минут

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Браузер не поддерживает уведомления');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!('Notification' in window)) {
      return 'unsupported';
    }
    return Notification.permission;
  }

  async showNotification(title: string, options: NotificationOptions = {}): Promise<void> {
    if (Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 10000);
    } catch (error) {
      console.error('Ошибка показа уведомления:', error);
    }
  }

  private canSendNotification(key: string): boolean {
    const lastTime = this.lastNotificationTime.get(key);
    if (!lastTime) return true;

    const timePassed = Date.now() - lastTime;
    return timePassed >= this.NOTIFICATION_COOLDOWN;
  }

  private markNotificationSent(key: string): void {
    this.lastNotificationTime.set(key, Date.now());
  }

  checkWeatherAlert(informerLabel: string, currentValue: string, description: string): void {
    if (Notification.permission !== 'granted') return;

    const numericValue = parseFloat(currentValue.replace(/[^0-9.-]/g, ''));
    if (isNaN(numericValue)) return;

    const key = informerLabel.toLowerCase();
    const previousValue = this.previousValues.get(key);

    if (previousValue !== undefined) {
      this.analyzeWeatherChange(informerLabel, key, currentValue, numericValue, previousValue, description);
    }

    this.previousValues.set(key, numericValue);
  }

  private analyzeWeatherChange(
    label: string,
    key: string,
    displayValue: string,
    current: number,
    previous: number,
    description: string
  ): void {
    const change = current - previous;
    const changePercent = (Math.abs(change) / Math.abs(previous)) * 100;

    if (key.includes('температура')) {
      if (change <= -5) {
        this.sendAlert(
          key,
          '🥶 Резкое похолодание!',
          `Температура упала на ${Math.abs(change).toFixed(1)}°C. Сейчас: ${displayValue}`
        );
      } else if (change >= 5) {
        this.sendAlert(
          key,
          '🌡️ Резкое потепление!',
          `Температура выросла на ${change.toFixed(1)}°C. Сейчас: ${displayValue}`
        );
      } else if (current <= -20) {
        this.sendAlert(
          key,
          '⚠️ Экстремальный холод!',
          `Очень низкая температура: ${displayValue}. Оденьтесь теплее!`
        );
      } else if (current >= 35) {
        this.sendAlert(
          key,
          '🔥 Экстремальная жара!',
          `Очень высокая температура: ${displayValue}. Берегите здоровье!`
        );
      }
    }

    if (key.includes('ветер')) {
      if (current >= 15) {
        this.sendAlert(
          key,
          '💨 Сильный ветер!',
          `Скорость ветра: ${displayValue}. Будьте осторожны!`
        );
      } else if (change >= 7 && changePercent >= 50) {
        this.sendAlert(
          key,
          '🌪️ Ветер усиливается!',
          `Скорость ветра увеличилась до ${displayValue}`
        );
      }
    }

    if (key.includes('влажность')) {
      if (current >= 90) {
        this.sendAlert(
          key,
          '💧 Очень высокая влажность!',
          `Влажность: ${displayValue}. Возможен туман или осадки`
        );
      } else if (current <= 30) {
        this.sendAlert(
          key,
          '🏜️ Низкая влажность!',
          `Влажность: ${displayValue}. Пейте больше воды`
        );
      }
    }

    if (key.includes('давление')) {
      if (current <= 730) {
        this.sendAlert(
          key,
          '📉 Низкое давление!',
          `Атмосферное давление: ${displayValue}. Возможно ухудшение самочувствия`
        );
      } else if (current >= 770) {
        this.sendAlert(
          key,
          '📈 Высокое давление!',
          `Атмосферное давление: ${displayValue}. Берегите здоровье`
        );
      } else if (Math.abs(change) >= 5) {
        this.sendAlert(
          key,
          '⚠️ Резкий перепад давления!',
          `Давление ${change > 0 ? 'повысилось' : 'понизилось'} на ${Math.abs(change).toFixed(0)} мм. Сейчас: ${displayValue}`
        );
      }
    }

    if (key.includes('осадки') || key.includes('дождь')) {
      if (current >= 10) {
        this.sendAlert(
          key,
          '☔ Сильные осадки!',
          `Интенсивность: ${displayValue}. Возьмите зонт!`
        );
      }
    }
  }

  private sendAlert(key: string, title: string, body: string): void {
    if (!this.canSendNotification(key)) {
      return;
    }

    this.showNotification(title, {
      body,
      tag: key,
      requireInteraction: true,
      vibrate: [200, 100, 200]
    });

    this.markNotificationSent(key);
  }

  loadDefaultRules(): NotificationRule[] {
    return [
      {
        informerLabel: 'Температура',
        type: 'temperature',
        condition: 'threshold',
        threshold: -20,
        enabled: true
      },
      {
        informerLabel: 'Температура',
        type: 'temperature',
        condition: 'threshold',
        threshold: 35,
        enabled: true
      },
      {
        informerLabel: 'Скорость ветра',
        type: 'wind',
        condition: 'threshold',
        threshold: 15,
        enabled: true
      },
      {
        informerLabel: 'Атмосферное давление',
        type: 'pressure',
        condition: 'decrease',
        value: 5,
        enabled: true
      },
      {
        informerLabel: 'Влажность',
        type: 'humidity',
        condition: 'threshold',
        threshold: 90,
        enabled: true
      }
    ];
  }

  saveRules(rules: NotificationRule[]): void {
    localStorage.setItem('weather_notification_rules', JSON.stringify(rules));
  }

  getRules(): NotificationRule[] {
    const saved = localStorage.getItem('weather_notification_rules');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Ошибка загрузки правил:', e);
      }
    }
    return this.loadDefaultRules();
  }
}

export const notificationService = new NotificationService();
export type { NotificationRule };
