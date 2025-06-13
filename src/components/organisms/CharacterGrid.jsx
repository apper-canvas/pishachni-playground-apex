import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { playerService } from '@/services';
import { toast } from 'react-toastify';

const CharacterGrid = ({ 
  onCharacterSelect,
  selectedCharacter,
  className = ''
}) => {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableCharacters = [
    { id: 'avatar-1', type: 'avatar-1', name: 'Classic Hero', unlocked: true },
    { id: 'avatar-2', type: 'avatar-2', name: 'Sneaky Detective', unlocked: true },
    { id: 'avatar-3', type: 'avatar-3', name: 'Mystic Wizard', unlocked: true },
    { id: 'garlic-necklace', type: 'garlic-necklace', name: 'Garlic Guardian', unlocked: false },
    { id: 'banana-helmet', type: 'banana-helmet', name: 'Banana Protector', unlocked: false },
    { id: 'duck-slippers', type: 'duck-slippers', name: 'Quack Master', unlocked: false }
  ];

  useEffect(() => {
    loadPlayerData();
  }, []);

  const loadPlayerData = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentPlayer = await playerService.getCurrentPlayer();
      setPlayer(currentPlayer);
    } catch (err) {
      setError(err.message || 'Failed to load player data');
      toast.error('Failed to load character data');
    } finally {
      setLoading(false);
    }
  };

  const handleCharacterSelect = (character) => {
    if (!character.unlocked && player && !player.unlockedItems.includes(character.id)) {
      toast.warn('This character is locked! Complete more challenges to unlock.');
      return;
    }
    onCharacterSelect?.(character);
  };

  const isCharacterUnlocked = (character) => {
    if (character.unlocked) return true;
    return player && player.unlockedItems.includes(character.id);
  };

  if (loading) {
    return (
      <div className={className}>
        <SkeletonLoader count={6} type="avatar" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Character data unavailable"
        message={error}
        onRetry={loadPlayerData}
        className={className}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`${className}`}
    >
      {/* Character Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {availableCharacters.map((character, index) => {
          const unlocked = isCharacterUnlocked(character);
          const selected = selectedCharacter?.id === character.id;

          return (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              {/* Character Avatar */}
              <div className="mb-3">
                <Avatar
                  type={character.type}
                  size="lg"
                  selected={selected}
                  unlocked={unlocked}
                  onClick={() => handleCharacterSelect(character)}
                  className="mx-auto"
                />
              </div>

              {/* Character Name */}
              <h3 className={`font-body text-sm font-bold mb-2 ${
                selected ? 'text-accent' : 
                unlocked ? 'text-white' : 'text-gray-400'
              }`}>
                {character.name}
              </h3>

              {/* Unlock Status */}
              {!unlocked && (
                <div className="text-xs text-gray-500 bg-gray-800 rounded-full px-3 py-1">
                  🔒 Locked
                </div>
              )}

              {/* Selection indicator */}
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-2"
                >
                  <div className="bg-accent text-black text-xs font-bold rounded-full px-3 py-1 inline-block">
                    ✓ Selected
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Character Stats/Info */}
      {selectedCharacter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-game-panel border-2 border-primary rounded-2xl p-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-display text-accent mb-3 glow-effect">
              {selectedCharacter.name}
            </h3>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-purple-800 rounded-lg p-3">
                <div className="text-2xl mb-1">💪</div>
                <p className="text-xs text-gray-300">Courage</p>
                <p className="text-warning font-bold">★★★</p>
              </div>
              <div className="bg-purple-800 rounded-lg p-3">
                <div className="text-2xl mb-1">🏃</div>
                <p className="text-xs text-gray-300">Speed</p>
                <p className="text-info font-bold">★★☆</p>
              </div>
              <div className="bg-purple-800 rounded-lg p-3">
                <div className="text-2xl mb-1">🎭</div>
                <p className="text-xs text-gray-300">Humor</p>
                <p className="text-success font-bold">★★★</p>
              </div>
            </div>

            <p className="text-gray-300 text-sm mt-4 font-body">
              Ready to face Pishachni with style and confidence!
            </p>
          </div>
        </motion.div>
      )}

      {/* Unlock Progress */}
      <div className="mt-6 bg-purple-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-body text-sm">Characters Unlocked</span>
          <span className="text-accent font-body font-bold">
            {availableCharacters.filter(c => isCharacterUnlocked(c)).length} / {availableCharacters.length}
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-accent to-success h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ 
              width: `${(availableCharacters.filter(c => isCharacterUnlocked(c)).length / availableCharacters.length) * 100}%` 
            }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterGrid;