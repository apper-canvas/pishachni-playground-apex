import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'default', className = '' }) => {
  const renderSkeleton = (index) => {
    switch (type) {
      case 'avatar':
        return (
          <div key={index} className="flex items-center space-x-4 p-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        );
      
      case 'game-room':
        return (
          <div key={index} className="bg-game-panel border-2 border-purple-600 rounded-2xl p-6">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full mx-auto mb-4 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-2/3 mx-auto mb-2 animate-pulse" />
            <div className="h-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-1/2 mx-auto animate-pulse" />
          </div>
        );
      
      case 'leaderboard':
        return (
          <div key={index} className="flex items-center justify-between p-4 bg-game-panel rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-700 to-purple-600 rounded-full animate-pulse" />
              <div className="h-4 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-24 animate-pulse" />
            </div>
            <div className="h-4 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-16 animate-pulse" />
          </div>
        );
      
      default:
        return (
          <div key={index} className="bg-game-panel rounded-lg p-6 border-2 border-purple-600">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-3/4" />
              <div className="h-4 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-1/2" />
              <div className="h-3 bg-gradient-to-r from-purple-700 to-purple-600 rounded w-2/3" />
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-4 ${className}`}
    >
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          {renderSkeleton(i)}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SkeletonLoader;