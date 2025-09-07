import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { LevelType } from '../types';

interface LevelProps {
  level: LevelType;
  onSubmit: (answer: number) => void;
  onHintClick: () => void;
  showHint: boolean;
}

const LightbulbIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h.01a1 1 0 100-2H11zM10 1a1 1 0 011 1v1.071a.999.999 0 01-.219.658l-1.065 1.243A4.002 4.002 0 006.93 9.617a1.001 1.001 0 01-1.861-.745 6.002 6.002 0 018.39-5.111A.998.998 0 0114 4.071V3a1 1 0 01-1-1H11a1 1 0 01-1-1zM6 10a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H6zM4 14a1 1 0 011-1h8a1 1 0 110 2H5a1 1 0 01-1-1z" />
    </svg>
);


const Level: React.FC<LevelProps> = ({ level, onSubmit, onHintClick, showHint }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue('');
    inputRef.current?.focus();
  }, [level]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const answer = parseFloat(inputValue);
    if (!isNaN(answer)) {
      onSubmit(answer);
    }
  };

  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 animate-fade-in">
      <div className="text-center mb-6">
        <p className="text-slate-400 text-lg">Resolva para 'x' na equação:</p>
        <div className="my-4 font-mono text-4xl md:text-5xl font-bold tracking-wider flex items-center justify-center space-x-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400 p-2">
                {level.question}
            </span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center">
        <div className="flex items-center font-mono text-2xl">
            <span className="text-cyan-400 mr-2">x =</span>
            <input
                ref={inputRef}
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-32 bg-slate-800 border-2 border-slate-600 rounded-lg p-2 text-center text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                required
                autoFocus
            />
        </div>
        <div className="flex flex-wrap justify-center gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
              Verificar Resposta
            </button>
             {level.hint && (
                <button
                    type="button"
                    onClick={onHintClick}
                    disabled={showHint}
                    className="px-6 py-3 bg-yellow-600 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-yellow-500/50 disabled:bg-slate-600 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <LightbulbIcon />
                    Dica
                </button>
            )}
        </div>
      </form>
       {showHint && level.hint && (
            <div className="mt-6 text-center text-slate-300 bg-slate-800 p-3 rounded-lg animate-fade-in-up border border-yellow-500/50">
                <p><strong className="text-yellow-400">Dica:</strong> {level.hint}</p>
            </div>
        )}
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
    </div>
  );
};

export default Level;