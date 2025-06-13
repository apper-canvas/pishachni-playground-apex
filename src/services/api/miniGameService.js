import miniGameData from '../mockData/miniGame.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let miniGames = [...miniGameData];

const miniGameService = {
  async getAll() {
    await delay(300);
    return [...miniGames];
  },

  async getById(id) {
    await delay(200);
    const game = miniGames.find(g => g.id === id);
    return game ? { ...game } : null;
  },

  async getByRoomId(roomId) {
    await delay(250);
    const games = miniGames.filter(g => g.roomId === roomId);
    return games.map(g => ({ ...g }));
  },

  async create(miniGame) {
    await delay(400);
    const newMiniGame = {
      ...miniGame,
      id: Date.now().toString(),
      completed: false
    };
    miniGames.push(newMiniGame);
    return { ...newMiniGame };
  },

  async update(id, updates) {
    await delay(300);
    const index = miniGames.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Mini-game not found');
    
    miniGames[index] = { ...miniGames[index], ...updates };
    return { ...miniGames[index] };
  },

  async delete(id) {
    await delay(250);
    const index = miniGames.findIndex(g => g.id === id);
    if (index === -1) throw new Error('Mini-game not found');
    
    miniGames.splice(index, 1);
    return true;
  },

  async completeGame(id, score = 0) {
    await delay(300);
    return await this.update(id, { 
      completed: true, 
      completedAt: Date.now(),
      score 
    });
  },

  async generateRandomChallenge(roomId) {
    await delay(200);
    const roomGames = await this.getByRoomId(roomId);
    if (roomGames.length === 0) return null;
    
    const randomGame = roomGames[Math.floor(Math.random() * roomGames.length)];
    return { ...randomGame };
  }
};

export default miniGameService;