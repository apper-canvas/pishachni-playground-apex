import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameButton from '@/components/atoms/GameButton';
import ApperIcon from '@/components/ApperIcon';

const MiniGameInterface = ({ 
  gameType,
  timeLimit = 30000,
  onComplete,
  onFail,
  className = ''
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [gameState, setGameState] = useState('waiting'); // waiting, playing, completed, failed
  const [score, setScore] = useState(0);
  const [gameData, setGameData] = useState({});

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 100);
      }, 100);
      return () => clearTimeout(timer);
    } else if (gameState === 'playing' && timeLeft <= 0) {
      handleGameFail();
    }
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(timeLimit);
    setScore(0);
    initializeGameData();
  };

  const handleGameComplete = (finalScore = score) => {
    setGameState('completed');
    onComplete?.(finalScore);
  };

  const handleGameFail = () => {
    setGameState('failed');
    onFail?.();
  };

  const initializeGameData = () => {
    switch (gameType) {
      case 'garlic-cooking':
        setGameData({ 
          garlicCount: 0, 
          targetCount: 20,
          pishachniAppears: false
        });
        break;
      case 'dance-battle':
        setGameData({ 
          sequence: generateDanceSequence(5),
          currentStep: 0,
          playerSequence: []
        });
        break;
      case 'toilet-paper-mummy':
        setGameData({ 
          wrapProgress: 0,
          targetProgress: 100,
          swipeCount: 0
        });
        break;
      case 'mirror-madness':
        setGameData({ 
          currentRiddle: 0,
          riddles: generateRiddles(),
          correctAnswers: 0
        });
        break;
      default:
        setGameData({});
    }
  };

  const generateDanceSequence = (length) => {
    const moves = ['👆', '👇', '👈', '👉', '👏', '🤸'];
    return Array.from({ length }, () => moves[Math.floor(Math.random() * moves.length)]);
  };

  const generateRiddles = () => [
    {
      question: "What do you call a ghost's favorite dessert?",
      options: ["Boo-berry pie", "Spook-etti", "Ghoul-ash", "Phantom fudge"],
      correct: 0
    },
    {
      question: "Why don't spirits ever get tired?",
      options: ["They sleep all day", "They're dead inside", "They have no body to rest", "They drink ghost coffee"],
      correct: 2
    },
    {
      question: "What's Pishachni's favorite dance move?",
      options: ["The Monster Mash", "The Thriller", "The Spook Shuffle", "The Haunted Hip-Hop"],
      correct: 2
    }
  ];

  const progressPercentage = ((timeLimit - timeLeft) / timeLimit) * 100;

  const renderGameContent = () => {
    switch (gameType) {
      case 'garlic-cooking':
        return <GarlicCookingGame gameData={gameData} setGameData={setGameData} setScore={setScore} onComplete={handleGameComplete} />;
      case 'dance-battle':
        return <DanceBattleGame gameData={gameData} setGameData={setGameData} setScore={setScore} onComplete={handleGameComplete} />;
      case 'toilet-paper-mummy':
        return <ToiletPaperGame gameData={gameData} setGameData={setGameData} setScore={setScore} onComplete={handleGameComplete} />;
      case 'mirror-madness':
        return <MirrorMadnessGame gameData={gameData} setGameData={setGameData} setScore={setScore} onComplete={handleGameComplete} />;
      default:
        return <div className="text-center text-white">Unknown game type</div>;
    }
  };

  if (gameState === 'waiting') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-game-panel border-4 border-primary rounded-2xl p-6 text-center ${className}`}
      >
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-2xl font-display text-accent mb-4">Ready to Play?</h3>
        <p className="text-white mb-6">You have {timeLimit / 1000} seconds to complete this challenge!</p>
        <GameButton onClick={startGame} variant="game" size="lg">
          Start Game
        </GameButton>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`bg-game-panel border-4 border-primary rounded-2xl p-6 ${className}`}
    >
      {/* Timer bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-body">Time Left</span>
          <span className="text-accent font-body font-bold">{Math.ceil(timeLeft / 1000)}s</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <motion.div
            className="bg-gradient-to-r from-accent to-warning h-3 rounded-full"
            style={{ width: `${Math.max(0, (timeLeft / timeLimit) * 100)}%` }}
            animate={{ opacity: timeLeft < 5000 ? [1, 0.5, 1] : 1 }}
            transition={{ duration: 0.5, repeat: timeLeft < 5000 ? Infinity : 0 }}
          />
        </div>
      </div>

      {/* Score */}
      <div className="text-center mb-4">
        <span className="text-warning font-body text-xl font-bold">Score: {score}</span>
      </div>

      {/* Game content */}
      <AnimatePresence mode="wait">
        {renderGameContent()}
      </AnimatePresence>

      {/* Game over states */}
      <AnimatePresence>
        {gameState === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-2xl"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-display text-success mb-2">Success!</h3>
              <p className="text-white text-lg">Final Score: {score}</p>
            </div>
          </motion.div>
        )}
        
        {gameState === 'failed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center rounded-2xl"
          >
            <div className="text-center">
              <div className="text-6xl mb-4">💀</div>
              <h3 className="text-3xl font-display text-error mb-2">Game Over!</h3>
              <p className="text-white text-lg">Pishachni got you!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Individual game components
const GarlicCookingGame = ({ gameData, setGameData, setScore, onComplete }) => {
  const chopGarlic = () => {
    const newCount = gameData.garlicCount + 1;
    setGameData({ ...gameData, garlicCount: newCount });
    setScore(newCount * 10);
    
    if (newCount >= gameData.targetCount) {
      onComplete(newCount * 10);
    }
    
    // Random Pishachni appearance
    if (Math.random() < 0.1) {
      setGameData({ ...gameData, garlicCount: newCount, pishachniAppears: true });
      setTimeout(() => {
        setGameData(prev => ({ ...prev, pishachniAppears: false }));
      }, 1000);
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-display text-accent mb-4">Chop the Garlic!</h3>
      <div className="text-4xl mb-4">🧄</div>
      <p className="text-white mb-4">
        {gameData.garlicCount} / {gameData.targetCount} chopped
      </p>
      
      <motion.div
        animate={{ scale: gameData.pishachniAppears ? [1, 1.2, 1] : 1 }}
        className="mb-4"
      >
        {gameData.pishachniAppears && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl"
          >
            👻
          </motion.div>
        )}
      </motion.div>
      
      <GameButton onClick={chopGarlic} variant="game" size="lg" className="text-4xl">
        🔪 CHOP!
      </GameButton>
    </div>
  );
};

const DanceBattleGame = ({ gameData, setGameData, setScore, onComplete }) => {
  const handleDanceMove = (move) => {
    const newPlayerSequence = [...gameData.playerSequence, move];
    const currentStep = gameData.currentStep;
    
    if (move === gameData.sequence[currentStep]) {
      // Correct move
      const newScore = (currentStep + 1) * 20;
      setScore(newScore);
      
      if (currentStep + 1 >= gameData.sequence.length) {
        // Completed sequence
        onComplete(newScore);
      } else {
        setGameData({
          ...gameData,
          currentStep: currentStep + 1,
          playerSequence: newPlayerSequence
        });
      }
    } else {
      // Wrong move - reset
      setGameData({
        ...gameData,
        currentStep: 0,
        playerSequence: []
      });
      setScore(0);
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-display text-accent mb-4">Follow the Dance!</h3>
      
      {/* Show sequence */}
      <div className="flex justify-center space-x-2 mb-6">
        {gameData.sequence.map((move, index) => (
          <motion.div
            key={index}
            className={`text-3xl p-2 rounded ${
              index < gameData.currentStep ? 'bg-success' :
              index === gameData.currentStep ? 'bg-accent' : 'bg-gray-600'
            }`}
            animate={index === gameData.currentStep ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            {move}
          </motion.div>
        ))}
      </div>
      
      {/* Dance buttons */}
      <div className="grid grid-cols-3 gap-4">
        {['👆', '👇', '👈', '👉', '👏', '🤸'].map((move) => (
          <GameButton
            key={move}
            onClick={() => handleDanceMove(move)}
            variant="game"
            className="text-2xl"
          >
            {move}
          </GameButton>
        ))}
      </div>
    </div>
  );
};

const ToiletPaperGame = ({ gameData, setGameData, setScore, onComplete }) => {
  const handleSwipe = () => {
    const newProgress = Math.min(100, gameData.wrapProgress + 5);
    const newSwipeCount = gameData.swipeCount + 1;
    
    setGameData({
      ...gameData,
      wrapProgress: newProgress,
      swipeCount: newSwipeCount
    });
    
    setScore(newSwipeCount * 5);
    
    if (newProgress >= gameData.targetProgress) {
      onComplete(newSwipeCount * 5);
    }
  };

  return (
    <div className="text-center">
      <h3 className="text-xl font-display text-accent mb-4">Wrap Yourself!</h3>
      <div className="text-6xl mb-4">🧻</div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-700 rounded-full h-6 mb-4">
        <motion.div
          className="bg-gradient-to-r from-white to-gray-300 h-6 rounded-full flex items-center justify-center"
          style={{ width: `${gameData.wrapProgress}%` }}
          layoutId="wrap-progress"
        >
          <span className="text-black text-sm font-bold">{Math.round(gameData.wrapProgress)}%</span>
        </motion.div>
      </div>
      
      <p className="text-white mb-4">Swipe in circles to wrap!</p>
      
      <GameButton 
        onClick={handleSwipe} 
        variant="game" 
        size="lg"
        className="text-2xl"
      >
        🌀 WRAP!
      </GameButton>
    </div>
  );
};

const MirrorMadnessGame = ({ gameData, setGameData, setScore, onComplete }) => {
  const handleAnswer = (answerIndex) => {
    const isCorrect = answerIndex === gameData.riddles[gameData.currentRiddle].correct;
    const newCorrectAnswers = gameData.correctAnswers + (isCorrect ? 1 : 0);
    const newCurrentRiddle = gameData.currentRiddle + 1;
    
    setScore(newCorrectAnswers * 50);
    
    if (newCurrentRiddle >= gameData.riddles.length) {
      onComplete(newCorrectAnswers * 50);
    } else {
      setGameData({
        ...gameData,
        currentRiddle: newCurrentRiddle,
        correctAnswers: newCorrectAnswers
      });
    }
  };

  const currentRiddle = gameData.riddles[gameData.currentRiddle];

  return (
    <div className="text-center">
      <h3 className="text-xl font-display text-accent mb-4">Answer the Riddle!</h3>
      <div className="text-4xl mb-4">🪞</div>
      
      <div className="bg-purple-800 rounded-lg p-4 mb-6">
        <p className="text-white text-lg mb-4">{currentRiddle.question}</p>
        
        <div className="grid grid-cols-1 gap-2">
          {currentRiddle.options.map((option, index) => (
            <GameButton
              key={index}
              onClick={() => handleAnswer(index)}
              variant="game"
              className="text-left"
            >
              {option}
            </GameButton>
          ))}
        </div>
      </div>
      
      <p className="text-accent">
        Question {gameData.currentRiddle + 1} of {gameData.riddles.length}
      </p>
    </div>
  );
};

export default MiniGameInterface;