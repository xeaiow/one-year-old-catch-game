import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BingoCell from './BingoCell';
import WinningLine from './WinningLine';
import Confetti from './Confetti';
import FloatingDecorations from './FloatingDecorations';
import { fetchRandomPlayer, RandomPlayer } from '@/lib/api';

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
  const [selectedPlayer, setSelectedPlayer] = useState<RandomPlayer | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    setItems(createBingoItems());
  }, []);

  const handlePullLever = async () => {
    if (isPulling) return;

    setIsPulling(true);
    setIsSpinning(true);
    setSelectedPlayer(null);

    // Simulate spinning effect
    setTimeout(async () => {
      try {
        const player = await fetchRandomPlayer();
        setSelectedPlayer(player);
      } catch (error) {
        console.error("Failed to fetch random player:", error);
      } finally {
        setIsSpinning(false);
        setTimeout(() => setIsPulling(false), 300);
      }
    }, 800);
  };

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

      {/* Main content with lever and grid */}
      <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 w-full">
        {/* Left side - Kawaii random player */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
          className="flex flex-col items-center gap-3"
        >
          {/* Avatar display */}
          <div className="relative p-3">
            <AnimatePresence mode="wait">
              {isSpinning ? (
                <motion.div
                  key="spinning"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/80 flex items-center justify-center"
                >
                  <motion.span
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                    className="text-3xl"
                  >
                    ❓
                  </motion.span>
                </motion.div>
              ) : selectedPlayer ? (
                <motion.div
                  key="player"
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: [0, 3, -3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-3 border-white shadow-lg"
                    >
                      <img
                        src={`https://tapback.co/api/avatar/${selectedPlayer.avatar_seed}.webp`}
                        alt={selectedPlayer.player_name}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ delay: 0.3 }}
                      className="absolute -top-1 -right-1 text-xl"
                    >
                      💖
                    </motion.span>
                  </div>
                  <motion.span
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-sm font-bold text-pink-600 mt-2 bg-white/80 px-3 py-1 rounded-full"
                  >
                    {selectedPlayer.player_name}
                  </motion.span>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/50 flex items-center justify-center border-2 border-dashed border-pink-300"
                >
                  <span className="text-3xl opacity-50">❓</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Draw button */}
          <motion.button
            onClick={handlePullLever}
            disabled={isPulling}
            whileHover={{ scale: isPulling ? 1 : 1.1 }}
            whileTap={{ scale: isPulling ? 1 : 0.9 }}
            className="px-5 py-2.5 relative"
          >
            {/* Sparkle particles when spinning */}
            <AnimatePresence>
              {isPulling && (
                <>
                  {[...Array(6)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                      animate={{
                        opacity: [1, 0],
                        scale: [0, 1],
                        x: [0, (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 20)],
                        y: [0, (i < 3 ? -1 : 1) * (15 + Math.random() * 15)],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                      className="absolute text-sm pointer-events-none"
                      style={{ left: '50%', top: '50%' }}
                    >
                      {['✨', '💫', '⭐', '🌟', '💖', '✧'][i]}
                    </motion.span>
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Dice */}
            <motion.span
              animate={isPulling ? {
                rotate: [0, 360],
                scale: [1, 1.3, 1.1, 1.2, 1],
                y: [0, -15, 0, -10, 0],
              } : {
                scale: [1, 1.08, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={isPulling ? {
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              } : {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="flex items-center gap-2 text-3xl"
            >
              🎲
            </motion.span>
          </motion.button>
        </motion.div>

        {/* Bingo Grid - Much larger and prominent */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
          className="relative w-full max-w-[70vw] sm:max-w-[60vmin] md:max-w-[55vmin] lg:max-w-[500px]"
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
      </div>

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
