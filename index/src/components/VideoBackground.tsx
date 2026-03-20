import { useEffect, useRef } from 'react';

interface StockDataPoint {
  x: number;
  y: number;
  prevY: number;
  color: string;
  speed: number;
}

export default function VideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const stockLines: StockDataPoint[][] = [];
    const numLines = 15;
    const pointsPerLine = 80;

    const colors = [
      'rgba(59, 130, 246, 0.6)',
      'rgba(34, 211, 238, 0.5)',
      'rgba(14, 165, 233, 0.5)',
      'rgba(96, 165, 250, 0.4)',
      'rgba(125, 211, 252, 0.4)',
    ];

    for (let i = 0; i < numLines; i++) {
      const line: StockDataPoint[] = [];
      const startY = Math.random() * canvas.height;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const speed = 0.5 + Math.random() * 1.5;

      for (let j = 0; j < pointsPerLine; j++) {
        const x = (j / pointsPerLine) * canvas.width;
        const randomChange = (Math.random() - 0.5) * 60;
        const y = startY + randomChange;

        line.push({
          x,
          y,
          prevY: y,
          color,
          speed,
        });
      }
      stockLines.push(line);
    }

    const candlesticks: Array<{
      x: number;
      y: number;
      height: number;
      width: number;
      color: string;
      speed: number;
    }> = [];

    for (let i = 0; i < 30; i++) {
      candlesticks.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        height: Math.random() * 40 + 20,
        width: 8,
        color: Math.random() > 0.5 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
        speed: 0.3 + Math.random() * 0.7,
      });
    }

    const numbers: Array<{
      x: number;
      y: number;
      value: string;
      speed: number;
      opacity: number;
    }> = [];

    const stockSymbols = ['▲', '▼', '¥', '$', '€', '+', '-', '%'];

    for (let i = 0; i < 25; i++) {
      numbers.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        value: Math.random() > 0.7
          ? stockSymbols[Math.floor(Math.random() * stockSymbols.length)]
          : (Math.random() * 1000).toFixed(2),
        speed: 0.2 + Math.random() * 0.5,
        opacity: 0.1 + Math.random() * 0.2,
      });
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.01;

      stockLines.forEach((line, lineIndex) => {
        ctx.beginPath();
        ctx.strokeStyle = line[0].color;
        ctx.lineWidth = 2;

        line.forEach((point, i) => {
          point.prevY = point.y;
          const wave = Math.sin(time + i * 0.1 + lineIndex) * 30;
          const trend = Math.sin(time * 0.3 + lineIndex) * 50;
          point.y = canvas.height * (0.3 + lineIndex * 0.05) + wave + trend;

          point.x -= point.speed;
          if (point.x < -10) {
            point.x = canvas.width + 10;
          }

          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });

        ctx.stroke();

        ctx.beginPath();
        ctx.strokeStyle = line[0].color.replace('0.6', '0.3').replace('0.5', '0.2').replace('0.4', '0.15');
        ctx.lineWidth = 1;

        line.forEach((point, i) => {
          if (i === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = line[0].color.replace('0.6', '0.05').replace('0.5', '0.03').replace('0.4', '0.02');
        ctx.fill();
      });

      candlesticks.forEach((candle) => {
        candle.x -= candle.speed;
        if (candle.x < -candle.width) {
          candle.x = canvas.width + candle.width;
          candle.y = Math.random() * canvas.height;
          candle.height = Math.random() * 40 + 20;
          candle.color = Math.random() > 0.5 ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
        }

        ctx.fillStyle = candle.color;
        ctx.fillRect(candle.x, candle.y, candle.width, candle.height);

        ctx.strokeStyle = candle.color.replace('0.3', '0.6');
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(candle.x + candle.width / 2, candle.y - 10);
        ctx.lineTo(candle.x + candle.width / 2, candle.y + candle.height + 10);
        ctx.stroke();
      });

      numbers.forEach((num) => {
        num.x -= num.speed;
        if (num.x < -100) {
          num.x = canvas.width + 100;
          num.y = Math.random() * canvas.height;
          num.value = Math.random() > 0.7
            ? stockSymbols[Math.floor(Math.random() * stockSymbols.length)]
            : (Math.random() * 1000).toFixed(2);
        }

        ctx.fillStyle = `rgba(148, 163, 184, ${num.opacity})`;
        ctx.font = '14px monospace';
        ctx.fillText(num.value, num.x, num.y);
      });

      const gridSize = 60;
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.15)';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/50 to-gray-900/60"></div>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[0.5px]"></div>
    </div>
  );
}
