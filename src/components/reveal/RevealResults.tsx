import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GuessCell from '../guess/GuessCell';
import FloatingDecorations from '../bingo/FloatingDecorations';
import { fetchItems, fetchMatches, Item, MatchedPlayer, MatchesResult } from '@/lib/api';

const MAX_SELECTIONS = 3;

type Step = 'items' | 'results';

const RevealResults = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [step, setStep] = useState<Step>('items');
  const [matchesResult, setMatchesResult] = useState<MatchesResult | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  // Fetch items from API
  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await fetchItems();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      } finally {
        setIsLoadingItems(false);
      }
    };
    loadItems();
  }, []);

  const isItemsComplete = selectedItemIds.length >= MAX_SELECTIONS;

  const handleCellClick = (itemId: string) => {
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter(id => id !== itemId));
      return;
    }

    if (isItemsComplete) return;

    setSelectedItemIds([...selectedItemIds, itemId]);
  };

  const handleReveal = async () => {
    if (!isItemsComplete) return;

    setIsLoadingResults(true);
    try {
      const result = await fetchMatches(selectedItemIds);
      setMatchesResult(result);
      setStep('results');
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleReset = () => {
    setStep('items');
    setSelectedItemIds([]);
    setMatchesResult(null);
  };

  // Get selected item names for display
  const selectedItemNames = selectedItemIds.map(id => {
    const item = items.find(i => i.id === id);
    return item?.name || '';
  });

  // Loading state
  if (isLoadingItems) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kawaii-pink/20 via-background to-kawaii-lavender/20">
        <motion.div
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-kawaii-pink border-t-kawaii-lavender border-r-kawaii-mint rounded-full mx-auto mb-4"
          />
          <motion.p
            className="text-muted-foreground text-lg"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ✨ 載入中... ✨
          </motion.p>
        </motion.div>
      </div>
    );
  }

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

      <AnimatePresence mode="wait">
        {step === 'items' ? (
          <motion.div
            key="items-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
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
                <span className="text-primary drop-shadow-sm">🎯 揭曉 </span>
                <span className="text-accent-foreground drop-shadow-sm">涵晞抓了什麼 🎯</span>
              </motion.h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                {isItemsComplete ? '選擇完成！點擊揭曉結果' : `選擇涵晞抓的 ${MAX_SELECTIONS} 個物品`}
              </p>
            </motion.div>

            {/* Grid */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="relative w-full max-w-[95vw] sm:max-w-[85vmin] md:max-w-[80vmin] lg:max-w-[800px]"
            >
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
                  <div className="grid grid-cols-4 gap-3 sm:gap-4 md:gap-5 p-4 sm:p-6 md:p-8 bg-card/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-primary/20">
                    {items.map((item, index) => (
                      <GuessCell
                        key={item.id}
                        item={{
                          id: index,
                          name: item.name,
                          src: item.image_url,
                        }}
                        isSelected={selectedItemIds.includes(item.id)}
                        onClick={() => handleCellClick(item.id)}
                        index={index}
                        disabled={isItemsComplete && !selectedItemIds.includes(item.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reveal button */}
            <AnimatePresence>
              {isItemsComplete && (
                <motion.button
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(330 100% 70% / 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  onClick={handleReveal}
                  disabled={isLoadingResults}
                  className="mt-6 px-10 py-4 bg-gradient-to-r from-kawaii-pink via-kawaii-peach to-kawaii-yellow text-foreground rounded-full font-bold text-xl shadow-xl border-2 border-white/50 disabled:opacity-50 kawaii-shadow"
                >
                  {isLoadingResults ? '✨ 載入中... ✨' : '🎉 揭曉結果 🎉'}
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="results-step"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full max-w-4xl px-4 relative"
          >
            {/* Floating corner decorations for results */}
            <motion.span
              className="absolute -top-4 left-0 text-3xl"
              animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🎀
            </motion.span>
            <motion.span
              className="absolute -top-4 right-0 text-3xl"
              animate={{ y: [0, -8, 0], rotate: [5, -5, 5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              💖
            </motion.span>

            {/* Title */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="text-center mb-6"
            >
              <motion.h1
                className="text-3xl sm:text-5xl font-extrabold mb-2"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-foreground drop-shadow-lg">🎊 結果揭曉 🎊</span>
              </motion.h1>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                <span className="text-muted-foreground text-sm sm:text-base">涵晞抓了：</span>
                {selectedItemNames.map((name, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                    whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
                    className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold bg-gradient-to-r from-kawaii-pink to-kawaii-peach text-foreground shadow-lg border-2 border-white/50 kawaii-shadow"
                  >
                    ✨ {name}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Results sections */}
            <div className="w-full space-y-6">
              {matchesResult && (
                <>
                  <ResultSection
                    emoji="🏆"
                    players={matchesResult.match3}
                    color="from-kawaii-yellow via-kawaii-peach to-kawaii-pink"
                    borderColor="border-yellow-400/60"
                    delay={0}
                    animationType="gold"
                  />
                  <ResultSection
                    emoji="🥈"
                    players={matchesResult.match2}
                    color="from-kawaii-blue via-kawaii-lavender to-kawaii-mint"
                    borderColor="border-kawaii-lavender"
                    delay={0.1}
                    animationType="silver"
                  />
                  <ResultSection
                    emoji="🥉"
                    players={matchesResult.match1}
                    color="from-kawaii-peach via-kawaii-pink to-kawaii-lavender"
                    borderColor="border-kawaii-peach"
                    delay={0.2}
                    animationType="bronze"
                  />
                </>
              )}
            </div>

            {/* Reset button */}
            <motion.button
              initial={{ scale: 0, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px hsl(270 60% 70% / 0.4)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
              onClick={handleReset}
              className="mt-8 px-8 py-3 bg-gradient-to-r from-kawaii-lavender to-kawaii-mint text-foreground rounded-full font-bold text-lg shadow-lg border-2 border-white/50"
            >
              🔄 重新選擇
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ResultSectionProps {
  emoji: string;
  players: MatchedPlayer[];
  color: string;
  borderColor: string;
  delay: number;
  animationType: 'gold' | 'silver' | 'bronze';
}

const floatAnimations = {
  gold: {
    y: [-8, 8, -8],
    rotate: [-8, 8, -8],
    scale: [1, 1.1, 1],
  },
  silver: {
    y: [-6, 6, -6],
    x: [-3, 3, -3],
    rotate: [-5, 5, -5],
  },
  bronze: {
    y: [-5, 5, -5],
    rotate: [-10, 0, 10, 0, -10],
  },
};

const floatDurations = {
  gold: 2,
  silver: 2.5,
  bronze: 3,
};

const ResultSection = ({ emoji, players, color, borderColor, delay, animationType }: ResultSectionProps) => {
  if (players.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.4 }}
        className={`p-4 pt-8 min-h-[100px] rounded-2xl bg-gradient-to-r ${color} border-2 ${borderColor} backdrop-blur-sm relative flex items-center justify-center`}
      >
        {/* Floating emoji - top left, highest z-index */}
        <motion.span
          className="absolute -left-3 -top-5 text-6xl sm:text-7xl drop-shadow-xl z-50"
          animate={floatAnimations[animationType]}
          transition={{
            duration: floatDurations[animationType],
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {emoji}
        </motion.span>
        <motion.p
          className="text-muted-foreground text-3xl"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          沒有人 😢
        </motion.p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`p-4 pt-8 rounded-2xl bg-gradient-to-r ${color} border-2 ${borderColor} backdrop-blur-sm relative`}
    >
      {/* Floating emoji - top left, highest z-index */}
      <motion.span
        className="absolute -left-3 -top-5 text-6xl sm:text-7xl drop-shadow-xl z-50"
        animate={floatAnimations[animationType]}
        transition={{
          duration: floatDurations[animationType],
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {emoji}
      </motion.span>
      {/* Player count - top right */}
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring" }}
        className="absolute right-3 top-2 text-lg font-bold bg-gradient-to-r from-kawaii-mint to-kawaii-blue px-3 py-1 rounded-full shadow-lg border-2 border-white/50"
      >
        {players.length} 人
      </motion.span>
      <div className="flex flex-wrap gap-4 mt-6">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            whileHover={{ scale: 1.1, y: -5 }}
            transition={{ delay: delay + index * 0.05, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-3 border-white shadow-xl bg-gradient-to-br from-kawaii-pink to-kawaii-lavender p-0.5">
                <img
                  src={`https://tapback.co/api/avatar/${player.avatar_seed}.webp`}
                  alt={player.player_name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              {/* Sparkle decoration */}
              <motion.span
                className="absolute -top-1 -right-1 text-xs"
                animate={{ scale: [1, 1.3, 1], rotate: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                ✨
              </motion.span>
            </div>
            <span className="text-xs sm:text-sm font-bold mt-1.5 max-w-[60px] sm:max-w-[70px] truncate text-center bg-white/50 px-2 py-0.5 rounded-full">
              {player.player_name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RevealResults;
