
import React, { useMemo } from 'react';
import type { Transaction } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { initialConsoles } from '../constants';
import { DollarSign, Gamepad2, Utensils, Clock } from 'lucide-react';


interface ReportsProps {
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

const Reports: React.FC<ReportsProps> = ({ transactions }) => {

    const totalRevenue = useMemo(() => transactions.reduce((sum, t) => sum + t.totalCost, 0), [transactions]);
    const rentalRevenue = useMemo(() => transactions.reduce((sum, t) => sum + t.rentalCost, 0), [transactions]);
    const fbRevenue = useMemo(() => transactions.reduce((sum, t) => sum + t.foodAndBeverageCost, 0), [transactions]);

    const dailyRevenue = useMemo(() => {
        const data: { [key: string]: { rental: number; fb: number } } = {};
        transactions.forEach(t => {
            const date = new Date(t.startTime).toLocaleDateString('id-ID');
            if (!data[date]) {
                data[date] = { rental: 0, fb: 0 };
            }
            data[date].rental += t.rentalCost;
            data[date].fb += t.foodAndBeverageCost;
        });
        return Object.entries(data).map(([date, values]) => ({ date, ...values }));
    }, [transactions]);

    const consolePopularity = useMemo(() => {
        const counts: { [key: string]: number } = {};
        initialConsoles.forEach(c => counts[c.type] = 0);
        transactions.forEach(t => {
            const console = initialConsoles.find(c => c.id === t.consoleId);
            if (console) {
                counts[console.type]++;
            }
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [transactions]);
    
    const peakHours = useMemo(() => {
        const hours = Array(24).fill(0).map((_, i) => ({ hour: `${i}:00`, transactions: 0 }));
        transactions.forEach(t => {
            const hour = new Date(t.startTime).getHours();
            hours[hour].transactions++;
        });
        return hours;
    }, [transactions]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-accent-cyan">Reports & Analytics</h2>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon={DollarSign} title="Total Revenue" value={formatCurrency(totalRevenue)} color="text-green-400" />
                <MetricCard icon={Gamepad2} title="Rental Revenue" value={formatCurrency(rentalRevenue)} color="text-brand-blue" />
                <MetricCard icon={Utensils} title="F&B Revenue" value={formatCurrency(fbRevenue)} color="text-accent-pink" />
                 <MetricCard icon={Clock} title="Total Transactions" value={transactions.length.toString()} color="text-yellow-400" />
            </div>

            {transactions.length === 0 ? <p className="text-center text-gray-500 py-10">No transaction data available to generate reports.</p> :
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Daily Revenue */}
                <ChartContainer title="Daily Revenue (Rental vs F&B)">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dailyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="date" stroke="#A0AEC0"/>
                            <YAxis stroke="#A0AEC0" tickFormatter={(tick) => `${tick/1000}k`} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}/>
                            <Legend />
                            <Bar dataKey="rental" stackId="a" fill="#007BFF" name="Rental" />
                            <Bar dataKey="fb" stackId="a" fill="#e94560" name="F&B" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>

                 {/* Console Popularity */}
                <ChartContainer title="Console Popularity">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={consolePopularity} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                                {consolePopularity.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}/>
                             <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Peak Hours */}
                 <ChartContainer title="Peak Hours Analysis" className="xl:col-span-2">
                    <ResponsiveContainer width="100%" height={300}>
                         <BarChart data={peakHours}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                            <XAxis dataKey="hour" stroke="#A0AEC0" interval={1}/>
                            <YAxis stroke="#A0AEC0" allowDecimals={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}/>
                            <Bar dataKey="transactions" fill="#00C49F" name="Transactions"/>
                        </BarChart>
                    </ResponsiveContainer>
                 </ChartContainer>
            </div>
            }
        </div>
    );
};

interface MetricCardProps {
    icon: React.ElementType;
    title: string;
    value: string;
    color: string;
}
const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-dark-card p-6 rounded-lg shadow-lg border border-gray-700 flex items-center space-x-4">
        <div className={`p-3 rounded-full bg-dark-bg ${color}`}>
            <Icon className="h-8 w-8" />
        </div>
        <div>
            <p className="text-sm text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

interface ChartContainerProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}
const ChartContainer: React.FC<ChartContainerProps> = ({ title, children, className }) => (
    <div className={`bg-dark-card p-6 rounded-lg shadow-lg border border-gray-700 ${className}`}>
        <h3 className="text-xl font-bold mb-4 text-accent-cyan">{title}</h3>
        {children}
    </div>
);

export default Reports;
