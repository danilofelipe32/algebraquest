import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Player, BoardSpace, Challenge, TurnState, ScoreEntry } from './types';
import { BOARD_LAYOUT, CHALLENGES, PLAYER_COLORS } from './constants';
import { saveScore } from './utils/leaderboard';
import { soundManager } from './utils/sound';
import SplashScreen from './components/SplashScreen';
import GameOverScreen from './components/GameOverScreen';
import GameSetupScreen from './components/GameSetupScreen';
import GameBoard from './components/GameBoard';
import PlayerHUD from './components/PlayerHUD';
import Dice from './components/Dice';
import ChallengeModal from './components/ChallengeModal';
import LeaderboardScreen from './components/LeaderboardScreen';
import RulesModal from './components/RulesModal';

// --- Ícones de Áudio ---
const SoundOnIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
);
const SoundOffIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l-4-4m0 4l4-4" /></svg>
);
const MusicOnIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-13c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg>
);
const MusicOffIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-13c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM3 3l18 18" /></svg>
);


const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [turnState, setTurnState] = useState<TurnState>('ROLL_DICE');
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [turnMessage, setTurnMessage] = useState<string>('');
  const [highlightedTimestamp, setHighlightedTimestamp] = useState<number | null>(null);
  const [showRules, setShowRules] = useState(false);
  const [animationClass, setAnimationClass] = useState('animate-fade-in');
  const [isMusicOn, setIsMusicOn] = useState(true);
  const [isSoundOn, setIsSoundOn] = useState(true);

  const currentPlayer = players[currentPlayerIndex];

  useEffect(() => {
    // Inicializa o gerenciador de som com os estados padrão
    soundManager.toggleMusic(isMusicOn);
    soundManager.toggleSound(isSoundOn);
  }, []);

  const toggleMusic = () => {
    const newState = !isMusicOn;
    setIsMusicOn(newState);
    soundManager.toggleMusic(newState);
  };

  const toggleSound = () => {
      const newState = !isSoundOn;
      setIsSoundOn(newState);
      soundManager.toggleSound(newState);
  };

  const changeGameState = useCallback((newGameState: GameState, onComplete?: () => void) => {
    setAnimationClass('animate-fade-out');
    setTimeout(() => {
        setGameState(newGameState);
        if (onComplete) {
            onComplete();
        }
        setAnimationClass('animate-fade-in');
    }, 500); // Sincronizado com a duração da animação CSS
  }, []);


  const handleGameSetup = useCallback((playerSetup: { name: string }[]) => {
    soundManager.playClick();
    changeGameState(GameState.PLAYING, () => {
      const newPlayers: Player[] = playerSetup.map((p, i) => ({
        id: i,
        name: p.name,
        score: 0,
        position: 0,
        color: PLAYER_COLORS[i],
      }));
      setPlayers(newPlayers);
      setCurrentPlayerIndex(0);
      setDiceResult(null);
      setWinner(null);
      setTurnState('ROLL_DICE');
    });
  }, [changeGameState]);

  const handleRestartGame = useCallback(() => {
    soundManager.playClick();
    changeGameState(GameState.SETUP, () => {
      setPlayers([]);
    });
  }, [changeGameState]);

  const handleShowLeaderboard = useCallback(() => {
    soundManager.playClick();
    changeGameState(GameState.LEADERBOARD, () => {
      setHighlightedTimestamp(null);
    });
  }, [changeGameState]);

  const handleSaveAndExit = useCallback(() => {
    soundManager.playClick();
    let winnerTimestamp: number | null = null;
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    const gameWinner = sortedPlayers[0];

    players.forEach((player, index) => {
      const timestamp = Date.now() + index; // Garante timestamp único para a chave
      const scoreEntry: ScoreEntry = {
        name: player.name,
        score: player.score,
        timestamp: timestamp,
      };
      if (player.id === gameWinner?.id) {
          winnerTimestamp = timestamp;
      }
      saveScore(scoreEntry);
    });
    
    changeGameState(GameState.LEADERBOARD, () => {
      setHighlightedTimestamp(winnerTimestamp);
      setPlayers([]);
    });
  }, [players, changeGameState]);
  
  const endTurn = useCallback(() => {
      setTimeout(() => {
        setDiceResult(null);
        setTurnMessage('');
        setCurrentPlayerIndex((prevIndex) => (prevIndex + 1) % players.length);
        setTurnState('ROLL_DICE');
    }, 2000);
  }, [players.length]);


  const handleMovePlayer = useCallback((steps: number) => {
    setPlayers(prevPlayers => {
      const newPlayers = [...prevPlayers];
      const player = newPlayers[currentPlayerIndex];
      const newPosition = Math.min(player.position + steps, BOARD_LAYOUT.length - 1);
      player.position = newPosition;
      
      setTimeout(() => {
         const space = BOARD_LAYOUT[newPosition];
         setTurnMessage(`Pousou em: ${space.title}`);
         setTurnState('ACTION');

         setTimeout(() => {
            switch(space.type) {
                case 'challenge':
                    const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
                    setActiveChallenge(randomChallenge);
                    break;
                case 'lucky':
                     soundManager.playLucky();
                     setPlayers(currentPlayers => {
                         const updatedPlayers = [...currentPlayers];
                         updatedPlayers[currentPlayerIndex].score += 5;
                         return updatedPlayers;
                     });
                     setTurnMessage('Sorte! +5 pontos!');
                     endTurn();
                     break;
                 case 'unlucky':
                     soundManager.playUnlucky();
                     setPlayers(currentPlayers => {
                        const updatedPlayers = [...currentPlayers];
                        const newPos = Math.max(0, updatedPlayers[currentPlayerIndex].position - 3);
                         updatedPlayers[currentPlayerIndex].position = newPos;
                         return updatedPlayers;
                     });
                     setTurnMessage('Azar! Volte 3 casas.');
                     endTurn();
                     break;
                case 'finish':
                    player.score += 25; // Bônus por terminar
                    setWinner(player);
                    changeGameState(GameState.GAME_OVER);
                    break;
                default:
                    endTurn();
            }
         }, 1500);

      }, 1000); // Espera a animação do peão terminar

      return newPlayers;
    });
  }, [currentPlayerIndex, endTurn, changeGameState]);


  const handleRollDice = useCallback(() => {
    if (turnState !== 'ROLL_DICE') return;
    
    soundManager.playDiceRoll();
    setTurnState('WAITING');
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceResult(roll);
    setTurnMessage(`${currentPlayer.name} tirou um ${roll}!`);

    setTimeout(() => {
        handleMovePlayer(roll);
    }, 1500);

  }, [turnState, currentPlayer, handleMovePlayer]);

  const handleChallengeAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
        soundManager.playCorrect();
        setTurnMessage('Correto! +10 pontos.');
        setPlayers(prev => {
            const newPlayers = [...prev];
            newPlayers[currentPlayerIndex].score += 10;
            return newPlayers;
        });
    } else {
        soundManager.playWrong();
        setTurnMessage('Incorreto! Volte 3 casas.');
        setPlayers(prev => {
            const newPlayers = [...prev];
            const player = newPlayers[currentPlayerIndex];
            player.position = Math.max(0, player.position - 3);
            return newPlayers;
        });
    }
    setActiveChallenge(null);
    endTurn();
  }, [currentPlayerIndex, endTurn]);

  useEffect(() => {
    if (gameState === GameState.PLAYING && players.length > 0) {
      const winningPlayer = players.find(p => p.position === BOARD_LAYOUT.length - 1);
      if (winningPlayer) {
        const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
        changeGameState(GameState.GAME_OVER, () => {
          setWinner(sortedPlayers[0]);
        });
      }
    }
  }, [players, gameState, changeGameState]);


  const renderContent = () => {
    switch (gameState) {
      case GameState.START:
        return <SplashScreen onStart={() => { soundManager.playClick(); changeGameState(GameState.SETUP); }} onShowLeaderboard={handleShowLeaderboard} onShowRules={() => { soundManager.playClick(); setShowRules(true); }} />;
      case GameState.SETUP:
        return <GameSetupScreen onGameSetup={handleGameSetup} />;
      case GameState.PLAYING:
        if (!currentPlayer) return null;
        return (
          <div className="w-full h-full flex flex-col gap-4">
            {/* --- Dashboard --- */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 flex-shrink-0">
              <div className="w-full md:max-w-sm">
                <PlayerHUD players={players} currentPlayerId={currentPlayer.id} />
              </div>
              <div className="w-full md:max-w-sm">
                 <div className="bg-slate-900/70 backdrop-blur-md p-4 rounded-lg text-center border border-slate-700">
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">Turno de: {currentPlayer.name}</h3>
                    <Dice onRoll={handleRollDice} result={diceResult} disabled={turnState !== 'ROLL_DICE'} />
                    {turnMessage && <p className="mt-4 text-slate-300 text-lg animate-pulse">{turnMessage}</p>}
                </div>
              </div>
            </div>
            
            {/* --- Game Board --- */}
            <div className="flex-grow min-h-0">
                <GameBoard board={BOARD_LAYOUT} players={players} />
            </div>
             
             {activeChallenge && (
                <ChallengeModal 
                    challenge={activeChallenge} 
                    player={currentPlayer}
                    onSubmit={handleChallengeAnswer}
                />
            )}
          </div>
        );
      case GameState.GAME_OVER:
        return <GameOverScreen players={players} winner={winner} onRestart={handleRestartGame} onSaveAndExit={handleSaveAndExit}/>;
      case GameState.LEADERBOARD:
        return <LeaderboardScreen onGoHome={() => { soundManager.playClick(); changeGameState(GameState.START); }} highlightedTimestamp={highlightedTimestamp} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4 font-sans">
      <div className="w-full max-w-7xl h-[95vh] bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-700 relative flex flex-col">
        <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
           <button 
            onClick={toggleMusic}
            className="w-10 h-10 bg-slate-700/80 text-white rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label={isMusicOn ? "Desativar música" : "Ativar música"}
           >
            {isMusicOn ? <MusicOnIcon /> : <MusicOffIcon />}
           </button>
            <button 
            onClick={toggleSound}
            className="w-10 h-10 bg-slate-700/80 text-white rounded-full flex items-center justify-center hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label={isSoundOn ? "Desativar sons" : "Ativar sons"}
           >
            {isSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
           </button>
          <button 
            onClick={() => { soundManager.playClick(); setShowRules(true); }}
            className="w-10 h-10 bg-slate-700/80 text-white rounded-full flex items-center justify-center text-xl font-bold hover:bg-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Mostrar regras do jogo"
          >
            ?
          </button>
        </div>
        <div className="p-4 md:p-8 flex-shrink-0">
            <div className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
                    Algebra Quest
                </h1>
                <p className="text-slate-400 mt-2">Uma aventura de tabuleiro algébrica!</p>
            </div>
        </div>
         <div className={`flex-grow px-4 md:px-8 pb-4 md:pb-8 flex items-center justify-center ${animationClass}`}>
             {renderContent()}
         </div>
      </div>
      {showRules && <RulesModal onClose={() => { soundManager.playClick(); setShowRules(false); }} />}
      <style>{`
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
        }
        @keyframes fade-out {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.98); }
        }
        .animate-fade-out {
            animation: fade-out 0.5s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default App;
