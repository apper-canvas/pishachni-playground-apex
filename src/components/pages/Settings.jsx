import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    soundEnabled: true,
    musicEnabled: true,
    jumpScaresEnabled: true,
    difficulty: 'normal', // easy, normal, hard
    vibrationEnabled: true,
    notifications: true
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      setSettings(prevSettings => ({
        ...prevSettings,
        ...JSON.parse(savedSettings)
      }));
    }
  };

  const saveSettings = (newSettings) => {
    localStorage.setItem('gameSettings', JSON.stringify(newSettings));
    setSettings(newSettings);
    toast.success('Settings saved!');
  };

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleDifficultyChange = (difficulty) => {
    const newSettings = { ...settings, difficulty };
    saveSettings(newSettings);
  };

  const resetToDefaults = () => {
    const defaultSettings = {
      soundEnabled: true,
      musicEnabled: true,
      jumpScaresEnabled: true,
      difficulty: 'normal',
      vibrationEnabled: true,
      notifications: true
    };
    saveSettings(defaultSettings);
    toast.info('Settings reset to defaults');
  };

  const clearGameData = () => {
    if (window.confirm('Are you sure you want to clear all game data? This cannot be undone!')) {
      localStorage.removeItem('gameOverData');
      localStorage.removeItem('selectedCharacter');
      localStorage.removeItem('highScore');
      toast.success('Game data cleared');
    }
  };

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-game-panel rounded-lg border-2 border-primary">
      <div className="flex-1">
        <h3 className="text-white font-body font-bold">{label}</h3>
        {description && (
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        )}
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
          enabled ? 'bg-accent' : 'bg-gray-600'
        }`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
        />
      </motion.button>
    </div>
  );

  const DifficultySelector = () => (
    <div className="bg-game-panel rounded-lg border-2 border-primary p-4">
      <h3 className="text-white font-body font-bold mb-4">Difficulty Level</h3>
      <div className="grid grid-cols-3 gap-2">
        {[
          { key: 'easy', label: 'Easy', emoji: '😊', color: 'success' },
          { key: 'normal', label: 'Normal', emoji: '😐', color: 'warning' },
          { key: 'hard', label: 'Hard', emoji: '😰', color: 'error' }
        ].map((diff) => (
          <motion.button
            key={diff.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDifficultyChange(diff.key)}
            className={`p-3 rounded-lg font-body text-sm border-2 transition-all ${
              settings.difficulty === diff.key
                ? `border-${diff.color} bg-${diff.color} bg-opacity-20 text-${diff.color}`
                : 'border-gray-600 text-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="text-2xl mb-1">{diff.emoji}</div>
            {diff.label}
          </motion.button>
        ))}
      </div>
      <p className="text-gray-400 text-xs mt-2">
        {settings.difficulty === 'easy' && 'Slower Pishachni, more time for mini-games'}
        {settings.difficulty === 'normal' && 'Balanced gameplay experience'}
        {settings.difficulty === 'hard' && 'Faster Pishachni, less time, more challenge!'}
      </p>
    </div>
  );

  return (
<div className="min-h-screen bg-gradient-to-b from-game-bg to-purple-900 overflow-y-auto scrollbar-theme">
      <div className="container mx-auto px-6 py-8 max-w-2xl">
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
              Settings
            </motion.h1>
            
            <div className="w-20" />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-accent font-body"
          >
            Customize your Pishachni experience
          </motion.p>
        </motion.div>

        {/* Settings Sections */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Audio Settings */}
          <div>
            <h2 className="text-2xl font-display text-accent mb-4 glow-effect">🔊 Audio</h2>
            <div className="space-y-3">
              <ToggleSwitch
                enabled={settings.soundEnabled}
                onToggle={() => handleToggle('soundEnabled')}
                label="Sound Effects"
                description="Spooky sounds and game audio"
              />
              <ToggleSwitch
                enabled={settings.musicEnabled}
                onToggle={() => handleToggle('musicEnabled')}
                label="Background Music"
                description="Atmospheric music and themes"
              />
            </div>
          </div>

          {/* Gameplay Settings */}
          <div>
            <h2 className="text-2xl font-display text-accent mb-4 glow-effect">🎮 Gameplay</h2>
            <div className="space-y-3">
              <ToggleSwitch
                enabled={settings.jumpScaresEnabled}
                onToggle={() => handleToggle('jumpScaresEnabled')}
                label="Jump Scares"
                description="Sudden Pishachni appearances"
              />
              <DifficultySelector />
            </div>
          </div>

          {/* Device Settings */}
          <div>
            <h2 className="text-2xl font-display text-accent mb-4 glow-effect">📱 Device</h2>
            <div className="space-y-3">
              <ToggleSwitch
                enabled={settings.vibrationEnabled}
                onToggle={() => handleToggle('vibrationEnabled')}
                label="Vibration"
                description="Haptic feedback for scares and actions"
              />
              <ToggleSwitch
                enabled={settings.notifications}
                onToggle={() => handleToggle('notifications')}
                label="Notifications"
                description="Daily challenges and reminders"
              />
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h2 className="text-2xl font-display text-accent mb-4 glow-effect">💾 Data</h2>
            <div className="space-y-3">
              <div className="bg-game-panel rounded-lg border-2 border-primary p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-white font-body font-bold">Reset Settings</h3>
                    <p className="text-gray-400 text-sm mt-1">Restore all settings to default values</p>
                  </div>
                  <Button
                    onClick={resetToDefaults}
                    variant="outline"
                    size="sm"
                    icon="RotateCcw"
                  >
                    Reset
                  </Button>
                </div>
              </div>
              
              <div className="bg-game-panel rounded-lg border-2 border-error p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-error font-body font-bold">Clear Game Data</h3>
                    <p className="text-gray-400 text-sm mt-1">Delete scores, progress, and unlocks</p>
                  </div>
                  <Button
                    onClick={clearGameData}
                    variant="danger"
                    size="sm"
                    icon="Trash2"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* App Info */}
          <div>
            <h2 className="text-2xl font-display text-accent mb-4 glow-effect">ℹ️ About</h2>
            <div className="bg-game-panel rounded-lg border-2 border-primary p-6 text-center">
              <div className="text-6xl mb-4">👻</div>
              <h3 className="text-2xl font-display text-primary mb-2">Pishachni Playground</h3>
              <p className="text-gray-300 font-body text-sm mb-4">
                A hilariously spooky arcade adventure
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Version 1.0.0</p>
                <p>Built with React & Tailwind</p>
                <p>© 2024 Pishachni Studios</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={() => navigate('/home')}
            variant="primary"
            size="lg"
            icon="Home"
            className="w-full max-w-md"
          >
            Return to Game
          </Button>
        </motion.div>

        {/* Floating settings gears */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-10"
              animate={{
                rotate: [0, 360],
                x: [0, 30, -30, 0],
                y: [0, -50, 20, 0],
              }}
              transition={{
                rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                x: { duration: 6 + i, repeat: Infinity },
                y: { duration: 4 + i, repeat: Infinity },
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 20}%`,
              }}
            >
              ⚙️
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;