import React from 'react';
import { PlacedWord } from './crosswordLogic';

interface ClueListProps {
  words: PlacedWord[];
  activeWordId?: number;
  onClueClick: (x: number, y: number, dir: 'H'|'V') => void;
}

export const ClueList: React.FC<ClueListProps> = ({ words, activeWordId, onClueClick }) => {
  const horizontal = words.filter(w => w.direction === 'H').sort((a,b) => a.id - b.id);
  const vertical = words.filter(w => w.direction === 'V').sort((a,b) => a.id - b.id);

  const renderList = (title: string, list: PlacedWord[]) => (
    <div className="flex-1 min-w-[250px] mb-4 md:mb-0">
       <h3 className="font-bold text-red-500 mb-2 uppercase tracking-wider border-b border-[#333] pb-1 sticky top-0 bg-[#1a1a1a]">{title}</h3>
       <ul className="text-sm text-gray-300 space-y-2 pr-2">
         {list.map(w => (
            <li 
              key={`${w.direction}-${w.id}`}
              onClick={() => onClueClick(w.x, w.y, w.direction)}
              className={`cursor-pointer p-2 rounded transition-colors ${activeWordId === w.id ? 'bg-[#2a2a2a] text-white border-l-2 border-red-500 shadow-sm' : 'hover:bg-[#222]'}`}
            >
               <strong>{w.id}.</strong> {w.clue.replace('___', '____')} <span className="text-zinc-500 text-xs">({w.word.length})</span>
            </li>
         ))}
       </ul>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 bg-[#1a1a1a] p-4 rounded border border-[#333] shadow-inner w-full max-h-[500px] overflow-y-auto custom-scrollbar">
       {horizontal.length > 0 && renderList("Horizontais", horizontal)}
       {vertical.length > 0 && renderList("Verticais", vertical)}
    </div>
  );
};
