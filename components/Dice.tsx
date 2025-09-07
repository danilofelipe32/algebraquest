import React, { useState, useEffect } from 'react';

interface DiceProps {
  onRoll: () => void;
  result: number | null;
  disabled: boolean;
}

const Dice: React.FC<DiceProps> = ({ onRoll, result, disabled }) => {
  const [rolling, setRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState<number>(1);

  useEffect(() => {
    if (result !== null) {
      setRolling(true);
      let rollCount = 0;
      const interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
        rollCount++;
        if (rollCount > 10) {
          clearInterval(interval);
          setRolling(false);
          setDisplayValue(result);
        }
      }, 100);

      return () => clearInterval(interval);
    } else {
        setDisplayValue(1); // Reset face when turn ends
    }
  }, [result]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-slate-900 text-4xl font-bold shadow-lg">
        {displayValue}
      </div>
      <button
        onClick={onRoll}
        disabled={disabled || rolling}
        className="w-full px-8 py-3 bg-violet-600 text-white font-bold rounded-lg shadow-lg hover:bg-violet-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:bg-slate-600 disabled:scale-100 disabled:cursor-not-allowed"
      >
        {rolling ? 'Rolando...' : 'Rolar Dado'}
      </button>
    </div>
  );
};

export default Dice;