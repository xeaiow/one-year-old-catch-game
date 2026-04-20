import { motion } from 'framer-motion';
import FloatingDecorations from '@/components/bingo/FloatingDecorations';

const CDN_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

const QRCode = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
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
        className="text-center mb-6"
      >
        <motion.h1
          className="text-2xl sm:text-4xl font-extrabold mb-2"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="text-primary drop-shadow-sm">✨ 掃描 </span>
          <span className="text-accent-foreground drop-shadow-sm">QR Code 加入小遊戲 ✨</span>
        </motion.h1>
      </motion.div>

      {/* QR Code Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
        className="relative"
      >
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

        {/* QR Code container */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 sm:p-8 bg-card/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-primary/20"
        >
          <motion.img
            src={`${CDN_BASE}/cdn/qrcode.png`}
            alt="QR Code"
            className="w-64 h-64 sm:w-80 sm:h-80 object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default QRCode;
