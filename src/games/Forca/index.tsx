import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '../../components/Header';
import { HangmanCanvas } from './HangmanCanvas';
import { VirtualKeyboard } from './VirtualKeyboard';
import { Play, RotateCcw } from 'lucide-react';

interface ForcaGameProps {
  onBack?: () => void;
}

export const ForcaGame: React.FC<ForcaGameProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<'setup' | 'playing' | 'gameover'>('setup');
  const [secretWordInput, setSecretWordInput] = useState('');
  const [secretWord, setSecretWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());

  // Helper para remover acentos e deixar uppercase na verificação
  const normalize = (str: string) => str.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const startGame = () => {
    if (secretWordInput.trim().length === 0) return;
    setSecretWord(secretWordInput.trim());
    setGuessedLetters(new Set());
    setPhase('playing');
  };

  const handleKeyPress = useCallback((key: string) => {
    if (phase !== 'playing') return;
    const upperKey = normalize(key);
    // Ignora se não é uma letra do alfabeto de A-Z
    if (!/^[A-Z]$/.test(upperKey)) return;
    
    setGuessedLetters(prev => {
      if (prev.has(upperKey)) return prev;
      const next = new Set(prev);
      next.add(upperKey);
      return next;
    });
  }, [phase]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Impede captura de coisas como "Enter", "Backspace"
      if (e.key.length === 1) {
        handleKeyPress(e.key);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeyPress]);

  const normalizedSecret = normalize(secretWord);
  const secretChars = secretWord.split('');

  // Conta quantas letras diferentes foram testadas e não estão na palavra secreta normalizada
  const wrongCount = Array.from(guessedLetters).filter(letter => !normalizedSecret.includes(letter)).length;
  
  // Condição de Vitória: Todas as letras [A-Z] da palavra secreta estão no Set de guessedLetters
  const atLeastOneLetter = secretChars.some(c => /[A-Za-z]/.test(normalize(c)));
  const isWinner = atLeastOneLetter && secretChars
    .filter(c => /[A-Za-z]/.test(normalize(c)))
    .every(c => guessedLetters.has(normalize(c)));
    
  const isLoser = wrongCount >= 6;

  useEffect(() => {
    if (phase === 'playing') {
      if (isWinner || isLoser) {
        setPhase('gameover');
      }
    }
  }, [isWinner, isLoser, phase]);

  const resetGame = () => {
    setSecretWordInput('');
    setSecretWord('');
    setGuessedLetters(new Set());
    setPhase('setup');
  };

  return (
    <div className="min-h-screen app-bg text-[var(--color-murdle-text)] font-mono flex flex-col relative selection:bg-red-900/50">
      <Header onBack={onBack} title="Jogo da Forca" hideGameActions />

      <main className="flex-1 p-2 sm:p-8 overflow-auto flex justify-center items-start">
        <div className="max-w-4xl w-full bg-[var(--color-murdle-dossier)] p-4 sm:p-10 rounded-sm border-2 border-[var(--color-murdle-grid-border)] shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative mt-2 sm:mt-10">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-800 opacity-60"></div>

          <div className="text-center mb-8 border-b-2 border-dashed border-[#333] pb-6">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-[0.2em] uppercase text-zinc-300 drop-shadow">Jogo da Forca</h2>
            <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-widest mt-2">
              {phase === 'setup' ? 'Fase 1: Inserção da Senha' : phase === 'playing' ? 'Fase 2: Interrogatório' : 'Caso Encerrado'}
            </p>
          </div>

          {phase === 'setup' && (
            <div className="flex flex-col items-center justify-center gap-6 py-8 sm:py-16">
              <div className="w-full max-w-sm text-center">
                <label className="block text-zinc-400 mb-4 text-sm uppercase tracking-wider font-bold">Jogador 1: Palavra Secreta</label>
                <input 
                  type="password"
                  value={secretWordInput}
                  onChange={e => setSecretWordInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && startGame()}
                  placeholder="DIGITE A PALAVRA..."
                  className="w-full bg-[#1a1a1a] border border-[#444] rounded p-4 text-center text-xl sm:text-2xl text-white outline-none focus:border-red-800 focus:ring-1 focus:ring-red-900 transition-all font-mono tracking-widest shadow-inner mb-4"
                />
                <p className="text-zinc-500 text-xs px-4">
                  Oculte o teclado do Jogador 2 enquanto digita. Apenas letras contam para erros/acertos.
                </p>
              </div>
              <button 
                onClick={startGame}
                disabled={secretWordInput.trim().length === 0}
                className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#3d3d3d] disabled:bg-[#111] disabled:text-zinc-600 disabled:border-[#333] border border-[#555] text-zinc-200 px-8 py-4 rounded font-bold uppercase tracking-wider transition-colors shadow-lg"
              >
                <Play size={20} />
                Iniciar Jogo
              </button>
            </div>
          )}

          {(phase === 'playing' || phase === 'gameover') && (
            <div className="flex flex-col items-center">
              <HangmanCanvas errors={wrongCount} />

              {/* Renderização da Palavra */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-8 max-w-full px-2">
                {secretChars.map((char, index) => {
                  const isLetter = /[A-Za-z]/.test(normalize(char));
                  const isRevealed = !isLetter || guessedLetters.has(normalize(char)) || phase === 'gameover';
                  const isMissedAtEnd = phase === 'gameover' && isLetter && !guessedLetters.has(normalize(char));

                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-10 sm:w-10 sm:h-14 border-b-4 flex items-center justify-center text-2xl sm:text-3xl font-bold uppercase transition-all
                        ${!isLetter ? 'border-transparent text-gray-500' : 'border-gray-500'} 
                        ${isMissedAtEnd ? 'text-red-500' : 'text-gray-100'}`}
                      >
                        {isRevealed ? char : ''}
                      </div>
                    </div>
                  );
                })}
              </div>

              {phase === 'playing' && (
                <VirtualKeyboard 
                  guessedLetters={guessedLetters} 
                  secretWord={secretWord} 
                  onKeyPress={handleKeyPress} 
                />
              )}

              {phase === 'gameover' && (
                <div className={`mt-6 p-6 sm:p-8 rounded-sm flex flex-col items-center gap-4 text-center w-full max-w-lg shadow-[0_5px_15px_rgba(0,0,0,0.5)] border
                  ${isWinner ? 'bg-[#1a2e20] border-[#2d5a3f]' : 'bg-[#2e1a1a] border-[#5a2d2d]'}`}
                >
                  <h3 className={`text-2xl sm:text-3xl font-bold uppercase tracking-wider drop-shadow-sm ${isWinner ? 'text-emerald-400' : 'text-red-500'}`}>
                    {isWinner ? 'Parabéns!' : 'Game Over!'}
                  </h3>
                  <p className="text-gray-300 font-bold mb-2">
                    {isWinner 
                      ? 'Você decifrou o enigma e salvou o Godofredo!'
                      : `O Godofredo foi enforcado. A palavra era: ${secretWord}`}
                  </p>
                  <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 bg-[#222] hover:bg-[#333] border border-[#555] text-white px-6 py-3 rounded uppercase font-bold tracking-wider transition-colors shadow-sm"
                  >
                    <RotateCcw size={18} />
                    Jogar Novamente
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
