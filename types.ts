
export type ConsoleType = 'PS3' | 'PS4' | 'PS5';
export type ConsoleStatus = 'Available' | 'In Use' | 'Maintenance';
export type FloorType = 'Reguler' | 'VIP';
export type View = 'dashboard' | 'customers' | 'inventory' | 'reports';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  ktpPhotoUrl?: string;
  membership: 'Regular' | 'VIP';
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem extends MenuItem {
  quantity: number;
}

export interface Session {
  id: string;
  customerId: string;
  startTime: number;
  duration: number; // in seconds
  remainingTime: number; // in milliseconds
  orders: OrderItem[];
  isFinished: boolean;
  rentalCost: number;
  overtimeCost: number;
  totalCost: number;
}

export interface Console {
  id: number;
  name: string;
  type: ConsoleType;
  status: ConsoleStatus;
  floor: FloorType;
  session?: Session;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  minStock: number;
  price: number;
}

export interface Transaction {
  id: string;
  consoleId: number;
  consoleName: string;
  customerId: string;
  startTime: number;
  endTime: number;
  rentalCost: number;
  foodAndBeverageCost: number;
  totalCost: number;
  type: 'Rental' | 'F&B';
}
