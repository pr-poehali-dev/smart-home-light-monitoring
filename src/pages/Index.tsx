import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Light {
  id: string;
  name: string;
  room: string;
  isOn: boolean;
  brightness: number;
}

interface Scenario {
  id: string;
  name: string;
  icon: string;
  gradient: string;
}

interface ScheduleItem {
  id: string;
  time: string;
  action: string;
  room: string;
}

interface Notification {
  id: string;
  type: 'warning' | 'info' | 'error';
  message: string;
  time: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  type: string;
  image: string;
}

const Index = () => {
  const [lights, setLights] = useState<Light[]>([
    { id: '1', name: 'Люстра', room: 'Гостиная', isOn: true, brightness: 80 },
    { id: '2', name: 'Торшер', room: 'Гостиная', isOn: false, brightness: 60 },
    { id: '3', name: 'Потолок', room: 'Спальня', isOn: true, brightness: 50 },
    { id: '4', name: 'Лента RGB', room: 'Спальня', isOn: true, brightness: 90 },
    { id: '5', name: 'Основной', room: 'Кухня', isOn: false, brightness: 70 },
    { id: '6', name: 'Рабочая зона', room: 'Кухня', isOn: true, brightness: 100 },
  ]);

  const scenarios: Scenario[] = [
    { id: '1', name: 'Вечер', icon: 'Sunset', gradient: 'gradient-purple-pink' },
    { id: '2', name: 'Работа', icon: 'Laptop', gradient: 'gradient-blue-orange' },
    { id: '3', name: 'Релакс', icon: 'CloudMoon', gradient: 'gradient-purple-pink' },
    { id: '4', name: 'Вечеринка', icon: 'Music', gradient: 'gradient-blue-orange' },
  ];

  const schedule: ScheduleItem[] = [
    { id: '1', time: '07:00', action: 'Включить', room: 'Кухня' },
    { id: '2', time: '09:00', action: 'Включить', room: 'Гостиная' },
    { id: '3', time: '22:00', action: 'Приглушить', room: 'Спальня' },
    { id: '4', time: '23:30', action: 'Выключить', room: 'Все комнаты' },
  ];

  const [notifications] = useState<Notification[]>([
    { id: '1', type: 'warning', message: 'Лампа в спальне работает 8 часов подряд', time: '10 мин назад' },
    { id: '2', type: 'info', message: 'Все светильники в гостиной включены', time: '1 час назад' },
    { id: '3', type: 'error', message: 'Потеря связи с торшером в гостиной', time: '3 часа назад' },
  ]);

  const products: Product[] = [
    { id: '1', name: 'Умная лампочка E27', price: 1290, description: 'RGB, 9W, Wi-Fi', type: 'Лампа', image: '💡' },
    { id: '2', name: 'LED лента 5м', price: 2490, description: 'RGB, пульт ДУ', type: 'Лента', image: '🌈' },
    { id: '3', name: 'Умный выключатель', price: 1890, description: 'Сенсорный, 2 клавиши', type: 'Выключатель', image: '🎛️' },
    { id: '4', name: 'Настольная лампа', price: 3490, description: 'RGB, таймер сна', type: 'Лампа', image: '🪔' },
    { id: '5', name: 'Потолочный светильник', price: 4990, description: 'Умное управление, 24W', type: 'Светильник', image: '💫' },
    { id: '6', name: 'Диммер Wi-Fi', price: 1590, description: 'Регулировка яркости', type: 'Аксессуар', image: '⚡' },
  ];



  const toggleLight = (id: string) => {
    setLights(lights.map(light => 
      light.id === id ? { ...light, isOn: !light.isOn } : light
    ));
    toast.success('Состояние изменено');
  };

  const toggleRoomLights = (room: string, turnOn: boolean) => {
    setLights(lights.map(light => 
      light.room === room ? { ...light, isOn: turnOn } : light
    ));
    toast.success(`Все светильники в комнате "${room}" ${turnOn ? 'включены' : 'выключены'}`);
  };

  const setBrightness = (id: string, value: number) => {
    setLights(lights.map(light => 
      light.id === id ? { ...light, brightness: value } : light
    ));
  };

  const activateScenario = (name: string) => {
    toast.success(`Сценарий "${name}" активирован`);
  };

  const rooms = ['Все', ...Array.from(new Set(lights.map(l => l.room)))];
  const [selectedRoom, setSelectedRoom] = useState('Все');

  const filteredLights = selectedRoom === 'Все' 
    ? lights 
    : lights.filter(l => l.room === selectedRoom);

  const activeCount = lights.filter(l => l.isOn).length;
  const totalPower = lights.filter(l => l.isOn).reduce((sum, l) => sum + l.brightness, 0);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
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

          <Card className="glassmorphism p-4 border-0">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Активно</p>
                <p className="text-2xl font-bold">{activeCount} из {lights.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Мощность</p>
                <p className="text-2xl font-bold">{Math.round(totalPower / 10)}%</p>
              </div>
            </div>
          </Card>
        </header>

        <Tabs defaultValue="home" className="animate-scale-in">
          <TabsList className="grid w-full grid-cols-6 bg-muted/50">
            <TabsTrigger value="home" className="data-[state=active]:gradient-purple-pink">
              <Icon name="Home" size={20} />
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:gradient-purple-pink">
              <Icon name="Map" size={20} />
            </TabsTrigger>
            <TabsTrigger value="rooms" className="data-[state=active]:gradient-purple-pink">
              <Icon name="Lightbulb" size={20} />
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="data-[state=active]:gradient-purple-pink">
              <Icon name="Sparkles" size={20} />
            </TabsTrigger>
            <TabsTrigger value="shop" className="data-[state=active]:gradient-purple-pink">
              <Icon name="ShoppingBag" size={20} />
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:gradient-purple-pink">
              <Icon name="Settings" size={20} />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-4 mt-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Все светильники</h2>
              <div className="space-y-3">
                {lights.map((light) => (
                  <Card 
                    key={light.id} 
                    className={`glassmorphism p-4 border-0 transition-all duration-500 hover:scale-[1.02] relative overflow-hidden ${
                      light.isOn ? 'neon-glow' : ''
                    }`}
                  >
                    {light.isOn && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent animate-pulse-glow pointer-events-none" />
                    )}
                    <div className="flex items-start justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg transition-all duration-300 ${
                          light.isOn 
                            ? 'gradient-purple-pink shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
                            : 'bg-muted'
                        }`}>
                          <Icon name="Lightbulb" size={20} className={light.isOn ? 'animate-pulse' : ''} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{light.name}</h3>
                          <p className="text-sm text-muted-foreground">{light.room}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={light.isOn} 
                        onCheckedChange={() => toggleLight(light.id)}
                      />
                    </div>
                    {light.isOn && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Яркость</span>
                          <span className="font-semibold">{light.brightness}%</span>
                        </div>
                        <Slider 
                          value={[light.brightness]} 
                          max={100} 
                          step={10}
                          onValueChange={([value]) => setBrightness(light.id, value)}
                          className="cursor-pointer"
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="map" className="space-y-4 mt-6">
            <h2 className="text-xl font-semibold">Карта дома</h2>
            <Card className="glassmorphism border-0 p-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">🛋️ Гостиная</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gradient-purple-pink border-0">
                        {lights.filter(l => l.room === 'Гостиная' && l.isOn).length}/{lights.filter(l => l.room === 'Гостиная').length}
                      </Badge>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => toggleRoomLights('Гостиная', !lights.filter(l => l.room === 'Гостиная').every(l => l.isOn))}
                      >
                        <Icon name="Power" size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {lights.filter(l => l.room === 'Гостиная').map(light => (
                      <div 
                        key={light.id}
                        onClick={() => toggleLight(light.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          light.isOn ? 'gradient-purple-pink neon-glow' : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon name="Lightbulb" size={16} />
                          <span className="text-xs">{light.brightness}%</span>
                        </div>
                        <p className="text-xs mt-1 font-medium">{light.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">🛏️ Спальня</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gradient-blue-orange border-0">
                        {lights.filter(l => l.room === 'Спальня' && l.isOn).length}/{lights.filter(l => l.room === 'Спальня').length}
                      </Badge>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => toggleRoomLights('Спальня', !lights.filter(l => l.room === 'Спальня').every(l => l.isOn))}
                      >
                        <Icon name="Power" size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {lights.filter(l => l.room === 'Спальня').map(light => (
                      <div 
                        key={light.id}
                        onClick={() => toggleLight(light.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          light.isOn ? 'gradient-blue-orange neon-glow' : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon name="Lightbulb" size={16} />
                          <span className="text-xs">{light.brightness}%</span>
                        </div>
                        <p className="text-xs mt-1 font-medium">{light.name}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">🍳 Кухня</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="gradient-purple-pink border-0">
                        {lights.filter(l => l.room === 'Кухня' && l.isOn).length}/{lights.filter(l => l.room === 'Кухня').length}
                      </Badge>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => toggleRoomLights('Кухня', !lights.filter(l => l.room === 'Кухня').every(l => l.isOn))}
                      >
                        <Icon name="Power" size={16} />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {lights.filter(l => l.room === 'Кухня').map(light => (
                      <div 
                        key={light.id}
                        onClick={() => toggleLight(light.id)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                          light.isOn ? 'gradient-purple-pink neon-glow' : 'bg-muted'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <Icon name="Lightbulb" size={16} />
                          <span className="text-xs">{light.brightness}%</span>
                        </div>
                        <p className="text-xs mt-1 font-medium">{light.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glassmorphism border-0 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Быстрое управление</p>
                  <p className="text-sm text-muted-foreground">Включить/выключить все</p>
                </div>
                <Button 
                  onClick={() => {
                    const allOn = lights.every(l => l.isOn);
                    setLights(lights.map(l => ({ ...l, isOn: !allOn })));
                    toast.success(allOn ? 'Все выключено' : 'Все включено');
                  }}
                  className="gradient-blue-orange border-0"
                >
                  <Icon name="Power" size={20} />
                </Button>
              </div>
            </Card>
          </TabsContent>

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
            )}
            <div className="space-y-3">
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
            <div className="grid grid-cols-2 gap-3">
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

          <TabsContent value="shop" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Магазин</h2>
              <Icon name="ShoppingCart" size={24} className="text-primary" />
            </div>
            <div className="space-y-3">
              {products.map((product) => (
                <Card key={product.id} className="glassmorphism border-0 p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{product.image}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        <Badge variant="outline" className="gradient-purple-pink border-0">
                          {product.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                          {product.price} ₽
                        </p>
                        <Button 
                          size="sm" 
                          className="gradient-blue-orange border-0"
                          onClick={() => toast.success(`${product.name} добавлен в корзину`)}
                        >
                          <Icon name="Plus" size={16} className="mr-1" />
                          В корзину
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="glassmorphism border-0 p-4 gradient-purple-pink">
              <div className="flex items-center gap-3">
                <Icon name="Truck" size={24} />
                <div>
                  <p className="font-semibold">Бесплатная доставка</p>
                  <p className="text-sm opacity-90">При заказе от 3000 ₽</p>
                </div>
              </div>
            </Card>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Index;