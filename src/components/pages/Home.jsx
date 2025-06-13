import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 overflow-y-auto">
      {/* Background mansion silhouette */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96">
          <div className="w-full h-full bg-gradient-to-t from-purple-800 to-transparent rounded-t-full" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header with floating elements */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 pt-12">
          {/* Floating Pishachni */}
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-20 right-8 text-6xl opacity-60"
          >
            👻
          </motion.div>

          {/* App Title */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="text-center mb-12"
          >
            <motion.h1
              animate={{ 
                textShadow: [
                  "0 0 20px #8B00FF",
                  "0 0 30px #8B00FF",
                  "0 0 20px #8B00FF"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl md:text-8xl font-display text-primary mb-4 wobble"
            >
              PISHACHNI
            </motion.h1>
            <motion.h2
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-display text-secondary glow-effect"
            >
              PLAYGROUND
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-accent font-body text-lg mt-4 max-w-md mx-auto"
            >
              Survive the haunted mansion with humor and wit!
            </motion.p>
          </motion.div>

          {/* Animated mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
            className="mb-8"
          >
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-8xl mb-4"
            >
              🏚️
            </motion.div>
          </motion.div>

          {/* Main Menu Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="space-y-4 w-full max-w-sm"
          >
            <Button
              onClick={() => navigate('/character-select')}
              variant="primary"
              size="xl"
              icon="Play"
              className="w-full text-xl"
            >
              Start Game
            </Button>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => navigate('/leaderboard')}
                variant="secondary"
                size="lg"
                icon="Trophy"
                className="w-full"
              >
                Leaderboard
              </Button>
              <Button
                onClick={() => navigate('/settings')}
                variant="accent"
                size="lg"
                icon="Settings"
                className="w-full"
              >
                Settings
              </Button>
            </div>

            <Button
              onClick={() => {
                // Show how to play modal or navigate to instructions
                alert("Swipe, tap, and survive! Avoid Pishachni while completing silly tasks in each room. Good luck!");
              }}
              variant="outline"
              size="lg"
              icon="HelpCircle"
              className="w-full"
            >
              How to Play
            </Button>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center py-6 px-6"
        >
          <p className="text-gray-400 text-sm font-body mb-2">
            Can you outwit the most hilariously chaotic spirit?
          </p>
          <div className="flex justify-center space-x-6 text-gray-500">
            <motion.div
              whileHover={{ scale: 1.2, color: '#FF6B35' }}
              className="cursor-pointer"
            >
              <ApperIcon name="Volume2" size={20} />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, color: '#39FF14' }}
              className="cursor-pointer"
            >
              <ApperIcon name="Share2" size={20} />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.2, color: '#8B00FF' }}
              className="cursor-pointer"
            >
              <ApperIcon name="Star" size={20} />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating background elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              animate={{
                x: [0, 100, -100, 0],
                y: [0, -150, 50, 0],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              {['🎃', '👻', '🕷️', '🦇', '🕯️', '🔮', '⚡', '✨'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;