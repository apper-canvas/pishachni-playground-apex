import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ScoreDisplay from '@/components/molecules/ScoreDisplay';
import ApperIcon from '@/components/ApperIcon';

const GameOverModal = ({ 
  isOpen,
  score = 0,
  highScore = 0,
  isNewRecord = false,
  deathMessage = "You slipped on a haunted banana!",
  onRestart,
  onHome,
  onShare,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleShare = () => {
    const shareText = `I just scored ${score.toLocaleString()} points in Pishachni Playground! ${isNewRecord ? 'NEW RECORD! 🎉' : ''} Can you beat my score?`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Pishachni Playground',
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      // You could show a toast here
    }
    
    onShare?.();
  };

  const deathMessages = [
    "You slipped on a haunted banana! 🍌",
    "Pishachni caught you red-handed! 👻",
    "You got spooked by your own reflection! 🪞",
    "The toilet paper wrapped you too tight! 🧻",
    "You danced yourself into a corner! 💃",
    "Garlic overload! Even the spirits fled! 🧄"
  ];

  const randomMessage = deathMessages[Math.floor(Math.random() * deathMessages.length)];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className={`bg-game-panel border-4 border-primary rounded-2xl p-8 max-w-md w-full text-center ${className}`}
          >
            {/* Game Over Title */}
            <motion.div
              animate={{ 
                rotate: [0, -2, 2, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mb-6"
            >
              <h1 className="text-4xl font-display text-error mb-2 glow-effect">
                GAME OVER
              </h1>
              <div className="text-6xl mb-4">💀</div>
            </motion.div>

            {/* Death Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-purple-800 rounded-lg p-4 mb-6"
            >
              <p className="text-white font-body text-lg">
                {deathMessage || randomMessage}
              </p>
            </motion.div>

            {/* Score Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <ScoreDisplay
                score={score}
                highScore={highScore}
                isNewRecord={isNewRecord}
                size="md"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              {/* Primary Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={onRestart}
                  variant="primary"
                  size="lg"
                  icon="RotateCcw"
                  className="flex-1"
                >
                  Play Again
                </Button>
                <Button
                  onClick={() => navigate('/home')}
                  variant="outline"
                  size="lg"
                  icon="Home"
                  className="flex-1"
                >
                  Home
                </Button>
              </div>

              {/* Secondary Actions */}
              <div className="flex gap-4">
                <Button
                  onClick={handleShare}
                  variant="secondary"
                  size="md"
                  icon="Share2"
                  className="flex-1"
                >
                  Share Score
                </Button>
                <Button
                  onClick={() => navigate('/leaderboard')}
                  variant="accent"
                  size="md"
                  icon="Trophy"
                  className="flex-1"
                >
                  Leaderboard
                </Button>
              </div>
            </motion.div>

            {/* Encouragement Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-400 text-sm font-body">
                {isNewRecord 
                  ? "You're becoming a master ghost hunter! 👻"
                  : score > 0 
                  ? "Not bad! Pishachni is impressed! 🎃"
                  : "Don't give up! Even Pishachni had to practice! 💪"
                }
              </p>
            </motion.div>

            {/* Floating celebration particles for new records */}
            {isNewRecord && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-success rounded-full"
                    initial={{ 
                      x: '50%', 
                      y: '50%',
                      scale: 0,
                      opacity: 1
                    }}
                    animate={{
                      x: `${Math.random() * 100}%`,
                      y: `${Math.random() * 100}%`,
                      scale: [0, 1, 0],
                      opacity: [1, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameOverModal;