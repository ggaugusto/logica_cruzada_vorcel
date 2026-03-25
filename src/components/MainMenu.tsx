import React from 'react';
import { Search, Lock, ShieldAlert, Grid3x3, Hash, Tv, Heart, Feather, Users } from 'lucide-react';

interface MainMenuProps {
  onSelectGame: (gameId: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="min-h-screen app-bg text-[var(--color-murdle-text)] font-mono flex flex-col items-center justify-center p-4 selection:bg-red-900/50">
      
      <div className="max-w-4xl w-full bg-[var(--color-murdle-dossier)] p-6 sm:p-12 rounded-sm border-2 border-[var(--color-murdle-grid-border)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-900 via-yellow-700 to-red-900 opacity-60"></div>
        <div className="absolute top-4 left-4 flex gap-2 opacity-60">
          <div className="w-3 h-3 rounded-full bg-red-800 border-t border-red-500 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-orange-800 border-t border-orange-500 shadow-sm"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-800 border-t border-emerald-500 shadow-sm"></div>
        </div>

        <div className="text-center mb-12 mt-4">
          <div className="flex justify-center mb-4">
            <ShieldAlert size={48} className="text-red-800/80" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-[0.2em] uppercase text-zinc-200 drop-shadow-md">
            SISTEMA DE ENTRETENIMENTO
          </h1>
          <p className="text-zinc-500 mt-4 tracking-widest text-sm uppercase">Selecione um módulo para iniciar</p>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-red-900/50 to-transparent mt-8"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Lógica Cruzada */}
          <button 
            onClick={() => onSelectGame('logica-cruzada')}
            className="group relative flex flex-col items-center text-center bg-[#1a1a1a] hover:bg-[#222] border-2 border-[#333] hover:border-red-900/50 p-8 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:-translate-y-1"
          >
            <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-900/30 flex items-center justify-center mb-4 group-hover:bg-red-900/40 group-hover:border-red-500/50 transition-colors">
              <Search size={32} className="text-red-500/80 group-hover:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2 tracking-wider uppercase">Lógica Cruzada</h2>
            <p className="text-sm text-gray-500">Resolva mistérios usando dedução lógica em um painel interativo cruzado.</p>
            <div className="mt-6 px-3 py-1 bg-green-900/20 border border-green-900/50 text-green-500 text-xs rounded uppercase tracking-wider">
              Módulo Ativo
            </div>
          </button>

          {/* Card: Forca */}
          <button 
            onClick={() => onSelectGame('forca')}
            className="group relative flex flex-col items-center text-center bg-[#1a1a1a] hover:bg-[#222] border-2 border-[#333] hover:border-red-900/50 p-8 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:-translate-y-1"
          >
            <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-900/30 flex items-center justify-center mb-4 group-hover:bg-red-900/40 group-hover:border-red-500/50 transition-colors">
              <Lock size={32} className="text-red-500/80 group-hover:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2 tracking-wider uppercase">Jogo da Forca</h2>
            <p className="text-sm text-gray-500">Salve o Godofredo deduzindo a palavra secreta antes que seja tarde. 2 Jogadores.</p>
            <div className="mt-6 px-3 py-1 bg-green-900/20 border border-green-900/50 text-green-500 text-xs rounded uppercase tracking-wider">
              Módulo Ativo
            </div>
          </button>

          {/* Card: Palavras Cruzadas */}
          <button 
            onClick={() => onSelectGame('cruzadas')}
            className="group relative flex flex-col items-center text-center bg-[#1a1a1a] hover:bg-[#222] border-2 border-[#333] hover:border-red-900/50 p-8 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:-translate-y-1 md:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-900/30 flex items-center justify-center mb-4 group-hover:bg-red-900/40 group-hover:border-red-500/50 transition-colors">
              <Grid3x3 size={32} className="text-red-500/80 group-hover:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2 tracking-wider uppercase">Palavras Cruzadas</h2>
            <p className="text-sm text-gray-500">Insira um tema para gerar quebra-cabeças infinitos baseados na enciclopédia global livre.</p>
            <div className="mt-6 px-3 py-1 bg-green-900/20 border border-green-900/50 text-green-500 text-xs rounded uppercase tracking-wider">
              Módulo Dinâmico
            </div>
          </button>

          {/* Card: Sudoku */}
          <button 
            onClick={() => onSelectGame('sudoku')}
            className="group relative flex flex-col items-center text-center bg-[#1a1a1a] hover:bg-[#222] border-2 border-[#333] hover:border-red-900/50 p-8 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:-translate-y-1 md:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 rounded-full bg-red-950/30 border border-red-900/30 flex items-center justify-center mb-4 group-hover:bg-red-900/40 group-hover:border-red-500/50 transition-colors">
              <Hash size={32} className="text-red-500/80 group-hover:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2 tracking-wider uppercase">Sudoku</h2>
            <p className="text-sm text-gray-500">Grade 9×9 clássica proceduralmente gerada. 5 níveis de dificuldade, cronômetro e dicas.</p>
            <div className="mt-6 px-3 py-1 bg-green-900/20 border border-green-900/50 text-green-500 text-xs rounded uppercase tracking-wider">
              Módulo Ativo
            </div>
          </button>

          {/* Card: Show do Milhão */}
          <button 
            onClick={() => onSelectGame('milhao')}
            className="group relative flex flex-col items-center text-center bg-[#1a1a1a] hover:bg-[#222] border-2 border-[#333] hover:border-indigo-900/50 p-8 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] hover:-translate-y-1 md:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 rounded-full bg-indigo-950/30 border border-indigo-900/30 flex items-center justify-center mb-4 group-hover:bg-indigo-900/40 group-hover:border-indigo-500/50 transition-colors">
              <Tv size={32} className="text-indigo-400/80 group-hover:text-indigo-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2 tracking-wider uppercase">Perguntas e Respostas</h2>
            <p className="text-sm text-gray-500">15 perguntas dinâmicas da Wikipédia. Acumule Ouro, Prata e Bronze. Um erro e você perde tudo!</p>
            <div className="mt-6 px-3 py-1 bg-indigo-900/20 border border-indigo-900/50 text-indigo-400 text-xs rounded uppercase tracking-wider">
              Quiz Dinâmico
            </div>
          </button>

          {/* Card: Quem do Casal */}
          <button 
            onClick={() => onSelectGame('casal')}
            className="group relative flex flex-col items-center text-center bg-[#1a0a1a] hover:bg-[#2a0a2a] border-2 border-[#2a0a2a] hover:border-pink-900/60 p-8 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)] hover:-translate-y-1 md:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 rounded-full bg-pink-950/30 border border-pink-900/30 flex items-center justify-center mb-4 group-hover:bg-pink-900/40 group-hover:border-pink-500/50 transition-colors">
              <Heart size={32} className="text-pink-500/80 group-hover:text-pink-400 fill-pink-900/60" />
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2 tracking-wider uppercase">Quem do Casal...?</h2>
            <p className="text-sm text-gray-500">Quiz de sintonia para dois jogadores. Votem em segredo e descubram o quanto se conhecem!</p>
            <div className="mt-6 px-3 py-1 bg-pink-900/20 border border-pink-900/50 text-pink-400 text-xs rounded uppercase tracking-wider">
              Modo 2 Jogadores
            </div>
          </button>

          {/* Card: História em Cadeia */}
          <button 
            onClick={() => onSelectGame('historia')}
            className="group relative flex flex-col items-center text-center bg-[#1a1200] hover:bg-[#221900] border-2 border-[#2a1a00] hover:border-amber-900/60 p-8 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(180,120,40,0.15)] hover:-translate-y-1 md:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 rounded-full bg-amber-950/30 border border-amber-900/30 flex items-center justify-center mb-4 group-hover:bg-amber-900/40 group-hover:border-amber-500/50 transition-colors">
              <Feather size={32} className="text-amber-500/80 group-hover:text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2 tracking-wider uppercase">História em Cadeia</h2>
            <p className="text-sm text-gray-500">Criem juntos um conto inédito! Cada jogador adiciona um trecho e a história vai tomando forma.</p>
            <div className="mt-6 px-3 py-1 bg-amber-900/20 border border-amber-900/50 text-amber-500 text-xs rounded uppercase tracking-wider">
              2-4 Jogadores
            </div>
          </button>

          {/* Card: Mímicas */}
          <button 
            onClick={() => onSelectGame('mimicas')}
            className="group relative flex flex-col items-center text-center bg-[#0a001a] hover:bg-[#14002a] border-2 border-[#1a0033] hover:border-violet-800/60 p-8 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:-translate-y-1 md:col-span-2 lg:col-span-1"
          >
            <div className="w-16 h-16 rounded-full bg-violet-950/40 border border-violet-900/30 flex items-center justify-center mb-4 group-hover:bg-violet-900/40 group-hover:border-violet-500/50 transition-colors">
              <Users size={32} className="text-violet-400/80 group-hover:text-violet-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-200 mb-2 tracking-wider uppercase">Mímicas</h2>
            <p className="text-sm text-gray-500">Party game de mímicas com mais de 3.000 palavras em 6 categorias. Cronômetro, equipes e placar em tempo real!</p>
            <div className="mt-6 px-3 py-1 bg-violet-900/20 border border-violet-900/50 text-violet-400 text-xs rounded uppercase tracking-wider">
              Party Game
            </div>
          </button>
        </div>
        
        <div className="mt-12 text-center text-xs text-zinc-600 uppercase tracking-widest flex items-center justify-center gap-2">
          <span>v2.0.0</span>
          <span>•</span>
          <span>Acesso Restrito</span>
        </div>
      </div>
    </div>
  );
};
