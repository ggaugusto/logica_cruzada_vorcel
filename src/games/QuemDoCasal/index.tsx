import React, { useState, useCallback, useRef } from 'react';
import { Header } from '../../components/Header';
import { Heart, Trophy, RefreshCw, CheckCircle } from 'lucide-react';

// ─── QUESTIONS ────────────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  // Hábitos
  "Quem demora mais no banheiro?",
  "Quem é mais bagunceiro(a)?",
  "Quem esquece as coisas com mais frequência?",
  "Quem dorme mais cedo?",
  "Quem acorda mais tarde?",
  "Quem come mais?",
  "Quem bebe mais água?",
  "Quem é mais viciado(a) no celular?",
  "Quem faz mais barulho comendo?",
  "Quem cheira a roupa antes de colocar na lavanderia?",
  "Quem deixa a torneira aberta escovando os dentes?",
  "Quem joga a toalha na cama?",
  "Quem acende mais luzes pela casa?",
  "Quem deixa pratos na pia mais tempo?",
  "Quem tem o quarto mais bagunçado?",
  "Quem gasta mais tempo escolhendo o que assistir?",
  "Quem troca de canal sem parar?",
  "Quem ronca mais?",
  "Quem pede socorro para abrir potes?",
  "Quem deixa a geladeira aberta mais tempo?",
  // Romance
  "Quem se apaixonou primeiro?",
  "Quem é mais ciumento(a)?",
  "Quem diz 'eu te amo' com mais frequência?",
  "Quem planeja as datas românticas?",
  "Quem é mais carinhoso(a)?",
  "Quem chora mais nos filmes?",
  "Quem enviou a primeira mensagem no chat?",
  "Quem liga/manda mensagem com mais frequência quando estão separados?",
  "Quem pede desculpas primeiro depois de uma briga?",
  "Quem briga mais por besteiras?",
  "Quem é mais teimoso(a)?",
  "Quem fala mais 'quero uma coisa, mas não sei o quê'?",
  "Quem mais lembra de datas importantes?",
  "Quem colocou a foto do casal como papel de parede primeiro?",
  "Quem é mais dramático(a)?",
  // Viagens
  "Quem faz as malas mais cedo?",
  "Quem esquece o passaporte?",
  "Quem escolhe o destino da viagem?",
  "Quem reclama mais no avião?",
  "Quem fotografa tudo na viagem?",
  "Quem perde as coisas em viagens?",
  "Quem quer ficar no hotel em vez de passear?",
  "Quem quer conhecer mais lugares na viagem?",
  "Quem roda o mapa na mão tentando se localizar?",
  "Quem convence o outro a experimentar comida estranha?",
  "Quem reclama mais do cansaço durante um passeio?",
  "Quem dorme mais no carro (ou avião)?",
  "Quem compra mais lembranças da viagem?",
  "Quem planeja o roteiro de cada dia da viagem?",
  // Futuro
  "Quem quer ter mais filhos?",
  "Quem vai trabalhar mais?",
  "Quem vai deixar o trabalho para cuidar dos filhos?",
  "Quem vai ensinar os filhos a andar de bicicleta?",
  "Quem vai levar os filhos ao parque?",
  "Quem vai cozinhar em casa?",
  "Quem vai cuidar das finanças do casal?",
  "Quem vai se aposentar primeiro?",
  "Quem vai nadar na piscina da casa própria primeiro?",
  "Quem vai plantar uma horta em casa?",
  "Quem vai adotar mais animais?",
  "Quem vai decorar a casa?",
  "Quem vai querer morar perto dos pais?",
  // Gostos pessoais
  "Quem prefere doce a salgado?",
  "Quem é mais elétrico(a) em festas?",
  "Quem prefere ficar em casa a sair?",
  "Quem prefere série a filme?",
  "Quem tem gosto musical mais eclético?",
  "Quem canta mais no chuveiro?",
  "Quem dança melhor?",
  "Quem é mais engraçado(a)?",
  "Quem tem mais amigos?",
  "Quem é mais tímido(a)?",
  "Quem gosta mais de animais?",
  "Quem prefere praia a montanha?",
  "Quem prefere frio a calor?",
  "Quem gasta mais dinheiro em roupas?",
  "Quem é mais econômico(a)?",
  "Quem assiste mais reality shows?",
  "Quem sabe mais fofoca?",
  "Quem é mais organizado(a)?",
  "Quem tem mais sapatos?",
  "Quem é mais vaidoso(a)?",
  // Situações engraçadas
  "Quem diria 'e a culpa não é minha' primeiro?",
  "Quem pede desculpa com chocolate?",
  "Quem come a comida do outro prato no restaurante?",
  "Quem é o rei/rainha da desculpa esfarrapada?",
  "Quem tem mais medo do escuro?",
  "Quem tem mais medo de barata?",
  "Quem grita mais assustando o outro por brincadeira?",
  "Quem vai usar o banheiro do outro no velório?",
  "Quem ia sobreviver mais tempo sozinho(a) numa ilha deserta?",
  "Quem iria comprar mais coisa no 'só vou dar uma olhadinha'?",
  "Quem não resistiria a estragar a surpresa?",
  "Quem chegaria mais cedo num aeroporto por precaução?",
  "Quem vai fazer o discurso mais longo no casamento dos filhos?",
  "Quem vai virar aquele avô/avó chato que dá conselho não pedido?",
  "Quem seria mais likely de entrar em reality show?",
  // Convivência
  "Quem cede mais ao outro?",
  "Quem toma decisões mais rápido?",
  "Quem manda mais no controle remoto?",
  "Quem escolhe o restaurante?",
  "Quem paga mais vezes a conta?",
  "Quem é o motorista oficial do casal?",
  "Quem monta os móveis de kit?",
  "Quem chama o técnico quando algo quebra?",
  "Quem reclama mais do outro para os amigos?",
  "Quem defende o outro com mais fervor?",
];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Vote = 'p1' | 'p2' | null;
interface Round {
  question: string;
  vote1: Vote;
  vote2: Vote;
  synced: boolean;
}

