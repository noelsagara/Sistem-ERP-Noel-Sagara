
import React, { useState } from 'react';
import type { Console, Customer, Session } from '../types';
import { RENTAL_PRICES } from '../constants';

interface StartSessionModalProps {
  consoleUnit: Console;
  customers: Customer[];
  onClose: () => void;
  onStart: (session: Session) => void;
}

const StartSessionModal: React.FC<StartSessionModalProps> = ({ consoleUnit, customers, onClose, onStart }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [durationHours, setDurationHours] = useState<number>(1);

  const handleStartSession = () => {
    if (!selectedCustomerId || durationHours <= 0) {
      alert('Please select a customer and set a valid duration.');
      return;
    }
    
    const pricePerHour = RENTAL_PRICES[consoleUnit.floor][consoleUnit.type];
    const rentalCost = pricePerHour * durationHours;

    const newSession: Session = {
      id: `S${Date.now()}`,
      customerId: selectedCustomerId,
      startTime: Date.now(),
      duration: durationHours * 3600, // in seconds
      remainingTime: durationHours * 3600 * 1000, // in ms
      orders: [],
      isFinished: false,
      rentalCost,
      overtimeCost: 0,
      totalCost: rentalCost,
    };

    onStart(newSession);
  };
  
  const pricePerHour = RENTAL_PRICES[consoleUnit.floor][consoleUnit.type];
  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-dark-card rounded-lg shadow-xl p-8 w-full max-w-md space-y-6 border border-gray-700">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-accent-cyan">Start Session</h2>
            <p className="text-gray-400">Console: {consoleUnit.name} ({consoleUnit.type})</p>
        </div>
        
        <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-300 mb-1">Customer</label>
            <select
                id="customer"
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full bg-dark-bg border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-accent-cyan focus:border-accent-cyan"
            >
                <option value="">Select a customer</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
            </select>
             {customers.length === 0 && <p className="text-xs text-yellow-400 mt-1">No customers found. Please add a customer first.</p>}
        </div>

        <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-1">Duration (hours)</label>
            <input
                type="number"
                id="duration"
                value={durationHours}
                onChange={(e) => setDurationHours(Number(e.target.value))}
                min="1"
                className="w-full bg-dark-bg border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-accent-cyan focus:border-accent-cyan"
            />
        </div>

        <div className="bg-dark-bg p-4 rounded-lg text-center">
            <p className="text-gray-400">Price per hour: {formatCurrency(pricePerHour)}</p>
            <p className="text-xl font-bold text-accent-cyan">Total: {formatCurrency(pricePerHour * durationHours)}</p>
        </div>

        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 transition-colors">Cancel</button>
          <button onClick={handleStartSession} className="px-4 py-2 rounded-md bg-accent-pink hover:bg-pink-700 transition-colors text-white font-bold" disabled={!selectedCustomerId || customers.length === 0}>Start</button>
        </div>
      </div>
    </div>
  );
};

export default StartSessionModal;
