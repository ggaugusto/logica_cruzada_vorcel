import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from '../../components/Header';
import { LogicGrid } from '../../components/LogicGrid';
import { CategoryEditor } from '../../components/CategoryEditor';
import { VictoryModal } from '../../components/VictoryModal';
import { useGridStore, Category, MarkType, GridItem } from '../../store/useGridStore';

const getVictoryCombinations = (categories: Category[], marks: Record<string, MarkType>): GridItem[][] | null => {
  if (categories.length < 2) return null;
  const N = categories.length;
  const C0 = categories[0];
  const M = C0.items.length;
  if (M === 0) return null;

  const validCombinations: GridItem[][] = [];

  for (let i = 0; i < M; i++) {
    const item0 = C0.items[i];
    const combo = [item0];

    let failed = false;
    for (let c = 1; c < N; c++) {
      const cat = categories[c];
      const checkedItems = cat.items.filter(item => marks[`${item0.id}::${item.id}`] === 'check');
      if (checkedItems.length !== 1) {
        failed = true;
        break;
      }
      combo.push(checkedItems[0]);
    }
    if (failed) return null;

    for (let a = 0; a < N; a++) {
      for (let b = a + 1; b < N; b++) {
        if (marks[`${combo[a].id}::${combo[b].id}`] !== 'check') {
          return null; // Inconsistent
        }
      }
    }

    validCombinations.push(combo);
  }

  for (let c = 1; c < N; c++) {
    const usedIds = new Set(validCombinations.map(combo => combo[c].id));
    if (usedIds.size !== M) return null; // Used items must be unique per category block
  }

  return validCombinations;
};

interface LogicaCruzadaGameProps {
  onBack?: () => void;
}

export const LogicaCruzadaGame: React.FC<LogicaCruzadaGameProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const caseName = useGridStore(state => state.caseName);
  const setCaseName = useGridStore(state => state.setCaseName);
  const marks = useGridStore(state => state.marks);
  const categories = useGridStore(state => state.categories);
  
  const [victoryData, setVictoryData] = useState<GridItem[][] | null>(null);
  const [hasShownVictory, setHasShownVictory] = useState(false);

  useEffect(() => {
    const combos = getVictoryCombinations(categories, marks);
    if (combos && !hasShownVictory) {
      setVictoryData(combos);
      setHasShownVictory(true);
    } else if (!combos) {
      setHasShownVictory(false);
    }
  }, [marks, categories, hasShownVictory]);

  return (
    <div className="min-h-screen app-bg text-[var(--color-murdle-text)] font-mono flex flex-col relative selection:bg-red-900/50">
      <Header onBack={onBack} />
      
      <main className="flex-1 p-2 sm:p-8 overflow-auto flex justify-center items-start">
        <div className="max-w-7xl w-full bg-[var(--color-murdle-dossier)] p-3 sm:p-10 rounded-sm border-2 border-[var(--color-murdle-grid-border)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative mt-2 sm:mt-10 overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-yellow-700 to-red-900 opacity-60"></div>
          <div className="absolute top-4 left-4 flex gap-2 opacity-60">
            <div className="w-3 h-3 rounded-full bg-red-800 border-t border-red-500 shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-orange-800 border-t border-orange-500 shadow-sm"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-800 border-t border-emerald-500 shadow-sm"></div>
          </div>
          
          <div className="mt-8 mb-6 border-b-2 border-dashed border-[var(--color-murdle-grid-border)] pb-4 flex flex-col gap-1">
             <input 
               type="text"
               value={caseName}
               onChange={(e) => setCaseName(e.target.value)}
               className="bg-transparent text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-zinc-300 outline-none border-b border-transparent focus:border-zinc-700 transition-colors w-full placeholder:text-zinc-700 p-0 m-0"
               placeholder="NOME DO CASO..."
             />
             <p className="text-xs sm:text-sm text-zinc-500 font-mono tracking-wider">ARQUIVO #LC-{new Date().getFullYear()}-001 • ACESSO RESTRITO - CLIQUE ACIMA PARA EDITAR</p>
          </div>
          
          <div className="bg-[var(--color-murdle-app-bg)] rounded border border-[var(--color-murdle-grid-border)] p-2 sm:p-4 shadow-inner overflow-x-auto w-full">
             <LogicGrid />
          </div>

          <div className="mt-8 pt-4 border-t-2 border-dashed border-[var(--color-murdle-grid-border)] flex flex-col lg:flex-row justify-between items-center text-xs text-zinc-500 gap-4 text-center lg:text-left">
             <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
                <span className="font-bold text-zinc-400">{t('app_title')} © {new Date().getFullYear()}</span>
                <span className="hidden sm:inline">•</span>
                <span>Desenvolvido por GG - Gustavo Galdino</span>
             </div>
             <span className="uppercase tracking-widest text-zinc-400 mt-2 sm:mt-0">Investigação em curso...</span>
          </div>
        </div>
      </main>

      <CategoryEditor />
      {victoryData && (
        <VictoryModal data={victoryData} onClose={() => setVictoryData(null)} />
      )}
    </div>
  );
};

export default LogicaCruzadaGame;
