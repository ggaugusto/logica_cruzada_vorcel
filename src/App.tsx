import { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { LogicaCruzadaGame } from './games/LogicaCruzada';
import { ForcaGame } from './games/Forca';
import { PalavrasCruzadasGame } from './games/PalavrasCruzadas';
import { SudokuGame } from './games/Sudoku';
import { ShowDoMilhaoGame } from './games/ShowDoMilhao';
import { QuemDoCasalGame } from './games/QuemDoCasal';
import { HistoriaEmCadeiaGame } from './games/HistoriaEmCadeia';
import { MimicasGame } from './games/Mimicas';

function App() {
  const [currentGame, setCurrentGame] = useState<string | null>(null);

  if (!currentGame) {
    return <MainMenu onSelectGame={setCurrentGame} />;
  }

  if (currentGame === 'logica-cruzada') {
    return <LogicaCruzadaGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'forca') {
    return <ForcaGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'cruzadas') {
    return <PalavrasCruzadasGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'sudoku') {
    return <SudokuGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'milhao') {
    return <ShowDoMilhaoGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'casal') {
    return <QuemDoCasalGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'historia') {
    return <HistoriaEmCadeiaGame onBack={() => setCurrentGame(null)} />;
  }

  if (currentGame === 'mimicas') {
    return <MimicasGame onBack={() => setCurrentGame(null)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      Jogo não encontrado.
      <button onClick={() => setCurrentGame(null)} className="ml-4 underline">Voltar</button>
    </div>
  );
}

export default App;
