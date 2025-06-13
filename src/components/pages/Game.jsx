import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import GameHUD from '@/components/molecules/GameHUD';
import GameOverModal from '@/components/organisms/GameOverModal';
import { gameSessionService, playerService } from '@/services';
import { toast } from 'react-toastify';

const Game = () => {
  const navigate = useNavigate();
  const gameLoopRef = useRef();
  const [gameSession, setGameSession] = useState(null);
  const [gameState, setGameState] = useState('playing'); // playing, paused, gameOver
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameOverData, setGameOverData] = useState({});

  // Runner game state
  const [playerY, setPlayerY] = useState(50); // Player vertical position (percentage)
  const [isJumping, setIsJumping] = useState(false);
  const [isDucking, setIsDucking] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [gameSpeed, setGameSpeed] = useState(2);
  const [distance, setDistance] = useState(0);
  const [backgroundOffset, setBackgroundOffset] = useState(0);
  const [pishachniDistance, setPishachniDistance] = useState(100);
  const [pishachniWarning, setPishachniWarning] = useState(false);

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

  // Main game loop
  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(() => {
        updateGame();
      }, 50); // 20 FPS
      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameState, playerY, obstacles, gameSpeed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (gameState !== 'playing') return;
      
      switch (event.code) {
        case 'Space':
        case 'ArrowUp':
          event.preventDefault();
          handleJump();
          break;
        case 'ArrowDown':
          event.preventDefault();
          handleDuck();
          break;
      }
    };

    const handleKeyUp = (event) => {
      if (event.code === 'ArrowDown') {
        setIsDucking(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, isJumping]);

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

  const updateGame = () => {
    // Update background scroll
    setBackgroundOffset(prev => (prev + gameSpeed) % 100);
    
    // Update distance and score
    setDistance(prev => {
      const newDistance = prev + gameSpeed;
      if (gameSession) {
        const newScore = Math.floor(newDistance / 10);
        setGameSession(prevSession => ({
          ...prevSession,
          score: newScore
        }));
      }
      return newDistance;
    });

    // Increase game speed over time
    setGameSpeed(prev => Math.min(prev + 0.001, 6));

    // Generate obstacles
    setObstacles(prev => {
      let newObstacles = [...prev];
      
      // Add new obstacles randomly
      if (Math.random() < 0.02 + (gameSpeed * 0.005)) {
        const obstacleTypes = ['cow', 'rock', 'tree'];
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        newObstacles.push({
          id: Date.now(),
          type,
          x: 100,
          y: type === 'rock' ? 75 : 70,
          width: type === 'cow' ? 12 : 8,
          height: type === 'cow' ? 15 : 10
        });
      }

      // Move obstacles left
      newObstacles = newObstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - gameSpeed
      }));

      // Remove off-screen obstacles
      newObstacles = newObstacles.filter(obstacle => obstacle.x > -10);

      return newObstacles;
    });

    // Update Pishachni chase
    setPishachniDistance(prev => {
      const newDistance = Math.max(prev - 0.1, 20);
      if (newDistance < 30 && !pishachniWarning) {
        showPishachniWarning();
      }
      return newDistance;
    });

    // Check collisions
    checkCollisions();
  };

  const checkCollisions = () => {
    const playerRect = {
      x: 15,
      y: isDucking ? playerY + 5 : playerY,
      width: 8,
      height: isDucking ? 10 : 15
    };

    obstacles.forEach(obstacle => {
      if (
        playerRect.x < obstacle.x + obstacle.width &&
        playerRect.x + playerRect.width > obstacle.x &&
        playerRect.y < obstacle.y + obstacle.height &&
        playerRect.y + playerRect.height > obstacle.y
      ) {
        handleCollision(obstacle.type);
      }
    });
  };

  const handleCollision = (obstacleType) => {
    const messages = {
      cow: "You ran into a sacred cow! 🐄",
      rock: "You tripped over a rock! 🪨", 
      tree: "You crashed into a tree! 🌳"
    };
    handleLifeLoss(messages[obstacleType] || "You hit an obstacle!");
  };

  const handleJump = () => {
    if (isJumping || isDucking) return;
    
    setIsJumping(true);
    setPlayerY(25); // Jump height
    
    setTimeout(() => {
      setPlayerY(50); // Return to ground
      setTimeout(() => {
        setIsJumping(false);
      }, 100);
    }, 300);
  };

  const handleDuck = () => {
    if (isJumping) return;
    setIsDucking(true);
    setPlayerY(55); // Duck position
  };

  const showPishachniWarning = () => {
    setPishachniWarning(true);
    document.body.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
      setPishachniWarning(false);
      document.body.style.animation = '';
      // Pishachni catch chance increases as she gets closer
      if (pishachniDistance < 25 && Math.random() < 0.3) {
        handleLifeLoss("Pishachni caught up to you!");
      }
    }, 1500);
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
        // Reset Pishachni distance slightly
        setPishachniDistance(prev => Math.min(prev + 10, 100));
      }
    } catch (error) {
      toast.error('Game error occurred');
    }
  };

  const handleGameOver = async (reason) => {
    if (!gameSession) return;
    
    setGameState('gameOver');
    
    try {
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

  const handleRestart = () => {
    setShowGameOver(false);
    setGameState('playing');
    setPlayerY(50);
    setIsJumping(false);
    setIsDucking(false);
    setObstacles([]);
    setGameSpeed(2);
    setDistance(0);
    setBackgroundOffset(0);
    setPishachniDistance(100);
    initializeGame();
  };

  const handlePause = () => {
    setGameState(gameState === 'playing' ? 'paused' : 'playing');
  };

  if (!gameSession) {
    return (
      <div className="min-h-screen bg-game-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏃</div>
          <p className="text-white font-body text-lg">Preparing your escape...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-200 via-yellow-100 to-green-200 overflow-hidden">
      {/* Game HUD */}
      <div className="relative z-20">
        <GameHUD
          score={gameSession.score}
          lives={gameSession.lives}
          timeElapsed={gameSession.timeElapsed}
          activePowerUps={gameSession.activePowerUps || []}
          currentRoom={`Distance: ${Math.floor(distance)}m`}
          className="m-4"
        />
      </div>

      {/* Game Canvas */}
      <div className="relative h-96 overflow-hidden">
        {/* Scrolling Background */}
        <div className="absolute inset-0">
          {/* Sky */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-orange-200"></div>
          
          {/* Mountains */}
          <div 
            className="absolute bottom-0 w-full h-32 opacity-30"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,100 L20,60 L40,80 L60,40 L80,70 L100,50 L100,100 Z' fill='%23654321'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 100px',
              backgroundRepeat: 'repeat-x',
              transform: `translateX(-${backgroundOffset * 0.5}px)`
            }}
          ></div>
          
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-24 bg-green-400"></div>
          <div 
            className="absolute bottom-0 w-full h-4 bg-yellow-600"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 10px, #8B4513 10px, #8B4513 12px)`,
              transform: `translateX(-${backgroundOffset * 2}px)`
            }}
          ></div>
        </div>

        {/* Player Character */}
        <motion.div
          className="absolute z-10 text-4xl"
          style={{ 
            left: '15%', 
            bottom: `${100 - playerY - 15}%`,
            transform: isDucking ? 'scaleY(0.7)' : 'scaleY(1)'
          }}
          animate={{ 
            rotate: isJumping ? [0, 360] : 0,
            y: isJumping ? [0, -20, 0] : 0
          }}
          transition={{ duration: 0.3 }}
        >
          🏃‍♂️
        </motion.div>

        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="absolute z-5 text-2xl"
            style={{
              left: `${obstacle.x}%`,
              bottom: `${100 - obstacle.y - obstacle.height}%`,
            }}
          >
            {obstacle.type === 'cow' && '🐄'}
            {obstacle.type === 'rock' && '🪨'}
            {obstacle.type === 'tree' && '🌳'}
          </div>
        ))}

        {/* Pishachni Chasing */}
        <motion.div
          className="absolute z-5 text-5xl"
          style={{ 
            left: `${Math.max(-10, -pishachniDistance + 10)}%`, 
            bottom: '25%' 
          }}
          animate={{ 
            scale: [1, 1.1, 1],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 1, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          👻
        </motion.div>

        {/* Control Instructions */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-3 rounded-lg text-sm">
          <p>⬆️ SPACE/UP: Jump</p>
          <p>⬇️ DOWN: Duck</p>
          <p>🏃‍♂️ Avoid obstacles!</p>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center space-x-4 mt-6">
        <button
          onClick={handlePause}
          className="bg-game-panel border-2 border-warning text-warning px-6 py-3 rounded-lg font-body text-lg"
        >
          {gameState === 'paused' ? '▶️ Resume' : '⏸️ Pause'}
        </button>
        <button
          onClick={() => navigate('/home')}
          className="bg-game-panel border-2 border-error text-error px-6 py-3 rounded-lg font-body text-lg"
        >
          🏠 Quit
        </button>
      </div>

      {/* Mobile Touch Controls */}
      <div className="flex justify-center space-x-8 mt-4 md:hidden">
        <button
          onTouchStart={handleJump}
          className="bg-blue-500 text-white text-4xl w-20 h-20 rounded-full flex items-center justify-center"
        >
          ⬆️
        </button>
        <button
          onTouchStart={handleDuck}
          onTouchEnd={() => setIsDucking(false)}
          className="bg-green-500 text-white text-4xl w-20 h-20 rounded-full flex items-center justify-center"
        >
          ⬇️
        </button>
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
                scale: [1, 1.3, 1],
                rotate: [0, -10, 10, 0]
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
              PISHACHNI IS CATCHING UP!
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
              Resume Running
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Game;