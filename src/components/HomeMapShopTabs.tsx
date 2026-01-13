import { useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Light, Product, CartItem } from './types';

interface HomeMapShopTabsProps {
  lights: Light[];
  products: Product[];
  cart: CartItem[];
  energyDataWeek: { day: string; consumption: number }[];
  energyDataMonth: { month: string; consumption: number; cost: number }[];
  toggleLight: (id: string) => void;
  toggleRoomLights: (room: string, turnOn: boolean) => void;
  setBrightness: (id: string, value: number) => void;
  setRoomBrightness: (room: string, value: number) => void;
  setLights: React.Dispatch<React.SetStateAction<Light[]>>;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
}

const HomeMapShopTabs = ({ 
  lights, 
  products, 
  cart,
  energyDataWeek,
  energyDataMonth,
  toggleLight, 
  toggleRoomLights, 
  setBrightness,
  setRoomBrightness,
  setLights,
  addToCart,
  removeFromCart,
  updateQuantity
}: HomeMapShopTabsProps) => {
  const [showCart, setShowCart] = useState(false);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const totalCartPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const currentData = viewMode === 'week' ? energyDataWeek : energyDataMonth;
  const maxConsumption = viewMode === 'week' 
    ? Math.max(...energyDataWeek.map(d => d.consumption))
    : Math.max(...energyDataMonth.map(d => d.consumption));

  return (
    <>
      <TabsContent value="home" className="space-y-4 mt-6">
        <Card className="glassmorphism border-0 p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
            <h2 className="text-xl md:text-2xl font-semibold">График потребления</h2>
            <div className="flex gap-2">
              <Badge 
                variant="outline" 
                className={`cursor-pointer ${viewMode === 'week' ? 'gradient-purple-pink border-0' : ''}`}
                onClick={() => setViewMode('week')}
              >
                Неделя
              </Badge>
              <Badge 
                variant="outline" 
                className={`cursor-pointer ${viewMode === 'month' ? 'gradient-blue-orange border-0' : ''}`}
                onClick={() => setViewMode('month')}
              >
                Месяц
              </Badge>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-40 md:h-64">
            {viewMode === 'week' ? energyDataWeek.map((data) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-32">
                  <div 
                    className="w-full gradient-blue-orange rounded-t-lg transition-all duration-500 hover:scale-105 relative group"
                    style={{ height: `${(data.consumption / 20) * 100}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-muted px-2 py-1 rounded text-xs whitespace-nowrap">
                      {data.consumption} кВт⋅ч
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{data.day}</p>
              </div>
            )) : energyDataMonth.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-32">
                  <div 
                    className="w-full gradient-purple-pink rounded-t-lg transition-all duration-500 hover:scale-105 relative group"
                    style={{ height: `${(data.consumption / 400) * 100}%` }}
                  >
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-muted px-2 py-1 rounded text-xs whitespace-nowrap space-y-1">
                      <p>{data.consumption} кВт⋅ч</p>
                      <p className="text-green-500">{data.cost} ₽</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{data.month}</p>
              </div>
            ))}
          </div>
        </Card>
        
        <Card className="glassmorphism border-0 p-4 md:p-6">
          <h3 className="font-semibold text-lg md:text-xl mb-3">Аналитика экономии</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Экономия за месяц</p>
              <p className="text-xl font-bold text-green-500">-18%</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Средний расход</p>
              <p className="text-xl font-bold">13 кВт⋅ч</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Пик нагрузки</p>
              <p className="text-xl font-bold">18:00-22:00</p>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Сэкономлено</p>
              <p className="text-xl font-bold text-green-500">920 ₽</p>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-3">Все светильники</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
        <h2 className="text-xl md:text-2xl font-semibold">Карта дома</h2>
        
        <Card className="glassmorphism border-0 p-4 md:p-6">
          <div className="relative aspect-[4/3] bg-muted/30 rounded-lg p-2 md:p-4">
            <svg viewBox="0 0 400 300" className="w-full h-full">
              <rect x="10" y="80" width="120" height="100" fill="rgba(139, 92, 246, 0.1)" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" rx="4" />
              <text x="70" y="50" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="600">🛌️ Гостиная</text>
              {lights.filter(l => l.room === 'Гостиная').map((light, idx) => (
                <g key={light.id} onClick={() => toggleLight(light.id)} style={{ cursor: 'pointer' }}>
                  <circle 
                    cx={40 + idx * 40} 
                    cy={130} 
                    r="12" 
                    fill={light.isOn ? 'url(#gradient-purple)' : 'rgba(100, 100, 100, 0.3)'}
                    className="transition-all duration-300"
                  >
                    {light.isOn && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
                  </circle>
                  <text x={40 + idx * 40} y={155} textAnchor="middle" fill="currentColor" fontSize="8">{light.name}</text>
                </g>
              ))}
              
              <rect x="150" y="80" width="120" height="100" fill="rgba(14, 165, 233, 0.1)" stroke="rgba(14, 165, 233, 0.3)" strokeWidth="2" rx="4" />
              <text x="210" y="50" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="600">🛏️ Спальня</text>
              {lights.filter(l => l.room === 'Спальня').map((light, idx) => (
                <g key={light.id} onClick={() => toggleLight(light.id)} style={{ cursor: 'pointer' }}>
                  <circle 
                    cx={180 + idx * 40} 
                    cy={130} 
                    r="12" 
                    fill={light.isOn ? 'url(#gradient-blue)' : 'rgba(100, 100, 100, 0.3)'}
                    className="transition-all duration-300"
                  >
                    {light.isOn && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
                  </circle>
                  <text x={180 + idx * 40} y={155} textAnchor="middle" fill="currentColor" fontSize="8">{light.name}</text>
                </g>
              ))}
              
              <rect x="290" y="80" width="100" height="100" fill="rgba(139, 92, 246, 0.1)" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" rx="4" />
              <text x="340" y="50" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="600">🍳 Кухня</text>
              {lights.filter(l => l.room === 'Кухня').map((light, idx) => (
                <g key={light.id} onClick={() => toggleLight(light.id)} style={{ cursor: 'pointer' }}>
                  <circle 
                    cx={320 + idx * 35} 
                    cy={130} 
                    r="12" 
                    fill={light.isOn ? 'url(#gradient-purple)' : 'rgba(100, 100, 100, 0.3)'}
                    className="transition-all duration-300"
                  >
                    {light.isOn && <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />}
                  </circle>
                  <text x={320 + idx * 35} y={155} textAnchor="middle" fill="currentColor" fontSize="8">{light.name}</text>
                </g>
              ))}
              
              <defs>
                <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#D946EF" />
                </linearGradient>
                <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#F97316" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </Card>
        
        <Card className="glassmorphism border-0 p-4 md:p-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg md:text-xl">🛋️ Гостиная</h3>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
                <h3 className="font-semibold text-lg md:text-xl">🛏️ Спальня</h3>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
                <h3 className="font-semibold text-lg md:text-xl">🍳 Кухня</h3>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="glassmorphism border-0 p-4 flex flex-col">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <Badge variant="outline" className="gradient-purple-pink border-0 ml-2">
                    {product.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3">
                  <p className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {product.price} ₽
                  </p>
                  <Button 
                    size="sm" 
                    className="gradient-blue-orange border-0"
                    onClick={() => addToCart(product)}
                  >
                    <Icon name="Plus" size={16} className="mr-1" />
                    В корзину
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {cart.length > 0 && (
          <Card className="glassmorphism border-0 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Корзина</h3>
              <Badge className="gradient-purple-pink border-0">{cart.length}</Badge>
            </div>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <p className="font-medium text-sm">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">{item.product.price} ₽</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Icon name="Minus" size={14} />
                    </Button>
                    <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Icon name="Plus" size={14} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Итого:</p>
                <p className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {totalCartPrice} ₽
                </p>
              </div>
              {totalCartPrice >= 3000 && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <Icon name="Check" size={16} />
                  <span>Бесплатная доставка!</span>
                </div>
              )}
              <Button className="w-full gradient-purple-pink border-0" onClick={() => {
                toast.success('Заказ оформлен!');
                setCart([]);
              }}>
                <Icon name="CreditCard" size={16} className="mr-2" />
                Оформить заказ
              </Button>
            </div>
          </Card>
        )}

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