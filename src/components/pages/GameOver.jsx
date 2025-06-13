import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ScoreDisplay from '@/components/molecules/ScoreDisplay';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import { playerService } from '@/services';
import { toast } from 'react-toastify';

const GameOver = () => {
  const navigate = useNavigate();
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    loadGameOverData();
  }, []);

  const loadGameOverData = async () => {
    setLoading(true);
    try {
      // Get game over data from localStorage or URL params
      const storedData = localStorage.getItem('gameOverData');
      if (storedData) {
        const data = JSON.parse(storedData);
        setGameData(data);
      } else {
        // Fallback data
        setGameData({
          score: 0,
          highScore: 0,
          isNewRecord: false,
          deathMessage: "You encountered Pishachni!"
        });
      }
    } catch (error) {
      toast.error('Failed to load game data');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!gameData) return;
    
    setSharing(true);
    const shareText = `I just scored ${gameData.score.toLocaleString()} points in Pishachni Playground! ${gameData.isNewRecord ? 'NEW RECORD! 🎉' : ''} Can you beat my score?`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Pishachni Playground',
          text: shareText,
          url: window.location.origin
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(shareText);
        toast.success('Score copied to clipboard!');
      }
    } catch (error) {
      toast.error('Failed to share score');
    } finally {
      setSharing(false);
    }
  };

  const handlePlayAgain = () => {
    localStorage.removeItem('gameOverData');
    navigate('/character-select');
  };

  const deathMessages = [
    "You slipped on a haunted banana! 🍌",
    "Pishachni caught you red-handed! 👻",
    "You got spooked by your own reflection! 🪞",
    "The toilet paper wrapped you too tight! 🧻",
    "You danced yourself into a corner! 💃",
    "Garlic overload! Even the spirits fled! 🧄",
    "You laughed so hard, you forgot to run! 😂",
    "The mirror cracked from your terrible joke! 🪞💔"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 flex items-center justify-center">
        <SkeletonLoader count={3} className="w-full max-w-md" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 overflow-y-auto">
      <div className="container mx-auto px-6 py-8 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.h1
            animate={{ 
              rotate: [0, -2, 2, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl font-display text-error mb-4 glow-effect"
          >
            GAME OVER
          </motion.h1>
          
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-8xl mb-6"
          >
            💀
          </motion.div>
        </motion.div>

        {/* Death Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-game-panel border-4 border-primary rounded-2xl p-6 mb-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-display text-accent mb-4">What Happened?</h2>
            <p className="text-white font-body text-lg">
              {gameData?.deathMessage || deathMessages[Math.floor(Math.random() * deathMessages.length)]}
            </p>
          </div>
        </motion.div>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <ScoreDisplay
            score={gameData?.score || 0}
            highScore={gameData?.highScore || 0}
            isNewRecord={gameData?.isNewRecord || false}
            size="lg"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >
          {/* Primary Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handlePlayAgain}
              variant="primary"
              size="xl"
              icon="RotateCcw"
              className="flex-1"
            >
              Play Again
            </Button>
            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              size="xl"
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
              size="lg"
              icon="Share2"
              disabled={sharing}
              className="flex-1"
            >
              {sharing ? 'Sharing...' : 'Share Score'}
            </Button>
            <Button
              onClick={() => navigate('/leaderboard')}
              variant="accent"
              size="lg"
              icon="Trophy"
              className="flex-1"
            >
              Leaderboard
            </Button>
          </div>
        </motion.div>

        {/* Encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <div className="bg-purple-800 rounded-lg p-6">
            <h3 className="text-xl font-display text-accent mb-3">Don't Give Up!</h3>
            <p className="text-gray-300 font-body mb-4">
              {gameData?.isNewRecord 
                ? "You're becoming a master ghost hunter! Keep improving your skills! 👻"
                : gameData?.score > 0 
                ? "Every escape attempt makes you stronger. Pishachni won't expect your next move! 🎃"
                : "Even Pishachni had to practice! Learn the patterns and try again! 💪"
              }
            </p>
            
            {/* Tips */}
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <span className="text-accent">💡</span>
                <span>Complete mini-games quickly for bonus points</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-warning">⚡</span>
                <span>Power-ups can save you from Pishachni</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-success">🎯</span>
                <span>Each room has different challenges</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-info">🏃</span>
                <span>Speed matters - but so does accuracy</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating spirits */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-20"
              animate={{
                x: [0, 80, -80, 0],
                y: [0, -120, 60, 0],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 1.5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            >
              {['👻', '💀', '🎃', '⚡', '✨', '🕯️', '🌙', '🔮'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameOver;