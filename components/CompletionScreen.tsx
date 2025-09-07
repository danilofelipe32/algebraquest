import React, { useState, FormEvent } from 'react';

interface CompletionScreenProps {
  score: number;
  totalQuestions: number;
  onSaveScore: (initials: string) => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ score, totalQuestions, onSaveScore }) => {
  const [initials, setInitials] = useState('');
  const percentage = Math.round((score / totalQuestions) * 100);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (initials.trim()) {
      onSaveScore(initials.trim().toUpperCase());
    }
  };

  return (
    <div className="text-center flex flex-col items-center justify-center p-8 animate-fade-in">
      <h2 className="text-3xl font-bold text-cyan-400 mb-2">Missão Completa!</h2>
      <p className="text-lg text-slate-300 mb-6">Você completou todos os níveis.</p>
      <div className="bg-slate-700/50 rounded-lg p-6 mb-8 w-full max-w-sm">
        <p className="text-xl text-slate-200">Pontuação Final</p>
        <p className="text-5xl font-bold my-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
          {score} / {totalQuestions}
        </p>
        <p className="text-2xl font-semibold text-slate-300">({percentage}%)</p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
         <label htmlFor="initials" className="text-slate-300 font-semibold">Insira suas iniciais:</label>
         <input
            type="text"
            id="initials"
            value={initials}
            onChange={(e) => setInitials(e.target.value)}
            maxLength={3}
            className="w-32 bg-slate-800 border-2 border-slate-600 rounded-lg p-2 text-center text-2xl font-mono uppercase text-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 outline-none transition-all"
            required
            autoFocus
          />
        <button
          type="submit"
          className="w-full px-8 py-3 bg-violet-600 text-white font-bold rounded-lg shadow-lg hover:bg-violet-500 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-violet-500/50 disabled:bg-slate-600 disabled:scale-100 disabled:cursor-not-allowed"
          disabled={!initials.trim()}
        >
          Salvar Pontuação
        </button>
      </form>
    </div>
  );
};

export default CompletionScreen;
