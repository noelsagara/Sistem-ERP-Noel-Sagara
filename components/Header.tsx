import React from 'react';
import type { View } from '../types';
import { Gamepad2, Users, Package, BarChart2, Tv } from 'lucide-react';

interface HeaderProps {
  setCurrentView: (view: View) => void;
  currentView: View;
}

const Header: React.FC<HeaderProps> = ({ setCurrentView, currentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Tv },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'inventory', label: 'Inventory', icon: Package },
    { id: 'reports', label: 'Reports', icon: BarChart2 },
  ];

  return (
    <header className="bg-dark-header shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Gamepad2 className="h-8 w-8 text-accent-cyan" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-white">PS Rental ERP</h1>
          </div>
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as View)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out transform hover:-translate-y-0.5
                  ${currentView === item.id 
                    ? 'bg-accent-pink text-white shadow-md' 
                    : 'text-gray-300 hover:bg-dark-card hover:text-white'}`}
              >
                <item.icon className="h-5 w-5 mr-2" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="md:hidden">
             {/* Mobile menu button can be added here */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;