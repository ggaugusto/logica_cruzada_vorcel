import React, { useEffect, useRef } from 'react';

interface HangmanCanvasProps {
  errors: number;
}

export const HangmanCanvas: React.FC<HangmanCanvasProps> = ({ errors }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Configurações de estilo
    ctx.strokeStyle = '#a1a1aa'; // text-zinc-400
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Base e Haste sempre presentes
    ctx.beginPath();
    ctx.moveTo(20, 240);
    ctx.lineTo(120, 240); // Base
    ctx.moveTo(70, 240);
    ctx.lineTo(70, 20);   // Haste vertical
    ctx.lineTo(150, 20);  // Haste horizontal
    ctx.lineTo(150, 50);  // Corda
    ctx.stroke();

    // Cabeça
    if (errors >= 1) {
      ctx.beginPath();
      ctx.arc(150, 70, 20, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Tronco
    if (errors >= 2) {
      ctx.beginPath();
      ctx.moveTo(150, 90);
      ctx.lineTo(150, 160);
      ctx.stroke();
    }
    // Braço Esquerdo
    if (errors >= 3) {
      ctx.beginPath();
      ctx.moveTo(150, 110);
      ctx.lineTo(120, 140);
      ctx.stroke();
    }
    // Braço Direito
    if (errors >= 4) {
      ctx.beginPath();
      ctx.moveTo(150, 110);
      ctx.lineTo(180, 140);
      ctx.stroke();
    }
    // Perna Esquerda
    if (errors >= 5) {
      ctx.beginPath();
      ctx.moveTo(150, 160);
      ctx.lineTo(120, 210);
      ctx.stroke();
    }
    // Perna Direita
    if (errors >= 6) {
      ctx.beginPath();
      ctx.moveTo(150, 160);
      ctx.lineTo(180, 210);
      ctx.stroke();
    }
  }, [errors]);

  return (
    <div className="flex justify-center items-center bg-[#151515] p-4 rounded border-2 border-dashed border-[#333] shadow-inner mb-6 w-full max-w-sm mx-auto">
      <canvas ref={canvasRef} width={220} height={260} className="max-w-full h-auto" />
    </div>
  );
};
