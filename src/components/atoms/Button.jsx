import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  disabled = false,
  className = '',
  onClick,
  ...props 
}) => {
  const baseClasses = "font-body font-bold rounded-full border-4 transition-all duration-200 focus:outline-none focus:ring-4 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white border-primary hover:bg-purple-600 hover:border-purple-600 focus:ring-purple-300 neon-glow",
    secondary: "bg-secondary text-white border-secondary hover:bg-orange-600 hover:border-orange-600 focus:ring-orange-300 neon-glow",
    accent: "bg-accent text-black border-accent hover:bg-green-400 hover:border-green-400 focus:ring-green-300 neon-glow",
    outline: "bg-transparent text-primary border-primary hover:bg-primary hover:text-white focus:ring-purple-300",
    ghost: "bg-transparent text-white border-transparent hover:bg-white hover:bg-opacity-10 focus:ring-white",
    danger: "bg-error text-white border-error hover:bg-red-600 hover:border-red-600 focus:ring-red-300 neon-glow"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    xl: "px-10 py-5 text-xl"
  };
  
  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  };

  const renderIcon = () => {
    if (!icon) return null;
    return <ApperIcon name={icon} size={iconSizes[size]} className="glow-effect" />;
  };

  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && renderIcon()}
      {children && <span className={icon ? (iconPosition === 'left' ? 'ml-2' : 'mr-2') : ''}>{children}</span>}
      {icon && iconPosition === 'right' && renderIcon()}
    </>
  );

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} wobble`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center justify-center">
        {buttonContent}
      </div>
    </motion.button>
  );
};

export default Button;