import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import PowerUpIcon from '@/components/atoms/PowerUpIcon';

const GameHUD = ({ 
  score = 0,
  lives = 3,
  timeElapsed = 0,
  activePowerUps = [],
  currentRoom = 'mansion-entrance',
  className = ''
}) => {
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  const roomNames = {
    'mansion-entrance': 'Entrance Hall',
    'garlic-kitchen': 'Kitchen of Chaos',
    'dance-hall': 'Spooky Dance Floor',
    'bathroom': 'Haunted Bathroom',
    'mirror-room': 'Mirror Madness'
  };

  return (
    <div className={`bg-game-panel border-4 border-primary rounded-2xl p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        {/* Score */}
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <ApperIcon name="Trophy" className="text-warning glow-effect" size={20} />
          <span className="text-warning font-body text-lg font-bold">
            {score.toLocaleString()}
          </span>
        </motion.div>

        {/* Lives */}
        <div className="flex items-center space-x-1">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              animate={{ 
                scale: index < lives ? [1, 1.2, 1] : 1,
                opacity: index < lives ? 1 : 0.3
              }}
              transition={{ 
                duration: 0.5,
                repeat: index < lives ? Infinity : 0,
                repeatDelay: 2
              }}
              className="text-2xl"
            >
              {index < lives ? '❤️' : '🖤'}
            </motion.div>
          ))}
        </div>

        {/* Timer */}
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
        >
          <ApperIcon name="Clock" className="text-info glow-effect" size={20} />
          <span className="text-info font-body text-lg font-bold">
            {formatTime(timeElapsed)}
          </span>
        </motion.div>
      </div>

      {/* Room name */}
      <div className="text-center mb-3">
        <motion.h3
          key={currentRoom}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-accent font-display text-lg glow-effect"
        >
          {roomNames[currentRoom] || 'Unknown Room'}
        </motion.h3>
      </div>

      {/* Active Power-ups */}
      {activePowerUps.length > 0 && (
        <div className="flex justify-center space-x-2">
          {activePowerUps.map((powerUp, index) => {
            const remainingTime = Math.max(0, powerUp.duration - (Date.now() - powerUp.activatedAt));
            return (
              <PowerUpIcon
                key={`${powerUp.type}-${index}`}
                type={powerUp.type}
                active={remainingTime > 0}
                duration={remainingTime}
                maxDuration={powerUp.duration}
                size="sm"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GameHUD;