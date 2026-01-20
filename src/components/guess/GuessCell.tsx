import { motion } from 'framer-motion';

interface GuessCellProps {
  item: {
    id: number;
    name: string;
    src: string;
  };
  isSelected: boolean;
  onClick: () => void;
  index: number;
  disabled: boolean;
}

const cellColors = [
  'bg-kawaii-pink',
  'bg-kawaii-mint',
  'bg-kawaii-lavender',
  'bg-kawaii-peach',
  'bg-kawaii-yellow',
  'bg-kawaii-blue',
];

const GuessCell = ({ item, isSelected, onClick, index, disabled }: GuessCellProps) => {
  const colorClass = cellColors[index % cellColors.length];
  const floatDelay = (index % 4) * 0.2 + Math.floor(index / 4) * 0.15;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.06,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
      }}
      className="relative aspect-square w-full"
    >
      <motion.div
        animate={!isSelected ? {
          y: [0, -4, 0],
          rotate: [0, 0.5, -0.5, 0],
        } : {
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 3,
          delay: floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-full h-full"
      >
        <motion.button
          onClick={onClick}
          whileHover={!disabled ? {
            scale: 1.06,
            rotateX: 4,
            rotateY: 4,
            transition: { duration: 0.2 }
          } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
          disabled={disabled}
          className={`
            w-full h-full rounded-2xl
            cursor-pointer select-none
            shadow-lg hover:shadow-xl
            transition-shadow duration-300
            ${isSelected ? 'ring-4 ring-glow-pink/60' : ''}
            ${disabled && !isSelected ? 'opacity-40' : ''}
          `}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className={`
              absolute inset-0 rounded-2xl overflow-hidden
              ${colorClass}
              border-2 ${isSelected ? 'border-primary' : 'border-card/30'}
              flex flex-col items-center justify-center
              p-2
            `}
          >
            {/* Corner sparkles */}
            <span className="absolute top-1 left-1 text-[8px] sm:text-[10px] opacity-60">✨</span>
            <span className="absolute top-1 right-1 text-[8px] sm:text-[10px] opacity-60">✨</span>
            <span className="absolute bottom-1 left-1 text-[8px] sm:text-[10px] opacity-60">⭐</span>
            <span className="absolute bottom-1 right-1 text-[8px] sm:text-[10px] opacity-60">⭐</span>

            {/* Image */}
            <motion.img
              src={item.src}
              alt={item.name}
              className="w-2/3 h-1/2 object-contain relative z-10 drop-shadow-sm"
              animate={isSelected ? {
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.08, 1],
              } : {}}
              transition={{ duration: 0.6, repeat: isSelected ? Infinity : 0 }}
            />

            {/* Item name */}
            <span className="text-sm sm:text-base md:text-lg font-bold text-foreground/80 mt-3 truncate max-w-full px-1">
              {item.name}
            </span>

            {/* Selected glow */}
            {isSelected && (
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

export default GuessCell;
