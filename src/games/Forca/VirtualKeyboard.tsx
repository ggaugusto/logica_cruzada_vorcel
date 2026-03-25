import React from 'react';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

interface VirtualKeyboardProps {
  guessedLetters: Set<string>;
  secretWord: string;
  onKeyPress: (key: string) => void;
  disabled?: boolean;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ guessedLetters, secretWord, onKeyPress, disabled }) => {
  const normalizedSecret = secretWord.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto mt-8">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-2 flex-wrap">
          {row.map(key => {
            const isGuessed = guessedLetters.has(key);
            const isCorrect = isGuessed && normalizedSecret.includes(key);
            const isWrong = isGuessed && !normalizedSecret.includes(key);

            let bgClass = "bg-[#2a2a2a] hover:bg-[#3d3d3d] text-gray-200 border-[#444]";
            if (isCorrect) bgClass = "bg-emerald-900/40 text-emerald-400 border-emerald-900 shadow-[0_0_10px_rgba(16,185,129,0.2)]";
            if (isWrong) bgClass = "bg-[#111] text-red-900/60 border-red-950/50 opacity-50";

            return (
              <button
                key={key}
                disabled={isGuessed || disabled}
                onClick={() => onKeyPress(key)}
                className={`w-8 h-10 sm:w-10 sm:h-12 md:w-12 md:h-14 lg:w-14 lg:h-16 rounded border flex flex-col items-center justify-center text-sm sm:text-lg md:text-xl font-bold transition-all ${bgClass}`}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
