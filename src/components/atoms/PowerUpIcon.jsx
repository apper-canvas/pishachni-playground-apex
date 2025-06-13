import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PowerUpIcon = ({ 
  type, 
  active = false,
  duration = 0,
  maxDuration = 10000,
  size = 'md',
  className = '',
  ...props 
}) => {
  const powerUpConfig = {
    'garlic-shield': {
      icon: 'Shield',
      color: 'text-accent',
      bgColor: 'bg-accent',
      emoji: '🧄'
    },
    'flashlight': {
      icon: 'Flashlight',
      color: 'text-warning',
      bgColor: 'bg-warning',
      emoji: '🔦'
    },
    'invisible-slippers': {
      icon: 'Eye',
      color: 'text-info',
      bgColor: 'bg-info',
      emoji: '👻'
    }
  };
  
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const config = powerUpConfig[type] || powerUpConfig['garlic-shield'];
  const progress = duration > 0 ? (duration / maxDuration) * 100 : 0;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          className={`${sizes[size]} relative ${className}`}
          {...props}
        >
          {/* Background circle */}
          <div className={`${sizes[size]} rounded-full ${config.bgColor} opacity-20 absolute inset-0`} />
          
          {/* Progress ring */}
          <svg className={`${sizes[size]} absolute inset-0 transform -rotate-90`}>
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className={config.color}
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
            />
          </svg>
          
          {/* Icon/Emoji */}
          <div className={`${sizes[size]} flex items-center justify-center relative z-10`}>
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-2xl"
            >
              {config.emoji}
            </motion.span>
          </div>
          
          {/* Glow effect */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className={`${sizes[size]} absolute inset-0 rounded-full ${config.bgColor} opacity-30 blur-sm`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PowerUpIcon;