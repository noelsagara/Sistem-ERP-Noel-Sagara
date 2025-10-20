
import React, { useState } from 'react';
import type { InventoryItem } from '../types';
import { Package, Plus, Save, AlertCircle } from 'lucide-react';

interface InventoryManagementProps {
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ inventory, setInventory }) => {
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  const handleEdit = (item: InventoryItem) => {
    setEditingItemId(item.id);
    setStockValue(item.stock);
  };

  const handleSave = (itemId: string) => {
    setInventory(prev => prev.map(item => item.id === itemId ? { ...item, stock: stockValue } : item));
    setEditingItemId(null);
  };

  return (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-accent-cyan flex items-center"><Package className="mr-2" /> Inventory Status</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-accent-cyan uppercase bg-dark-header">
            <tr>
              <th scope="col" className="px-6 py-3">Item Name</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Current Stock</th>
              <th scope="col" className="px-6 py-3">Min. Stock</th>
              <th scope="col" className="px-6 py-3 text-center">Status</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id} className="bg-dark-bg border-b border-gray-700 hover:bg-gray-800">
                <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                <td className="px-6 py-4">
                  {editingItemId === item.id ? (
                    <input
                      type="number"
                      value={stockValue}
                      onChange={(e) => setStockValue(Number(e.target.value))}
                      className="w-20 bg-dark-bg border border-gray-600 rounded-md px-2 py-1"
                    />
                  ) : (
                    item.stock
                  )}
                </td>
                <td className="px-6 py-4">{item.minStock}</td>
                <td className="px-6 py-4 text-center">
                  {item.stock <= item.minStock ? (
                    <span className="flex items-center justify-center text-red-400 font-bold">
                      <AlertCircle size={16} className="mr-1"/> Low Stock
                    </span>
                  ) : (
                    <span className="text-green-400">In Stock</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {editingItemId === item.id ? (
                    <button onClick={() => handleSave(item.id)} className="font-medium text-green-400 hover:underline flex items-center justify-center mx-auto"><Save size={16} className="mr-1"/> Save</button>
                  ) : (
                    <button onClick={() => handleEdit(item)} className="font-medium text-brand-blue hover:underline flex items-center justify-center mx-auto"><Plus size={16} className="mr-1"/> Update</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;
