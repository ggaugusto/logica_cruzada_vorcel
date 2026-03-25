import React, { useState, useCallback } from 'react';
import { Header } from '../../components/Header';
import { Loader2, Trophy, SkipForward, Star } from 'lucide-react';

// ─── PRIZE TABLE ──────────────────────────────────────────────────────────────
interface Prize { bronze: number; silver: number; gold: number; label: string; }
const PRIZE_TABLE: Prize[] = [
  // Perguntas 1-5: Bronze
  { bronze: 100,  silver: 0, gold: 0, label: '100 Bronze' },
  { bronze: 200,  silver: 0, gold: 0, label: '200 Bronze' },
  { bronze: 400,  silver: 0, gold: 0, label: '400 Bronze' },
  { bronze: 800,  silver: 0, gold: 0, label: '800 Bronze' },
  { bronze: 1000, silver: 0, gold: 0, label: '1.000 Bronze' },
  // Perguntas 6-10: Prata
  { bronze: 0, silver: 1,  gold: 0, label: '1 Prata' },
  { bronze: 0, silver: 2,  gold: 0, label: '2 Prata' },
  { bronze: 0, silver: 4,  gold: 0, label: '4 Prata' },
  { bronze: 0, silver: 8,  gold: 0, label: '8 Prata' },
  { bronze: 0, silver: 16, gold: 0, label: '16 Prata' },
  // Perguntas 11-15: Ouro
  { bronze: 0, silver: 0, gold: 1,  label: '1 Ouro' },
  { bronze: 0, silver: 0, gold: 2,  label: '2 Ouro' },
  { bronze: 0, silver: 0, gold: 4,  label: '4 Ouro' },
  { bronze: 0, silver: 0, gold: 8,  label: '8 Ouro' },
  { bronze: 0, silver: 0, gold: 16, label: '16 Ouro 👑' },
];

interface Wallet { bronze: number; silver: number; gold: number; }
const EMPTY_WALLET: Wallet = { bronze: 0, silver: 0, gold: 0 };

function addPrize(w: Wallet, p: Prize): Wallet {
  let bronze = w.bronze + p.bronze;
  let silver = w.silver + p.silver + Math.floor(bronze / 1000);
  bronze = bronze % 1000;
  let gold = w.gold + p.gold + Math.floor(silver / 1000);
  silver = silver % 1000;
  return { bronze, silver, gold };
}

function formatWallet(w: Wallet): string {
  const parts: string[] = [];
  if (w.gold   > 0) parts.push(`${w.gold} 🥇`);
  if (w.silver > 0) parts.push(`${w.silver} 🥈`);
  if (w.bronze > 0) parts.push(`${w.bronze} 🥉`);
  return parts.length ? parts.join('  ') : '0 🥉';
}

// ─── WIKIPEDIA FETCH ──────────────────────────────────────────────────────────
interface Question { question: string; answer: string; options: string[]; }

async function fetchRandomTitle(): Promise<string> {
  const res = await fetch('https://pt.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*');
  const data = await res.json();
  return data.query.random[0].title as string;
}

async function fetchExtract(title: string): Promise<string> {
  const res = await fetch(`https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(title)}&format=json&origin=*`);
  const data = await res.json();
  const pages = data.query.pages;
  const page: any = Object.values(pages)[0];
  return (page.extract || '').split('\n')[0].trim();
}

async function fetchQuestion(): Promise<Question | null> {
  try {
    const correctTitle = await fetchRandomTitle();
    const extract = await fetchExtract(correctTitle);
    if (!extract || extract.length < 40) return null;

    // Censor the answer in the question text
    const censored = extract.replace(new RegExp(correctTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '_______');

    // Fetch 3 wrong titles
    const wrongTitles: string[] = [];
    for (let i = 0; i < 3; i++) {
      try { wrongTitles.push(await fetchRandomTitle()); } catch { wrongTitles.push('Opção ' + (i+1)); }
    }

    const allOpts = [correctTitle, ...wrongTitles].sort(() => Math.random() - 0.5);

    return {
      question: censored.length > 400 ? censored.slice(0, 400) + '...' : censored,
      answer: correctTitle,
      options: allOpts,
    };
  } catch {
    return null;
  }
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
interface Props { onBack?: () => void; }

type Phase = 'menu' | 'loading' | 'playing' | 'correct' | 'wrong' | 'victory';

export const ShowDoMilhaoGame: React.FC<Props> = ({ onBack }) => {
  const [phase, setPhase] = useState<Phase>('menu');
  const [question, setQuestion] = useState<Question | null>(null);
  const [questionIdx, setQuestionIdx] = useState(0);  // 0-based
  const [wallet, setWallet] = useState<Wallet>(EMPTY_WALLET);
  const [skips, setSkips] = useState(3);
  const [selected, setSelected] = useState<string | null>(null);

  const loadNextQuestion = useCallback(async (idx: number) => {
    setPhase('loading');
    setSelected(null);
    let q: Question | null = null;
    let retries = 0;
    while (!q && retries < 5) { q = await fetchQuestion(); retries++; }
    if (!q) { loadNextQuestion(idx); return; }
    setQuestion(q);
    setQuestionIdx(idx);
    setPhase('playing');
  }, []);

  const handleStart = () => {
    setWallet(EMPTY_WALLET);
    setSkips(3);
    setQuestionIdx(0);
    loadNextQuestion(0);
  };

  const handleAnswer = (opt: string) => {
    if (phase !== 'playing' || selected) return;
    setSelected(opt);
    const correct = opt === question!.answer;

    if (correct) {
      const newWallet = addPrize(wallet, PRIZE_TABLE[questionIdx]);
      setWallet(newWallet);
      setPhase('correct');
      setTimeout(() => {
        if (questionIdx + 1 >= PRIZE_TABLE.length) {
          setPhase('victory');
        } else {
          loadNextQuestion(questionIdx + 1);
        }
      }, 2000);
    } else {
      setPhase('wrong');
    }
  };

  const handleSkip = () => {
    if (skips <= 0 || phase !== 'playing') return;
    setSkips(s => s - 1);
    loadNextQuestion(questionIdx);
  };

  const getOptionClass = (opt: string) => {
    if (!selected) return 'bg-[#1c1c2e] hover:bg-[#2a2a4e] border-[#3a3a6e] text-gray-200 hover:border-indigo-500 cursor-pointer';
    if (opt === question!.answer) return 'bg-emerald-900/60 border-emerald-500 text-emerald-300 font-bold';
    if (opt === selected && opt !== question!.answer) return 'bg-red-900/60 border-red-500 text-red-300';
    return 'bg-[#1a1a2e] border-[#333] text-gray-500 cursor-default';
  };

  const currentPrize = PRIZE_TABLE[questionIdx];

  return (
    <div className="min-h-screen app-bg text-[var(--color-murdle-text)] font-mono flex flex-col selection:bg-indigo-900/50">
      <Header onBack={onBack} title="Perguntas e Respostas" hideGameActions />

      <main className="flex-1 p-2 sm:p-6 flex flex-col items-center justify-center overflow-auto">
        <div className="max-w-2xl w-full">

          {/* ── MENU ── */}
          {phase === 'menu' && (
            <div className="bg-[#0f0f1a] border-2 border-indigo-900/50 rounded-xl p-8 sm:p-12 flex flex-col items-center gap-8 shadow-[0_0_40px_rgba(99,102,241,0.2)] text-center">
              <div className="text-5xl sm:text-7xl">🎰</div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-indigo-300 uppercase tracking-widest drop-shadow">Perguntas e Respostas</h2>
                <p className="text-zinc-500 text-sm sm:text-base mt-3 uppercase tracking-widest">Perguntas dinâmicas da Enciclopédia Global</p>
              </div>
              <div className="text-sm text-zinc-500 flex flex-col gap-1 text-left bg-[#16162a] border border-[#2a2a4e] p-4 rounded-lg w-full max-w-sm">
                <p className="text-zinc-300 font-bold mb-2 uppercase tracking-wider">Regras:</p>
                <p>• 15 perguntas progressivas</p>
                <p>• 🥉 Bronze → 🥈 Prata → 🥇 Ouro</p>
                <p>• 1 Prata = 1.000 Bronze | 1 Ouro = 1.000 Prata</p>
                <p>• 3 pulos disponíveis por jogo</p>
                <p>• Um erro encerra o jogo</p>
              </div>
              <button onClick={handleStart}
                className="bg-indigo-800 hover:bg-indigo-700 text-white px-12 py-4 rounded-lg font-bold uppercase tracking-widest text-lg transition-all shadow-lg hover:shadow-indigo-700/50 hover:scale-105">
                Jogar Agora
              </button>
            </div>
          )}

          {/* ── LOADING ── */}
          {phase === 'loading' && (
            <div className="flex flex-col items-center gap-6 py-24 text-zinc-400">
              <Loader2 size={56} className="animate-spin text-indigo-500" />
              <p className="uppercase tracking-widest text-sm animate-pulse">Buscando pergunta na enciclopédia...</p>
            </div>
          )}

          {/* ── PLAYING / CORRECT / WRONG ── */}
          {(phase === 'playing' || phase === 'correct' || phase === 'wrong') && question && (
            <div className="flex flex-col gap-4">
              {/* HUD */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0f0f1a] border border-[#2a2a4e] rounded-xl px-4 py-3">
                <div>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Pergunta</p>
                  <p className="text-lg font-bold text-indigo-300">{questionIdx + 1} <span className="text-zinc-600">/ 15</span></p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Prêmio desta rodada</p>
                  <p className="text-base font-bold text-yellow-400">{currentPrize?.label}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-500 uppercase tracking-widest">Carteira</p>
                  <p className="text-base font-bold text-zinc-200">{formatWallet(wallet)}</p>
                </div>
              </div>

              {/* Question */}
              <div className={`bg-[#0f0f1a] border-2 rounded-xl p-5 sm:p-7 transition-colors ${
                phase === 'correct' ? 'border-emerald-600' : phase === 'wrong' ? 'border-red-600' : 'border-[#2a2a4e]'
              }`}>
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3">Qual é o tema descrito abaixo?</p>
                <p className="text-sm sm:text-base text-zinc-200 leading-relaxed">{question.question}</p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((opt, i) => (
                  <button key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={!!selected}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${getOptionClass(opt)}`}
                  >
                    <span className="font-bold text-indigo-400 text-lg min-w-[24px]">
                      {['A', 'B', 'C', 'D'][i]}:
                    </span>
                    <span className="text-sm leading-snug">{opt}</span>
                  </button>
                ))}
              </div>

              {/* Skip button */}
              {!selected && (
                <button
                  onClick={handleSkip}
                  disabled={skips <= 0}
                  className="flex items-center justify-center gap-2 w-full mt-1 py-3 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm uppercase tracking-wider"
                >
                  <SkipForward size={16} />
                  Pular Pergunta ({skips} restante{skips !== 1 ? 's' : ''})
                </button>
              )}

              {/* Feedback message */}
              {phase === 'wrong' && (
                <div className="bg-red-900/30 border border-red-700 rounded-xl p-5 flex flex-col items-center gap-4 text-center">
                  <p className="text-2xl font-bold text-red-400 uppercase tracking-widest">Resposta Errada!</p>
                  <p className="text-zinc-400 text-sm">A resposta correta era: <strong className="text-emerald-400">{question.answer}</strong></p>
                  <p className="text-zinc-400 text-sm">Você saiu com: <strong className="text-yellow-400">{formatWallet(wallet)}</strong></p>
                  <div className="flex gap-3 mt-2">
                    <button onClick={handleStart} className="bg-indigo-800 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all text-sm">
                      Jogar Novamente
                    </button>
                    <button onClick={() => setPhase('menu')} className="bg-[#1c1c2e] hover:bg-[#2a2a3e] border border-[#3a3a5e] text-zinc-300 px-6 py-3 rounded-lg font-bold uppercase tracking-wider transition-all text-sm">
                      Menu
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── VICTORY ── */}
          {phase === 'victory' && (
            <div className="bg-[#0a0a1a] border-2 border-yellow-600 rounded-xl p-8 sm:p-14 flex flex-col items-center gap-6 shadow-[0_0_60px_rgba(234,179,8,0.3)] text-center">
              <div className="text-6xl animate-bounce">👑</div>
              <Trophy size={56} className="text-yellow-400 drop-shadow-lg" />
              <h3 className="text-3xl sm:text-4xl font-bold text-yellow-400 uppercase tracking-widest">Milionário de Ouro!</h3>
              <p className="text-zinc-400 uppercase tracking-widest text-sm">Respondeu corretamente todas as 15 perguntas!</p>
              <div className="text-2xl font-bold text-yellow-300 flex items-center gap-2">
                <Star className="text-yellow-500" /> {formatWallet(wallet)} <Star className="text-yellow-500" />
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={handleStart} className="bg-yellow-700 hover:bg-yellow-600 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-widest transition-all hover:scale-105">
                  Jogar Novamente
                </button>
                <button onClick={() => setPhase('menu')} className="bg-[#1c1c2e] hover:bg-[#2a2a3e] border border-[#3a3a5e] text-zinc-300 px-8 py-3 rounded-lg font-bold uppercase tracking-widest transition-all">
                  Menu
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default ShowDoMilhaoGame;
