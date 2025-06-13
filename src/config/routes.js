import Home from '@/components/pages/Home';
import CharacterSelect from '@/components/pages/CharacterSelect';
import Game from '@/components/pages/Game';
import GameOver from '@/components/pages/GameOver';
import Settings from '@/components/pages/Settings';
import Leaderboard from '@/components/pages/Leaderboard';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    component: Home
  },
  characterSelect: {
    id: 'characterSelect',
    label: 'Character Select',
    path: '/character-select',
    component: CharacterSelect
  },
  game: {
    id: 'game',
    label: 'Game',
    path: '/game',
    component: Game
  },
  gameOver: {
    id: 'gameOver',
    label: 'Game Over',
    path: '/game-over',
    component: GameOver
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    component: Settings
  },
  leaderboard: {
    id: 'leaderboard',
    label: 'Leaderboard',
    path: '/leaderboard',
    component: Leaderboard
  }
};

export const routeArray = Object.values(routes);