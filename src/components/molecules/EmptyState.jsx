import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const EmptyState = ({ 
  title = "Nothing here yet!",
  description = "Looks like this area is ghost-free... for now.",
  emoji = "👻",
  actionLabel,
  onAction,
  showAction = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center p-8 ${className}`}
    >
      {/* Animated Emoji */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-8xl mb-6"
      >
        {emoji}
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-display text-accent mb-4 glow-effect"
      >
        {title}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-300 font-body mb-8 max-w-sm mx-auto"
      >
        {description}
      </motion.p>

      {/* Action Button */}
      {showAction && actionLabel && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={onAction}
            variant="primary"
            size="lg"
            icon="Plus"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}

      {/* Floating spirit particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -80, 40, 0],
              rotate: [0, 180, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
            }}
            style={{
              left: `${30 + i * 20}%`,
              top: `${40 + i * 15}%`,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default EmptyState;