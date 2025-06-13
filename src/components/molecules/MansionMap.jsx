import { motion } from 'framer-motion';
import GameButton from '@/components/atoms/GameButton';

const MansionMap = ({ 
  currentRoom = 'mansion-entrance',
  completedRooms = [],
  onRoomSelect,
  className = ''
}) => {
  const rooms = [
    {
      id: 'mansion-entrance',
      name: 'Entrance',
      icon: 'Home',
      position: { x: 50, y: 80 },
      emoji: '🏚️'
    },
    {
      id: 'garlic-kitchen',
      name: 'Kitchen',
      icon: 'ChefHat',
      position: { x: 20, y: 50 },
      emoji: '🧄'
    },
    {
      id: 'dance-hall',
      name: 'Dance Hall',
      icon: 'Music',
      position: { x: 80, y: 50 },
      emoji: '💃'
    },
    {
      id: 'bathroom',
      name: 'Bathroom',
      icon: 'Droplets',
      position: { x: 20, y: 20 },
      emoji: '🚽'
    },
    {
      id: 'mirror-room',
      name: 'Mirror Room',
      icon: 'Eye',
      position: { x: 80, y: 20 },
      emoji: '🪞'
    }
  ];

  const isRoomAvailable = (roomId) => {
    if (roomId === 'mansion-entrance') return true;
    return completedRooms.includes('mansion-entrance');
  };

  const isRoomCompleted = (roomId) => {
    return completedRooms.includes(roomId);
  };

  return (
    <div className={`relative bg-game-panel border-4 border-primary rounded-2xl p-6 aspect-square ${className}`}>
      {/* Mansion background */}
      <div className="absolute inset-4 bg-gradient-to-b from-purple-900 to-purple-800 rounded-xl opacity-50" />
      
      {/* Connecting paths */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Entrance to Kitchen */}
        <line 
          x1="50%" y1="80%" 
          x2="20%" y2="50%" 
          stroke="#8B00FF" 
          strokeWidth="3" 
          strokeDasharray="5,5"
          className="opacity-60"
        />
        {/* Entrance to Dance Hall */}
        <line 
          x1="50%" y1="80%" 
          x2="80%" y2="50%" 
          stroke="#8B00FF" 
          strokeWidth="3" 
          strokeDasharray="5,5"
          className="opacity-60"
        />
        {/* Kitchen to Bathroom */}
        <line 
          x1="20%" y1="50%" 
          x2="20%" y2="20%" 
          stroke="#8B00FF" 
          strokeWidth="3" 
          strokeDasharray="5,5"
          className="opacity-60"
        />
        {/* Dance Hall to Mirror Room */}
        <line 
          x1="80%" y1="50%" 
          x2="80%" y2="20%" 
          stroke="#8B00FF" 
          strokeWidth="3" 
          strokeDasharray="5,5"
          className="opacity-60"
        />
      </svg>

      {/* Room buttons */}
      {rooms.map((room) => {
        const available = isRoomAvailable(room.id);
        const completed = isRoomCompleted(room.id);
        const current = currentRoom === room.id;

        return (
          <motion.div
            key={room.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${room.position.x}%`, top: `${room.position.y}%` }}
            whileHover={available ? { scale: 1.1 } : {}}
            whileTap={available ? { scale: 0.9 } : {}}
          >
            <motion.button
              className={`
                w-16 h-16 rounded-full border-4 font-body text-2xl
                transition-all duration-300 relative
                ${current 
                  ? 'bg-accent border-accent text-black neon-glow animate-pulse-glow' 
                  : completed
                  ? 'bg-success border-success text-black'
                  : available
                  ? 'bg-game-panel border-primary text-white hover:border-accent'
                  : 'bg-gray-600 border-gray-500 text-gray-400 cursor-not-allowed'
                }
              `}
              disabled={!available}
              onClick={() => available && onRoomSelect?.(room.id)}
              whileHover={available ? { y: -2 } : {}}
            >
              <span className="relative z-10">{room.emoji}</span>
              
              {/* Pulsing glow for current room */}
              {current && (
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-accent rounded-full"
                />
              )}
              
              {/* Completion checkmark */}
              {completed && !current && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center text-black text-sm"
                >
                  ✓
                </motion.div>
              )}
              
              {/* Lock icon for unavailable rooms */}
              {!available && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm">🔒</span>
                </div>
              )}
            </motion.button>
            
            {/* Room name */}
            <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className={`text-xs font-body ${
                current ? 'text-accent' : 
                completed ? 'text-success' : 
                available ? 'text-white' : 'text-gray-400'
              }`}>
                {room.name}
              </span>
            </div>
          </motion.div>
        );
      })}
      
      {/* Pishachni indicator */}
      <motion.div
        animate={{ 
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity }
        }}
        className="absolute top-4 right-4 text-3xl"
        title="Pishachni is lurking..."
      >
        👻
      </motion.div>
    </div>
  );
};

export default MansionMap;