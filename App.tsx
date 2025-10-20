
import React, { useState, useEffect } from 'react';
import { initialConsoles, initialInventory } from './constants';
import type { View, Console, Customer, InventoryItem, Transaction } from './types';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import CustomerManagement from './components/CustomerManagement';
import InventoryManagement from './components/InventoryManagement';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [consoles, setConsoles] = useState<Console[]>(initialConsoles);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setConsoles(prevConsoles =>
        prevConsoles.map(c => {
          if (c.status === 'In Use' && c.session) {
            const now = Date.now();
            const endTime = c.session.startTime + c.session.duration * 1000;
            const remainingTime = Math.max(0, endTime - now);
            
            if (remainingTime === 0 && !c.session.isFinished) {
               // Auto-finish session logic handled when managing session
               return { ...c, session: { ...c.session, remainingTime } };
            }
            
            return { ...c, session: { ...c.session, remainingTime } };
          }
          return c;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard consoles={consoles} setConsoles={setConsoles} customers={customers} inventory={inventory} setInventory={setInventory} setTransactions={setTransactions} />;
      case 'customers':
        return <CustomerManagement customers={customers} setCustomers={setCustomers} />;
      case 'inventory':
        return <InventoryManagement inventory={inventory} setInventory={setInventory} />;
      case 'reports':
        return <Reports transactions={transactions} />;
      default:
        return <Dashboard consoles={consoles} setConsoles={setConsoles} customers={customers} inventory={inventory} setInventory={setInventory} setTransactions={setTransactions} />;
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-gray-200 font-sans">
      <Header setCurrentView={setCurrentView} currentView={currentView} />
      <main className="p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
