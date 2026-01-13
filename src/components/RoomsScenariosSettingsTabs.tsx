import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { Light, Scenario, ScheduleItem, Notification } from './types';

interface RoomsScenariosSettingsTabsProps {
  lights: Light[];
  scenarios: Scenario[];
  schedule: ScheduleItem[];
  notifications: Notification[];
  toggleLight: (id: string) => void;
  toggleRoomLights: (room: string, turnOn: boolean) => void;
  setRoomBrightness: (room: string, value: number) => void;
  activateScenario: (name: string) => void;
}

const RoomsScenariosSettingsTabs = ({ 
  lights, 
  scenarios, 
  schedule, 
  notifications,
  toggleLight, 
  toggleRoomLights,
  setRoomBrightness,
  activateScenario 
}: RoomsScenariosSettingsTabsProps) => {
  const rooms = ['Все', ...Array.from(new Set(lights.map(l => l.room)))];
  const [selectedRoom, setSelectedRoom] = useState('Все');

  const filteredLights = selectedRoom === 'Все' 
    ? lights 
    : lights.filter(l => l.room === selectedRoom);

  return (
    <>
      <TabsContent value="rooms" className="space-y-4 mt-6">
        <div className="flex gap-2 flex-wrap mb-4">
          {rooms.map((room) => (
            <Badge
              key={room}
              variant={selectedRoom === room ? 'default' : 'outline'}
              className={`cursor-pointer px-4 py-2 transition-all ${
                selectedRoom === room ? 'gradient-purple-pink border-0' : ''
              }`}
              onClick={() => setSelectedRoom(room)}
            >
              {room}
            </Badge>
          ))}
        </div>
        {selectedRoom !== 'Все' && (
          <>
            <Card className="glassmorphism border-0 p-4 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Управление комнатой</p>
                  <p className="text-sm text-muted-foreground">
                    {filteredLights.filter(l => l.isOn).length} из {filteredLights.length} включено
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="gradient-purple-pink border-0"
                    onClick={() => toggleRoomLights(selectedRoom, true)}
                  >
                    <Icon name="Power" size={16} className="mr-1" />
                    Включить все
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => toggleRoomLights(selectedRoom, false)}
                  >
                    <Icon name="PowerOff" size={16} className="mr-1" />
                    Выключить все
                  </Button>
                </div>
              </div>
            </Card>
            
            <Card className="glassmorphism border-0 p-4 mb-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Яркость в комнате</p>
                  <Badge className="gradient-blue-orange border-0">
                    {Math.round(filteredLights.reduce((sum, l) => sum + l.brightness, 0) / filteredLights.length)}%
                  </Badge>
                </div>
                <Slider 
                  value={[Math.round(filteredLights.reduce((sum, l) => sum + l.brightness, 0) / filteredLights.length)]} 
                  max={100} 
                  step={10}
                  onValueChange={([value]) => setRoomBrightness(selectedRoom, value)}
                  className="cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </Card>
          </>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredLights.map((light) => (
            <Card 
              key={light.id} 
              className={`glassmorphism p-4 border-0 transition-all duration-500 relative overflow-hidden ${
                light.isOn ? 'neon-glow' : ''
              }`}
            >
              {light.isOn && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-orange-500/20 animate-pulse-glow" />
              )}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    light.isOn 
                      ? 'gradient-blue-orange shadow-[0_0_20px_rgba(139,92,246,0.5)]' 
                      : 'bg-muted'
                  }`}>
                    <Icon name="Lightbulb" size={20} className={light.isOn ? 'animate-pulse' : ''} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{light.name}</h3>
                    <p className="text-sm text-muted-foreground">{light.brightness}%</p>
                  </div>
                </div>
                <Switch 
                  checked={light.isOn} 
                  onCheckedChange={() => toggleLight(light.id)}
                />
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="scenarios" className="space-y-4 mt-6">
        <h2 className="text-xl font-semibold">Сценарии освещения</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="glassmorphism border-0 p-6 cursor-pointer transition-all duration-300 hover:scale-105"
              onClick={() => activateScenario(scenario.name)}
            >
              <div className="space-y-3">
                <div className={`${scenario.gradient} p-3 rounded-xl w-fit`}>
                  <Icon name={scenario.icon as any} size={28} />
                </div>
                <h3 className="font-semibold text-lg">{scenario.name}</h3>
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="schedule" className="space-y-4 mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Расписание</h2>
          <Button size="sm" className="gradient-purple-pink border-0">
            <Icon name="Plus" size={16} className="mr-1" />
            Добавить
          </Button>
        </div>
        <div className="space-y-3">
          {schedule.map((item) => (
            <Card key={item.id} className="glassmorphism p-4 border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="gradient-blue-orange p-3 rounded-lg">
                    <Icon name="Clock" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{item.time}</p>
                    <p className="text-sm text-muted-foreground">{item.action} • {item.room}</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4 mt-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Уведомления</h2>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`glassmorphism p-4 border-0 border-l-4 ${
                  notification.type === 'error' ? 'border-l-destructive' :
                  notification.type === 'warning' ? 'border-l-yellow-500' :
                  'border-l-accent'
                }`}
              >
                <div className="flex gap-3">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'error' ? 'bg-destructive/20' :
                    notification.type === 'warning' ? 'bg-yellow-500/20' :
                    'bg-accent/20'
                  }`}>
                    <Icon 
                      name={
                        notification.type === 'error' ? 'AlertCircle' :
                        notification.type === 'warning' ? 'AlertTriangle' :
                        'Info'
                      } 
                      size={20}
                      className={
                        notification.type === 'error' ? 'text-destructive' :
                        notification.type === 'warning' ? 'text-yellow-500' :
                        'text-accent'
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 space-y-4">
            <h3 className="text-lg font-semibold">Настройки</h3>
            <Card className="glassmorphism p-4 border-0 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Автоматизация</p>
                  <p className="text-sm text-muted-foreground">Умное управление по расписанию</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push-уведомления</p>
                  <p className="text-sm text-muted-foreground">Получать оповещения</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Энергосбережение</p>
                  <p className="text-sm text-muted-foreground">Автовыключение неиспользуемых</p>
                </div>
                <Switch />
              </div>
            </Card>
          </div>
        </div>
      </TabsContent>
    </>
  );
};

export default RoomsScenariosSettingsTabs;