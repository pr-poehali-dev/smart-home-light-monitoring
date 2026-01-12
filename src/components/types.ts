export interface Light {
  id: string;
  name: string;
  room: string;
  isOn: boolean;
  brightness: number;
}

export interface Scenario {
  id: string;
  name: string;
  icon: string;
  gradient: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  action: string;
  room: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'error';
  message: string;
  time: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  type: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface EnergyData {
  day: string;
  consumption: number;
}