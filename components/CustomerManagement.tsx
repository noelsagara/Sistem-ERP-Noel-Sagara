
import React, { useState } from 'react';
import type { Customer } from '../types';
import { UserPlus, User } from 'lucide-react';

interface CustomerManagementProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers, setCustomers }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [membership, setMembership] = useState<'Regular' | 'VIP'>('Regular');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Name and Phone are required.');
      return;
    }
    const newCustomer: Customer = {
      id: `C${Date.now()}`,
      name,
      phone,
      address,
      membership,
    };
    setCustomers(prev => [...prev, newCustomer]);
    setName('');
    setPhone('');
    setAddress('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Add Customer Form */}
      <div className="lg:col-span-1 bg-dark-card p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-accent-cyan flex items-center"><UserPlus className="mr-2" /> Add New Customer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full bg-dark-bg border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-accent-cyan focus:border-accent-cyan" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Phone Number</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 w-full bg-dark-bg border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-accent-cyan focus:border-accent-cyan" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Address</label>
            <textarea value={address} onChange={e => setAddress(e.target.value)} rows={3} className="mt-1 w-full bg-dark-bg border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-accent-cyan focus:border-accent-cyan"></textarea>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-300">Membership</label>
            <select value={membership} onChange={e => setMembership(e.target.value as 'Regular' | 'VIP')} className="mt-1 w-full bg-dark-bg border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-accent-cyan focus:border-accent-cyan">
              <option value="Regular">Regular</option>
              <option value="VIP">VIP</option>
            </select>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-accent-pink hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-md transition-colors">Add Customer</button>
          </div>
        </form>
      </div>

      {/* Customer List */}
      <div className="lg:col-span-2 bg-dark-card p-6 rounded-lg shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-accent-cyan flex items-center"><User className="mr-2" /> Customer List</h2>
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-accent-cyan uppercase bg-dark-header sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3">Name</th>
                <th scope="col" className="px-6 py-3">Phone</th>
                <th scope="col" className="px-6 py-3">Membership</th>
                <th scope="col" className="px-6 py-3">Address</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(customer => (
                <tr key={customer.id} className="bg-dark-bg border-b border-gray-700 hover:bg-gray-800">
                  <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{customer.name}</td>
                  <td className="px-6 py-4">{customer.phone}</td>
                  <td className="px-6 py-4">
                     <span className={`px-2 py-1 rounded-full text-xs ${customer.membership === 'VIP' ? 'bg-yellow-500 text-black' : 'bg-blue-500 text-white'}`}>
                        {customer.membership}
                     </span>
                  </td>
                  <td className="px-6 py-4">{customer.address}</td>
                </tr>
              ))}
               {customers.length === 0 && (
                <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-500">No customers registered yet.</td>
                </tr>
               )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;
