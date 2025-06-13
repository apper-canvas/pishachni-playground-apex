import gameSessionData from '../mockData/gameSession.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let gameSessions = [...gameSessionData];

const gameSessionService = {
  async getAll() {
    await delay(300);
    return [...gameSessions];
  },

  async getById(id) {
    await delay(200);
    const session = gameSessions.find(s => s.id === id);
    return session ? { ...session } : null;
  },

  async create(session) {
    await delay(400);
    const newSession = {
      ...session,
      id: Date.now().toString(),
      score: 0,
      lives: 3,
      timeElapsed: 0,
      currentRoom: 'mansion-entrance',
      activePowerUps: []
    };
    gameSessions.push(newSession);
    return { ...newSession };
  },

  async update(id, updates) {
    await delay(300);
    const index = gameSessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Game session not found');
    
    gameSessions[index] = { ...gameSessions[index], ...updates };
    return { ...gameSessions[index] };
  },

  async delete(id) {
    await delay(250);
    const index = gameSessions.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Game session not found');
    
    gameSessions.splice(index, 1);
    return true;
  },

  async getCurrentSession() {
    await delay(200);
    // Return the most recent active session
    const activeSessions = gameSessions.filter(s => s.isActive);
    return activeSessions.length > 0 ? { ...activeSessions[0] } : null;
  },

  async addPowerUp(id, powerUpType) {
    await delay(250);
    const session = await this.getById(id);
    if (!session) throw new Error('Session not found');
    
    const activePowerUps = [...session.activePowerUps, {
      type: powerUpType,
      activatedAt: Date.now(),
      duration: 10000 // 10 seconds
    }];
    
    return await this.update(id, { activePowerUps });
  },

  async loseLife(id) {
    await delay(200);
    const session = await this.getById(id);
    if (!session) throw new Error('Session not found');
    
    const newLives = Math.max(0, session.lives - 1);
    const isGameOver = newLives === 0;
    
    return await this.update(id, { 
      lives: newLives,
      isActive: !isGameOver
    });
  }
};

export default gameSessionService;