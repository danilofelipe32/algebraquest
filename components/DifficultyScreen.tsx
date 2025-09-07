import React from 'react';
import { Difficulty } from '../types';

interface DifficultyScreenProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultyButton: React.FC<{
  difficulty: Difficulty;
  color: string;
  onClick: (difficulty: Difficulty) => void;
}> = ({ difficulty, color, onClick }) => (
  <button
    onClick={() => onClick(difficulty)}
    className={`w-full sm:w-48 px-8 py-4 text-white font-bold rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 ${color}`}
  >
    {difficulty}
  </button>
);

const DifficultyScreen: React.FC<DifficultyScreenProps> = ({ onSelectDifficulty }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center p-8 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-4">Escolha seu Desafio</h2>
      <p className="max-w-md text-slate-400 mb-8">
        Selecione uma dificuldade para começar sua missão. Níveis mais difíceis têm problemas mais complexos e menos tempo!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <DifficultyButton difficulty="Fácil" color="bg-green-600 hover:bg-green-500 focus:ring-green-500/50" onClick={onSelectDifficulty} />
        <DifficultyButton difficulty="Médio" color="bg-yellow-600 hover:bg-yellow-500 focus:ring-yellow-500/50" onClick={onSelectDifficulty} />
        <DifficultyButton difficulty="Difícil" color="bg-red-600 hover:bg-red-500 focus:ring-red-500/50" onClick={onSelectDifficulty} />
      </div>
       <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default DifficultyScreen;