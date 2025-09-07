import React from 'react';
import { Player } from '../types';
import Confetti from './Confetti';

interface GameOverScreenProps {
  players: Player[];
  winner: Player | null;
  onRestart: () => void;
  onSaveAndExit: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ players, winner, onRestart, onSaveAndExit }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="text-center flex flex-col items-center justify-center p-8 w-full max-w-lg">
      <Confetti />
      <h2 className="text-3xl font-bold text-cyan-400 mb-2">Fim de Jogo!</h2>
      {winner && (
        <p className="text-xl text-slate-300 mb-6">
          O vencedor é <span className={`font-bold ${winner.color.replace('bg-', 'text-')}`}>{winner.name}</span>!
        </p>
      )}
      <div className="bg-slate-700/50 rounded-lg p-6 mb-8 w-full">
        <h3 className="text-xl text-slate-200 mb-4">Classificação Final</h3>
        <ol className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const isWinner = player.id === winner?.id;
            return (
                 <li 
                    key={player.id} 
                    className={`flex items-center justify-between p-3 rounded-lg bg-slate-800/70 border-l-4 transition-transform duration-300 ${player.color.replace('bg-', 'border-')} ${isWinner ? 'winner-animation' : ''}`}
                >
                <div className="flex items-center gap-4">
                    <span className="font-bold text-lg text-slate-400">{index + 1}.</span>
                    <span className="font-semibold text-lg text-white">{player.name}</span>
                </div>
                <p className="font-bold text-xl text-cyan-300">{player.score} pts</p>
                </li>
            );
          })}
        </ol>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
         <button
            onClick={onRestart}
            className="w-full px-8 py-3 bg-slate-700 text-white font-bold rounded-lg shadow-lg hover:bg-slate-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-slate-600/50"
        >
            Jogar Novamente
        </button>
        <button
            onClick={onSaveAndExit}
            className="w-full px-8 py-3 bg-violet-600 text-white font-bold rounded-lg shadow-lg hover:bg-violet-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-violet-500/50"
        >
            Salvar e Ver Placar
        </button>
      </div>
       <style>{`
        @keyframes winner-glow {
          0% { 
            box-shadow: 0 0 5px #06b6d4, 0 0 10px #06b6d4, 0 0 15px #8b5cf6;
            transform: scale(1.02);
          }
          50% { 
            box-shadow: 0 0 20px #06b6d4, 0 0 30px #06b6d4, 0 0 40px #8b5cf6;
            transform: scale(1.05);
          }
          100% { 
            box-shadow: 0 0 5px #06b6d4, 0 0 10px #06b6d4, 0 0 15px #8b5cf6;
            transform: scale(1.02);
          }
        }
        .winner-animation {
          animation: winner-glow 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GameOverScreen;