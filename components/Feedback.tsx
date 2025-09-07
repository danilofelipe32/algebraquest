import React from 'react';

interface FeedbackProps {
  isCorrect: boolean | null;
  message?: string;
}

const CheckIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const XIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


const Feedback: React.FC<FeedbackProps> = ({ isCorrect, message }) => {
  if (isCorrect === null) return null;

  const baseClasses = 'flex items-center justify-center font-bold text-lg rounded-lg px-4 py-2 transition-all duration-300';
  const correctClasses = 'bg-green-500/20 text-green-400';
  const incorrectClasses = 'bg-red-500/20 text-red-400 animate-shake';

  const feedbackConfig = isCorrect
    ? { classes: correctClasses, icon: <CheckIcon />, text: 'Correto!' }
    : { classes: incorrectClasses, icon: <XIcon />, text: message || 'Tente Novamente!' };

  return (
    <div className={`animate-fade-in-up ${baseClasses} ${feedbackConfig.classes}`}>
        {feedbackConfig.icon}
        {feedbackConfig.text}
        <style>{`
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .animate-shake {
                animation: shake 0.5s ease-in-out;
            }
            @keyframes fade-in-up {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up {
                animation: fade-in-up 0.3s ease-out forwards;
            }
        `}</style>
    </div>
  );
};

export default Feedback;