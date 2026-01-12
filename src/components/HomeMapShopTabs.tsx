import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Light, Product } from './types';

interface HomeMapShopTabsProps {
  lights: Light[];
  products: Product[];
  toggleLight: (id: string) => void;
  toggleRoomLights: (room: string, turnOn: boolean) => void;
  setBrightness: (id: string, value: number) => void;
  setLights: React.Dispatch<React.SetStateAction<Light[]>>;
}

const HomeMapShopTabs = ({ 
  lights, 
  products, 
  toggleLight, 
  toggleRoomLights, 
  setBrightness,
  setLights 
}: HomeMapShopTabsProps) => {
  return (
    <>
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
    </>
  );
};

export default HomeMapShopTabs;
