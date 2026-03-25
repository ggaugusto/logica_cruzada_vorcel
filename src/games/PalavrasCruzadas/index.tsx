import React, { useState } from 'react';
import { Header } from '../../components/Header';
import { Play, Loader2, CheckCircle } from 'lucide-react';
import { fetchWordsFromWikipedia, generateCrosswordGrid, CrosswordData } from './crosswordLogic';
import { CrosswordGrid } from './CrosswordGrid';
import { ClueList } from './ClueList';

interface CruzadasGameProps {
  onBack?: () => void;
}

export const PalavrasCruzadasGame: React.FC<CruzadasGameProps> = ({ onBack }) => {
  const [theme, setTheme] = useState('');
  const [phase, setPhase] = useState<'setup' | 'loading' | 'playing'>('setup');
  const [gridData, setGridData] = useState<CrosswordData | null>(null);
  const [userAnswers, setUserAnswers] = useState<string[][]>([]);
  
  const [activeX, setActiveX] = useState(-1);
  const [activeY, setActiveY] = useState(-1);
  const [activeDir, setActiveDir] = useState<'H'|'V'>('H');
  
  const [errorMsg, setErrorMsg] = useState('');

  const startGame = async () => {
    if (!theme.trim()) return;
    setPhase('loading');
    setErrorMsg('');
    
    const words = await fetchWordsFromWikipedia(theme);
    const data = generateCrosswordGrid(words);
    
    if (!data) {
        setErrorMsg('Não foi possível gerar cruzadas com esse tema. Tente um tema mais abrangente.');
        setPhase('setup');
        return;
    }

    setGridData(data);
    setUserAnswers(Array(data.grid.height).fill(null).map(() => Array(data.grid.width).fill('')));
    setActiveX(data.words[0].x);
    setActiveY(data.words[0].y);
    setActiveDir(data.words[0].direction);
    setPhase('playing');
  };

  const handleCellInput = (x: number, y: number, val: string) => {
     setUserAnswers(prev => {
        const next = [...prev];
        next[y] = [...next[y]];
        next[y][x] = val;
        return next;
     });
  };

  const checkAnswers = () => {
     if (!gridData) return;
     let correct = 0;
     let total = 0;
     const nextAns = [...userAnswers];
     for (let y=0; y<gridData.grid.height; y++) {
         nextAns[y] = [...nextAns[y]];
         for (let x=0; x<gridData.grid.width; x++) {
             if (gridData.grid.cells[y][x]) {
                 total++;
                 if (nextAns[y][x] === gridData.grid.cells[y][x]?.answer) {
                     correct++;
                 } else {
                     nextAns[y][x] = ''; // Limpa os errados
                 }
             }
         }
     }
     setUserAnswers(nextAns);
     if (correct === total) {
         alert('Parabéns! O Dossiê foi completado com sucesso!');
     }
  };

  const activeWord = gridData?.words.find(w => {
     if (w.direction !== activeDir) return false;
     if (w.direction === 'H') return activeY === w.y && activeX >= w.x && activeX < w.x + w.word.length;
     return activeX === w.x && activeY >= w.y && activeY < w.y + w.word.length;
  });

  return (
    <div className="min-h-screen app-bg text-[var(--color-murdle-text)] font-mono flex flex-col relative selection:bg-red-900/50">
      <Header onBack={onBack} title="Palavras Cruzadas" hideGameActions />

      <main className="flex-1 p-2 sm:p-6 overflow-auto flex flex-col items-center">
        <div className="max-w-6xl w-full bg-[var(--color-murdle-dossier)] p-4 sm:p-8 rounded border-2 border-[var(--color-murdle-grid-border)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative mt-2">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 opacity-60"></div>
          
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase text-zinc-300 drop-shadow">Cruzadas Dinâmicas</h2>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">
              {phase === 'setup' ? 'Insira um Tema' : phase === 'loading' ? 'Buscando Dados na Wikipédia...' : `Tema: ${theme}`}
            </p>
          </div>

          {phase === 'setup' && (
             <div className="flex flex-col items-center justify-center gap-6 py-12">
               <div className="w-full max-w-md">
                 <input 
                   type="text"
                   value={theme}
                   onChange={e => setTheme(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && startGame()}
                   placeholder="EX: ASTRONOMIA, BRASIL..."
                   className="w-full bg-[#1a1a1a] border border-[#444] rounded p-4 text-center text-xl sm:text-2xl text-white outline-none focus:border-red-800 focus:ring-1 focus:ring-red-900 transition-all font-mono tracking-widest uppercase"
                 />
                 {errorMsg && <p className="text-red-500 text-sm mt-4 text-center">{errorMsg}</p>}
               </div>
               <button 
                 onClick={startGame}
                 disabled={theme.trim().length < 3}
                 className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3d3d3d] disabled:bg-[#111] disabled:text-zinc-600 disabled:border-[#333] border border-[#555] text-zinc-200 px-8 py-4 rounded font-bold uppercase tracking-wider transition-colors shadow-lg"
               >
                 <Play size={20} />
                 Gerar Cruzadas
               </button>
               <p className="text-xs text-zinc-600 uppercase max-w-xs text-center mt-4">
                 Coletaremos dados criptografados diretamente do banco de dados enciclopédico global para montar o seu dossiê.
               </p>
             </div>
          )}

          {phase === 'loading' && (
             <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-4">
                 <Loader2 size={48} className="animate-spin text-red-800" />
                 <p className="uppercase tracking-widest text-xs sm:text-sm animate-pulse text-center">Consultando enciclopédia global e tecendo cruzamentos...</p>
             </div>
          )}

          {phase === 'playing' && gridData && (
             <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
               <div className="w-full lg:w-2/3 flex flex-col items-center">
                 <CrosswordGrid 
                   data={gridData} 
                   userAnswers={userAnswers} 
                   onCellInput={handleCellInput}
                   activeDirection={activeDir}
                   activeX={activeX}
                   activeY={activeY}
                   setActiveCell={(x, y, dir) => {
                       setActiveX(x); setActiveY(y); setActiveDir(dir);
                   }}
                 />
                 <button 
                   onClick={checkAnswers}
                   className="mt-6 w-full max-w-xs flex items-center justify-center gap-2 bg-[#1a2e20] hover:bg-[#2d5a3f] border border-[#2d5a3f] text-emerald-500 p-3 rounded font-bold uppercase tracking-wider transition-all shadow-md"
                 >
                   <CheckCircle size={18} />
                   Verificar Grade
                 </button>
                 <p className="text-xs text-zinc-600 mt-2 text-center">Células incorretas serão apagadas ao verificar.</p>
               </div>
               <div className="w-full lg:w-1/3 flex flex-col gap-4">
                 <ClueList 
                   words={gridData.words} 
                   activeWordId={activeWord?.id}
                   onClueClick={(x, y, dir) => {
                       setActiveX(x); setActiveY(y); setActiveDir(dir);
                   }}
                 />
                 
                 {/* Painel de Dicas */}
                 {activeWord && (
                   <div className="bg-[#1a1a1a] p-4 rounded border border-[#333] shadow-inner mt-4 lg:mt-0 animate-in fade-in duration-300">
                     <h3 className="font-bold text-yellow-600 mb-2 uppercase tracking-wider text-sm border-b border-[#333] pb-1">Menu de Inteligência: Alvo #{activeWord.id}</h3>
                     <p className="text-xs text-zinc-500 mb-3 uppercase tracking-widest">Utilize com sabedoria, detetive.</p>
                     <div className="flex flex-col gap-2">
                       <button 
                         onClick={() => {
                           const letter = window.prompt(`Verificar Letra no Alvo #${activeWord.id}: Que letra você suspeita que exista nesta palavra?`);
                           if (!letter) return;
                           const upper = letter.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").slice(0, 1);
                           if (!/[A-Z]/.test(upper)) return;
                           
                           let found = false;
                           const nextAns = [...userAnswers];
                           for (let i = 0; i < activeWord.word.length; i++) {
                             if (activeWord.word[i] === upper) {
                               const wx = activeWord.direction === 'H' ? activeWord.x + i : activeWord.x;
                               const wy = activeWord.direction === 'V' ? activeWord.y + i : activeWord.y;
                               nextAns[wy] = [...nextAns[wy]];
                               nextAns[wy][wx] = upper;
                               found = true;
                             }
                           }
                           if (found) {
                             setUserAnswers(nextAns);
                             alert(`Certa resposta! A letra '${upper}' foi preenchida na grade.`);
                           } else {
                             alert(`Pista falsa! A letra '${upper}' não pertence ao Alvo #${activeWord.id}.`);
                           }
                         }}
                         className="flex items-center justify-center bg-[#222] hover:bg-[#333] border border-[#444] text-gray-200 p-3 text-xs uppercase font-bold rounded transition-colors"
                       >
                         Verificar / Preencher Letra
                       </button>
                       <button 
                         onClick={() => {
                           if(window.confirm(`Isso irá revelar a Resposta Oficial de '${activeWord.clue.replace('___', '____')}'. Tem certeza?`)) {
                             const nextAns = [...userAnswers];
                             for (let i = 0; i < activeWord.word.length; i++) {
                               const wx = activeWord.direction === 'H' ? activeWord.x + i : activeWord.x;
                               const wy = activeWord.direction === 'V' ? activeWord.y + i : activeWord.y;
                               nextAns[wy] = [...nextAns[wy]];
                               nextAns[wy][wx] = activeWord.word[i];
                             }
                             setUserAnswers(nextAns);
                           }
                         }}
                         className="flex items-center justify-center bg-red-950/30 hover:bg-red-900/60 border border-red-900/50 text-red-500 p-3 text-xs uppercase font-bold rounded transition-colors"
                       >
                         Solicitar Resolução Completa
                       </button>
                     </div>
                   </div>
                 )}
               </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default PalavrasCruzadasGame;