interface PlayerConfig { name1: string; name2: string; }

const TOTAL_ROUNDS = 15;

// ─── COMPONENT ────────────────────────────────────────────────────────────────
interface Props { onBack?: () => void; }

type Phase = 'config' | 'playing' | 'results';

export const QuemDoCasalGame: React.FC<Props> = ({ onBack }) => {
  const [phase, setPhase] = useState<Phase>('config');
  const [players, setPlayers] = useState<PlayerConfig>({ name1: 'Jogador 1', name2: 'Jogador 2' });
  const [questions, setQuestions] = useState<string[]>([]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [vote1, setVote1] = useState<Vote>(null);
  const [vote2, setVote2] = useState<Vote>(null);
  const [revealed, setRevealed] = useState(false);

  const inputRef1 = useRef<HTMLInputElement>(null);
  const inputRef2 = useRef<HTMLInputElement>(null);

  const startGame = () => {
    const q = shuffle(ALL_QUESTIONS).slice(0, TOTAL_ROUNDS);
    setQuestions(q);
    setRounds([]);
    setCurrentIdx(0);
    setVote1(null);
    setVote2(null);
    setRevealed(false);
    setPhase('playing');
  };

  const handleVote = useCallback((player: 1 | 2, choice: 'p1' | 'p2') => {
    let newVote1 = player === 1 ? choice : vote1;
    let newVote2 = player === 2 ? choice : vote2;
    if (player === 1) setVote1(choice);
    if (player === 2) setVote2(choice);

    if (newVote1 && newVote2) {
      setTimeout(() => setRevealed(true), 400);
    }
  }, [vote1, vote2]);

  const nextRound = () => {
    const synced = vote1 === vote2;
    setRounds(prev => [...prev, {
      question: questions[currentIdx],
      vote1, vote2, synced
    }]);

    if (currentIdx + 1 >= TOTAL_ROUNDS) {
      setPhase('results');
      return;
    }

    setCurrentIdx(i => i + 1);
    setVote1(null);
    setVote2(null);
    setRevealed(false);
  };

  const syncedCount = rounds.filter(r => r.synced).length;
  const getSynchroMessage = (count: number) => {
    if (count >= 13) return { msg: "💑 Vocês estão completamente em sintonia! Amor perfeito!", color: "text-pink-400" };
    if (count >= 10) return { msg: "💖 A sintonia de vocês é incrível! Quase telepáticos!", color: "text-pink-300" };
    if (count >= 7)  return { msg: "💗 Casal combinado! Boas chances de um futuro juntos!", color: "text-rose-300" };
    if (count >= 4)  return { msg: "😄 Ainda têm muito para descobrir um do outro — e que delícia!", color: "text-orange-400" };
    return { msg: "😂 Vão precisar de muitas mais noites conversando! Mas amam um ao outro!", color: "text-yellow-400" };
  };

  const voteLabel = (v: Vote) => v === 'p1' ? players.name1 : v === 'p2' ? players.name2 : '—';

  const current = questions[currentIdx];

  return (
    <div className="min-h-screen font-sans flex flex-col selection:bg-pink-900/50"
      style={{ background: 'linear-gradient(135deg, #1a0a12 0%, #1a0a1f 50%, #0a0a1a 100%)' }}>
      <Header onBack={onBack} title="Quem do Casal...?" hideGameActions />

      <main className="flex-1 p-3 sm:p-6 flex flex-col items-center justify-center overflow-auto">
        <div className="max-w-md w-full">

          {/* ── CONFIG ── */}
          {phase === 'config' && (
            <div className="bg-[#1a0a1a] border border-pink-900/40 rounded-2xl p-6 sm:p-10 flex flex-col items-center gap-6 shadow-[0_0_40px_rgba(236,72,153,0.15)] text-center">
              <div className="text-5xl">💑</div>
              <h2 className="text-2xl font-bold text-pink-300 tracking-widest uppercase">Quem do Casal...?</h2>
              <p className="text-sm text-zinc-500">Descubram o quanto se conhecem! Respondam ao mesmo tempo sobre a relação de vocês.</p>
              <div className="w-full flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs text-pink-400 uppercase tracking-wider font-bold">Nome do Jogador 1</label>
                  <input ref={inputRef1} value={players.name1}
                    onChange={e => setPlayers(p => ({ ...p, name1: e.target.value || 'Jogador 1' }))}
                    className="bg-[#2a0a2a] border border-pink-900/50 text-white rounded-lg px-4 py-3 outline-none focus:border-pink-600 transition-colors text-center text-lg font-bold"
                    placeholder="Jogador 1" maxLength={20} />
                </div>
                <div className="flex items-center gap-2 text-pink-800">
                  <div className="flex-1 h-px bg-pink-900/40" />
                  <Heart size={20} className="text-pink-700 fill-pink-900" />
                  <div className="flex-1 h-px bg-pink-900/40" />
                </div>
                <div className="flex flex-col gap-1 text-left">
                  <label className="text-xs text-violet-400 uppercase tracking-wider font-bold">Nome do Jogador 2</label>
                  <input ref={inputRef2} value={players.name2}
                    onChange={e => setPlayers(p => ({ ...p, name2: e.target.value || 'Jogador 2' }))}
                    className="bg-[#0a0a2a] border border-violet-900/50 text-white rounded-lg px-4 py-3 outline-none focus:border-violet-500 transition-colors text-center text-lg font-bold"
                    placeholder="Jogador 2" maxLength={20} />
                </div>
              </div>
              <button onClick={startGame}
                className="w-full mt-2 bg-gradient-to-r from-pink-800 to-violet-800 hover:from-pink-700 hover:to-violet-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-lg transition-all shadow-lg hover:scale-[1.02]">
                💖 Começar
              </button>
              <p className="text-xs text-zinc-600 uppercase tracking-widest">{TOTAL_ROUNDS} perguntas · Votos secretos · Sistema de sintonia</p>
            </div>
          )}

          {/* ── PLAYING ── */}
          {phase === 'playing' && current && (
            <div className="flex flex-col gap-4">
              {/* Progress */}
              <div className="flex items-center justify-between text-xs text-zinc-500 uppercase tracking-widest px-1">
                <span>Rodada {currentIdx + 1} / {TOTAL_ROUNDS}</span>
                <span className="text-pink-600">❤️ {rounds.filter(r => r.synced).length} sintonia(s)</span>
              </div>
              <div className="h-1.5 w-full bg-[#2a1a2a] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-pink-700 to-violet-700 rounded-full transition-all duration-500"
                  style={{ width: `${((currentIdx) / TOTAL_ROUNDS) * 100}%` }} />
              </div>

              {/* Question card */}
              <div className="bg-gradient-to-br from-[#200a20] to-[#0a0a20] border border-pink-900/40 rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_20px_rgba(236,72,153,0.1)]">
                <p className="text-xs text-pink-500/60 uppercase tracking-widest mb-3">Quem do casal...</p>
                <p className="text-lg sm:text-xl font-bold text-white leading-snug">{current}</p>
              </div>

              {/* Voting */}
              <div className="grid grid-cols-2 gap-3">
                {/* Player 1 vote */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-pink-400 font-bold uppercase tracking-wider text-center truncate">{players.name1}</p>
                  {!revealed && vote1 ? (
                    <div className="flex items-center justify-center gap-2 bg-pink-900/30 border border-pink-700/50 rounded-xl py-5 text-pink-300 text-sm font-bold">
                      <CheckCircle size={18} /> Votou!
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button onClick={() => !vote1 && handleVote(1, 'p1')}
                        disabled={!!vote1}
                        className={`py-4 rounded-xl border-2 font-bold text-sm transition-all ${revealed && vote1 === 'p1' ? 'bg-pink-700 border-pink-500 text-white scale-95' : 'bg-[#1a0a1a] border-pink-900/50 text-pink-300 hover:bg-pink-900/30 hover:border-pink-600 disabled:opacity-50'}`}>
                        {players.name1.length > 10 ? players.name1.slice(0, 10) + '…' : players.name1}
                      </button>
                      <button onClick={() => !vote1 && handleVote(1, 'p2')}
                        disabled={!!vote1}
                        className={`py-4 rounded-xl border-2 font-bold text-sm transition-all ${revealed && vote1 === 'p2' ? 'bg-violet-700 border-violet-500 text-white scale-95' : 'bg-[#0a0a1a] border-violet-900/50 text-violet-300 hover:bg-violet-900/30 hover:border-violet-600 disabled:opacity-50'}`}>
                        {players.name2.length > 10 ? players.name2.slice(0, 10) + '…' : players.name2}
                      </button>
                    </div>
                  )}
                </div>

                {/* Player 2 vote */}
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-violet-400 font-bold uppercase tracking-wider text-center truncate">{players.name2}</p>
                  {!revealed && vote2 ? (
                    <div className="flex items-center justify-center gap-2 bg-violet-900/30 border border-violet-700/50 rounded-xl py-5 text-violet-300 text-sm font-bold">
                      <CheckCircle size={18} /> Votou!
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button onClick={() => !vote2 && handleVote(2, 'p1')}
                        disabled={!!vote2}
                        className={`py-4 rounded-xl border-2 font-bold text-sm transition-all ${revealed && vote2 === 'p1' ? 'bg-pink-700 border-pink-500 text-white scale-95' : 'bg-[#1a0a1a] border-pink-900/50 text-pink-300 hover:bg-pink-900/30 hover:border-pink-600 disabled:opacity-50'}`}>
                        {players.name1.length > 10 ? players.name1.slice(0, 10) + '…' : players.name1}
                      </button>
                      <button onClick={() => !vote2 && handleVote(2, 'p2')}
                        disabled={!!vote2}
                        className={`py-4 rounded-xl border-2 font-bold text-sm transition-all ${revealed && vote2 === 'p2' ? 'bg-violet-700 border-violet-500 text-white scale-95' : 'bg-[#0a0a1a] border-violet-900/50 text-violet-300 hover:bg-violet-900/30 hover:border-violet-600 disabled:opacity-50'}`}>
                        {players.name2.length > 10 ? players.name2.slice(0, 10) + '…' : players.name2}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Reveal & Next */}
              {revealed && vote1 && vote2 && (
                <div className={`rounded-2xl p-4 text-center border transition-all animate-in fade-in duration-300 ${vote1 === vote2 ? 'bg-pink-900/30 border-pink-600 shadow-[0_0_15px_rgba(236,72,153,0.2)]' : 'bg-[#1a1a1a] border-[#333]'}`}>
                  <p className="text-sm text-zinc-300 mb-1">
                    <span className="text-pink-300 font-bold">{players.name1}</span> votou em <strong>{voteLabel(vote1)}</strong>
                    &nbsp;·&nbsp;
                    <span className="text-violet-300 font-bold">{players.name2}</span> votou em <strong>{voteLabel(vote2)}</strong>
                  </p>
                  {vote1 === vote2
                    ? <p className="text-pink-400 font-bold text-lg">💕 Em Sintonia!</p>
                    : <p className="text-zinc-500 text-sm">Pensamentos diferentes — é normal!</p>
                  }
                  <button onClick={nextRound}
                    className="mt-3 w-full bg-gradient-to-r from-pink-800 to-violet-800 hover:opacity-90 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all text-sm">
                    {currentIdx + 1 < TOTAL_ROUNDS ? 'Próxima →' : 'Ver Resultado 🏆'}
                  </button>
                </div>
              )}

              {!vote1 && !vote2 && (
                <p className="text-center text-xs text-zinc-600 uppercase tracking-widest animate-pulse">Cada jogador vota no próprio celular ou na própria metade da tela</p>
              )}
            </div>
          )}

          {/* ── RESULTS ── */}
          {phase === 'results' && (
            <div className="flex flex-col gap-5">
              <div className="bg-gradient-to-br from-[#200a20] to-[#0a0a20] border border-pink-900/40 rounded-2xl p-6 text-center shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                <Trophy size={48} className="text-pink-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white uppercase tracking-widest">Resultado Final</h3>
                <div className="mt-4 flex justify-center gap-8">
                  <div>
                    <p className="text-4xl font-black text-pink-400">{syncedCount}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">em sintonia</p>
                  </div>
                  <div className="w-px bg-pink-900/40" />
                  <div>
                    <p className="text-4xl font-black text-zinc-400">{TOTAL_ROUNDS - syncedCount}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">diferentes</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="h-3 w-full bg-[#2a1a2a] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-600 to-violet-600 rounded-full transition-all duration-1000"
                      style={{ width: `${(syncedCount / TOTAL_ROUNDS) * 100}%` }} />
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{Math.round((syncedCount / TOTAL_ROUNDS) * 100)}% de sintonia</p>
                </div>
                <p className={`mt-4 font-semibold text-sm leading-relaxed ${getSynchroMessage(syncedCount).color}`}>
                  {getSynchroMessage(syncedCount).msg}
                </p>
              </div>

              {/* Round-by-round breakdown */}
              <div className="bg-[#150a15] border border-pink-900/30 rounded-2xl p-4 max-h-72 overflow-y-auto">
                <p className="text-xs text-zinc-500 uppercase tracking-widest mb-3 font-bold">Histórico de Respostas</p>
                <ul className="space-y-2">
                  {rounds.map((r, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm py-1 border-b border-[#2a1a2a] last:border-0`}>
                      <span className={`mt-0.5 shrink-0 text-base ${r.synced ? '💕' : '🔸'}`}></span>
                      <div className="flex-1 min-w-0">
                        <p className="text-zinc-300 leading-snug text-xs truncate">{r.question}</p>
                        <p className="text-zinc-600 text-xs mt-0.5">
                          {players.name1}: <span className={r.vote1 === 'p1' ? 'text-pink-400' : 'text-violet-400'}>{voteLabel(r.vote1)}</span>
                          {' '}·{' '}
                          {players.name2}: <span className={r.vote2 === 'p1' ? 'text-pink-400' : 'text-violet-400'}>{voteLabel(r.vote2)}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <button onClick={startGame}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-800 to-violet-800 hover:opacity-90 text-white py-3 rounded-xl font-bold uppercase tracking-wider transition-all text-sm">
                  <RefreshCw size={16} /> Jogar Novamente
                </button>
                <button onClick={() => setPhase('config')}
                  className="flex-1 border border-pink-900/50 text-pink-300 py-3 rounded-xl font-bold uppercase tracking-wider transition-all text-sm hover:bg-pink-900/20">
                  Trocar Nomes
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default QuemDoCasalGame;
