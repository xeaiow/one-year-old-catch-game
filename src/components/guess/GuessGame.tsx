import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GuessCell from './GuessCell';
import FloatingDecorations from '../bingo/FloatingDecorations';
import Confetti from '../bingo/Confetti';
import { fetchItems, submitGameResult, Item } from '@/lib/api';

interface GuessGameProps {
  playerName: string;
  avatarSeed: string;
}

const MAX_SELECTIONS = 3;

type Step = 'items' | 'gender';

const GuessGame = ({ playerName, avatarSeed }: GuessGameProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [step, setStep] = useState<Step>('items');
  const [selectedGender, setSelectedGender] = useState<'boy' | 'girl' | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Toggle selection
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter(id => id !== itemId));
      return;
    }

    // Don't allow more than MAX_SELECTIONS
    if (isItemsComplete) return;

    setSelectedItemIds([...selectedItemIds, itemId]);
  };

  const handleNextStep = () => {
    if (isItemsComplete) {
      setStep('gender');
    }
  };

  const handleGenderSelect = async (gender: 'boy' | 'girl') => {
    if (selectedGender || isSubmitting) return;

    setSelectedGender(gender);
    setShowConfetti(true);
    setIsSubmitting(true);

    try {
      await submitGameResult({
        player_name: playerName,
        avatar_seed: avatarSeed,
        selected_items: selectedItemIds,
        guessed_gender: gender === 'boy' ? 'male' : 'female',
      });
    } catch (error) {
      console.error("Failed to submit result:", error);
    }

    setTimeout(() => {
      navigate('/guess-success');
    }, 1500);
  };

  // Loading state
  if (isLoadingItems) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">載入中...</p>
        </div>
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
                <span className="text-primary drop-shadow-sm">✨ 猜猜看 </span>
                <span className="text-accent-foreground drop-shadow-sm">小寶會抓什麼 ✨</span>
              </motion.h1>
              <p className="text-muted-foreground text-sm sm:text-base mt-2">
                {isItemsComplete ? '選擇完成！點擊下一步繼續' : `還可以選 ${MAX_SELECTIONS - selectedItemIds.length} 個物品`}
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

            {/* Next button */}
            <AnimatePresence>
              {isItemsComplete && (
                <motion.button
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 12 }}
                  onClick={handleNextStep}
                  className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  下一步 ✨
                </motion.button>
              )}
            </AnimatePresence>
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
