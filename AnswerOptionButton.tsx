
import React from 'react';
import { AnswerOption } from '../types';
import { OPTION_COLORS } from '../constants';
import { AnswerSymbol } from './icons';

interface AnswerOptionButtonProps {
  option: AnswerOption;
  index: number;
  onClick: (optionId: string) => void;
  disabled: boolean;
  isRevealed: boolean;
  isSelected: boolean;
}

const AnswerOptionButton: React.FC<AnswerOptionButtonProps> = ({
  option,
  index,
  onClick,
  disabled,
  isRevealed,
  isSelected,
}) => {
  let buttonStyle = `${OPTION_COLORS[index % OPTION_COLORS.length]}`;
  let revealStyle = '';

  if (isRevealed) {
    if (option.isCorrect) {
      buttonStyle = 'bg-green-500 border-2 border-white scale-105 shadow-xl';
    } else if (isSelected && !option.isCorrect) {
      buttonStyle = 'bg-red-700 opacity-70 line-through';
    } else {
      buttonStyle = 'bg-slate-600 opacity-50';
    }
  } else if (disabled && isSelected) {
     // Style for selected but not yet revealed
     buttonStyle = `${OPTION_COLORS[index % OPTION_COLORS.length]} opacity-80 ring-4 ring-white ring-opacity-50`;
  }


  return (
    <button
      onClick={() => onClick(option.id)}
      disabled={disabled || isRevealed}
      className={`w-full p-3 md:p-4 rounded-lg text-white text-sm md:text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${buttonStyle} ${
        disabled && !isRevealed && !isSelected ? 'opacity-70 cursor-not-allowed' : ''
      } ${isRevealed ? 'cursor-default' : 'hover:shadow-lg'}`}
    >
      <div className="flex items-center justify-start">
        <div className="mr-3 p-2 bg-black bg-opacity-20 rounded">
           <AnswerSymbol index={index} />
        </div>
        <span className="flex-1 text-left">{option.text}</span>
      </div>
    </button>
  );
};

export default AnswerOptionButton;
