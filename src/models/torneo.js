class Torneo {
  constructor({ id, nombre, fecha_inicio, fecha_fin, scoringLocked = false }) {
    this.id = id;
    this.nombre = nombre;
    this.fecha_inicio = new Date(fecha_inicio);
    this.fecha_fin = fecha_fin ? new Date(fecha_fin) : null;
    // once true, scoring parameters can no longer be edited
    this.scoringLocked = scoringLocked;
  }

  hasStarted() {
    return Date.now() >= this.fecha_inicio.getTime();
  }

  canEditScoring() {
    return !this.hasStarted() && !this.scoringLocked;
  }
}

module.exports = Torneo;
