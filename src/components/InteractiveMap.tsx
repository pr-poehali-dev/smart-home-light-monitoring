import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Room, Light } from './types';
import { toast } from 'sonner';

interface InteractiveMapProps {
  rooms: Room[];
  lights: Light[];
  toggleLight: (id: string) => void;
  toggleRoomLights: (room: string, turnOn: boolean) => void;
  setLights: (lights: Light[]) => void;
  selectedRoom: string | null;
  onRoomClick: (roomId: string) => void;
}

const InteractiveMap = ({
  rooms,
  lights,
  toggleLight,
  toggleRoomLights,
  setLights,
  selectedRoom,
  onRoomClick,
}: InteractiveMapProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [draggedLight, setDraggedLight] = useState<string | null>(null);
  const [isPositioningMode, setIsPositioningMode] = useState(false);

  const handleDragStart = (lightId: string) => {
    if (!isPositioningMode) return;
    setIsDragging(true);
    setDraggedLight(lightId);
  };

  const handleDrop = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging || !draggedLight || !isPositioningMode) return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 400;
    const y = ((e.clientY - rect.top) / rect.height) * 300;

    setLights(
      lights.map((light) =>
        light.id === draggedLight ? { ...light, x, y } : light
      )
    );

    setIsDragging(false);
    setDraggedLight(null);
    toast.success('Позиция устройства обновлена');
  };

  const getLightPosition = (light: Light, roomName: string, idx: number) => {
    if (light.x && light.y) {
      return { x: light.x, y: light.y };
    }

    const room = rooms.find((r) => r.name === roomName);
    if (room) {
      return {
        x: room.x + 30 + (idx % 3) * 30,
        y: room.y + room.height / 2,
      };
    }

    return { x: 50 + idx * 40, y: 150 };
  };

  const getColorFromRoom = (roomColor: string) => {
    return roomColor.replace('0.2', '0.5');
  };

  return (
    <div className="space-y-4">
      <Card className="glassmorphism border-0 p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">Интерактивная карта</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Нажмите на комнату для управления
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isPositioningMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setIsPositioningMode(!isPositioningMode);
                toast.info(
                  isPositioningMode
                    ? 'Режим позиционирования выключен'
                    : 'Режим позиционирования включен. Перетащите устройства на карте.'
                );
              }}
              className={isPositioningMode ? 'gradient-purple-pink border-0' : ''}
            >
              <Icon name="Move" size={16} className="mr-2" />
              {isPositioningMode ? 'Готово' : 'Позиционирование'}
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/3] bg-muted/30 rounded-lg p-2 md:p-4 overflow-hidden">
          <svg
            viewBox="0 0 400 300"
            className="w-full h-full"
            onMouseUp={handleDrop}
            onMouseLeave={() => {
              setIsDragging(false);
              setDraggedLight(null);
            }}
          >
            <defs>
              {rooms.map((room) => (
                <linearGradient
                  key={room.id}
                  id={`gradient-${room.id}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={getColorFromRoom(room.color)} />
                  <stop
                    offset="100%"
                    stopColor={getColorFromRoom(room.color).replace('0.5', '0.8')}
                  />
                </linearGradient>
              ))}
            </defs>

            {rooms.map((room) => {
              const roomLights = lights.filter((l) => l.room === room.name);
              const hasActiveLight = roomLights.some((l) => l.isOn);

              return (
                <g key={room.id}>
                  <rect
                    x={room.x}
                    y={room.y}
                    width={room.width}
                    height={room.height}
                    fill={room.color}
                    stroke={hasActiveLight ? `url(#gradient-${room.id})` : 'rgba(255, 255, 255, 0.2)'}
                    strokeWidth={hasActiveLight ? '3' : '2'}
                    rx="8"
                    className={`cursor-pointer transition-all ${
                      selectedRoom === room.id ? 'opacity-100' : 'opacity-80'
                    }`}
                    onClick={() => onRoomClick(room.id)}
                  >
                    {hasActiveLight && (
                      <animate
                        attributeName="stroke-width"
                        values="3;5;3"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    )}
                  </rect>
                  <text
                    x={room.x + room.width / 2}
                    y={room.y - 10}
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="14"
                    fontWeight="600"
                    className="cursor-pointer"
                    onClick={() => onRoomClick(room.id)}
                  >
                    {room.name}
                  </text>

                  {roomLights.map((light, idx) => {
                    const pos = getLightPosition(light, room.name, idx);
                    return (
                      <g
                        key={light.id}
                        onMouseDown={() => handleDragStart(light.id)}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isPositioningMode) {
                            toggleLight(light.id);
                          }
                        }}
                        style={{
                          cursor: isPositioningMode ? 'move' : 'pointer',
                        }}
                      >
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r="14"
                          fill={
                            light.isOn
                              ? `url(#gradient-${room.id})`
                              : 'rgba(100, 100, 100, 0.3)'
                          }
                          className="transition-all duration-300"
                        >
                          {light.isOn && (
                            <animate
                              attributeName="opacity"
                              values="0.7;1;0.7"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          )}
                        </circle>
                        {light.isOn && (
                          <circle
                            cx={pos.x}
                            cy={pos.y}
                            r="20"
                            fill="none"
                            stroke={getColorFromRoom(room.color)}
                            strokeWidth="2"
                            opacity="0.5"
                          >
                            <animate
                              attributeName="r"
                              values="14;24;14"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              values="0.5;0;0.5"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                        <text
                          x={pos.x}
                          y={pos.y + 25}
                          textAnchor="middle"
                          fill="currentColor"
                          fontSize="9"
                          fontWeight="500"
                        >
                          {light.name}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </svg>
        </div>

        {isPositioningMode && (
          <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <Icon name="Info" size={16} />
              <span>Перетаскивайте устройства на карте для настройки их расположения</span>
            </div>
          </div>
        )}
      </Card>

      {selectedRoom && (
        <Card className="glassmorphism border-0 p-4 md:p-6">
          {(() => {
            const room = rooms.find((r) => r.id === selectedRoom);
            if (!room) return null;

            const roomLights = lights.filter((l) => l.room === room.name);
            const allOn = roomLights.every((l) => l.isOn);

            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: room.color }}
                      >
                        <Icon name={room.icon as any} size={20} />
                      </div>
                      {room.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {roomLights.filter((l) => l.isOn).length} из {roomLights.length}{' '}
                      устройств активно
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="gradient-purple-pink border-0"
                      onClick={() => toggleRoomLights(room.name, !allOn)}
                    >
                      <Icon name={allOn ? 'PowerOff' : 'Power'} size={16} className="mr-2" />
                      {allOn ? 'Выключить все' : 'Включить все'}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {roomLights.map((light) => (
                    <Card
                      key={light.id}
                      className={`glassmorphism border-0 p-4 transition-all ${
                        light.isOn ? 'neon-glow' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg transition-all ${
                              light.isOn
                                ? 'gradient-blue-orange shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                                : 'bg-muted'
                            }`}
                          >
                            <Icon
                              name="Lightbulb"
                              size={20}
                              className={light.isOn ? 'animate-pulse' : ''}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold">{light.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Яркость: {light.brightness}%
                            </p>
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

                {roomLights.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Lightbulb" size={48} className="mx-auto mb-3 opacity-30" />
                    <p>В этой комнате нет устройств</p>
                    <p className="text-sm mt-1">Привяжите устройства через редактирование комнаты</p>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
};

export default InteractiveMap;
