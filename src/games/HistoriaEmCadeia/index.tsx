import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../../components/Header';
import { BookOpen, CheckCircle, RotateCcw, Feather, Download } from 'lucide-react';

import { STORY_STARTERS } from './starters';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const MAX_CHARS = 200;

interface Turn { player: number; text: string; }
interface Props { onBack?: () => void; }
type Phase = 'config' | 'playing' | 'reading';

export const HistoriaEmCadeiaGame: React.FC<Props> = ({ onBack }) => {
  const [phase, setPhase] = useState<Phase>('config');
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState(['Jogador 1', 'Jogador 2', 'Jogador 3', 'Jogador 4']);
  const [starter, setStarter] = useState('');
  const [turns, setTurns] = useState<Turn[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [input, setInput] = useState('');
  const [justAdded, setJustAdded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const storyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phase === 'playing') {
      storyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [turns, phase]);

  const startGame = () => {
    setStarter(pickRandom(STORY_STARTERS));
    setTurns([]);
    setCurrentPlayer(0);
    setInput('');
    setJustAdded(false);
    setPhase('playing');
  };

  const addTurn = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newTurns = [...turns, { player: currentPlayer, text: trimmed }];
    setTurns(newTurns);
    setInput('');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
    setCurrentPlayer(p => (p + 1) % playerCount);
  };

  const finishStory = () => setPhase('reading');

  const exportPDF = () => {
    const authorList = Array.from({ length: playerCount }).map((_, i) => playerNames[i]).join(', ');
    const storyHtml = `<p class="starter">${starter}</p>` +
      turns.map(t => `<p class="turn" style="color:${['#a78bfa','#34d399','#fbbf24','#38bdf8'][t.player % 4]}">${t.text}</p>`).join('');

    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8">
<title>História em Cadeia</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family: 'Lora', Georgia, serif; background: #fdf6e3; color: #3b2a1a; padding: 60px 70px; line-height: 1.9; font-size: 16px; max-width: 800px; margin: 0 auto; }
  h1 { text-align:center; font-size:2rem; color:#78350f; letter-spacing:.2em; text-transform:uppercase; margin-bottom:.5rem; }
  .authors { text-align:center; font-size:.8rem; color:#92400e; letter-spacing:.15em; text-transform:uppercase; margin-bottom:2.5rem; }
  .divider { text-align:center; color:#d97706; font-size:1.5rem; margin:1rem 0 2rem; }
  .starter { font-style:italic; margin-bottom:1.2rem; color:#5c3d1e; }
  .turn { margin-bottom:1rem; }
  .footer { margin-top:3rem; text-align:center; font-size:.75rem; color:#b45309; letter-spacing:.15em; text-transform:uppercase; }
  @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } button { display:none; } }
</style></head><body>
<h1>📜 História em Cadeia</h1>
<p class="authors">Autores: ${authorList}</p>
<div class="divider">✦ ✦ ✦</div>
${storyHtml}
<p class="footer">Criado com Sistema de Entretenimento · ${new Date().toLocaleDateString('pt-BR')}</p>
<script>window.onload=()=>{ window.print(); }<\/script>
</body></html>`;

    const win = window.open('', '_blank', 'width=800,height=700');
    if (win) { win.document.write(html); win.document.close(); }
  };

  const fullStory = starter + ' ' + turns.map(t => t.text).join(' ');

  const PLAYER_COLORS = [
    'text-violet-400 border-violet-700',
    'text-emerald-400 border-emerald-700',
    'text-amber-400 border-amber-700',
    'text-sky-400 border-sky-700',
  ];
  const PLAYER_BG = [
    'bg-violet-900/20',
    'bg-emerald-900/20',
    'bg-amber-900/20',
    'bg-sky-900/20',
  ];

  return (
    <div className="min-h-screen flex flex-col font-serif"
      style={{ background: 'linear-gradient(160deg, #0f0a06 0%, #1a120a 60%, #0a0a0f 100%)' }}>
      <Header onBack={onBack} title="História em Cadeia" hideGameActions />

      <main className="flex-1 p-3 sm:p-6 flex flex-col items-center overflow-auto pb-10">
        <div className="max-w-lg w-full">

          {/* ── CONFIG ── */}
          {phase === 'config' && (
            <div className="bg-[#1a120a]/90 border border-amber-900/40 rounded-2xl p-6 sm:p-10 flex flex-col gap-6 shadow-[0_0_40px_rgba(180,120,40,0.15)]">
              <div className="text-center">
                <div className="text-5xl mb-3">📖</div>
                <h2 className="text-2xl font-bold text-amber-300 tracking-widest uppercase">História em Cadeia</h2>
                <p className="text-sm text-amber-900/80 mt-2 font-sans">Cada jogador adiciona um trecho. Juntos, vocês escrevem algo único.</p>
              </div>

              <div>
                <p className="text-xs text-amber-700 uppercase tracking-widest font-sans font-bold mb-3">Quantos jogadores?</p>
                <div className="flex gap-3 justify-center">
                  {[2, 3, 4].map(n => (
                    <button key={n} onClick={() => setPlayerCount(n)}
                      className={`w-14 h-14 rounded-xl border-2 font-bold text-xl transition-all ${playerCount === n ? 'bg-amber-800/60 border-amber-500 text-amber-200 scale-105' : 'border-amber-900/40 text-amber-700 hover:border-amber-700'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {Array.from({ length: playerCount }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <label className={`text-xs uppercase tracking-wider font-bold font-sans ${PLAYER_COLORS[i].split(' ')[0]}`}>
                      Jogador {i + 1}
                    </label>
                    <input value={playerNames[i]}
                      onChange={e => { const names = [...playerNames]; names[i] = e.target.value || `Jogador ${i+1}`; setPlayerNames(names); }}
                      maxLength={20}
                      className="bg-[#120c06] border border-amber-900/40 text-amber-100 rounded-lg px-4 py-2.5 outline-none focus:border-amber-600 transition-colors font-sans text-base"
                    />
                  </div>
                ))}
              </div>

              <button onClick={startGame}
                className="w-full bg-gradient-to-r from-amber-900 to-yellow-900 hover:from-amber-800 hover:to-yellow-800 text-amber-100 py-4 rounded-xl font-bold uppercase tracking-widest text-base transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2">
                <Feather size={20} /> Começar a Escrever
              </button>
            </div>
          )}

          {/* ── PLAYING ── */}
          {phase === 'playing' && (
            <div className="flex flex-col gap-4">
              {/* Turn counter – no limit */}
              <div className="flex justify-between items-center text-xs font-sans text-amber-800 uppercase tracking-wider px-1">
                <span>Trechos: {turns.length}</span>
                <span>Vez de: <span className={`font-bold ${PLAYER_COLORS[currentPlayer].split(' ')[0]}`}>{playerNames[currentPlayer]}</span></span>
              </div>

              {/* Story accumulator */}
              <div className="bg-[#1a120a]/80 border border-amber-900/30 rounded-2xl p-5 sm:p-7 shadow-inner">
                <div className="flex items-center gap-2 mb-4 border-b border-amber-900/30 pb-3">
                  <BookOpen size={16} className="text-amber-700" />
                  <p className="text-xs text-amber-800 uppercase tracking-widest font-sans font-bold">A história até agora</p>
                </div>
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-amber-200/80 leading-relaxed text-base italic flex-1">{starter}</p>
                    {turns.length === 0 && (
                      <button 
                        onClick={() => setStarter(pickRandom(STORY_STARTERS))}
                        className="p-1.5 rounded-lg border border-amber-900/40 text-amber-700 hover:text-amber-400 hover:border-amber-700 transition-all"
                        title="Sugerir outra frase"
                      >
                        <RotateCcw size={14} />
                      </button>
                    )}
                  </div>
                  {turns.map((t, i) => (
                    <p key={i}
                      className={`leading-relaxed text-base transition-all duration-500 ${i === turns.length - 1 && justAdded ? 'animate-in fade-in slide-in-from-bottom-2 duration-500' : ''} ${PLAYER_COLORS[t.player % 4].split(' ')[0]}`}>
                      {t.text}
                    </p>
                  ))}
                  <div ref={storyEndRef} />
                </div>
              </div>

              {/* Input area */}
              <div className={`rounded-2xl border-2 p-4 transition-all ${PLAYER_BG[currentPlayer]} ${PLAYER_COLORS[currentPlayer].split(' ')[1]}`}>
                <p className={`text-xs font-sans font-bold uppercase tracking-wider mb-2 ${PLAYER_COLORS[currentPlayer].split(' ')[0]}`}>
                  {playerNames[currentPlayer]}, continue a história:
                </p>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => setInput(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) addTurn(); }}
                  rows={3}
                  placeholder="Adicione o próximo trecho da história..."
                  className="w-full bg-black/20 text-amber-100 rounded-xl p-3 outline-none resize-none text-base leading-relaxed font-serif placeholder:text-amber-900/60 border border-transparent focus:border-amber-700/50 transition-colors"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-xs font-sans ${input.length > MAX_CHARS * 0.85 ? 'text-red-400' : 'text-amber-800'}`}>
                    {input.length} / {MAX_CHARS}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={finishStory}
                      className="text-xs border border-amber-900/50 text-amber-700 hover:text-amber-400 px-3 py-1.5 rounded-lg font-sans uppercase tracking-wider transition-colors">
                      Finalizar
                    </button>
                    <button
                      onClick={addTurn}
                      disabled={!input.trim()}
                      className="flex items-center gap-2 bg-amber-800 hover:bg-amber-700 disabled:opacity-30 text-amber-100 px-5 py-2 rounded-lg font-sans font-bold uppercase tracking-wider transition-all text-sm">
                      <CheckCircle size={16} /> Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {justAdded && (
                <div className="text-center text-sm font-sans text-amber-600 animate-in fade-in duration-300 uppercase tracking-widest">
                  ✦ Passe para o próximo jogador ✦
                </div>
              )}
            </div>
          )}

          {/* ── READING ── */}
          {phase === 'reading' && (
            <div className="flex flex-col gap-6">
              <div className="bg-[#1a120a] border border-amber-700/40 rounded-2xl p-6 sm:p-10 shadow-[0_0_30px_rgba(180,120,40,0.2)]">
                <div className="text-center border-b border-amber-900/40 pb-5 mb-6">
                  <div className="text-4xl mb-2">📜</div>
                  <h3 className="text-xl font-bold text-amber-300 uppercase tracking-widest">A História Completa</h3>
                  <p className="text-xs text-amber-800 font-sans uppercase tracking-widest mt-1">{turns.length + 1} trechos · {playerCount} autores</p>
                </div>
                <div className="leading-8 text-amber-100/90 text-base sm:text-lg whitespace-pre-wrap">
                  {fullStory}
                </div>
                <div className="mt-6 pt-4 border-t border-amber-900/40 flex flex-wrap gap-3 justify-center">
                  {Array.from({ length: playerCount }).map((_, i) => (
                    <span key={i} className={`text-xs font-sans px-3 py-1 rounded-full border ${PLAYER_COLORS[i]} ${PLAYER_BG[i]}`}>
                      {playerNames[i]}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={startGame}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-900 to-yellow-900 hover:opacity-90 text-amber-100 py-3 rounded-xl font-sans font-bold uppercase tracking-wider transition-all">
                  <RotateCcw size={16} /> Nova História
                </button>
                <button onClick={() => setPhase('config')}
                  className="flex-1 border border-amber-900/40 text-amber-700 hover:text-amber-400 py-3 rounded-xl font-sans font-bold uppercase tracking-wider transition-all">
                  Trocar Jogadores
                </button>
              </div>
              <button onClick={exportPDF}
                className="w-full flex items-center justify-center gap-2 bg-[#1a1200] hover:bg-[#2a1a00] border-2 border-amber-700/60 text-amber-400 py-3 rounded-xl font-sans font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-amber-900/40">
                <Download size={18} /> Salvar como PDF
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default HistoriaEmCadeiaGame;
