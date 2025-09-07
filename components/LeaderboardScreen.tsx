import React, { useState, useEffect } from 'react';
import { getScores } from '../utils/leaderboard';
import { ScoreEntry } from '../types';

interface LeaderboardScreenProps {
  onGoHome: () => void;
  highlightedTimestamp: number | null;
}

const TrophyIcon: React.FC<{ rank: number }> = ({ rank }) => {
  const colors: { [key: number]: string } = {
    1: 'text-yellow-400',
    2: 'text-slate-300',
    3: 'text-yellow-600',
  };
  const color = colors[rank] || 'text-slate-500';

  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${color}`} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M11.158 2.134A2 2 0 009.166 1.1a1 1 0 00-1.072.032L3.6 4.364l-.001.002a2 2 0 00-1.415 1.868V14a2 2 0 002 2h1.5a1 1 0 001-1v-2.364a1 1 0 011-1h4a1 1 0 011 1V15a1 1 0 001 1h1.5a2 2 0 002-2V6.234a2 2 0 00-1.416-1.868l-4.49-3.232zM10 10a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );
};

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onGoHome, highlightedTimestamp }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    setScores(getScores());
  }, []);

  return (
    <div className="text-center flex flex-col items-center justify-center p-4 sm:p-8 w-full">
      <h2 className="text-3xl font-bold text-cyan-400 mb-4">Placar de Líderes</h2>
      
      <div className="w-full max-w-lg bg-slate-900/50 rounded-lg border border-slate-700 p-4">
        {scores.length > 0 ? (
          <ol className="space-y-3">
            {scores.map((score, index) => {
              const rank = index + 1;
              const isHighlighted = score.timestamp === highlightedTimestamp;
              return (
                <li 
                  key={score.timestamp} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${isHighlighted ? 'bg-cyan-500/20 scale-105 ring-2 ring-cyan-400' : 'bg-slate-800/70'}`}
                >
                  <div className="flex items-center gap-4">
                     <span className="font-bold text-lg w-8 text-slate-400 flex items-center gap-2">
                        {rank > 3 ? `${rank}.` : <TrophyIcon rank={rank} />}
                     </span>
                     <span className="font-semibold text-xl text-white">{score.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-cyan-300">{score.score} pts</p>
                  </div>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="text-slate-400 py-8">Nenhuma pontuação registrada ainda. Seja o primeiro!</p>
        )}
      </div>

      <button
        onClick={onGoHome}
        className="mt-8 px-8 py-3 bg-slate-700 text-white font-bold rounded-lg shadow-lg hover:bg-slate-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-slate-600/50"
      >
        Voltar ao Início
      </button>
    </div>
  );
};

export default LeaderboardScreen;