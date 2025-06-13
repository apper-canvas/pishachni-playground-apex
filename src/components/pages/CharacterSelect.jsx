import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import CharacterGrid from '@/components/organisms/CharacterGrid';
import ApperIcon from '@/components/ApperIcon';

const CharacterSelect = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
  };

  const handleStartGame = () => {
    if (!selectedCharacter) {
      // Auto-select first available character
      setSelectedCharacter({
        id: 'avatar-1', 
        type: 'avatar-1', 
        name: 'Classic Hero'
      });
    }
    // Store selected character in localStorage for the game
    localStorage.setItem('selectedCharacter', JSON.stringify(selectedCharacter));
    navigate('/game');
  };

  return (
<div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 overflow-y-auto scrollbar-theme">
      <div className="container mx-auto px-6 py-8">
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
                  "0 0 10px #8B00FF",
                  "0 0 20px #8B00FF",
                  "0 0 10px #8B00FF"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl font-display text-primary glow-effect"
            >
              Choose Your Hero
            </motion.h1>
            
            <div className="w-20" /> {/* Spacer for center alignment */}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
className="text-accent font-body text-lg max-w-md mx-auto"
          >
            Pick your runner and prepare to escape Pishachni in an endless chase through India!
          </motion.p>
        </motion.div>

        {/* Character Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <CharacterGrid
            selectedCharacter={selectedCharacter}
            onCharacterSelect={handleCharacterSelect}
            className="mb-8"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              onClick={handleStartGame}
              variant="primary"
              size="xl"
              icon="Gamepad2"
              disabled={!selectedCharacter}
              className="flex-1"
            >
              Start Adventure
            </Button>
            
            <Button
              onClick={() => navigate('/home')}
              variant="outline"
              size="xl"
              icon="Home"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>

          {!selectedCharacter && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-warning text-sm font-body mt-4"
            >
              Select a character to continue
            </motion.p>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div className="bg-game-panel border-2 border-primary rounded-2xl p-6">
            <h3 className="text-xl font-display text-accent mb-4 text-center glow-effect">
              💡 Pro Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm font-body text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-accent">🏃</span>
                <p>Each character has unique abilities that can help you survive different rooms</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-warning">🔓</span>
                <p>Complete challenges to unlock new characters and customizations</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-success">⚡</span>
                <p>Some characters are better at specific mini-games than others</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-info">🎭</span>
                <p>Your humor stat affects how Pishachni reacts to your choices</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating spirits for ambiance */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-20"
              animate={{
                x: [0, 60, -60, 0],
                y: [0, -120, 40, 0],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 6 + i * 1.5,
                repeat: Infinity,
                delay: i * 1,
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
            >
              {['👻', '🎃', '🕷️', '🦇', '✨', '💀'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;