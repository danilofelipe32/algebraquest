import React, { useRef, useState, useLayoutEffect } from 'react';
import { BoardSpace, Player } from '../types';

interface PawnProps {
  player: Player;
  position: { top: number; left: number };
}

// Componente do Peão, agora posicionado de forma absoluta em relação ao tabuleiro.
const Pawn: React.FC<PawnProps> = ({ player, position }) => {
    return (
        <div 
            className={`absolute w-7 h-7 rounded-full ${player.color} border-2 border-white flex items-center justify-center font-bold text-xs shadow-lg transition-all duration-700 ease-in-out`}
            style={{ 
                top: `${position.top}px`, 
                left: `${position.left}px`,
                transform: 'translate(-50%, -50%)', // Centraliza o peão nas coordenadas
                zIndex: 10 + player.id,
            }}
            title={player.name}
        >
            {player.name.charAt(0).toUpperCase()}
        </div>
    );
};

interface GameBoardProps {
  board: BoardSpace[];
  players: Player[];
}

const GameBoard: React.FC<GameBoardProps> = ({ board, players }) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const spaceRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [spacePositions, setSpacePositions] = useState<{ top: number; left: number }[]>([]);

  // useLayoutEffect é usado para medir o layout do DOM antes que o navegador pinte a tela, evitando "piscadas".
  useLayoutEffect(() => {
    const boardEl = boardRef.current;
    if (!boardEl) return;

    // Função para calcular a posição central de cada casa do tabuleiro
    const calculatePositions = () => {
        const positions = spaceRefs.current.map(el => {
            if (el) {
                return { 
                    top: el.offsetTop + el.offsetHeight / 2,
                    left: el.offsetLeft + el.offsetWidth / 2,
                };
            }
            return { top: 0, left: 0 };
        });
        
        // Apenas atualiza o estado se as posições realmente mudaram para evitar um loop de renderização infinito.
        if (JSON.stringify(positions) !== JSON.stringify(spacePositions)) {
           setSpacePositions(positions);
        }
    };

    calculatePositions();

    // Um ResizeObserver recalcula as posições se o tamanho do tabuleiro mudar (ex: redimensionamento da janela).
    const resizeObserver = new ResizeObserver(calculatePositions);
    resizeObserver.observe(boardEl);

    return () => resizeObserver.unobserve(boardEl);
  }, [board, players, spacePositions]);

  const getSpaceColor = (type: BoardSpace['type']) => {
      switch(type) {
          case 'start': return 'bg-green-600';
          case 'finish': return 'bg-yellow-500';
          case 'lucky': return 'bg-blue-500';
          case 'unlucky': return 'bg-red-700';
          case 'safe': return 'bg-slate-600';
          case 'challenge': return 'bg-violet-600';
          default: return 'bg-slate-700';
      }
  }
  
  // Calcula a posição exata de um peão, organizando em círculo se houver múltiplos na mesma casa.
  const getPawnPosition = (player: Player) => {
    if (!spacePositions[player.position]) {
        return { top: -999, left: -999 }; // Esconde o peão se a posição for inválida
    }
    
    const center = spacePositions[player.position];
    const playersOnSameSpace = players.filter(p => p.position === player.position);
    const totalOnSpace = playersOnSameSpace.length;
    
    if (totalOnSpace <= 1) {
        return center; // Se estiver sozinho, fica no centro
    }
    
    const playerIndexOnSpace = playersOnSameSpace.findIndex(p => p.id === player.id);
    const angle = (playerIndexOnSpace / totalOnSpace) * 2 * Math.PI; // Distribui em um círculo
    const distance = 10; // Raio do círculo em pixels

    return {
        top: center.top + Math.sin(angle) * distance,
        left: center.left + Math.cos(angle) * distance,
    };
  };

  return (
    <div ref={boardRef} className="relative grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-12 gap-1 p-2 bg-slate-900/50 rounded-lg border border-slate-700 w-full h-full overflow-y-auto">
      {/* Renderiza as casas do tabuleiro (agora sem os peões dentro) */}
      {board.map((space, index) => (
        <div
          key={index}
          ref={el => { spaceRefs.current[index] = el; }}
          className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-center p-1 text-xs font-semibold ${getSpaceColor(space.type)} shadow-inner`}
        >
          <span className="absolute top-0.5 left-1 font-bold text-white/50 text-xs">{index + 1}</span>
          <span className="z-10">{space.title}</span>
        </div>
      ))}

      {/* Renderiza os peões sobre o tabuleiro */}
      {spacePositions.length > 0 && players.map((player) => (
            <Pawn 
                key={player.id} 
                player={player}
                position={getPawnPosition(player)}
            />
        ))}
    </div>
  );
};

export default GameBoard;