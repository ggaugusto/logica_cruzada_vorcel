import React, { useRef, useEffect } from 'react';
import { CrosswordData } from './crosswordLogic';

interface GridProps {
  data: CrosswordData;
  userAnswers: string[][];
  onCellInput: (x: number, y: number, value: string) => void;
  activeDirection: 'H' | 'V';
  activeX: number;
  activeY: number;
  setActiveCell: (x: number, y: number, dir: 'H'|'V') => void;
}

export const CrosswordGrid: React.FC<GridProps> = ({ data, userAnswers, onCellInput, activeDirection, activeX, activeY, setActiveCell }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[][]>([]);

  useEffect(() => {
    inputRefs.current = Array(data.grid.height).fill(null).map(() => Array(data.grid.width).fill(null));
  }, [data]);

  useEffect(() => {
    if (activeX >= 0 && activeY >= 0) {
      inputRefs.current[activeY]?.[activeX]?.focus();
    }
  }, [activeX, activeY, activeDirection]);

  const handleKeyDown = (e: React.KeyboardEvent, x: number, y: number) => {
    let nextX = x;
    let nextY = y;
    let dir = activeDirection;

    if (e.key === 'ArrowRight') { nextX++; dir = 'H'; }
    if (e.key === 'ArrowLeft') { nextX--; dir = 'H'; }
    if (e.key === 'ArrowDown') { nextY++; dir = 'V'; }
    if (e.key === 'ArrowUp') { nextY--; dir = 'V'; }

    if (e.key === 'Backspace' && !userAnswers[y][x]) {
        nextX = dir === 'H' ? x - 1 : x;
        nextY = dir === 'V' ? y - 1 : y;
    }

    if (nextX !== x || nextY !== y) {
       while(nextX >= 0 && nextX < data.grid.width && nextY >= 0 && nextY < data.grid.height) {
          if (data.grid.cells[nextY][nextX] !== null) {
              setActiveCell(nextX, nextY, dir);
              e.preventDefault();
              break;
          }
           if (e.key === 'ArrowRight' || (e.key === 'Backspace' && dir ==='H')) nextX += (e.key === 'Backspace' ? -1 : 1);
           else if (e.key === 'ArrowLeft') nextX--;
           else if (e.key === 'ArrowDown' || (e.key === 'Backspace' && dir ==='V')) nextY += (e.key === 'Backspace' ? -1 : 1);
           else if (e.key === 'ArrowUp') nextY--;
           else break;
       }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, x: number, y: number) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
    onCellInput(x, y, val);
    
    if (val) {
       let nx = activeDirection === 'H' ? x + 1 : x;
       let ny = activeDirection === 'V' ? y + 1 : y;
       if (nx < data.grid.width && ny < data.grid.height && data.grid.cells[ny][nx]) {
          setActiveCell(nx, ny, activeDirection);
       }
    }
  };

  const isCellActiveMatch = (x: number, y: number) => {
     if (x === activeX && y === activeY) return true;
     
     const activeWord = data.words.find(w => {
         if (w.direction !== activeDirection) return false;
         if (w.direction === 'H') return activeY === w.y && activeX >= w.x && activeX < w.x + w.word.length;
         return activeX === w.x && activeY >= w.y && activeY < w.y + w.word.length;
     });

     if (activeWord) {
         if (activeWord.direction === 'H') return y === activeWord.y && x >= activeWord.x && x < activeWord.x + activeWord.word.length;
         if (activeWord.direction === 'V') return x === activeWord.x && y >= activeWord.y && y < activeWord.y + activeWord.word.length;
     }
     return false;
  };

  return (
    <div className="overflow-auto max-w-full p-2 sm:p-4 bg-[#111] rounded border border-[#333] shadow-inner flex justify-center">
      <div 
        className="grid gap-[1px] border border-[#333] bg-[#333]" 
        style={{ gridTemplateColumns: `repeat(${data.grid.width}, minmax(30px, 40px))` }}
      >
        {data.grid.cells.map((row, y) => 
          row.map((cell, x) => {
             if (!cell) {
               return <div key={`${x}-${y}`} className="bg-[#111] w-full aspect-square" />;
             }
             
             const isActive = x === activeX && y === activeY;
             const inActiveWord = isCellActiveMatch(x, y);
             const val = userAnswers[y][x] || '';
             
             return (
               <div key={`${x}-${y}`} className={`relative w-full aspect-square bg-white ${inActiveWord ? 'bg-blue-100' : ''} ${isActive ? 'bg-yellow-200' : ''}`}>
                 {cell.number && (
                    <span className="absolute top-[2px] left-[2px] text-[9px] font-bold text-gray-700 leading-none select-none">
                      {cell.number}
                    </span>
                 )}
                 <input
                   ref={el => {
                     if (!inputRefs.current[y]) inputRefs.current[y] = [];
                     inputRefs.current[y][x] = el;
                   }}
                   maxLength={1}
                   value={val}
                   onChange={e => handleChange(e, x, y)}
                   onKeyDown={e => handleKeyDown(e, x, y)}
                   onClick={() => {
                       if (activeX === x && activeY === y) {
                           setActiveCell(x, y, activeDirection === 'H' ? 'V' : 'H');
                       } else {
                           let hasH = data.words.some(w => w.direction === 'H' && y === w.y && x >= w.x && x < w.x + w.word.length);
                           let hasV = data.words.some(w => w.direction === 'V' && x === w.x && y >= w.y && y < w.y + w.word.length);
                           
                           let newDir = activeDirection;
                           if (newDir === 'H' && !hasH && hasV) newDir = 'V';
                           if (newDir === 'V' && !hasV && hasH) newDir = 'H';
                           setActiveCell(x, y, newDir);
                       }
                   }}
                   className={`w-full h-full text-center text-lg sm:text-xl font-bold uppercase outline-none bg-transparent pt-1 text-gray-900 focus:bg-yellow-200 transition-colors cursor-pointer select-none`}
                 />
               </div>
             )
          })
        )}
      </div>
    </div>
  );
};
