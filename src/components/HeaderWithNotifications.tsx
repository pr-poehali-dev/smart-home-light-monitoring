import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Notification } from './types';

interface HeaderWithNotificationsProps {
  notifications: Notification[];
  activeCount: number;
  totalLights: number;
  totalPower: number;
}

const HeaderWithNotifications = ({ 
  notifications, 
  activeCount, 
  totalLights, 
  totalPower 
}: HeaderWithNotificationsProps) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Умный дом
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Система освещения</p>
        </div>
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Icon name="Bell" size={24} />
            {notifications.filter(n => n.type === 'error' || n.type === 'warning').length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse-glow" />
            )}
          </Button>
          
          {showNotifications && (
            <Card className="absolute right-0 top-12 w-80 glassmorphism border-0 p-4 z-50 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Уведомления</h3>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setShowNotifications(false)}
                >
                  <Icon name="X" size={16} />
                </Button>
              </div>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className="p-3 rounded-lg bg-muted/50 space-y-1 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className={`p-1 rounded-full ${
                        notification.type === 'error' ? 'bg-destructive/20' : 
                        notification.type === 'warning' ? 'bg-yellow-500/20' : 
                        'bg-blue-500/20'
                      }`}>
                        <Icon 
                          name={
                            notification.type === 'error' ? 'AlertCircle' : 
                            notification.type === 'warning' ? 'AlertTriangle' : 
                            'Info'
                          } 
                          size={16}
                          className={`${
                            notification.type === 'error' ? 'text-destructive' : 
                            notification.type === 'warning' ? 'text-yellow-500' : 
                            'text-blue-500'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      <Card className="glassmorphism p-4 md:p-6 border-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Активно</p>
            <p className="text-2xl md:text-3xl font-bold">{activeCount} из {totalLights}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Мощность</p>
            <p className="text-2xl md:text-3xl font-bold">{Math.round(totalPower / 10)}%</p>
          </div>
          <div className="space-y-1 hidden md:block">
            <p className="text-sm text-muted-foreground">Сегодня</p>
            <p className="text-2xl md:text-3xl font-bold">12 кВт⋅ч</p>
          </div>
          <div className="space-y-1 hidden md:block">
            <p className="text-sm text-muted-foreground">Экономия</p>
            <p className="text-2xl md:text-3xl font-bold text-green-500">-18%</p>
          </div>
        </div>
      </Card>
    </header>
  );
};

export default HeaderWithNotifications;