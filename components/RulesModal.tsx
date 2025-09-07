import React from 'react';

interface RulesModalProps {
  onClose: () => void;
}

const RuleItem: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4">
        <h4 className="font-bold text-cyan-400 text-lg mb-1">{title}</h4>
        <p className="text-slate-300">{children}</p>
    </div>
);

const RulesModal: React.FC<RulesModalProps> = ({ onClose }) => {
  return (
    <div 
        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
        onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Impede o fechamento ao clicar dentro
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Regras do Jogo</h2>
             <button onClick={onClose} className="text-slate-400 hover:text-white text-3xl font-bold">&times;</button>
          </div>
          
          <div className="space-y-4">
             <RuleItem title="🎯 Objetivo">
                Seja o primeiro jogador a chegar à casa final (Chegada) ou tenha a maior pontuação quando um jogador chegar ao final.
             </RuleItem>
             <RuleItem title="🎲 Como Jogar">
                Na sua vez, clique em 'Rolar Dado'. Seu peão avançará o número de casas indicado no dado.
             </RuleItem>
             <RuleItem title="🏠 Tipos de Casas">
                <ul className="list-disc list-inside space-y-2 mt-2">
                    <li><strong className="text-violet-400">Desafio:</strong> Resolva uma equação de álgebra. Se acertar, ganha 10 pontos. Se errar, volta 3 casas.</li>
                    <li><strong className="text-blue-400">Sorte:</strong> Sorte a sua! Você ganha 5 pontos instantaneamente.</li>
                    <li><strong className="text-red-400">Azar:</strong> Que pena! Você deve voltar 3 casas no tabuleiro.</li>
                    <li><strong className="text-slate-400">Descanso:</strong> Uma casa segura. Nada acontece aqui, aproveite a pausa!</li>
                    <li><strong className="text-yellow-400">Chegada:</strong> Parabéns! Você ganha um bônus de 25 pontos por terminar a corrida.</li>
                </ul>
             </RuleItem>
              <RuleItem title="🏆 Vitória">
                O jogo termina quando o primeiro jogador alcança a casa 'Chegada'. O vencedor é o jogador com a maior pontuação total no final do jogo.
             </RuleItem>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-8 px-8 py-3 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
          >
            Entendi!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RulesModal;