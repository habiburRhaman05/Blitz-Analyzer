import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function AppLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow"
          >
            <Zap className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-2xl bg-primary/20"
          />
        </div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-gradient-primary">Blitz AI</h2>
          <p className="mt-2 text-sm text-muted-foreground">Preparing your workspace...</p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="h-2 w-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
