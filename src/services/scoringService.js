const torneoStore = require('../models/torneoStore');

function updateScoringParams(torneoId, newParams) {
  const torneo = torneoStore.get(torneoId);
  if (!torneo) {
    throw new Error('Torneo no encontrado');
  }

  if (!torneo.canEditScoring()) {
    throw new Error('Los parámetros de puntuación no se pueden modificar tras el inicio del torneo');
  }

  torneoStore.update(torneoId, { ...newParams });
  return torneoStore.get(torneoId);
}

module.exports = {
  updateScoringParams,
};
