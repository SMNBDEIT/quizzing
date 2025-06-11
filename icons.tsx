
import React from 'react';

export const CheckIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

export const CrossIcon: React.FC<{ className?: string }> = ({ className = "h-8 w-8" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Icons for answer choices, similar to Kahoot shapes
export const TriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={`w-6 h-6 ${className}`}>
    <path d="M2 26h28L16 4z" />
  </svg>
);
export const DiamondIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={`w-6 h-6 ${className}`}>
    <path d="M16 2l14 14-14 14L2 16z" />
  </svg>
);
export const CircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={`w-6 h-6 ${className}`}>
    <circle cx="16" cy="16" r="14" />
  </svg>
);
export const SquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" className={`w-6 h-6 ${className}`}>
    <path d="M2 2h28v28H2z" />
  </svg>
);

export const AnswerSymbol: React.FC<{ index: number }> = ({ index }) => {
  const symbols = [
    <TriangleIcon key="triangle" className="fill-current" />,
    <DiamondIcon key="diamond" className="fill-current" />,
    <CircleIcon key="circle" className="fill-current" />,
    <SquareIcon key="square" className="fill-current" />
  ];
  return symbols[index % 4] || <SquareIcon className="fill-current"/>;
};
