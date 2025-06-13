import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { playerService } from '@/services';
import { toast } from 'react-toastify';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // all, today, week, month

  useEffect(() => {
    loadLeaderboardData();
  }, []);

  const loadLeaderboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current player for comparison
      const player = await playerService.getCurrentPlayer();
      setCurrentPlayer(player);

      // Generate mock leaderboard data since we have a single-player game
      const mockScores = generateMockLeaderboard(player);
      setScores(mockScores);
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard');
      toast.error('Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const generateMockLeaderboard = (currentPlayer) => {
    const mockNames = [
      'GhostHunter_2024', 'PishachniSlayer', 'SpookyMaster', 'BananaKnight',
      'GarlicGuru', 'DancingPhantom', 'MirrorMage', 'ToiletPaperHero',
      'ScreamQueen', 'LaughingSpirit', 'ChaosController', 'MansionEscaper'
    ];

    const scores = mockNames.map((name, index) => ({
      id: `player-${index + 2}`,
      name,
      score: Math.floor(Math.random() * 5000) + 1000,
      avatar: `avatar-${(index % 3) + 1}`,
      achievements: Math.floor(Math.random() * 8) + 1,
      lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
    }));

    // Add current player if they have a high score
    if (currentPlayer && currentPlayer.highScore > 0) {
      scores.push({
        id: currentPlayer.id,
        name: 'You',
        score: currentPlayer.highScore,
        avatar: currentPlayer.avatar || 'avatar-1',
        achievements: currentPlayer.achievements?.length || 0,
        lastPlayed: new Date().toISOString(),
        isCurrentPlayer: true
      });
    }

    // Sort by score and take top 20
    return scores.sort((a, b) => b.score - a.score).slice(0, 20);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '👑';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return 'text-warning';
      case 2: return 'text-gray-300';
      case 3: return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const getAvatarEmoji = (avatarType) => {
    const avatars = {
      'avatar-1': '👤',
      'avatar-2': '🕵️‍♀️',
      'avatar-3': '🧙‍♂️'
    };
    return avatars[avatarType] || '👤';
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
<div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 overflow-y-auto scrollbar-theme">
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <div className="h-8 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-48 mx-auto mb-4 animate-pulse" />
          </div>
          <SkeletonLoader count={10} type="leaderboard" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 flex items-center justify-center">
        <ErrorState
          title="Leaderboard Unavailable"
          message={error}
          onRetry={loadLeaderboardData}
          onHome={() => navigate('/home')}
        />
      </div>
    );
  }

  if (scores.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 flex items-center justify-center">
        <EmptyState
          title="No Scores Yet"
          description="Be the first to set a high score in Pishachni Playground!"
          emoji="🏆"
          actionLabel="Start Playing"
          onAction={() => navigate('/character-select')}
        />
      </div>
    );
  }

  return (
<div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 overflow-y-auto scrollbar-theme">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={() => navigate('/home')}
              variant="ghost"
              size="md"
              icon="ArrowLeft"
            >
              Back
            </Button>
            
            <motion.h1
              animate={{ 
                textShadow: [
                  "0 0 10px #FFD700",
                  "0 0 20px #FFD700",
                  "0 0 10px #FFD700"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-display text-warning glow-effect"
            >
              Leaderboard
            </motion.h1>
            
            <div className="w-20" />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-accent font-body"
          >
            Top ghost hunters who survived Pishachni's chaos
          </motion.p>
        </motion.div>

        {/* Current Player Stats */}
        {currentPlayer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-game-panel border-4 border-accent rounded-2xl p-6 mb-8"
          >
            <div className="text-center">
              <h2 className="text-xl font-display text-accent mb-4 glow-effect">Your Best</h2>
              <div className="flex items-center justify-center space-x-6">
                <div className="text-center">
                  <div className="text-3xl mb-2">{getAvatarEmoji(currentPlayer.avatar)}</div>
                  <p className="text-white font-body font-bold">You</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-display text-warning font-bold mb-2">
                    {currentPlayer.highScore.toLocaleString()}
                  </div>
                  <p className="text-gray-300 text-sm">High Score</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <p className="text-accent font-bold">
                    #{scores.findIndex(s => s.isCurrentPlayer) + 1 || '—'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-3"
        >
          {scores.map((player, index) => {
            const rank = index + 1;
            const isCurrentPlayer = player.isCurrentPlayer;
            
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`
                  bg-game-panel rounded-lg p-4 border-2 transition-all duration-300
                  ${isCurrentPlayer 
                    ? 'border-accent bg-opacity-80 scale-105' 
                    : rank <= 3 
                    ? 'border-warning' 
                    : 'border-primary hover:border-accent'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  {/* Rank and Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl font-bold ${getRankColor(rank)} min-w-[50px] text-center`}>
                      {getRankIcon(rank)}
                    </div>
                    <div className="text-3xl">{getAvatarEmoji(player.avatar)}</div>
                    <div>
                      <h3 className={`font-body font-bold ${
                        isCurrentPlayer ? 'text-accent' : 'text-white'
                      }`}>
                        {player.name}
                        {isCurrentPlayer && <span className="text-xs ml-2">👈</span>}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-gray-400">
                        <span>🏆 {player.achievements} achievements</span>
                        <span>⏰ {formatTimeAgo(player.lastPlayed)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <div className={`text-2xl font-display font-bold ${
                      rank === 1 ? 'text-warning' : 
                      rank <= 3 ? 'text-orange-400' : 
                      isCurrentPlayer ? 'text-accent' : 'text-white'
                    }`}>
                      {player.score.toLocaleString()}
                    </div>
                    <p className="text-gray-400 text-xs">points</p>
                  </div>
                </div>

                {/* Special effects for top 3 */}
                {rank <= 3 && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                    <motion.div
                      animate={{
                        x: [-100, window.innerWidth],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 5,
                        delay: rank
                      }}
                      className="absolute top-1/2 h-0.5 w-20 bg-gradient-to-r from-transparent via-warning to-transparent"
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center space-y-4"
        >
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate('/character-select')}
              variant="primary"
              size="lg"
              icon="Play"
            >
              Play Again
            </Button>
            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              size="lg"
              icon="Home"
            >
              Home
            </Button>
          </div>
          
          <p className="text-gray-400 text-sm font-body">
            Challenge yourself to reach the top of the leaderboard!
          </p>
        </motion.div>

        {/* Floating trophies */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20"
              animate={{
                y: [0, -30, 0],
                rotate: [0, 10, -10, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 1.2,
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 30}%`,
              }}
            >
              {['🏆', '👑', '🥇', '⭐', '🎖️', '🏅'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;