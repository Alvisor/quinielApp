const express = require('express');
const torneoStore = require('../models/torneoStore');
const { updateScoringParams } = require('../services/scoringService');

const router = express.Router();

// Example route to create torneo (for testing)
router.post('/', (req, res) => {
  const torneo = torneoStore.create(req.body);
  res.json(torneo);
});

router.patch('/:id/scoring', (req, res) => {
  try {
    const updated = updateScoringParams(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
