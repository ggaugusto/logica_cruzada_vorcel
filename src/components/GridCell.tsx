import React from 'react';
import { useGridStore, MarkType } from '../store/useGridStore';
import { X, Check } from 'lucide-react';

interface GridCellProps {
  rowId: string;
  colId: string;
  isLastCol?: boolean;
  isLastRow?: boolean;
}

export const GridCell: React.FC<GridCellProps> = ({ rowId, colId, isLastCol, isLastRow }) => {
  const marks = useGridStore(state => state.marks);
  const setMark = useGridStore(state => state.setMark);
  
  const key = `${rowId}::${colId}`;
  const mark = marks[key] || 'empty';

  const handleClick = () => {
    let nextMark: MarkType = 'empty';
    if (mark === 'empty') nextMark = 'x';
    else if (mark === 'x') nextMark = 'check';
    setMark(rowId, colId, nextMark);
  };

  return (
    <td 
      onClick={handleClick}
      className={`
        w-8 h-8 sm:w-10 sm:h-10 border border-[var(--color-murdle-grid-border)] bg-[var(--color-murdle-grid-bg)]
        text-center cursor-pointer transition-colors select-none p-0
        hover:bg-[var(--color-murdle-grid-header)]
        ${isLastCol ? 'border-r-2 border-r-[var(--color-murdle-grid-thick)]' : ''}
        ${isLastRow ? 'border-b-2 border-b-[var(--color-murdle-grid-thick)]' : ''}
      `}
    >
      <div className="flex items-center justify-center w-full h-full">
        {mark === 'x' && <X size={20} className="text-[var(--color-murdle-accent)]" />}
        {mark === 'check' && <Check size={20} className="text-[var(--color-murdle-success)]" />}
      </div>
    </td>
  );
};
