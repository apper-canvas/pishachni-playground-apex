import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GameHUD from '@/components/molecules/GameHUD';
import MansionMap from '@/components/molecules/MansionMap';
import MiniGameInterface from '@/components/molecules/MiniGameInterface';
import GameOverModal from '@/components/organisms/GameOverModal';
import { gameSessionService, playerService, miniGameService } from '@/services';
import { toast } from 'react-toastify';

const Game = () => {
  const navigate = useNavigate();
  const [gameSession, setGameSession] = useState(null);
  const [currentRoom, setCurrentRoom] = useState('mansion-entrance');
  const [completedRooms, setCompletedRooms] = useState([]);
  const [activeMiniGame, setActiveMiniGame] = useState(null);
  const [gameState, setGameState] = useState('playing'); // playing, paused, gameOver
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [pishachniWarning, setPishachniWarning] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverData, setGameOverData] = useState({});

  // Game timer
  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setGameSession(prev => prev ? {
          ...prev,
          timeElapsed: Date.now() - gameStartTime
        } : null);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState, gameStartTime]);

  // Initialize game session
  useEffect(() => {
    initializeGame();
  }, []);

  // Pishachni random appearances
  useEffect(() => {
    if (gameState === 'playing' && !activeMiniGame) {
      const pishachniTimer = setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every 3 seconds
          showPishachniWarning();
        }
      }, 3000);
      return () => clearInterval(pishachniTimer);
    }
  }, [gameState, activeMiniGame]);

  const initializeGame = async () => {
    try {
      const selectedCharacter = JSON.parse(localStorage.getItem('selectedCharacter') || '{}');
      const newSession = await gameSessionService.create({
        playerId: 'player-1',
        character: selectedCharacter,
        isActive: true
      });
      setGameSession(newSession);
      setGameStartTime(Date.now());
    } catch (error) {
      toast.error('Failed to start game');
      navigate('/home');
    }
  };

  const showPishachniWarning = () => {
    setPishachniWarning(true);
    // Screen shake effect
    document.body.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      setPishachniWarning(false);
      document.body.style.animation = '';
      // Small chance of losing a life
      if (Math.random() < 0.2) {
        handleLifeLoss("Pishachni surprised you!");
      }
    }, 1500);
  };

  const handleRoomSelect = async (roomId) => {
    if (roomId === currentRoom) return;
    
    setCurrentRoom(roomId);
    
    // Load mini-game for this room
    try {
      const miniGame = await miniGameService.generateRandomChallenge(roomId);
      if (miniGame) {
        setActiveMiniGame(miniGame);
      }
    } catch (error) {
      console.error('Failed to load mini-game:', error);
    }
  };

  const handleMiniGameComplete = async (score) => {
    if (!gameSession || !activeMiniGame) return;
    
    try {
      // Update session score
      const newScore = gameSession.score + score;
      await gameSessionService.update(gameSession.id, { score: newScore });
      
      // Mark room as completed
      if (!completedRooms.includes(currentRoom)) {
        setCompletedRooms(prev => [...prev, currentRoom]);
      }
      
      // Update game session
      setGameSession(prev => ({ ...prev, score: newScore }));
      setActiveMiniGame(null);
      
      toast.success(`Room completed! +${score} points!`);
      
      // Check if all rooms completed
      const allRooms = ['mansion-entrance', 'garlic-kitchen', 'dance-hall', 'bathroom', 'mirror-room'];
      const newCompletedRooms = [...completedRooms, currentRoom];
      if (newCompletedRooms.length >= allRooms.length) {
        handleGameWin();
      }
    } catch (error) {
      toast.error('Failed to save progress');
    }
  };

  const handleMiniGameFail = () => {
    setActiveMiniGame(null);
    handleLifeLoss("Failed the challenge!");
  };

  const handleLifeLoss = async (reason) => {
    if (!gameSession) return;
    
    try {
      const updatedSession = await gameSessionService.loseLife(gameSession.id);
      setGameSession(updatedSession);
      
      if (updatedSession.lives <= 0) {
        handleGameOver(reason);
      } else {
        toast.warn(`${reason} Lives remaining: ${updatedSession.lives}`);
      }
    } catch (error) {
      toast.error('Game error occurred');
    }
  };

  const handleGameOver = async (reason) => {
    if (!gameSession) return;
    
    setGameState('gameOver');
    
    try {
      // Update high score if needed
      const player = await playerService.getCurrentPlayer();
      const isNewRecord = gameSession.score > (player?.highScore || 0);
      
      if (isNewRecord) {
        await playerService.updateHighScore('player-1', gameSession.score);
      }
      
      setGameOverData({
        score: gameSession.score,
        highScore: player?.highScore || 0,
        isNewRecord,
        deathMessage: reason
      });
      
      setShowGameOver(true);
    } catch (error) {
      console.error('Failed to save high score:', error);
    }
  };

  const handleGameWin = async () => {
    if (!gameSession) return;
    
    const bonusScore = 1000;
    const finalScore = gameSession.score + bonusScore;
    
    try {
      await gameSessionService.update(gameSession.id, { score: finalScore });
      const player = await playerService.getCurrentPlayer();
      const isNewRecord = finalScore > (player?.highScore || 0);
      
      if (isNewRecord) {
        await playerService.updateHighScore('player-1', finalScore);
      }
      
      setGameOverData({
        score: finalScore,
        highScore: player?.highScore || 0,
        isNewRecord,
        deathMessage: "Congratulations! You've escaped Pishachni's mansion! 🎉"
      });
      
      setShowGameOver(true);
      toast.success('You won! All rooms completed!');
    } catch (error) {
      console.error('Failed to save victory:', error);
    }
  };

  const handleRestart = () => {
    setShowGameOver(false);
    setGameState('playing');
    setCurrentRoom('mansion-entrance');
    setCompletedRooms([]);
    setActiveMiniGame(null);
    initializeGame();
  };

  const handlePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  if (!gameSession) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">👻</div>
          <p className="text-white font-body text-lg">Loading your adventure...</p>
        </div>
      </div>
    );
  }

