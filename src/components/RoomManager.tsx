import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Room, Light } from './types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RoomManagerProps {
  rooms: Room[];
  lights: Light[];
  setRooms: (rooms: Room[]) => void;
  setLights: (lights: Light[]) => void;
  onRoomClick: (roomId: string) => void;
  selectedRoom: string | null;
}

const RoomManager = ({ rooms, lights, setRooms, setLights, onRoomClick, selectedRoom }: RoomManagerProps) => {
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Home');
  const [selectedColor, setSelectedColor] = useState('rgba(139, 92, 246, 0.2)');

  const availableIcons = [
    'Home', 'Bed', 'Utensils', 'Bath', 'Sofa', 
    'Tv', 'DoorOpen', 'Building', 'Trees', 'Car'
  ];

  const availableColors = [
    { name: 'Фиолетовый', value: 'rgba(139, 92, 246, 0.2)', border: 'rgba(139, 92, 246, 0.5)' },
    { name: 'Синий', value: 'rgba(14, 165, 233, 0.2)', border: 'rgba(14, 165, 233, 0.5)' },
    { name: 'Зелёный', value: 'rgba(34, 197, 94, 0.2)', border: 'rgba(34, 197, 94, 0.5)' },
    { name: 'Оранжевый', value: 'rgba(249, 115, 22, 0.2)', border: 'rgba(249, 115, 22, 0.5)' },
    { name: 'Розовый', value: 'rgba(236, 72, 153, 0.2)', border: 'rgba(236, 72, 153, 0.5)' },
    { name: 'Жёлтый', value: 'rgba(234, 179, 8, 0.2)', border: 'rgba(234, 179, 8, 0.5)' },
  ];

  const addRoom = () => {
    if (!newRoomName.trim()) {
      toast.error('Введите название комнаты');
      return;
    }

    const newRoom: Room = {
      id: Date.now().toString(),
      name: newRoomName,
      icon: selectedIcon,
      color: selectedColor,
      x: 10 + (rooms.length % 3) * 130,
      y: 80 + Math.floor(rooms.length / 3) * 110,
      width: 120,
      height: 100,
    };

    setRooms([...rooms, newRoom]);
    setNewRoomName('');
    setIsAddingRoom(false);
    toast.success(`Комната "${newRoomName}" добавлена`);
  };

  const deleteRoom = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    setLights(lights.map(light => 
      light.room === room.name ? { ...light, room: 'Без комнаты' } : light
    ));
    setRooms(rooms.filter(r => r.id !== roomId));
    toast.success(`Комната "${room.name}" удалена`);
  };

  const updateRoomName = (roomId: string, newName: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const oldName = room.name;
    setRooms(rooms.map(r => r.id === roomId ? { ...r, name: newName } : r));
    setLights(lights.map(light => 
      light.room === oldName ? { ...light, room: newName } : light
    ));
    setEditingRoom(null);
    toast.success(`Комната переименована в "${newName}"`);
  };

  const assignLightToRoom = (lightId: string, roomName: string) => {
    setLights(lights.map(light => 
      light.id === lightId ? { ...light, room: roomName } : light
    ));
    toast.success('Устройство привязано к комнате');
  };

  const getRoomLightsCount = (roomName: string) => {
    return lights.filter(l => l.room === roomName).length;
  };

  const getRoomActiveLightsCount = (roomName: string) => {
    return lights.filter(l => l.room === roomName && l.isOn).length;
  };

  return (
    <div className="space-y-4">
      <Card className="glassmorphism border-0 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold">Управление комнатами</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {rooms.length} {rooms.length === 1 ? 'комната' : rooms.length < 5 ? 'комнаты' : 'комнат'}
            </p>
          </div>
          <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
            <DialogTrigger asChild>
              <Button className="gradient-purple-pink border-0">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent className="glassmorphism border-0">
              <DialogHeader>
                <DialogTitle>Новая комната</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Название комнаты</Label>
                  <Input
                    placeholder="Например: Гостиная"
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    className="glassmorphism"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Иконка</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableIcons.map((icon) => (
                      <button
                        key={icon}
                        onClick={() => setSelectedIcon(icon)}
                        className={`p-3 rounded-lg transition-all ${
                          selectedIcon === icon
                            ? 'gradient-purple-pink scale-110'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <Icon name={icon as any} size={20} />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Цвет</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.value)}
                        className={`p-3 rounded-lg transition-all border-2 ${
                          selectedColor === color.value
                            ? 'border-white scale-105'
                            : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color.value }}
                      >
                        <span className="text-xs font-medium">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <Button onClick={addRoom} className="w-full gradient-blue-orange border-0">
                  Создать комнату
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className={`glassmorphism border-2 p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedRoom === room.id
                  ? 'border-primary shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                  : 'border-transparent'
              }`}
              onClick={() => onRoomClick(room.id)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: room.color }}
                    >
                      <Icon name={room.icon as any} size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {getRoomActiveLightsCount(room.name)}/{getRoomLightsCount(room.name)} активно
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingRoom(room);
                          }}
                        >
                          <Icon name="Edit" size={14} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glassmorphism border-0" onClick={(e) => e.stopPropagation()}>
                        <DialogHeader>
                          <DialogTitle>Редактировать комнату</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                            <Label>Название</Label>
                            <Input
                              defaultValue={room.name}
                              onBlur={(e) => {
                                if (e.target.value.trim()) {
                                  updateRoomName(room.id, e.target.value);
                                }
                              }}
                              className="glassmorphism"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Устройства в комнате ({getRoomLightsCount(room.name)})</Label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {lights.filter(l => l.room === room.name).map(light => (
                                <div
                                  key={light.id}
                                  className="flex items-center justify-between p-2 rounded bg-muted/50"
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon name="Lightbulb" size={16} />
                                    <span className="text-sm">{light.name}</span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => assignLightToRoom(light.id, 'Без комнаты')}
                                  >
                                    Отвязать
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Доступные устройства</Label>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {lights.filter(l => l.room !== room.name).map(light => (
                                <div
                                  key={light.id}
                                  className="flex items-center justify-between p-2 rounded bg-muted/50"
                                >
                                  <div className="flex items-center gap-2">
                                    <Icon name="Lightbulb" size={16} />
                                    <span className="text-sm">{light.name}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {light.room}
                                    </Badge>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => assignLightToRoom(light.id, room.name)}
                                  >
                                    Привязать
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRoom(room.id);
                      }}
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Устройств</span>
                  <Badge className="gradient-blue-orange border-0">
                    {getRoomLightsCount(room.name)}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default RoomManager;
