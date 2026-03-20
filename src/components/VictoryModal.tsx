import React from 'react';
import { useGridStore } from '../store/useGridStore';
import { Trophy, FileCheck, X } from 'lucide-react';

export const VictoryModal: React.FC<{ data: any[][], onClose: () => void }> = ({ data, onClose }) => {
  const categories = useGridStore(state => state.categories);
  const caseName = useGridStore(state => state.caseName);

  return (
    <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-emerald-900/50 p-6 sm:p-8 rounded-lg w-full max-w-2xl shadow-2xl flex flex-col gap-6 relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center gap-2">
          <div className="w-16 h-16 rounded-full bg-emerald-900/40 flex items-center justify-center border border-emerald-500/50 text-emerald-400 mb-2">
            <Trophy size={32} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-widest text-emerald-500 drop-shadow-sm">Caso Resolvido!</h2>
          <p className="text-zinc-400 font-mono">Resumo oficial das descobertas do caso: <strong className="text-zinc-200">{caseName}</strong></p>
        </div>

        <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-md max-h-[50vh] overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-zinc-800 text-zinc-500 uppercase tracking-widest text-xs font-bold">
            <FileCheck size={16} className="text-emerald-600" />
            Parecer Investigativo
          </div>
          
          {data.map((combo, i) => (
            <div key={i} className="p-3 bg-zinc-900 border-l-4 border-emerald-600 rounded mb-3 font-mono text-xs sm:text-sm text-zinc-300 leading-relaxed shadow bg-gradient-to-r from-emerald-900/10 to-transparent">
              <div className="flex items-center float-left mr-2">
                 <span className="text-emerald-500 font-bold text-lg leading-none">✓</span>
              </div>
              De acordo com os fatos analisados, <strong className="text-white">{combo[0].name}</strong> <span className="text-zinc-500 text-[10px]">[{categories[0].name.toUpperCase()}]</span> 
              {combo.length > 1 ? ' confirma ligação com: ' : ''}
              
              {combo.slice(1).map((item: any, idx: number, arr: any[]) => (
                <span key={item.id}>
                  {idx > 0 && idx < arr.length - 1 && ', '}
                  {idx > 0 && idx === arr.length - 1 && ' e '}
                  <strong className="text-emerald-400">{item.name}</strong> <span className="text-zinc-500 text-[10px]">[{categories[idx+1].name.toUpperCase()}]</span>
                </span>
              ))}
              .
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded font-bold tracking-widest uppercase transition-colors shadow-[0_0_10px_rgba(4,120,87,0.5)]"
        >
          Fechar Relatório
        </button>
      </div>
    </div>
  );
};
