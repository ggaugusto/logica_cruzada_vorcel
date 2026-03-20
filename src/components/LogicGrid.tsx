import React from 'react';
import { useGridStore } from '../store/useGridStore';
import { GridCell } from './GridCell';
import { IconRenderer } from '../utils/iconMap';
import { useTranslation } from 'react-i18next';

export const LogicGrid: React.FC = () => {
  const categories = useGridStore(state => state.categories);
  const { t } = useTranslation();

  if (categories.length < 2) {
    return (
      <div className="p-8 text-center text-[var(--color-murdle-text-muted)] italic">
        {t('empty_state')}
      </div>
    );
  }

  const colCategories = categories.slice(1);
  const rowCategories = [categories[0], ...categories.slice(2).reverse()];

  return (
    <div className="overflow-x-auto p-1 sm:p-4 w-full">
      <table className="border-collapse select-none mx-auto">
        <thead>
          {/* Main Category Headers (Top) */}
          <tr>
            <th className="p-0 border-none" colSpan={2}></th>
            {colCategories.map((cat, i) => (
              <th 
                key={cat.id} 
                colSpan={cat.items.length} 
                className={`
                  py-2 border border-[var(--color-murdle-grid-border)] 
                  bg-[var(--color-murdle-grid-header)] font-bold text-[10px] sm:text-xs tracking-widest uppercase 
                  text-[var(--color-murdle-text)]
                  ${i < colCategories.length - 1 ? 'border-r-2 border-r-[var(--color-murdle-grid-thick)]' : ''}
                `}
              >
                {cat.name}
              </th>
            ))}
          </tr>
          
          {/* Individual Item Headers (Top) */}
          <tr>
            <th className="p-0 border-none" colSpan={2}></th>
            {colCategories.map((cat) => (
              cat.items.map((item, itemIdx) => {
                const isLastCol = itemIdx === cat.items.length - 1;
                return (
                  <th 
                    key={`top-item-${item.id}`} 
                    className={`
                      w-8 h-24 sm:w-10 sm:h-32 border border-[var(--color-murdle-grid-border)] 
                      bg-[var(--color-murdle-grid-header)] align-bottom p-1
                      ${isLastCol ? 'border-r-2 border-r-[var(--color-murdle-grid-thick)]' : ''}
                      border-b-2 border-b-[var(--color-murdle-grid-thick)]
                    `}
                  >
                    <div className="flex flex-col items-center justify-end h-full gap-2 overflow-hidden">
                      <span 
                        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} 
                        className="text-[10px] sm:text-xs text-[var(--color-murdle-text-muted)] whitespace-nowrap"
                      >
                        {item.name}
                      </span>
                      <IconRenderer name={item.iconName} className="text-[var(--color-murdle-text)] shrink-0" size={14} />
                    </div>
                  </th>
                );
              })
            ))}
          </tr>
        </thead>
        
        <tbody>
          {rowCategories.map((rowCat, rIndex) => (
            <React.Fragment key={rowCat.id}>
              {rowCat.items.map((rowItem, itemIndex) => {
                const isLastRow = itemIndex === rowCat.items.length - 1;
                return (
                  <tr key={`row-${rowItem.id}`}>
                    {/* Category Label (Leftmost) */}
                    {itemIndex === 0 && (
                      <th 
                        rowSpan={rowCat.items.length} 
                        className={`
                          w-8 sm:w-10 border border-[var(--color-murdle-grid-border)] 
                          bg-[var(--color-murdle-grid-header)] font-bold text-[10px] sm:text-xs 
                          tracking-widest uppercase text-[var(--color-murdle-text)]
                          border-b-2 border-b-[var(--color-murdle-grid-thick)]
                        `}
                      >
                        <div className="flex justify-center items-center h-full">
                          <span style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }} className="whitespace-nowrap">
                            {rowCat.name}
                          </span>
                        </div>
                      </th>
                    )}
                    
                    {/* Row Item Header (Left) */}
                    <th className={`
                      h-8 sm:h-10 px-2 py-1 border border-[var(--color-murdle-grid-border)] 
                      bg-[var(--color-murdle-grid-header)] text-right text-[10px] sm:text-xs 
                      text-[var(--color-murdle-text-muted)] font-bold whitespace-nowrap
                      border-r-2 border-r-[var(--color-murdle-grid-thick)]
                      ${isLastRow ? 'border-b-2 border-b-[var(--color-murdle-grid-thick)]' : ''}
                    `}>
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2 h-full">
                         <span>{rowItem.name}</span>
                         <IconRenderer name={rowItem.iconName} className="text-[var(--color-murdle-text)]" size={14} />
                      </div>
                    </th>
                    
                    {/* Grid Cells */}
                    {colCategories.map((colCat, cIndex) => {
                      if (cIndex >= colCategories.length - rIndex) {
                        return null;
                      }
                      
                      return colCat.items.map((colItem, colItemIdx) => {
                        const isLastColInCat = colItemIdx === colCat.items.length - 1;
                        return (
                          <GridCell 
                            key={`${rowItem.id}-${colItem.id}`} 
                            rowId={rowItem.id} 
                            colId={colItem.id}
                            isLastCol={isLastColInCat}
                            isLastRow={isLastRow}
                          />
                        );
                      });
                    })}
                  </tr>
                );
              })}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
