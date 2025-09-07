
import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const percentage = total > 0 ? ((current) / total) * 100 : 0;

  return (
    <div className="w-full bg-slate-700 rounded-full h-2.5 mt-2">
      <div
        className="bg-gradient-to-r from-cyan-500 to-violet-500 h-2.5 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
