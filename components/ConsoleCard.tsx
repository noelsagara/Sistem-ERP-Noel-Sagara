import React from 'react';
import type { Console } from '../types';
import { Gamepad2, Tv, Clock, AlertTriangle } from 'lucide-react';

interface ConsoleCardProps {
  consoleUnit: Console;
  onClick: () => void;
}

const formatTime = (ms: number) => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};


const ConsoleCard: React.FC<ConsoleCardProps> = ({ consoleUnit, onClick }) => {
  const statusClasses = {
    Available: 'border-green-500 bg-green-500/10 hover:bg-green-500/20',
    'In Use': 'border-orange-500 bg-orange-500/10 hover:bg-orange-500/20',
    Maintenance: 'border-red-500 bg-red-500/10 cursor-not-allowed opacity-60',
  };

  const isTimeLow = consoleUnit.session && consoleUnit.session.remainingTime < 15 * 60 * 1000;
  const isOvertime = consoleUnit.session && consoleUnit.session.remainingTime <= 0;

  return (
    <div
      onClick={consoleUnit.status !== 'Maintenance' ? onClick : undefined}
      className={`rounded-lg border-2 p-4 flex flex-col justify-between transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer h-52 ${statusClasses[consoleUnit.status]}`}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold">{consoleUnit.name}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
          consoleUnit.status === 'Available' ? 'bg-green-500' : 
          consoleUnit.status === 'In Use' ? 'bg-orange-500' : 'bg-red-500'
        }`}>{consoleUnit.status}</span>
      </div>

      <div className="flex items-center justify-center my-2">
        <Gamepad2 size={32} className="text-gray-400" />
        <span className="text-2xl font-black ml-2">{consoleUnit.type}</span>
      </div>

      <div className="text-center">
        {consoleUnit.status === 'In Use' && consoleUnit.session ? (
          <div className={`flex items-center justify-center font-mono text-xl tracking-wider p-2 rounded-md ${
            isTimeLow && !isOvertime ? 'bg-yellow-500/20 text-yellow-400 animate-pulse-fast' : 
            isOvertime ? 'bg-red-500/20 text-red-400 animate-pulse' : ''
          }`}>
            <Clock size={20} className="mr-2" />
            <span>{formatTime(consoleUnit.session.remainingTime)}</span>
          </div>
        ) : consoleUnit.status === 'Available' ? (
          <div className="flex items-center justify-center text-green-400">
            <Tv size={20} className="mr-2" />
            <span>Ready</span>
          </div>
        ) : (
           <div className="flex items-center justify-center text-red-400">
            <AlertTriangle size={20} className="mr-2" />
            <span>Maintenance</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsoleCard;