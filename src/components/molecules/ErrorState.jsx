import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ErrorState = ({ 
  title = "Oops! Something went wrong",
  message = "Looks like Pishachni caused some mischief!",
  actionLabel = "Try Again",
  onRetry,
  onHome,
  showHomeButton = true,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center p-8 ${className}`}
    >
      {/* Animated Error Icon */}
      <motion.div
        animate={{ 
          rotate: [0, -10, 10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="text-8xl mb-6"
      >
        👻
      </motion.div>

      {/* Error Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-display text-error mb-4 glow-effect"
      >
        {title}
      </motion.h2>

      {/* Error Message */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg text-gray-300 font-body mb-8 max-w-md mx-auto"
      >
        {message}
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="primary"
            size="lg"
            icon="RefreshCw"
            className="min-w-[140px]"
          >
            {actionLabel}
          </Button>
        )}
        
        {showHomeButton && onHome && (
          <Button
            onClick={onHome}
            variant="outline"
            size="lg"
            icon="Home"
            className="min-w-[140px]"
          >
            Go Home
          </Button>
        )}
      </motion.div>

      {/* Floating particles for ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-error rounded-full opacity-30"
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 50, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default ErrorState;