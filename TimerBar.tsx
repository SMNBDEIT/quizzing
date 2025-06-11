
import React, { useState, useEffect, useCallback } from 'react';

interface TimerBarProps {
  durationSeconds: number;
  onTimeUp: () => void;
  isPaused: boolean;
  resetKey: string | number; // Change this key to reset the timer
  onTick?: (timeLeft: number) => void;
}

const TimerBar: React.FC<TimerBarProps> = ({ durationSeconds, onTimeUp, isPaused, resetKey, onTick }) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  const stableOnTimeUp = useCallback(onTimeUp, [onTimeUp]);
  const stableOnTick = useCallback(onTick || (() => {}), [onTick]);


  useEffect(() => {
    setTimeLeft(durationSeconds); // Reset time when resetKey (e.g. questionId) changes
  }, [resetKey, durationSeconds]);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) {
      if (timeLeft <= 0) {
        stableOnTimeUp();
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = prevTime - 1;
        stableOnTick(newTime);
        if (newTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, isPaused, stableOnTimeUp, stableOnTick, durationSeconds]);

  const percentage = durationSeconds > 0 ? (timeLeft / durationSeconds) * 100 : 0;

  return (
    <div className="w-full h-5 md:h-6 bg-slate-700 rounded-full overflow-hidden shadow-inner">
      <div
        className="h-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full transition-all duration-1000 linear"
        style={{ width: `${percentage}%` }}
      >
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-800 mix-blend-screen">
          {timeLeft}s
        </span>
      </div>
    </div>
  );
};

export default TimerBar;
