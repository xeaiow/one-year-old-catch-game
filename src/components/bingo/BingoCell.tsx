import { motion } from 'framer-motion';

const CDN_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

interface BingoCellProps {
  item: {
    image: string;
    name: string;
    color: string;
  };
  isFlipped: boolean;
  isWinning: boolean;
  onClick: () => void;
  index: number;
}

const BingoCell = ({ item, isFlipped, isWinning, onClick, index }: BingoCellProps) => {
  const cellColors: Record<string, string> = {
    pink: 'bg-kawaii-pink',
    mint: 'bg-kawaii-mint',
    lavender: 'bg-kawaii-lavender',
    peach: 'bg-kawaii-peach',
    yellow: 'bg-kawaii-yellow',
    blue: 'bg-kawaii-blue',
  };

  // Staggered floating animation delays
  const floatDelay = (index % 3) * 0.3 + Math.floor(index / 3) * 0.2;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: 0,
      }}
      transition={{ 
        delay: index * 0.08,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
      }}
      className="relative aspect-square w-full min-h-[80px] sm:min-h-[120px] md:min-h-[150px]"
      style={{ perspective: '1000px', WebkitPerspective: '1000px' }}
    >
      {/* Idle floating wrapper */}
      <motion.div
        animate={!isFlipped ? {
          y: [0, -6, 0],
          rotate: [0, 1, -1, 0],
        } : (isWinning ? {
          scale: [1, 1.08, 1],
          y: [0, -4, 0],
        } : {})}
        transition={{
          duration: 3,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full"
      >
        <motion.button
          onClick={() => !isFlipped && onClick()}
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{ 
            duration: 0.6, 
            type: "spring", 
            stiffness: 80,
            damping: 12
          }}
          whileHover={!isFlipped ? { 
            scale: 1.08, 
            rotateX: 8,
            rotateY: 8,
            transition: { duration: 0.2 }
          } : {}}
          disabled={isFlipped}
          className={`
            w-full h-full rounded-2xl
            cursor-pointer select-none
            shadow-lg hover:shadow-xl
            transition-shadow duration-300
            ${isWinning ? 'ring-4 ring-glow-pink/60' : ''}
          `}
          style={{
            transformStyle: 'preserve-3d',
            WebkitTransformStyle: 'preserve-3d',
          }}
        >
          {/* Card Back */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-primary/20"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-kawaii-pink via-kawaii-lavender to-kawaii-mint p-2 flex flex-col items-center justify-center relative">
              {/* Polka dot pattern */}
              <div className="absolute inset-0 opacity-20">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={`dot-${i}`}
                    className="absolute w-2 h-2 rounded-full bg-card"
                    style={{
                      top: `${10 + (i % 4) * 25}%`,
                      left: `${10 + Math.floor(i / 4) * 30}%`,
                    }}
                  />
                ))}
              </div>
              
              {/* Floating decorations */}
              <motion.span
                className="absolute top-2 left-2 text-[10px] sm:text-xs opacity-50"
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💖
              </motion.span>
              <motion.span
                className="absolute top-2 right-2 text-[10px] sm:text-xs opacity-50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              >
                ⭐
              </motion.span>
              <motion.span
                className="absolute bottom-2 left-2 text-[10px] sm:text-xs opacity-40"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              >
                ☁️
              </motion.span>
              <motion.span
                className="absolute bottom-2 right-2 text-[10px] sm:text-xs opacity-50"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.span>
              
              {/* Center sleeping character */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 flex flex-col items-center"
              >
                <img
                  src={`${CDN_BASE}/cdn/card.avif`}
                  alt=""
                  className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                />
                <motion.span
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-lg sm:text-2xl md:text-3xl font-extrabold text-foreground/50 mt-1"
                >
                  ?
                </motion.span>
              </motion.div>
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-card/40 to-transparent"
                animate={{ x: ['-150%', '250%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                style={{ width: '40%' }}
              />
            </div>
          </div>

          {/* Card Front */}
          <div 
            className={`
              absolute inset-0 rounded-2xl overflow-hidden
              ${cellColors[item.color] || 'bg-kawaii-pink'}
              border-2 border-card/30
              flex flex-col items-center justify-center gap-1
              p-2
            `}
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* Corner sparkles */}
            <span className="absolute top-1 left-1 text-[8px] sm:text-[10px] opacity-60">✨</span>
            <span className="absolute top-1 right-1 text-[8px] sm:text-[10px] opacity-60">✨</span>
            <span className="absolute bottom-1 left-1 text-[8px] sm:text-[10px] opacity-60">⭐</span>
            <span className="absolute bottom-1 right-1 text-[8px] sm:text-[10px] opacity-60">⭐</span>

            {/* Image */}
            <motion.img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain relative z-10"
              animate={isWinning ? {
                rotate: [0, -8, 8, -8, 0],
                scale: [1, 1.1, 1],
              } : {}}
              transition={{ duration: 0.6, repeat: isWinning ? Infinity : 0 }}
            />

            {/* Name */}
            <span className="text-xs sm:text-sm md:text-base font-bold text-foreground/70 capitalize relative z-10">
              {item.name}
            </span>

            {/* Winning glow */}
            {isWinning && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
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
          </div>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BingoCell;
