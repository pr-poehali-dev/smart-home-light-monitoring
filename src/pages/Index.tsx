import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Light, Scenario, ScheduleItem, Notification, Product } from '@/components/types';
import HeaderWithNotifications from '@/components/HeaderWithNotifications';
import HomeMapShopTabs from '@/components/HomeMapShopTabs';
import RoomsScenariosSettingsTabs from '@/components/RoomsScenariosSettingsTabs';

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

  const activeCount = lights.filter(l => l.isOn).length;
  const totalPower = lights.filter(l => l.isOn).reduce((sum, l) => sum + l.brightness, 0);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        <HeaderWithNotifications 
          notifications={notifications}
          activeCount={activeCount}
          totalLights={lights.length}
          totalPower={totalPower}
        />

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

          <HomeMapShopTabs 
            lights={lights}
            products={products}
            toggleLight={toggleLight}
            toggleRoomLights={toggleRoomLights}
            setBrightness={setBrightness}
            setLights={setLights}
          />

          <RoomsScenariosSettingsTabs 
            lights={lights}
            scenarios={scenarios}
            schedule={schedule}
            notifications={notifications}
            toggleLight={toggleLight}
            toggleRoomLights={toggleRoomLights}
            activateScenario={activateScenario}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
