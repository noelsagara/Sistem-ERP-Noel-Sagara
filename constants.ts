import type { Console, InventoryItem, MenuItem } from './types';

export const RENTAL_PRICES: Record<string, Record<string, number>> = {
  Reguler: {
    PS3: 8000,
    PS4: 10000,
    PS5: 15000,
  },
  VIP: {
    PS3: 10000,
    PS4: 12000,
    PS5: 18000,
  },
};

export const FOOD_AND_BEVERAGE_MENU: MenuItem[] = [
  { id: 'fb1', name: 'Chitato', price: 8000 },
  { id: 'fb2', name: 'Indomie Tante', price: 10000 },
  { id: 'fb3', name: 'Indomie Telur', price: 13000 },
  { id: 'fb4', name: 'Roti Bakar', price: 12000 },
  { id: 'fb5', name: 'Es Teh', price: 5000 },
  { id: 'fb6', name: 'Es Kopi', price: 8000 },
  { id: 'fb7', name: 'Air Es', price: 2000 },
];

const generateInitialConsoles = (): Console[] => {
  const consoles: Console[] = [];
  let idCounter = 1;

  // Lantai 1 Reguler (Total: 7 PS5, 10 PS4, 10 PS3)
  // PS5: 7 units
  for (let i = 1; i <= 7; i++) {
    consoles.push({ id: idCounter++, name: `R-PS5-${i}`, type: 'PS5', status: 'Available', floor: 'Reguler' });
  }
  // PS4: 10 units
  for (let i = 1; i <= 10; i++) {
    consoles.push({ id: idCounter++, name: `R-PS4-${i}`, type: 'PS4', status: i === 10 ? 'Maintenance' : 'Available', floor: 'Reguler' });
  }
  // PS3: 10 units
  for (let i = 1; i <= 10; i++) {
    consoles.push({ id: idCounter++, name: `R-PS3-${i}`, type: 'PS3', status: 'Available', floor: 'Reguler' });
  }

  // Lantai 2 VIP (Total: 7 PS5, 9 PS4, 6 PS3)
  // PS5: 7 units
  for (let i = 1; i <= 7; i++) {
    consoles.push({ id: idCounter++, name: `V-PS5-${i}`, type: 'PS5', status: 'Available', floor: 'VIP' });
  }
  // PS4: 9 units
  for (let i = 1; i <= 9; i++) {
    consoles.push({ id: idCounter++, name: `V-PS4-${i}`, type: 'PS4', status: 'Available', floor: 'VIP' });
  }
  // PS3: 6 units
  for (let i = 1; i <= 6; i++) {
    consoles.push({ id: idCounter++, name: `V-PS3-${i}`, type: 'PS3', status: 'Available', floor: 'VIP' });
  }

  return consoles;
};


export const initialConsoles: Console[] = generateInitialConsoles();


export const initialInventory: InventoryItem[] = [
  { id: 'fb1', name: 'Chitato', stock: 100, minStock: 20, price: 8000 },
  { id: 'fb2', name: 'Indomie Tante', stock: 50, minStock: 10, price: 10000 },
  { id: 'fb3', name: 'Indomie Telur', stock: 50, minStock: 10, price: 13000 },
  { id: 'fb4', name: 'Roti Bakar', stock: 30, minStock: 5, price: 12000 },
  { id: 'fb5', name: 'Es Teh', stock: 200, minStock: 50, price: 5000 },
  { id: 'fb6', name: 'Es Kopi', stock: 150, minStock: 30, price: 8000 },
  { id: 'fb7', name: 'Air Es', stock: 300, minStock: 50, price: 2000 },
];
