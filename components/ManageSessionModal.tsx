
import React, { useState, useEffect } from 'react';
import type { Console, Customer, InventoryItem, Transaction, OrderItem } from '../types';
import { RENTAL_PRICES } from '../constants';
import { PlusCircle, Trash2, Clock } from 'lucide-react';

interface ManageSessionModalProps {
  consoleUnit: Console;
  customers: Customer[];
  inventory: InventoryItem[];
  onClose: () => void;
  onUpdate: (updatedConsole: Console) => void;
  onEndSession: (transaction: Transaction) => void;
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
const formatTime = (ms: number) => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const ManageSessionModal: React.FC<ManageSessionModalProps> = ({ consoleUnit, customers, inventory, onClose, onUpdate, onEndSession }) => {
    const [extendHours, setExtendHours] = useState(1);
    const [orders, setOrders] = useState<OrderItem[]>(consoleUnit.session?.orders || []);

    const customer = customers.find(c => c.id === consoleUnit.session?.customerId);
    const session = consoleUnit.session;

    if (!session) return null;

    const pricePerHour = RENTAL_PRICES[consoleUnit.floor][consoleUnit.type];
    const initialDurationSeconds = session.duration;
    const timeElapsedMs = Date.now() - session.startTime;
    const overtimeMs = Math.max(0, timeElapsedMs - initialDurationSeconds * 1000);
    const overtimeHours = Math.ceil(overtimeMs / (3600 * 1000));
    const overtimeCost = overtimeMs > 0 ? overtimeHours * pricePerHour : 0;

    const fAndBCost = orders.reduce((acc, order) => acc + order.price * order.quantity, 0);
    const totalCost = session.rentalCost + overtimeCost + fAndBCost;

    const handleExtend = () => {
        const newDuration = session.duration + extendHours * 3600;
        const newRentalCost = session.rentalCost + extendHours * pricePerHour;
        const updatedSession = { ...session, duration: newDuration, rentalCost: newRentalCost };
        onUpdate({ ...consoleUnit, session: updatedSession });
        setExtendHours(1);
    };

    const handleAddOrder = (item: InventoryItem) => {
        setOrders(prevOrders => {
            const existingOrder = prevOrders.find(o => o.id === item.id);
            if (existingOrder) {
                return prevOrders.map(o => o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o);
            }
            return [...prevOrders, { ...item, quantity: 1 }];
        });
    };
    
    const handleRemoveOrder = (itemId: string) => {
        setOrders(prevOrders => prevOrders.filter(o => o.id !== itemId));
    };

    useEffect(() => {
        const updatedSession = { ...session, orders, totalCost };
        onUpdate({ ...consoleUnit, session: updatedSession });
         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orders]);


    const handleEndSession = () => {
        const transaction: Transaction = {
            id: `T${Date.now()}`,
            consoleId: consoleUnit.id,
            consoleName: consoleUnit.name,
            customerId: session.customerId,
            startTime: session.startTime,
            endTime: Date.now(),
            rentalCost: session.rentalCost + overtimeCost,
            foodAndBeverageCost: fAndBCost,
            totalCost,
            type: 'Rental'
        };
        onEndSession(transaction);
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-dark-card rounded-lg shadow-xl w-full max-w-4xl h-full max-h-[90vh] flex flex-col border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                     <h2 className="text-2xl font-bold text-accent-cyan">Manage Session: {consoleUnit.name}</h2>
                     <p className="text-gray-400">Customer: {customer?.name || 'N/A'}</p>
                </div>

                <div className="flex-grow overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Side - Session Info & Billing */}
                    <div className="space-y-4">
                        <div className="bg-dark-bg p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-2 text-accent-pink">Time Info</h3>
                             <div className="flex justify-between items-center text-2xl font-mono">
                                <span>Remaining:</span>
                                <span className={session.remainingTime < 0 ? "text-red-500" : ""}>{formatTime(session.remainingTime)}</span>
                            </div>
                            {overtimeMs > 0 && (
                                <div className="flex justify-between items-center text-lg font-mono text-red-400 mt-2">
                                    <span>Overtime:</span>
                                    <span>{formatTime(overtimeMs)}</span>
                                </div>
                            )}
                        </div>
                        
                        <div className="bg-dark-bg p-4 rounded-lg">
                             <h3 className="font-bold text-lg mb-2 text-accent-pink">Extend Time</h3>
                             <div className="flex items-center space-x-2">
                                 <input type="number" value={extendHours} onChange={e => setExtendHours(Number(e.target.value))} min="1" className="w-20 bg-dark-bg border border-gray-600 rounded-md px-2 py-1" />
                                 <span>Hours</span>
                                 <button onClick={handleExtend} className="px-4 py-1 rounded-md bg-brand-blue hover:bg-blue-600 text-white flex items-center"><Clock size={16} className="mr-1"/> Extend</button>
                             </div>
                        </div>

                        <div className="bg-dark-bg p-4 rounded-lg">
                            <h3 className="font-bold text-lg mb-4 text-accent-pink">Billing Summary</h3>
                            <div className="space-y-2 text-gray-300">
                                <div className="flex justify-between"><span>Initial Rental:</span><span>{formatCurrency(session.rentalCost)}</span></div>
                                <div className="flex justify-between"><span>Overtime:</span><span>{formatCurrency(overtimeCost)}</span></div>
                                <div className="flex justify-between"><span>F&B:</span><span>{formatCurrency(fAndBCost)}</span></div>
                                <hr className="border-gray-600 my-2" />
                                <div className="flex justify-between text-2xl font-bold text-accent-cyan"><span>Total:</span><span>{formatCurrency(totalCost)}</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - F&B Orders */}
                    <div className="flex flex-col">
                        <h3 className="font-bold text-lg mb-2 text-accent-pink">Food & Beverage Orders</h3>
                        <div className="bg-dark-bg p-4 rounded-lg flex-grow">
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                                {inventory.map(item => (
                                    <button key={item.id} onClick={() => handleAddOrder(item)} disabled={item.stock <= 0} className="text-left p-2 bg-dark-card rounded text-sm hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed">
                                        <p>{item.name}</p>
                                        <p className="text-xs text-gray-400">{formatCurrency(item.price)} (S: {item.stock})</p>
                                    </button>
                                ))}
                            </div>
                            <hr className="border-gray-600 my-2" />
                            <h4 className="font-semibold mb-2">Current Order:</h4>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                               {orders.length === 0 && <p className="text-sm text-gray-500">No items ordered yet.</p>}
                                {orders.map(order => (
                                    <div key={order.id} className="flex justify-between items-center text-sm p-1 bg-gray-800 rounded">
                                        <span>{order.name} x {order.quantity}</span>
                                        <div className="flex items-center">
                                            <span>{formatCurrency(order.price * order.quantity)}</span>
                                            <button onClick={() => handleRemoveOrder(order.id)} className="ml-2 text-red-500 hover:text-red-400"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-700 flex justify-between items-center bg-dark-header rounded-b-lg">
                    <button onClick={onClose} className="px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-700 transition-colors">Close</button>
                    <button onClick={handleEndSession} className="px-8 py-3 rounded-md bg-accent-pink hover:bg-pink-700 transition-colors text-white font-bold text-lg">End Session & Pay</button>
                </div>
            </div>
        </div>
    );
};

export default ManageSessionModal;
