
import React, { useState } from 'react';
import type { Console, Customer, InventoryItem, Transaction, FloorType } from '../types';
import ConsoleCard from './ConsoleCard';
import StartSessionModal from './StartSessionModal';
import ManageSessionModal from './ManageSessionModal';

interface DashboardProps {
    consoles: Console[];
    setConsoles: React.Dispatch<React.SetStateAction<Console[]>>;
    customers: Customer[];
    inventory: InventoryItem[];
    setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
    setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
}

const Dashboard: React.FC<DashboardProps> = ({ consoles, setConsoles, customers, inventory, setInventory, setTransactions }) => {
    const [selectedConsole, setSelectedConsole] = useState<Console | null>(null);
    const [isStartModalOpen, setStartModalOpen] = useState(false);
    const [isManageModalOpen, setManageModalOpen] = useState(false);

    const handleConsoleClick = (consoleUnit: Console) => {
        setSelectedConsole(consoleUnit);
        if (consoleUnit.status === 'Available') {
            setStartModalOpen(true);
        } else if (consoleUnit.status === 'In Use') {
            setManageModalOpen(true);
        }
    };

    const floors: FloorType[] = ['Reguler', 'VIP'];

    return (
        <div className="space-y-8">
            {floors.map(floor => (
                <div key={floor}>
                    <h2 className="text-3xl font-bold mb-4 text-accent-cyan tracking-wide border-b-2 border-accent-cyan pb-2">{floor} Floor</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                        {consoles.filter(c => c.floor === floor).map(c => (
                            <ConsoleCard key={c.id} consoleUnit={c} onClick={() => handleConsoleClick(c)} />
                        ))}
                    </div>
                </div>
            ))}

            {isStartModalOpen && selectedConsole && (
                <StartSessionModal
                    consoleUnit={selectedConsole}
                    customers={customers}
                    onClose={() => setStartModalOpen(false)}
                    onStart={(session) => {
                        setConsoles(prev => prev.map(c => c.id === selectedConsole.id ? { ...c, status: 'In Use', session } : c));
                        setStartModalOpen(false);
                    }}
                />
            )}

            {isManageModalOpen && selectedConsole && (
                <ManageSessionModal
                    consoleUnit={selectedConsole}
                    customers={customers}
                    inventory={inventory}
                    onClose={() => setManageModalOpen(false)}
                    onUpdate={(updatedConsole) => {
                        setConsoles(prev => prev.map(c => c.id === updatedConsole.id ? updatedConsole : c));
                    }}
                    onEndSession={(transaction) => {
                        setTransactions(prev => [...prev, transaction]);
                        setConsoles(prev => prev.map(c => c.id === selectedConsole.id ? { ...c, status: 'Available', session: undefined } : c));
                        const sessionOrders = selectedConsole.session?.orders || [];
                        setInventory(prevInv => prevInv.map(invItem => {
                            const order = sessionOrders.find(o => o.id === invItem.id);
                            return order ? {...invItem, stock: invItem.stock - order.quantity} : invItem;
                        }));
                        setManageModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
