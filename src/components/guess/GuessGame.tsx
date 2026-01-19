import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GuessCell from './GuessCell';
import FloatingDecorations from '../bingo/FloatingDecorations';
import Confetti from '../bingo/Confetti';

interface GuessItem {
  id: number;
  name: string;
  src: string;
}

const guessItems: GuessItem[] = [
  { id: 1, name: '物品1', src: '/1.avif' },
  { id: 2, name: '物品2', src: '/2.avif' },
  { id: 3, name: '物品3', src: '/3.avif' },
  { id: 4, name: '物品4', src: '/4.avif' },
  { id: 5, name: '物品5', src: '/5.avif' },
  { id: 6, name: '物品6', src: '/6.avif' },
  { id: 7, name: '物品7', src: '/7.avif' },
  { id: 8, name: '物品8', src: '/8.avif' },
  { id: 9, name: '物品9', src: '/9.avif' },
  { id: 10, name: '物品10', src: '/10.avif' },
  { id: 11, name: '物品11', src: '/11.avif' },
  { id: 12, name: '物品12', src: '/12.avif' },
];

const MAX_SELECTIONS = 3;

type Step = 'items' | 'gender';

const GuessGame = () => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [step, setStep] = useState<Step>('items');
  const [selectedGender, setSelectedGender] = useState<'boy' | 'girl' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const isItemsComplete = selectedIndices.length >= MAX_SELECTIONS;

  const handleCellClick = (index: number) => {
    if (isItemsComplete) return;
    if (selectedIndices.includes(index)) return;

    const newSelections = [...selectedIndices, index];
    setSelectedIndices(newSelections);

    if (newSelections.length >= MAX_SELECTIONS) {
      setTimeout(() => setStep('gender'), 800);
    }
  };

  const handleGenderSelect = (gender: 'boy' | 'girl') => {
    if (selectedGender) return;
    setSelectedGender(gender);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);
  };

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
                <span className="text-primary drop-shadow-sm">✨ 猜猜看 </span>
                <span className="text-accent-foreground drop-shadow-sm">涵晞會抓什麼 ✨</span>
              </motion.h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                {isItemsComplete ? '選擇完成！' : `還可以選 ${MAX_SELECTIONS - selectedIndices.length} 個物品`}
              </p>
            </motion.div>

            {/* Grid - 4 columns x 3 rows, sized to match Bingo's cell size */}
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
                    {guessItems.map((item, index) => (
                      <GuessCell
                        key={item.id}
                        item={item}
                        isSelected={selectedIndices.includes(index)}
                        onClick={() => handleCellClick(index)}
                        index={index}
                        disabled={isItemsComplete}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="gender-step"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
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
                <span className="text-primary drop-shadow-sm">✨ 猜猜看 </span>
                <span className="text-accent-foreground drop-shadow-sm">是男生還是女生 ✨</span>
              </motion.h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                {selectedGender ? '選擇完成！' : '選擇一個'}
              </p>
            </motion.div>

            {/* Gender selection - same structure as Bingo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
              className="relative w-full max-w-[90vw] sm:max-w-[70vmin] md:max-w-[65vmin] lg:max-w-[600px]"
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
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 p-4 sm:p-6 md:p-8 bg-card/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-primary/20">
                    {/* Boy */}
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, type: "spring" }}
                      whileHover={!selectedGender ? { scale: 1.05 } : {}}
                      whileTap={!selectedGender ? { scale: 0.95 } : {}}
                      onClick={() => handleGenderSelect('boy')}
                      disabled={selectedGender !== null}
                      className={`
                        relative aspect-square w-full
                        rounded-2xl overflow-hidden
                        bg-kawaii-blue border-2
                        ${selectedGender === 'boy' ? 'border-primary ring-4 ring-glow-pink/60' : 'border-card/30'}
                        ${selectedGender && selectedGender !== 'boy' ? 'opacity-40' : ''}
                        shadow-xl cursor-pointer
                        flex flex-col items-center justify-center gap-2
                        transition-all duration-300
                      `}
                    >
                      <span className="absolute top-2 left-2 text-sm sm:text-base opacity-60">✨</span>
                      <span className="absolute top-2 right-2 text-sm sm:text-base opacity-60">✨</span>
                      <span className="absolute bottom-2 left-2 text-sm sm:text-base opacity-60">⭐</span>
                      <span className="absolute bottom-2 right-2 text-sm sm:text-base opacity-60">⭐</span>
                      <motion.span
                        className="text-6xl sm:text-7xl md:text-8xl"
                        animate={selectedGender === 'boy' ? {
                          rotate: [0, -8, 8, -8, 0],
                          scale: [1, 1.1, 1],
                        } : {
                          y: [0, -8, 0],
                        }}
                        transition={{ duration: selectedGender === 'boy' ? 0.6 : 2.5, repeat: Infinity }}
                      >
                        👦
                      </motion.span>
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground/80">男生</span>
                      {selectedGender === 'boy' && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          animate={{
                            boxShadow: [
                              '0 0 20px hsl(200 100% 70% / 0.4), inset 0 0 20px hsl(200 100% 80% / 0.2)',
                              '0 0 40px hsl(200 100% 70% / 0.6), inset 0 0 30px hsl(200 100% 80% / 0.3)',
                              '0 0 20px hsl(200 100% 70% / 0.4), inset 0 0 20px hsl(200 100% 80% / 0.2)',
                            ],
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </motion.button>

                    {/* Girl */}
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      whileHover={!selectedGender ? { scale: 1.05 } : {}}
                      whileTap={!selectedGender ? { scale: 0.95 } : {}}
                      onClick={() => handleGenderSelect('girl')}
                      disabled={selectedGender !== null}
                      className={`
                        relative aspect-square w-full
                        rounded-2xl overflow-hidden
                        bg-kawaii-pink border-2
                        ${selectedGender === 'girl' ? 'border-primary ring-4 ring-glow-pink/60' : 'border-card/30'}
                        ${selectedGender && selectedGender !== 'girl' ? 'opacity-40' : ''}
                        shadow-xl cursor-pointer
                        flex flex-col items-center justify-center gap-2
                        transition-all duration-300
                      `}
                    >
                      <span className="absolute top-2 left-2 text-sm sm:text-base opacity-60">💕</span>
                      <span className="absolute top-2 right-2 text-sm sm:text-base opacity-60">💕</span>
                      <span className="absolute bottom-2 left-2 text-sm sm:text-base opacity-60">🎀</span>
                      <span className="absolute bottom-2 right-2 text-sm sm:text-base opacity-60">🎀</span>
                      <motion.span
                        className="text-6xl sm:text-7xl md:text-8xl"
                        animate={selectedGender === 'girl' ? {
                          rotate: [0, -8, 8, -8, 0],
                          scale: [1, 1.1, 1],
                        } : {
                          y: [0, -8, 0],
                        }}
                        transition={{ duration: selectedGender === 'girl' ? 0.6 : 2.5, repeat: Infinity, delay: 0.3 }}
                      >
                        👧
                      </motion.span>
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground/80">女生</span>
                      {selectedGender === 'girl' && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          animate={{
                            boxShadow: [
                              '0 0 20px hsl(330 100% 70% / 0.4), inset 0 0 20px hsl(330 100% 80% / 0.2)',
                              '0 0 40px hsl(330 100% 70% / 0.6), inset 0 0 30px hsl(330 100% 80% / 0.3)',
                              '0 0 20px hsl(330 100% 70% / 0.4), inset 0 0 20px hsl(330 100% 80% / 0.2)',
                            ],
                          }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Selection message */}
            <AnimatePresence>
              {selectedGender && (
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
                    🎉 完成！ 🎉
                  </motion.h2>
                </motion.div>
              )}
            </AnimatePresence>
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

export default GuessGame;
