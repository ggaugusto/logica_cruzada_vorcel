import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../../components/Header';
import { SudokuGrid } from './SudokuGrid';
import { NumberPad } from './NumberPad';
import { generateSudoku, Difficulty } from './sudokuLogic';
import { RefreshCw, Trophy } from 'lucide-react';

interface SudokuGameProps {
  onBack?: () => void;
}

const DIFFICULTIES: { key: Difficulty; label: string; color: string }[] = [
  { key: 'iniciante',   label: 'Iniciante',   color: 'border-emerald-700 text-emerald-400' },
  { key: 'facil',       label: 'Fácil',       color: 'border-blue-700 text-blue-400' },
  { key: 'medio',       label: 'Médio',       color: 'border-yellow-700 text-yellow-400' },
  { key: 'dificil',     label: 'Difícil',     color: 'border-orange-700 text-orange-400' },
  { key: 'especialista',label: 'Especialista',color: 'border-red-700 text-red-400' },
];

export const SudokuGame: React.FC<SudokuGameProps> = ({ onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medio');
  const [phase, setPhase] = useState<'setup' | 'playing' | 'victory'>('setup');
  const [solution, setSolution] = useState<number[][]>([]);
  const [initialBoard, setInitialBoard] = useState<number[][]>([]);
  const [userBoard, setUserBoard] = useState<number[][]>([]);
  const [activeRow, setActiveRow] = useState(-1);
  const [activeCol, setActiveCol] = useState(-1);
  const [errors, setErrors] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  useEffect(() => { return () => stopTimer(); }, []);

  const startGame = useCallback((diff: Difficulty) => {
    const { solution: sol, puzzle } = generateSudoku(diff);
    setSolution(sol);
    setInitialBoard(puzzle.map(r => [...r]));
    setUserBoard(puzzle.map(r => [...r]));
    setActiveRow(-1);
    setActiveCol(-1);
    setErrors(0);
    setElapsed(0);
    setPhase('playing');
    startTimer();
  }, []);

  const handleNumberInput = useCallback((num: number) => {
    if (phase !== 'playing') return;
    if (activeRow < 0 || activeCol < 0) return;
    if (initialBoard[activeRow]?.[activeCol] !== 0) return; // cell is fixed

    const newBoard = userBoard.map(r => [...r]);
    const prev = newBoard[activeRow][activeCol];
    newBoard[activeRow][activeCol] = num;

    // Track errors if the number differs from solution
    const correct = solution[activeRow][activeCol];
    if (num !== correct && prev !== num) {
      setErrors(e => e + 1);
    }

    setUserBoard(newBoard);

    // Check victory: every cell is correctly filled
    const isComplete = newBoard.every((row, r) => row.every((val, c) => val === solution[r][c]));
    if (isComplete) {
      stopTimer();
      setPhase('victory');
    }
  }, [phase, activeRow, activeCol, initialBoard, userBoard, solution]);

  const handleClear = useCallback(() => {
    if (phase !== 'playing') return;
    if (activeRow < 0 || activeCol < 0) return;
    if (initialBoard[activeRow]?.[activeCol] !== 0) return;
    const newBoard = userBoard.map(r => [...r]);
    newBoard[activeRow][activeCol] = 0;
    setUserBoard(newBoard);
  }, [phase, activeRow, activeCol, initialBoard, userBoard]);

  const handleHint = useCallback(() => {
    if (phase !== 'playing') return;
    // Collect all empty or wrong cells
    const empty: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (userBoard[r][c] !== solution[r][c]) {
          empty.push([r, c]);
        }
      }
    }
    if (empty.length === 0) return;
    const [hr, hc] = empty[Math.floor(Math.random() * empty.length)];
    const newBoard = userBoard.map(r => [...r]);
    newBoard[hr][hc] = solution[hr][hc];
    setUserBoard(newBoard);
    setActiveRow(hr);
    setActiveCol(hc);
  }, [phase, userBoard, solution]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (phase !== 'playing') return;
    const num = parseInt(e.key);
    if (num >= 1 && num <= 9) { handleNumberInput(num); return; }
    if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { handleClear(); return; }
    if (e.key === 'ArrowUp' && activeRow > 0) { setActiveRow(r => r - 1); e.preventDefault(); }
    if (e.key === 'ArrowDown' && activeRow < 8) { setActiveRow(r => r + 1); e.preventDefault(); }
    if (e.key === 'ArrowLeft' && activeCol > 0) { setActiveCol(c => c - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight' && activeCol < 8) { setActiveCol(c => c + 1); e.preventDefault(); }
  }, [phase, activeRow, activeCol, handleNumberInput, handleClear]);

  const difficultyInfo = DIFFICULTIES.find(d => d.key === difficulty)!;

  return (
    <div className="min-h-screen app-bg text-[var(--color-murdle-text)] font-mono flex flex-col selection:bg-red-900/50">
      <Header onBack={onBack} title="Sudoku" hideGameActions />

      <main className="flex-1 p-2 sm:p-6 overflow-auto flex flex-col items-center">
        <div className="max-w-2xl w-full bg-[var(--color-murdle-dossier)] p-4 sm:p-8 rounded border-2 border-[var(--color-murdle-grid-border)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative mt-2">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 opacity-60" />

          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-widest uppercase text-zinc-300">Sudoku</h2>
              {phase === 'playing' && (
                <span className={`text-xs uppercase font-bold tracking-widest border px-2 py-0.5 rounded mt-1 inline-block ${difficultyInfo.color}`}>
                  {difficultyInfo.label}
                </span>
              )}
            </div>
            {phase === 'playing' && (
              <div className="flex items-center gap-6 text-sm text-zinc-400 uppercase tracking-widest">
                <span>⏱ <strong className="text-zinc-200">{formatTime(elapsed)}</strong></span>
                <span>✗ <strong className="text-red-400">{errors}</strong></span>
                <button
                  onClick={() => startGame(difficulty)}
                  className="flex items-center gap-1 text-xs bg-[#222] hover:bg-[#333] border border-[#444] text-zinc-300 px-3 py-2 rounded transition-colors"
                >
                  <RefreshCw size={14} /> Novo Jogo
                </button>
              </div>
            )}
          </div>

          {/* SETUP PHASE */}
          {phase === 'setup' && (
            <div className="flex flex-col items-center gap-8 py-8">
              <p className="text-zinc-500 uppercase tracking-widest text-xs">Escolha a Dificuldade</p>
              <div className="flex flex-wrap justify-center gap-3">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d.key}
                    onClick={() => setDifficulty(d.key)}
                    className={`px-5 py-3 rounded border-2 font-bold uppercase tracking-wider text-sm transition-all ${difficulty === d.key ? d.color + ' bg-[#2a2a2a] scale-105 shadow-lg' : 'border-[#333] text-zinc-500 hover:border-[#555] hover:text-zinc-300'}`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => startGame(difficulty)}
                className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#555] text-zinc-200 px-10 py-4 rounded font-bold uppercase tracking-widest transition-colors shadow-lg text-lg"
              >
                ▶  Iniciar Investigação
              </button>
            </div>
          )}

          {/* PLAYING PHASE */}
          {phase === 'playing' && (
            <>
              <SudokuGrid
                board={userBoard}
                initialBoard={initialBoard}
                activeRow={activeRow}
                activeCol={activeCol}
                onCellClick={(r, c) => { setActiveRow(r); setActiveCol(c); }}
                onKeyDown={handleKeyDown}
              />
              <NumberPad
                onNumberInput={handleNumberInput}
                onClear={handleClear}
                onHint={handleHint}
              />
            </>
          )}

          {/* VICTORY PHASE */}
          {phase === 'victory' && (
            <div className="flex flex-col items-center gap-6 py-12 text-center">
              <Trophy size={64} className="text-yellow-500 drop-shadow-lg" />
              <h3 className="text-3xl font-bold text-zinc-200 tracking-widest uppercase">Caso Encerrado!</h3>
              <p className="text-zinc-400 text-sm uppercase tracking-widest">
                Dificuldade: <span className={`font-bold ${difficultyInfo.color.split(' ')[1]}`}>{difficultyInfo.label}</span> &nbsp;|&nbsp; Tempo: <strong className="text-zinc-200">{formatTime(elapsed)}</strong> &nbsp;|&nbsp; Erros: <strong className="text-red-400">{errors}</strong>
              </p>
              <button
                onClick={() => setPhase('setup')}
                className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-[#555] text-zinc-200 px-8 py-3 rounded font-bold uppercase tracking-widest transition-colors"
              >
                <RefreshCw size={18} /> Novo Desafio
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default SudokuGame;
