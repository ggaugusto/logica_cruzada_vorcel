import React, { useEffect } from 'react';

interface SudokuGridProps {
  board: number[][]; 
  initialBoard: number[][]; 
  activeRow: number;
  activeCol: number;
  onCellClick: (r: number, c: number) => void;
  onKeyDown: (e: KeyboardEvent) => void;
}

export const SudokuGrid: React.FC<SudokuGridProps> = ({ board, initialBoard, activeRow, activeCol, onCellClick, onKeyDown }) => {
  
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const isConflict = (r: number, c: number, num: number) => {
     if (num === 0) return false;
     let countRow = 0;
     let countCol = 0;
     let countBox = 0;
     
     for (let i=0; i<9; i++) {
        if (board[r][i] === num) countRow++;
        if (board[i][c] === num) countCol++;
     }
     const boxR = Math.floor(r/3)*3;
     const boxC = Math.floor(c/3)*3;
     for (let i=0; i<3; i++) {
       for (let j=0; j<3; j++) {
          if (board[boxR+i][boxC+j] === num) countBox++;
       }
     }
     
     return countRow > 1 || countCol > 1 || countBox > 1;
  };

  const getCellClasses = (r: number, c: number, val: number, isFixed: boolean) => {
     const isSelected = r === activeRow && c === activeCol;
     const isRelated = (!isSelected) && (r === activeRow || c === activeCol || 
                        (Math.floor(r/3) === Math.floor(activeRow/3) && Math.floor(c/3) === Math.floor(activeCol/3)));
     const hasError = isConflict(r, c, val);
     
     let bg = "bg-[#1c1c1c]";
     if (isSelected) bg = "bg-[#4a4a4a] shadow-inner";
     else if (isRelated) bg = "bg-[#2a2a2a]";

     let text = "text-gray-300";
     if (hasError) text = "text-red-500 font-extrabold animate-pulse";
     else if (!isFixed && val !== 0) text = "text-blue-400 font-bold";
     else if (isFixed) text = "text-gray-100 font-bold";

     return `w-full aspect-square flex items-center justify-center text-xl sm:text-2xl lg:text-3xl cursor-pointer select-none transition-colors border border-[#333] ${bg} ${text}`;
  };

  // Render as 3x3 blocks, each block containing a 3x3 sub-grid
  const blocks = [];
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      const cells = [];
      for (let innerRow = 0; innerRow < 3; innerRow++) {
        for (let innerCol = 0; innerCol < 3; innerCol++) {
          const r = blockRow * 3 + innerRow;
          const c = blockCol * 3 + innerCol;
          const val = board[r]?.[c] ?? 0;
          const isFixed = initialBoard[r] && initialBoard[r][c] !== 0;
          cells.push(
            <div
              key={`${r}-${c}`}
              onClick={() => onCellClick(r, c)}
              className={getCellClasses(r, c, val, isFixed)}
            >
              {val !== 0 ? val : ''}
            </div>
          );
        }
      }
      blocks.push(
        <div
          key={`block-${blockRow}-${blockCol}`}
          className="grid grid-cols-3 gap-0 border-2 border-zinc-500 rounded-sm overflow-hidden"
        >
          {cells}
        </div>
      );
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-zinc-600 p-[3px] rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
      <div className="grid grid-cols-3 gap-[3px] bg-zinc-600">
        {blocks}
      </div>
    </div>
  );
};