return (
<div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 overflow-auto scrollbar-theme">
      {/* Game HUD */}
      <div className="relative z-20">
        <GameHUD
          score={gameSession.score}
          lives={gameSession.lives}
          timeElapsed={gameSession.timeElapsed}
          activePowerUps={gameSession.activePowerUps || []}
          currentRoom={currentRoom}
          className="m-4"
        />
      </div>

{/* Main Game Area */}
<div className="flex-1 p-4 relative overflow-y-auto overflow-x-hidden scrollbar-theme">
        <AnimatePresence mode="wait">
          {activeMiniGame ? (
            <motion.div
              key="minigame"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="h-full flex items-center justify-center"
            >
              <MiniGameInterface
                gameType={activeMiniGame.taskType}
                timeLimit={activeMiniGame.timeLimit}
                onComplete={handleMiniGameComplete}
                onFail={handleMiniGameFail}
                className="w-full max-w-md"
              />
            </motion.div>
          ) : (
            <motion.div
              key="mansion"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full flex flex-col items-center justify-center"
            >
              <MansionMap
                currentRoom={currentRoom}
                completedRooms={completedRooms}
                onRoomSelect={handleRoomSelect}
                className="w-full max-w-lg mb-6"
              />
              
              <div className="text-center">
                <p className="text-white font-body mb-4">
                  Tap a room to enter and face the challenge!
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handlePause}
                    className="bg-game-panel border-2 border-warning text-warning px-4 py-2 rounded-lg font-body"
                  >
                    {gameState === 'paused' ? '▶️ Resume' : '⏸️ Pause'}
                  </button>
                  <button
                    onClick={() => navigate('/home')}
                    className="bg-game-panel border-2 border-error text-error px-4 py-2 rounded-lg font-body"
                  >
                    🏠 Quit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pishachni Warning Overlay */}
      <AnimatePresence>
        {pishachniWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-600 bg-opacity-20 flex items-center justify-center z-30 pointer-events-none"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ duration: 0.5 }}
              className="text-9xl"
            >
              👻
            </motion.div>
            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-32 text-4xl font-display text-error text-center glow-effect"
            >
              PISHACHNI APPROACHES!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={showGameOver}
        score={gameOverData.score}
        highScore={gameOverData.highScore}
        isNewRecord={gameOverData.isNewRecord}
        deathMessage={gameOverData.deathMessage}
        onRestart={handleRestart}
        onHome={() => navigate('/home')}
      />

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40"
        >
          <div className="text-center">
            <div className="text-6xl mb-4">⏸️</div>
            <h2 className="text-4xl font-display text-accent mb-6">Game Paused</h2>
            <button
              onClick={handlePause}
              className="bg-primary text-white px-8 py-4 rounded-2xl font-body text-xl border-4 border-primary hover:bg-purple-600"
            >
              Resume Game
            </button>
          </div>
        </motion.div>
      )}

      {/* Background ambiance */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-10"
            animate={{
              x: [0, 50, -50, 0],
              y: [0, -100, 50, 0],
              rotate: [0, 180, 360],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 8 + i * 1.5,
              repeat: Infinity,
              delay: i * 0.8,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {['👻', '🎃', '🕷️', '🦇', '⚡', '✨', '💀', '🔮', '🕯️', '🌙'][i]}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Game;