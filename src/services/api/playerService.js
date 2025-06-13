import playerData from '../mockData/player.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let players = [...playerData];

const playerService = {
  async getAll() {
    await delay(300);
    return [...players];
  },

  async getById(id) {
    await delay(200);
    const player = players.find(p => p.id === id);
    return player ? { ...player } : null;
  },

  async create(player) {
    await delay(400);
    const newPlayer = {
      ...player,
      id: Date.now().toString(),
      highScore: 0,
      unlockedItems: ['avatar-1'],
      achievements: []
    };
    players.push(newPlayer);
    return { ...newPlayer };
  },

  async update(id, updates) {
    await delay(300);
    const index = players.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Player not found');
    
    players[index] = { ...players[index], ...updates };
    return { ...players[index] };
  },

  async delete(id) {
    await delay(250);
    const index = players.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Player not found');
    
    players.splice(index, 1);
    return true;
  },

  async getCurrentPlayer() {
    await delay(200);
    // Return first player as current player for single-user game
    return players.length > 0 ? { ...players[0] } : null;
  },

  async updateHighScore(id, score) {
    await delay(300);
    const player = await this.getById(id);
    if (!player) throw new Error('Player not found');
    
    if (score > player.highScore) {
      return await this.update(id, { highScore: score });
    }
    return { ...player };
  }
};

export default playerService;