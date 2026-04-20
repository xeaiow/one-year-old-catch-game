import { motion } from 'framer-motion';
import FloatingDecorations from '@/components/bingo/FloatingDecorations';
import Confetti from '@/components/bingo/Confetti';

const GuessSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <FloatingDecorations />
      <Confetti />

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

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
        className="text-center"
      >
        <motion.h1
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, -3, 3, 0],
          }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-6xl sm:text-6xl md:text-7xl font-extrabold text-primary drop-shadow-lg mb-6"
        >
          🎉 完成！
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl sm:text-2xl text-foreground/80 font-bold"
        >
          謝謝你的參與
        </motion.p>
      </motion.div>
    </div>
  );
};

export default GuessSuccess;
