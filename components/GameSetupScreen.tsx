import React, { useState, useCallback } from 'react';
import { PLAYER_COLORS } from '../constants';

interface GameSetupScreenProps {
  onGameSetup: (players: { name: string }[]) => void;
}

const GameSetupScreen: React.FC<GameSetupScreenProps> = ({ onGameSetup }) => {
  const [players, setPlayers] = useState([{ name: '' }, { name: '' }]);

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index].name = name;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    if (players.length < 4) {
      setPlayers([...players, { name: '' }]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = [...players];
      newPlayers.splice(index, 1);
      setPlayers(newPlayers);
    }
  };

  const canStart = players.every(p => p.name.trim() !== '');

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (canStart) {
      onGameSetup(players);
    }
  }, [canStart, players, onGameSetup]);


  return (
    <div className="text-center flex flex-col items-center justify-center p-8 w-full max-w-md">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-4">Configurar Jogo</h2>
      <p className="max-w-md text-slate-400 mb-8">
        Adicione de 2 a 4 jogadores para começar a aventura.
      </p>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        {players.map((player, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-4 h-8 rounded-l-md ${PLAYER_COLORS[index]}`}></div>
            <input
              type="text"
              placeholder={`Nome do Jogador ${index + 1}`}
              value={player.name}
              onChange={(e) => handlePlayerNameChange(index, e.target.value)}
              className="flex-grow bg-slate-800 border-2 border-slate-600 rounded-r-lg p-2 text-lg text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
              required
            />
            {players.length > 2 && (
              <button type="button" onClick={() => removePlayer(index)} className="text-red-500 hover:text-red-400 font-bold text-2xl">&times;</button>
            )}
          </div>
        ))}
        {players.length < 4 && (
            <button type="button" onClick={addPlayer} className="w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">Adicionar Jogador</button>
        )}
        <button
          type="submit"
          disabled={!canStart}
          className="w-full px-8 py-3 mt-4 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50 disabled:bg-slate-600 disabled:scale-100 disabled:cursor-not-allowed"
        >
          Iniciar Jogo
        </button>
      </form>
    </div>
  );
};

export default GameSetupScreen;