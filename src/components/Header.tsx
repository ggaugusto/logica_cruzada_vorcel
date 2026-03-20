import React from 'react';
import { useTranslation } from 'react-i18next';
import { useGridStore } from '../store/useGridStore';
import { RotateCcw, Globe, FilePlus } from 'lucide-react';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const clearGrid = useGridStore(state => state.clearGrid);
  const resetGame = useGridStore(state => state.resetGame);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('app-language', lng);
  };

  return (
    <header className="bg-[#111] border-b border-[#333] p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-red-900 flex items-center justify-center text-white font-bold text-xl border border-red-700 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
          M
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-widest uppercase text-gray-200">
          {t('app_title')}
        </h1>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-[#222] p-1.5 rounded border border-[#444]">
          <Globe size={16} className="text-gray-400 ml-1 hidden sm:block" />
          <select 
            className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer pr-1"
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
          >
            <option value="pt-BR">PT-BR</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
        </div>
        
        <button 
          onClick={() => {
            if(window.confirm('Iniciar nova partida? Isso apagará o quadro e todas as categorias customizadas!')) {
              resetGame();
            }
          }}
          className="flex items-center gap-2 px-3 py-1.5 bg-red-950/30 hover:bg-red-900/60 border border-red-900/50 rounded text-sm transition-colors text-red-400"
        >
          <FilePlus size={16} />
          <span className="hidden sm:inline">Nova Partida</span>
        </button>
        <button 
          onClick={clearGrid}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#3d3d3d] border border-[#555] rounded text-sm transition-colors text-gray-200"
        >
          <RotateCcw size={16} className="text-red-400" />
          <span className="hidden sm:inline">{t('clear_grid')}</span>
        </button>
      </div>
    </header>
  );
};
