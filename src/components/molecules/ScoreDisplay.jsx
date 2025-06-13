import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ScoreDisplay = ({ 
  score = 0,
  highScore = 0,
  isNewRecord = false,
  showComparison = true,
  size = 'md',
  className = ''
}) => {
  const sizes = {
    sm: {
      score: 'text-2xl',
      label: 'text-sm',
      icon: 20
    },
    md: {
      score: 'text-4xl',
      label: 'text-base',
      icon: 24
    },
    lg: {
      score: 'text-6xl',
      label: 'text-lg',
      icon: 32
    }
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center ${className}`}
    >
      {/* Current Score */}
      <div className="mb-4">
        <div className="flex items-center justify-center space-x-3 mb-2">
          <ApperIcon 
            name="Trophy" 
            size={currentSize.icon} 
            className="text-warning glow-effect" 
          />
          <motion.span
            key={score}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-display ${currentSize.score} text-warning font-bold glow-effect`}
          >
            {score.toLocaleString()}
          </motion.span>
        </div>
        <p className={`${currentSize.label} text-white font-body`}>Final Score</p>
      </div>

      {/* New Record Celebration */}
      {isNewRecord && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-4"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-2"
          >
            🎉
          </motion.div>
          <motion.p
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-success font-display text-2xl font-bold glow-effect"
          >
            NEW RECORD!
          </motion.p>
        </motion.div>
      )}

      {/* High Score Comparison */}
      {showComparison && !isNewRecord && highScore > 0 && (
        <div className="bg-game-panel rounded-lg p-4 border-2 border-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-body">Previous Best</p>
              <p className="text-primary font-body text-xl font-bold">
                {highScore.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-300 text-sm font-body">Difference</p>
              <motion.p
                className={`font-body text-xl font-bold ${
                  score > highScore ? 'text-success' : 'text-error'
                }`}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {score > highScore ? '+' : ''}{(score - highScore).toLocaleString()}
              </motion.p>
            </div>
          </div>
        </div>
      )}

      {/* Score breakdown */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-center">
        <div className="bg-purple-800 rounded-lg p-3">
          <ApperIcon name="Target" size={20} className="text-accent mx-auto mb-1" />
          <p className="text-accent font-body text-lg font-bold">
            {Math.floor(score / 100)}
          </p>
          <p className="text-gray-300 text-xs">Tasks Completed</p>
        </div>
        <div className="bg-purple-800 rounded-lg p-3">
          <ApperIcon name="Zap" size={20} className="text-warning mx-auto mb-1" />
          <p className="text-warning font-body text-lg font-bold">
            {score % 100 === 0 ? 'Perfect!' : 'Good!'}
          </p>
          <p className="text-gray-300 text-xs">Performance</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ScoreDisplay;