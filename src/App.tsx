import { Header } from './components/Header';
import { LogicGrid } from './components/LogicGrid';
import { CategoryEditor } from './components/CategoryEditor';
import { useTranslation } from 'react-i18next';
import { useGridStore } from './store/useGridStore';

function App() {
  const { t } = useTranslation();
  const caseName = useGridStore(state => state.caseName);
  const setCaseName = useGridStore(state => state.setCaseName);

  return (
    <div className="min-h-screen app-bg text-[var(--color-murdle-text)] font-mono flex flex-col relative selection:bg-red-900/50">
      <Header />
      
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
    </div>
  );
}

export default App;
