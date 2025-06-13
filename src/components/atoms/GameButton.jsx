import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const GameButton = ({ 
  children, 
  icon, 
  variant = 'game',
  size = 'md',
  glowing = false,
  pulsing = false,
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "font-body font-bold rounded-2xl border-4 transition-all duration-200 focus:outline-none relative overflow-hidden";
  
  const variants = {
    game: "bg-game-panel text-accent border-accent hover:bg-purple-800 focus:ring-accent shadow-lg",
    power: "bg-gradient-to-r from-accent to-info text-black border-accent hover:from-green-400 hover:to-cyan-400",
    danger: "bg-error text-white border-red-600 hover:bg-red-600",
    transparent: "bg-transparent text-white border-white border-2 hover:bg-white hover:bg-opacity-10"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg"
  };

  const glowClass = glowing ? 'neon-glow animate-pulse-glow' : '';
  const pulseClass = pulsing ? 'animate-bounce-light' : '';

  return (
    <motion.button
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${glowClass} ${pulseClass} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center justify-center space-x-2 relative z-10">
        {icon && <ApperIcon name={icon} size={20} className="glow-effect" />}
        {children && <span>{children}</span>}
      </div>
      
      {glowing && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full animate-pulse" />
      )}
    </motion.button>
  );
};

export default GameButton;