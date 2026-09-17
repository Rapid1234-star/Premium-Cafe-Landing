import { useEffect } from 'react';
import { motion } from 'motion/react';

interface LoadingScreenProps {
  progress: number;
  isReady: boolean;
  onComplete: () => void;
}

export default function LoadingScreen({ progress, isReady, onComplete }: LoadingScreenProps) {
  useEffect(() => {
    if (isReady || progress >= 1) {
      const timer = setTimeout(() => {
        onComplete();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isReady, progress, onComplete]);

  const shouldShow = !isReady && progress < 1;

  if (!shouldShow) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: shouldShow ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[100] bg-espresso flex flex-col items-center justify-center"
      role="status"
      aria-live="polite"
      aria-label="Loading animation frames"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center"
      >
        <div className="font-serif text-4xl md:text-6xl text-ivory mb-6 tracking-tight">
          E&B<span className="text-terracotta">.</span>
        </div>
        <p className="text-ivory/60 text-lg md:text-xl mb-10 max-w-xs mx-auto">
          Crafting your experience&hellip;
        </p>

        <div className="w-full max-w-md mx-auto">
          <div className="h-1 bg-ivory/10 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full bg-terracotta rounded-full origin-left"
            />
          </div>
          <p className="text-ivory/40 text-sm mt-4 font-mono">
            {Math.round(progress * 100)}%
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}