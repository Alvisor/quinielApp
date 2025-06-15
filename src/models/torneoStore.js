const Torneo = require('./torneo');

class TorneoStore {
  constructor() {
    this.torneos = new Map();
  }

  create(torneoData) {
    const torneo = new Torneo(torneoData);
    this.torneos.set(torneo.id, torneo);
    return torneo;
  }

  get(id) {
    return this.torneos.get(id);
  }

  update(id, updates) {
    const torneo = this.get(id);
    if (!torneo) return null;
    Object.assign(torneo, updates);
    return torneo;
  }
}

module.exports = new TorneoStore();
