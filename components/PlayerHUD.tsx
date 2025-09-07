import React from 'react';
import { Player } from '../types';

interface PlayerHUDProps {
  players: Player[];
  currentPlayerId: number;
}

const PlayerHUD: React.FC<PlayerHUDProps> = ({ players, currentPlayerId }) => {
  return (
    <div className="w-full bg-slate-900/70 backdrop-blur-md p-4 rounded-lg border border-slate-700">
      <h3 className="text-xl font-bold text-cyan-400 mb-4 text-center">Jogadores</h3>
      <div className="space-y-3">
        {players.map((player) => (
          <div
            key={player.id}
            className={`p-3 rounded-lg transition-all duration-300 ${player.id === currentPlayerId ? 'bg-cyan-500/20 ring-2 ring-cyan-400' : 'bg-slate-800/70'}`}
          >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-8 rounded ${player.color}`}></div>
                    <span className="font-semibold text-lg">{player.name}</span>
                </div>
              <span className="font-mono text-xl font-bold text-cyan-300">{player.score} pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerHUD;