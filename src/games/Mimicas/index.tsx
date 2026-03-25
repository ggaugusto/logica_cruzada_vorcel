import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '../../components/Header';
import { Play, CheckCircle, XCircle, RotateCcw, Trophy, Eye } from 'lucide-react';
import { DATABASE, MimicaItem, shuffleArray } from './wordsDB';

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string; emoji: string }> = {
  'Pessoa':     { bg: 'bg-violet-700',  text: 'text-violet-100', border: 'border-violet-500', emoji: '🧑' },
  'Lugar':      { bg: 'bg-emerald-700', text: 'text-emerald-100', border: 'border-emerald-500', emoji: '📍' },
  'Coisa':      { bg: 'bg-orange-600',  text: 'text-orange-100', border: 'border-orange-400', emoji: '📦' },
  'Ação':       { bg: 'bg-rose-600',    text: 'text-rose-100', border: 'border-rose-400', emoji: '🎭' },
  'Filme/Livro':{ bg: 'bg-yellow-600',  text: 'text-yellow-950', border: 'border-yellow-400', emoji: '🎬' },
  'Animal':     { bg: 'bg-sky-600',     text: 'text-sky-100', border: 'border-sky-400', emoji: '🐾' },
};

const TEAM_COLORS = [
  { main: '#7c3aed', light: '#a78bfa', bg: 'bg-violet-800', border: 'border-violet-500' },
  { main: '#b91c1c', light: '#f87171', bg: 'bg-red-800', border: 'border-red-500' },
  { main: '#047857', light: '#34d399', bg: 'bg-emerald-800', border: 'border-emerald-500' },
  { main: '#b45309', light: '#fbbf24', bg: 'bg-amber-800', border: 'border-amber-500' },
  { main: '#0369a1', light: '#38bdf8', bg: 'bg-sky-800', border: 'border-sky-500' },
  { main: '#be185d', light: '#f472b6', bg: 'bg-pink-800', border: 'border-pink-500' },
];

interface Team { name: string; score: number; }

type Phase = 'setup' | 'team-turn' | 'reveal' | 'timer' | 'result' | 'victory';

interface Props { onBack?: () => void; }

export const MimicasGame: React.FC<Props> = ({ onBack }) => {
  // ── Setup state ─────────────────────────────────────────────────────────────
  const [teamCount, setTeamCount] = useState(2);
  const [teamNames, setTeamNames] = useState(['Equipe 1', 'Equipe 2', 'Equipe 3', 'Equipe 4', 'Equipe 5', 'Equipe 6']);
  const [winScore, setWinScore] = useState(10);
  const [roundTime, setRoundTime] = useState(60);

  // ── Game state ───────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState<Phase>('setup');
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [wordQueue, setWordQueue] = useState<MimicaItem[]>([]);
  const [currentWord, setCurrentWord] = useState<MimicaItem | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [animClass, setAnimClass] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const beep = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880; o.type = 'square';
      g.gain.setValueAtTime(0.3, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.4);
    } catch {}
  }, []);

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  useEffect(() => { return () => stopTimer(); }, []);

  const startGame = () => {
    const initialTeams: Team[] = Array.from({ length: teamCount }, (_, i) => ({
      name: teamNames[i] || `Equipe ${i + 1}`,
      score: 0,
    }));
    setTeams(initialTeams);
    setCurrentTeamIdx(0);
    setWordQueue(shuffleArray(DATABASE));
    setPhase('team-turn');
  };

  const pickNextWord = useCallback((queue: MimicaItem[]) => {
    if (queue.length === 0) return null;
    return queue[0];
  }, []);

  const handleReveal = () => {
    const word = pickNextWord(wordQueue);
    if (!word) { alert('Todas as palavras foram usadas! Reinicie o jogo.'); return; }
    setCurrentWord(word);
    setWordQueue(q => q.slice(1));
    setAnimClass('animate-in fade-in zoom-in duration-300');
    setTimeout(() => setAnimClass(''), 400);
    setPhase('reveal');
  };

  const handleStartTimer = () => {
    setTimeLeft(roundTime);
    setPhase('timer');
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          beep();
          setPhase('result');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleResult = (correct: boolean) => {
    stopTimer();
    if (correct) {
      const newTeams = teams.map((t, i) =>
        i === currentTeamIdx ? { ...t, score: t.score + 1 } : t
      );
      setTeams(newTeams);
      if (newTeams[currentTeamIdx].score >= winScore) {
        setPhase('victory');
        return;
      }
    }
    const nextIdx = (currentTeamIdx + 1) % teamCount;
    setCurrentTeamIdx(nextIdx);
    setPhase('team-turn');
  };

  const resetGame = () => {
    stopTimer();
    setPhase('setup');
    setTeams([]);
    setCurrentTeamIdx(0);
    setWordQueue([]);
    setCurrentWord(null);
  };

  const currentTeamColor = TEAM_COLORS[currentTeamIdx % TEAM_COLORS.length];
  const cat = currentWord ? CATEGORY_COLORS[currentWord.category] : null;

  const timerPercent = (timeLeft / roundTime) * 100;
  const timerColor = timerPercent > 50 ? '#22c55e' : timerPercent > 25 ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen flex flex-col font-sans"
      style={{ background: 'linear-gradient(160deg, #0a0014 0%, #0f0020 50%, #000a0a 100%)' }}>
      <Header onBack={onBack} title="Mímicas" hideGameActions />

      <main className="flex-1 p-3 sm:p-6 flex flex-col items-center justify-start overflow-auto pb-10">
        <div className="max-w-md w-full flex flex-col gap-4">

          {/* ── SCOREBOARD (always visible while playing) ──────────────────── */}
          {phase !== 'setup' && phase !== 'victory' && (
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(teamCount, 3)}, 1fr)` }}>
              {teams.map((t, i) => (
                <div key={i}
                  className={`rounded-xl border-2 p-2 text-center transition-all ${i === currentTeamIdx ? TEAM_COLORS[i % 6].border + ' scale-105 shadow-lg' : 'border-white/10'}`}
                  style={{ background: i === currentTeamIdx ? `${TEAM_COLORS[i % 6].main}44` : '#ffffff08' }}>
                  <p className="text-xs uppercase tracking-wider truncate" style={{ color: TEAM_COLORS[i % 6].light }}>{t.name}</p>
                  <p className="text-3xl font-black text-white">{t.score}</p>
                  <p className="text-xs text-white/30">/ {winScore}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── SETUP ─────────────────────────────────────────────────────── */}
          {phase === 'setup' && (
            <div className="flex flex-col gap-5">
              <div className="text-center py-4">
                <div className="text-6xl mb-2">🎭</div>
                <h2 className="text-3xl font-black text-white uppercase tracking-widest">Mímicas</h2>
                <p className="text-sm text-white/40 mt-1 uppercase tracking-wider">Party Game de Mímicas</p>
              </div>

              {/* Team count */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-3">Número de Equipes</p>
                <div className="flex gap-2 flex-wrap justify-center">
                  {[2,3,4,5,6].map(n => (
                    <button key={n} onClick={() => setTeamCount(n)}
                      className={`w-12 h-12 rounded-xl font-black text-xl border-2 transition-all ${teamCount === n ? 'bg-violet-600 border-violet-400 text-white scale-105' : 'border-white/20 text-white/50 hover:border-white/40'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Team names */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Nomes das Equipes</p>
                {Array.from({ length: teamCount }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ background: TEAM_COLORS[i].light }} />
                    <input value={teamNames[i]}
                      onChange={e => { const n = [...teamNames]; n[i] = e.target.value; setTeamNames(n); }}
                      maxLength={20}
                      className="flex-1 bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2 outline-none focus:border-violet-500 transition-colors text-sm font-bold"
                    />
                  </div>
                ))}
              </div>

              {/* Win score & time */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-2">Meta de Pontos</p>
                  <div className="flex gap-2 flex-wrap">
                    {[5,10,15,20].map(n => (
                      <button key={n} onClick={() => setWinScore(n)}
                        className={`flex-1 min-w-0 py-2 rounded-lg font-black border-2 text-sm transition-all ${winScore === n ? 'bg-yellow-500 border-yellow-400 text-black' : 'border-white/20 text-white/50 hover:border-white/40'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-2">Tempo (seg)</p>
                  <div className="flex gap-2 flex-wrap">
                    {[30,60,90].map(n => (
                      <button key={n} onClick={() => setRoundTime(n)}
                        className={`flex-1 min-w-0 py-2 rounded-lg font-black border-2 text-sm transition-all ${roundTime === n ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/20 text-white/50 hover:border-white/40'}`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-center text-white/30 text-xs uppercase tracking-widest">{DATABASE.length} palavras em {Object.keys(CATEGORY_COLORS).length} categorias</p>

              <button onClick={startGame}
                className="w-full py-5 rounded-2xl font-black text-xl uppercase tracking-widest text-white transition-all hover:scale-[1.02] shadow-xl"
                style={{ background: 'linear-gradient(135deg, #7c3aed, #be185d)' }}>
                🎮 Começar o Jogo!
              </button>
            </div>
          )}

          {/* ── TEAM TURN  ─────────────────────────────────────────────────── */}
          {phase === 'team-turn' && (
            <div className="flex flex-col items-center gap-6 py-6">
              <div className="rounded-2xl border-2 p-6 w-full text-center shadow-2xl"
                style={{ background: `${currentTeamColor.main}33`, borderColor: currentTeamColor.light }}>
                <p className="text-sm uppercase tracking-widest font-bold mb-1" style={{ color: currentTeamColor.light }}>Vez da equipe</p>
                <p className="text-4xl font-black text-white">{teams[currentTeamIdx]?.name}</p>
              </div>
              <p className="text-white/50 text-sm uppercase tracking-wider">O mímico pega o celular e aperta o botão</p>
              <button onClick={handleReveal}
                className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-2xl uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
                style={{ background: `linear-gradient(135deg, ${currentTeamColor.main}, #1a1a1a)` }}>
                <Eye size={30} /> Ver Palavra
              </button>
              <button onClick={resetGame} className="text-xs text-white/20 uppercase tracking-widest hover:text-white/40 transition-colors">← Reiniciar</button>
            </div>
          )}

          {/* ── REVEAL ────────────────────────────────────────────────────── */}
          {phase === 'reveal' && currentWord && cat && (
            <div className={`flex flex-col items-center gap-6 py-6 ${animClass}`}>
              <div className={`w-full rounded-2xl border-2 p-3 flex items-center justify-center gap-2 ${cat.bg} ${cat.border} border-4`}>
                <span className="text-2xl">{cat.emoji}</span>
                <span className={`text-sm font-black uppercase tracking-widest ${cat.text}`}>{currentWord.category}</span>
              </div>
              <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center shadow-inner relative group">
                <p className="text-4xl sm:text-5xl font-black text-white leading-tight">{currentWord.word}</p>
                <button onClick={handleReveal} title="Trocar Palavra"
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/10 text-white/40 hover:bg-white/20 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus:opacity-100">
                  <RotateCcw size={18} />
                </button>
              </div>
              <p className="text-white/40 text-sm uppercase tracking-widest text-center">O mímico memoriza e aperta Começar!</p>
              
              <div className="w-full flex flex-col gap-3">
                <button onClick={handleStartTimer}
                  className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-2xl uppercase tracking-widest text-white shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #059669, #065f46)' }}>
                  <Play size={30} /> Começar Mímica!
                </button>
                
                <button onClick={handleReveal}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm uppercase tracking-widest text-white/40 border border-white/10 hover:bg-white/5 hover:text-white/70 transition-all">
                  <RotateCcw size={18} /> Trocar Palavra
                </button>
              </div>
            </div>
          )}

          {/* ── TIMER ─────────────────────────────────────────────────────── */}
          {phase === 'timer' && currentWord && cat && (
            <div className="flex flex-col items-center gap-4 py-4">
              {/* Timer ring */}
              <div className="relative flex items-center justify-center" style={{ width: 180, height: 180 }}>
                <svg width="180" height="180" style={{ position:'absolute', top:0, left:0, transform:'rotate(-90deg)' }}>
                  <circle cx="90" cy="90" r="80" fill="none" stroke="#ffffff18" strokeWidth="12" />
                  <circle cx="90" cy="90" r="80" fill="none" stroke={timerColor} strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 80}`}
                    strokeDashoffset={`${2 * Math.PI * 80 * (1 - timerPercent / 100)}`}
                    strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }} />
                </svg>
                <p className="text-7xl font-black text-white z-10">{timeLeft}</p>
              </div>
              <div className={`w-full rounded-2xl border-4 p-4 text-center ${cat.bg} ${cat.border}`}>
                <p className={`text-xs font-bold uppercase tracking-widest ${cat.text} mb-1`}>{cat.emoji} {currentWord.category}</p>
                <p className="text-3xl font-black text-white">{currentWord.word}</p>
              </div>
              {/* ✅ Early correct button */}
              <button onClick={() => handleResult(true)}
                className="w-full flex items-center justify-center gap-3 py-6 rounded-2xl font-black text-2xl uppercase tracking-widest text-white border-4 border-emerald-400 bg-emerald-600 shadow-lg shadow-emerald-900/50 transition-all hover:bg-emerald-500 hover:scale-[1.03] active:scale-95">
                <CheckCircle size={34} /> ACERTOU!
              </button>
              <button onClick={() => handleResult(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-base uppercase tracking-widest text-white/60 border border-white/20 hover:border-red-600/60 hover:text-red-400 transition-all">
                <XCircle size={20} /> Pular / Errou
              </button>
            </div>
          )}


          {/* ── RESULT ───────────────────────────────────────────────────── */}
          {phase === 'result' && currentWord && cat && (
            <div className="flex flex-col items-center gap-5 py-6">
              <div className={`w-full rounded-2xl border-4 p-5 text-center ${cat.bg} ${cat.border}`}>
                <p className={`text-xs font-bold uppercase tracking-widest ${cat.text} mb-1`}>{cat.emoji} {currentWord.category}</p>
                <p className="text-3xl font-black text-white">{currentWord.word}</p>
              </div>
              <p className="text-lg text-white/70 uppercase tracking-widest font-bold">⏱ Tempo esgotado!</p>
              <p className="text-white/50 text-sm uppercase tracking-widest">A equipe <strong className="text-white">{teams[currentTeamIdx]?.name}</strong> acertou?</p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <button onClick={() => handleResult(true)}
                  className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl font-black text-xl border-4 border-emerald-400 bg-emerald-600 text-white transition-all hover:bg-emerald-500 hover:scale-[1.03] active:scale-95 shadow-lg shadow-emerald-900/50">
                  <CheckCircle size={40} />
                  ACERTOU!
                </button>
                <button onClick={() => handleResult(false)}
                  className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl font-black text-xl border-4 border-red-500 bg-red-700 text-white transition-all hover:bg-red-600 hover:scale-[1.03] active:scale-95 shadow-lg shadow-red-900/50">
                  <XCircle size={40} />
                  ERROU
                </button>
              </div>
            </div>
          )}

          {/* ── VICTORY ──────────────────────────────────────────────────── */}
          {phase === 'victory' && (
            <div className="flex flex-col items-center gap-6 py-8 text-center">
              <div className="text-7xl animate-bounce">🏆</div>
              <Trophy size={60} className="text-yellow-400" />
              <h3 className="text-3xl font-black text-yellow-400 uppercase tracking-widest">Vencedor!</h3>
              <div className="rounded-2xl border-4 border-yellow-500 bg-yellow-400/10 px-10 py-6 shadow-[0_0_40px_rgba(234,179,8,0.3)]">
                <p className="text-5xl font-black text-white">{teams[currentTeamIdx]?.name}</p>
                <p className="text-yellow-400 font-bold mt-2 text-xl">{teams[currentTeamIdx]?.score} pontos</p>
              </div>
              <div className="w-full flex flex-col gap-2 mt-2">
                {teams.slice().sort((a,b) => b.score - a.score).map((t, i) => (
                  <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                    <span className="text-white/70 font-bold">{i+1}. {t.name}</span>
                    <span className="text-yellow-400 font-black text-xl">{t.score} pts</span>
                  </div>
                ))}
              </div>
              <button onClick={resetGame}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-lg uppercase tracking-widest text-white border-2 border-white/20 hover:bg-white/10 transition-all">
                <RotateCcw size={22} /> Novo Jogo
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default MimicasGame;
