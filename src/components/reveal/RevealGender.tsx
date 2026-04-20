import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingDecorations from '../bingo/FloatingDecorations';
import { fetchGenderMatches, GenderMatchesResult, MatchedPlayer } from '@/lib/api';

const CDN_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

type Step = 'select' | 'results';
type Gender = 'male' | 'female';

const RevealGender = () => {
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [step, setStep] = useState<Step>('select');
  const [matchesResult, setMatchesResult] = useState<GenderMatchesResult | null>(null);
  const [isLoadingResults, setIsLoadingResults] = useState(false);

  const handleGenderSelect = (gender: Gender) => {
    setSelectedGender(gender);
  };

  const handleReveal = async () => {
    if (!selectedGender) return;

    setIsLoadingResults(true);
    try {
      const result = await fetchGenderMatches(selectedGender);
      setMatchesResult(result);
      setStep('results');
    } catch (error) {
      console.error("Failed to fetch gender matches:", error);
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleReset = () => {
    setStep('select');
    setSelectedGender(null);
    setMatchesResult(null);
  };

  const genderLabel = selectedGender === 'male' ? '男生' : '女生';
  const genderEmoji = selectedGender === 'male' ? '👦' : '👧';

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
        {step === 'select' ? (
          <motion.div
            key="select-step"
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
              className="text-center mb-8"
            >
              <motion.h1
                className="text-2xl sm:text-4xl font-extrabold mb-1"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-primary drop-shadow-sm">🎀 揭曉</span>
                <span className="text-accent-foreground drop-shadow-sm">芒果的性別 🎀</span>
              </motion.h1>
            </motion.div>

            {/* Gender Selection */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-8"
            >
              {/* Male Option */}
              <motion.button
                onClick={() => handleGenderSelect('male')}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative w-40 h-48 sm:w-48 sm:h-56 rounded-3xl
                  bg-gradient-to-br from-kawaii-blue via-kawaii-mint to-kawaii-lavender
                  border-4 ${selectedGender === 'male' ? 'border-primary ring-4 ring-glow-pink/60' : 'border-white/50'}
                  shadow-xl cursor-pointer
                  flex flex-col items-center justify-center gap-2
                  transition-all duration-300
                `}
              >
                <motion.img
                  src={`${CDN_BASE}/cdn/male.avif`}
                  alt="男生"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                  animate={selectedGender === 'male' ? {
                    rotate: [-5, 5, -5],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.6, repeat: selectedGender === 'male' ? Infinity : 0 }}
                />
                <span className="text-xl sm:text-2xl font-bold text-foreground">男生</span>
                {selectedGender === 'male' && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 15px hsl(330 100% 70% / 0.4), inset 0 0 15px hsl(330 100% 80% / 0.2)',
                        '0 0 30px hsl(330 100% 70% / 0.6), inset 0 0 20px hsl(330 100% 80% / 0.3)',
                        '0 0 15px hsl(330 100% 70% / 0.4), inset 0 0 15px hsl(330 100% 80% / 0.2)',
                      ],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                <span className="absolute top-2 left-2 text-lg opacity-60">✨</span>
                <span className="absolute top-2 right-2 text-lg opacity-60">⭐</span>
                <span className="absolute bottom-2 left-2 text-lg opacity-60">💙</span>
                <span className="absolute bottom-2 right-2 text-lg opacity-60">✨</span>
              </motion.button>

              {/* Female Option */}
              <motion.button
                onClick={() => handleGenderSelect('female')}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative w-40 h-48 sm:w-48 sm:h-56 rounded-3xl
                  bg-gradient-to-br from-kawaii-pink via-kawaii-peach to-kawaii-yellow
                  border-4 ${selectedGender === 'female' ? 'border-primary ring-4 ring-glow-pink/60' : 'border-white/50'}
                  shadow-xl cursor-pointer
                  flex flex-col items-center justify-center gap-2
                  transition-all duration-300
                `}
              >
                <motion.img
                  src={`${CDN_BASE}/cdn/female.avif`}
                  alt="女生"
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                  animate={selectedGender === 'female' ? {
                    rotate: [-5, 5, -5],
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{ duration: 0.6, repeat: selectedGender === 'female' ? Infinity : 0 }}
                />
                <span className="text-xl sm:text-2xl font-bold text-foreground">女生</span>
                {selectedGender === 'female' && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 15px hsl(330 100% 70% / 0.4), inset 0 0 15px hsl(330 100% 80% / 0.2)',
                        '0 0 30px hsl(330 100% 70% / 0.6), inset 0 0 20px hsl(330 100% 80% / 0.3)',
                        '0 0 15px hsl(330 100% 70% / 0.4), inset 0 0 15px hsl(330 100% 80% / 0.2)',
                      ],
                    }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                <span className="absolute top-2 left-2 text-lg opacity-60">✨</span>
                <span className="absolute top-2 right-2 text-lg opacity-60">⭐</span>
                <span className="absolute bottom-2 left-2 text-lg opacity-60">💗</span>
                <span className="absolute bottom-2 right-2 text-lg opacity-60">✨</span>
              </motion.button>
            </motion.div>

            {/* Reveal button */}
            <AnimatePresence>
              {selectedGender && (
                <motion.button
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px hsl(330 100% 70% / 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  onClick={handleReveal}
                  disabled={isLoadingResults}
                  className="px-10 py-4 bg-gradient-to-r from-kawaii-pink via-kawaii-peach to-kawaii-yellow text-foreground rounded-full font-bold text-xl shadow-xl border-2 border-white/50 disabled:opacity-50 kawaii-shadow"
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
                <span className="text-foreground drop-shadow-lg">🎊 椰果有弟弟了！</span>
              </motion.h1>
            </motion.div>

            {/* Results sections */}
            <div className="w-full space-y-6">
              {matchesResult && (
                <GenderResultSection
                  emoji="🎯"
                  title=""
                  players={matchesResult.correct}
                  color="from-kawaii-yellow via-kawaii-peach to-kawaii-pink"
                  borderColor="border-yellow-400/60"
                  delay={0}
                  animationType="correct"
                />
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

interface GenderResultSectionProps {
  emoji: string;
  title: string;
  players: MatchedPlayer[];
  color: string;
  borderColor: string;
  delay: number;
  animationType: 'correct' | 'incorrect';
}

const floatAnimations = {
  correct: {
    y: [-8, 8, -8],
    rotate: [-8, 8, -8],
    scale: [1, 1.1, 1],
  },
  incorrect: {
    y: [-6, 6, -6],
    x: [-3, 3, -3],
    rotate: [-5, 5, -5],
  },
};

const floatDurations = {
  correct: 2,
  incorrect: 2.5,
};

const GenderResultSection = ({ emoji, title, players, color, borderColor, delay, animationType }: GenderResultSectionProps) => {
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
        {/* Title */}
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.1, type: "spring" }}
          className="absolute left-16 top-2 text-lg font-bold"
        >
          {title}
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
      {/* Title */}
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.1, type: "spring" }}
        className="absolute left-16 top-2 text-lg font-bold"
      >
        {title}
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

export default RevealGender;
