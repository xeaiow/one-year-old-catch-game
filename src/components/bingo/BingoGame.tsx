import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BingoCell from './BingoCell';
import WinningLine from './WinningLine';
import Confetti from './Confetti';
import FloatingDecorations from './FloatingDecorations';

const CDN_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface BingoItem {
  image: string;
  name: string;
  color: string;
}

// Only 2 types of patterns
const kawaiiItemTypes: BingoItem[] = [
  { image: `${CDN_BASE}/cdn/male.avif`, name: '男生', color: 'blue' },     // Pattern 1 (winning pattern)
  { image: `${CDN_BASE}/cdn/female.avif`, name: '女生', color: 'pink' },  // Pattern 2
];

// Fixed grid pattern:
// 男 | 男 | 男
// 男 | 女 | 女
// 女 | 男 | 女
const createBingoItems = (): BingoItem[] => {
  const male = { ...kawaiiItemTypes[0] };
  const female = { ...kawaiiItemTypes[1] };

  return [
    { ...male },   // 0: 男
    { ...male },   // 1: 男
    { ...male },   // 2: 男
    { ...male },   // 3: 男
    { ...female }, // 4: 女
    { ...female }, // 5: 女
    { ...female }, // 6: 女
    { ...male },   // 7: 男
    { ...female }, // 8: 女
  ];
};

interface WinLine {
  type: 'row' | 'col' | 'diag';
  index: number;
  cells: number[];
}

const BingoGame = () => {
  const [items, setItems] = useState<BingoItem[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>(Array(9).fill(false));
  const [winningLines, setWinningLines] = useState<WinLine[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasBingo, setHasBingo] = useState(false);

  useEffect(() => {
    setItems(createBingoItems());
  }, []);

  const checkWin = useCallback((newFlipped: boolean[], currentItems: BingoItem[]) => {
    const lines: WinLine[] = [];

    // Only check the fixed winning row: [0, 1, 2]
    const winningCells = [0, 1, 2];
    const allFlipped = winningCells.every(i => newFlipped[i]);

    if (allFlipped) {
      const firstImage = currentItems[winningCells[0]]?.image;
      const allSame = winningCells.every(i => currentItems[i]?.image === firstImage);
      if (allSame) {
        lines.push({ type: 'row', index: 0, cells: winningCells });
      }
    }

    return lines;
  }, []);

  const handleCellClick = (index: number) => {
    if (hasBingo || flipped[index]) return;

    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    const lines = checkWin(newFlipped, items);
    if (lines.length > 0 && !hasBingo) {
      setTimeout(() => {
        setWinningLines(lines);
        setHasBingo(true);
        setShowConfetti(true);
      }, 450);

      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const getWinningCells = (): Set<number> => {
    const cells = new Set<number>();
    winningLines.forEach(line => line.cells.forEach(cell => cells.add(cell)));
    return cells;
  };

  const winningCells = getWinningCells();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-2 sm:p-4 relative overflow-hidden">
      <FloatingDecorations />

      {/* Polka dot + gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-kawaii-pink/30 via-background to-kawaii-lavender/30" />
        <div className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--primary)) 2px, transparent 2px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Title */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="text-center mb-4"
      >
        <motion.h1 
          className="text-2xl sm:text-4xl font-extrabold mb-1"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-primary drop-shadow-sm">✨ 猜猜看 </span>
          <span className="text-accent-foreground drop-shadow-sm">是男生還是女生 ✨</span>
        </motion.h1>
      </motion.div>

      {/* Bingo Grid - Much larger and prominent */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
        className="relative w-full max-w-[90vw] sm:max-w-[70vmin] md:max-w-[65vmin] lg:max-w-[600px]"
      >
        {/* Grid container with decorative corners */}
        <div className="relative">
          {/* Corner decorations */}
          <motion.span 
            className="absolute -top-6 -left-6 text-2xl sm:text-3xl z-10"
            animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🌟
          </motion.span>
          <motion.span 
            className="absolute -top-6 -right-6 text-2xl sm:text-3xl z-10"
            animate={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            💫
          </motion.span>
          <motion.span 
            className="absolute -bottom-6 -left-6 text-2xl sm:text-3xl z-10"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💕
          </motion.span>
          <motion.span 
            className="absolute -bottom-6 -right-6 text-2xl sm:text-3xl z-10"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            🎀
          </motion.span>

          <div className="relative">
            <div className="grid grid-cols-3 gap-3 sm:gap-4 md:gap-5 p-4 sm:p-6 md:p-8 bg-card/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-primary/20">
              {items.map((item, index) => (
                <BingoCell
                  key={`${item.name}-${index}`}
                  item={item}
                  isFlipped={flipped[index]}
                  isWinning={winningCells.has(index)}
                  onClick={() => handleCellClick(index)}
                  index={index}
                />
              ))}
            </div>

            {/* Winning lines overlay - positioned over the entire grid */}
            <AnimatePresence>
              {winningLines.map((line, i) => (
                <WinningLine key={`${line.type}-${line.index}-${i}`} type={line.type} index={line.index} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Bingo celebration */}
      <AnimatePresence>
        {hasBingo && (
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 12 }}
            className="mt-6 text-center"
          >
            <motion.h2
              animate={{ 
                scale: [1, 1.15, 1],
                rotate: [0, -3, 3, 0],
              }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="text-3xl sm:text-5xl font-extrabold text-primary drop-shadow-lg"
            >
              🎉 BINGO! 🎉
            </motion.h2>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>
    </div>
  );
};

export default BingoGame;
