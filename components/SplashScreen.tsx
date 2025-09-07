import React from 'react';

interface SplashScreenProps {
  onStart: () => void;
  onShowLeaderboard: () => void;
  onShowRules: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStart, onShowLeaderboard, onShowRules }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl md:text-3xl font-semibold text-slate-200 mb-4">Bem-vindo à sua Missão!</h2>
      <p className="max-w-md text-slate-400 mb-8">
        Junte seus amigos para uma corrida até a linha de chegada, resolvendo desafios de álgebra ao longo do caminho. O jogador com a maior pontuação vence!
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
        <button
          onClick={onStart}
          className="px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
        >
          Começar Jogo
        </button>
        <button
          onClick={onShowLeaderboard}
          className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg shadow-lg hover:bg-slate-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-slate-600/50"
        >
          Placar de Líderes
        </button>
         <button
          onClick={onShowRules}
          className="px-8 py-3 bg-slate-700 text-white font-bold rounded-lg shadow-lg hover:bg-slate-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-slate-600/50"
        >
          Regras do Jogo
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;