import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { Challenge, Player } from '../types';

interface ChallengeModalProps {
  challenge: Challenge;
  player: Player;
  onSubmit: (isCorrect: boolean) => void;
}

const ChallengeModal: React.FC<ChallengeModalProps> = ({ challenge, player, onSubmit }) => {
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const inputRef = useRef<HTMLInputElement>(null);
  // Fix: Use ReturnType<typeof setTimeout> for browser compatibility instead of NodeJS.Timeout.
  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Efeito para controlar o cronômetro
  useEffect(() => {
    inputRef.current?.focus();
    
    // Inicia um novo cronômetro para o desafio atual
    timerIdRef.current = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    // Função de limpeza para parar o cronômetro quando o modal for fechado
    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
      }
    };
  }, [challenge]); // Reinicia sempre que um novo desafio aparece

  // Efeito para lidar com o fim do tempo
  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerIdRef.current) clearInterval(timerIdRef.current);
      if (!feedback) { // Garante que a lógica de "tempo esgotado" execute apenas uma vez
        setFeedback({ isCorrect: false, message: "O tempo acabou!" });
        setTimeout(() => {
          onSubmit(false);
        }, 1500);
      }
    }
  }, [timeLeft, feedback, onSubmit]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (feedback) return; // Impede múltiplos envios

    // Para o cronômetro ao enviar uma resposta
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
    }

    const answer = parseFloat(inputValue);
    const isCorrect = !isNaN(answer) && challenge.getSolution() === answer;

    setFeedback({ isCorrect, message: isCorrect ? "Correto!" : "Incorreto!" });

    setTimeout(() => {
      onSubmit(isCorrect);
    }, 1500);
  };

  const getTimerColor = () => {
    if (timeLeft <= 5) return 'text-red-500';
    if (timeLeft <= 10) return 'text-yellow-500';
    return 'text-cyan-400';
  };

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (Math.max(0, timeLeft) / 30) * circumference;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className={`bg-slate-800 rounded-2xl shadow-2xl border ${player.color.replace('bg-', 'border-')} w-full max-w-md m-4`}>
        <div className="p-8">
          <h2 className={`text-2xl font-bold mb-2 text-center ${player.color.replace('bg-', 'text-')}`}>{player.name}, seu desafio!</h2>
          <p className="text-slate-400 text-lg text-center mb-4">Resolva para 'x' na equação:</p>
          
          <div className="flex justify-center my-4">
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 70 70">
                <circle className="text-slate-700" strokeWidth="6" stroke="currentColor" fill="transparent" r={radius} cx="35" cy="35" />
                <circle
                  className={`${getTimerColor()} transition-all duration-500`}
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={progressOffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="35"
                  cy="35"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-3xl font-bold ${getTimerColor()}`}>
                {timeLeft}
              </span>
            </div>
          </div>

          <div className="my-4 font-mono text-4xl md:text-5xl font-bold tracking-wider flex items-center justify-center text-center text-white">
            {challenge.question}
          </div>

          {!feedback ? (
             <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center justify-center mt-6">
                <div className="flex items-center font-mono text-2xl">
                    <span className="text-cyan-400 mr-2">x =</span>
                    <input
                        ref={inputRef}
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-32 bg-slate-900 border-2 border-slate-600 rounded-lg p-2 text-center text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
                        required
                        autoFocus
                    />
                </div>
                <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 mt-2 bg-cyan-600 text-white font-bold rounded-lg shadow-lg hover:bg-cyan-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
                >
                Verificar Resposta
                </button>
            </form>
          ) : (
            <div className={`mt-8 text-center font-bold text-2xl animate-pulse ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {feedback.message}
            </div>
          )}
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

export default ChallengeModal;