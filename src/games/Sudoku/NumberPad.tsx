import React from 'react';
import { Eraser, Lightbulb } from 'lucide-react';

interface NumberPadProps {
  onNumberInput: (num: number) => void;
  onClear: () => void;
  onHint: () => void;
}

export const NumberPad: React.FC<NumberPadProps> = ({ onNumberInput, onClear, onHint }) => {
  return (
    <div className="w-full max-w-sm mx-auto mt-6 px-2">
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {[1,2,3,4,5].map(n => (
          <button 
            key={n} 
            onClick={() => onNumberInput(n)}
            className="bg-[#222] hover:bg-[#333] border border-[#444] text-white aspect-square rounded select-none flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm transition-colors"
          >
            {n}
          </button>
        ))}
        {[6,7,8,9].map(n => (
          <button 
            key={n} 
            onClick={() => onNumberInput(n)}
            className="bg-[#222] hover:bg-[#333] border border-[#444] text-white aspect-square rounded select-none flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm transition-colors"
          >
            {n}
          </button>
        ))}
        <button 
           onClick={onClear}
           className="bg-red-950/40 hover:bg-red-900/60 border border-red-900/60 text-red-400 aspect-square rounded flex items-center justify-center transition-colors select-none shadow-sm"
           title="Apagar Célula"
        >
           <Eraser size={24} />
        </button>
      </div>
      <div className="flex justify-center mt-4">
        <button 
             onClick={onHint}
             className="w-full max-w-[200px] bg-yellow-950/30 hover:bg-yellow-900/50 border border-yellow-700/50 text-yellow-500 py-3 rounded flex items-center justify-center gap-2 transition-colors select-none shadow-sm uppercase font-bold text-sm tracking-wider"
             title="Revelar número correto"
        >
             <Lightbulb size={20} />
             Pedir Dica
        </button>
      </div>
    </div>
  );
};
