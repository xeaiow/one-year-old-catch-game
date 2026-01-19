import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BingoCell from './BingoCell';
import WinningLine from './WinningLine';
import Confetti from './Confetti';
import FloatingDecorations from './FloatingDecorations';

interface BingoItem {
  emoji: string;
  name: string;
  color: string;
}

// Only 2 types of patterns
const kawaiiItemTypes: BingoItem[] = [
  { emoji: '🧁', name: 'cupcake', color: 'pink' },   // Pattern 1 (winning pattern)
  { emoji: '😺', name: 'kitty', color: 'peach' },    // Pattern 2
];

// Lines that could form bingo (excluding winning diagonal [0,4,8])
const nonWinningLines = [
  [0, 1, 2], // Row 0
  [3, 4, 5], // Row 1
  [6, 7, 8], // Row 2
  [0, 3, 6], // Col 0
  [1, 4, 7], // Col 1
  [2, 5, 8], // Col 2
  [2, 4, 6], // Anti-diagonal
];

// Check if a configuration would allow non-winning bingo
const wouldCauseInvalidBingo = (items: (BingoItem | null)[]): boolean => {
  const cupcake = kawaiiItemTypes[0].emoji;
  
  for (const line of nonWinningLines) {
    // Skip the winning diagonal
    if (line[0] === 0 && line[1] === 4 && line[2] === 8) continue;
    
    const allCupcakes = line.every(i => items[i]?.emoji === cupcake);
    if (allCupcakes) return true;
  }
  return false;
};

// Create 9 cards: positions 0, 4, 8 are always cupcake
// Other positions are random but ensure no other line can bingo
const createBingoItems = (): BingoItem[] => {
  const items: BingoItem[] = Array(9).fill(null);
  const winningPattern = kawaiiItemTypes[0]; // Pattern 1 (🧁)
  const otherPattern = kawaiiItemTypes[1];   // Pattern 2 (😺)
  
  // Fixed winning diagonal: [0, 4, 8] always have pattern 1
  items[0] = { ...winningPattern };
  items[4] = { ...winningPattern };
  items[8] = { ...winningPattern };
  
  // Other positions get random patterns, but validate no invalid bingo
  const otherPositions = [1, 2, 3, 5, 6, 7];
  
  // Try random assignments until we find a valid configuration
  let attempts = 0;
  do {
    otherPositions.forEach(pos => {
      const randomPattern = kawaiiItemTypes[Math.floor(Math.random() * kawaiiItemTypes.length)];
      items[pos] = { ...randomPattern };
    });
    attempts++;
  } while (wouldCauseInvalidBingo(items) && attempts < 100);
  
  return items;
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

    // Only check the fixed winning diagonal: [0, 4, 8]
    const winningCells = [0, 4, 8];
    const allFlipped = winningCells.every(i => newFlipped[i]);
    
    if (allFlipped) {
      const firstEmoji = currentItems[winningCells[0]]?.emoji;
      const allSame = winningCells.every(i => currentItems[i]?.emoji === firstEmoji);
      if (allSame) {
        lines.push({ type: 'diag', index: 0, cells: winningCells });
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
