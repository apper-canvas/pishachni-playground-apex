import { motion } from 'framer-motion';

const Avatar = ({ 
  type = 'avatar-1', 
  size = 'md',
  selected = false,  
  unlocked = true,
  onClick,
  className = '',
  ...props 
}) => {
  const avatarImages = {
    'avatar-1': '👤',
    'avatar-2': '🕵️‍♀️',
    'avatar-3': '🧙‍♂️',
    'garlic-necklace': '🧄',
    'banana-helmet': '🍌',
    'duck-slippers': '🦆'
  };
  
  const sizes = {
    sm: 'w-12 h-12 text-2xl',
    md: 'w-16 h-16 text-4xl',
    lg: 'w-24 h-24 text-6xl',
    xl: 'w-32 h-32 text-8xl'
  };
  
  const baseClasses = "rounded-full border-4 flex items-center justify-center font-body transition-all duration-300 cursor-pointer";
  
  const getAvatarClasses = () => {
    if (!unlocked) {
      return "bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed";
    }
    
    if (selected) {
      return "bg-accent border-accent text-black neon-glow animate-pulse-glow";
    }
    
    return "bg-game-panel border-primary text-white hover:border-accent hover:bg-purple-800";
  };

  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.1, rotate: 5 } : {}}
      whileTap={unlocked ? { scale: 0.9 } : {}}
      className={`${baseClasses} ${sizes[size]} ${getAvatarClasses()} ${className}`}
      onClick={unlocked ? onClick : undefined}
      {...props}
    >
      <span className="relative">
        {avatarImages[type] || '👤'}
        {!unlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs">🔒</span>
          </div>
        )}
        {selected && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center"
          >
            <span className="text-xs">✓</span>
          </motion.div>
        )}
      </span>
    </motion.div>
  );
};

export default Avatar;