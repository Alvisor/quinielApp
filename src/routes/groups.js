const express = require('express');
const prisma = require('../prismaClient');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

function generateCode() {
  return Math.random().toString(36).substring(2, 8);
}

// Create a new group
router.post('/', authenticateToken, async (req, res) => {
  const { nombre, descripcion, torneoId } = req.body;
  if (!nombre || !torneoId) {
    return res.status(400).json({ message: 'Nombre y torneoId requeridos' });
  }
  try {
    const grupo = await prisma.grupo.create({
      data: {
        nombre,
        descripcion,
        code: generateCode(),
        torneoId,
        adminId: req.userId,
      },
    });
    // add creator as participant
    await prisma.participacion.create({
      data: { userId: req.userId, grupoId: grupo.id },
    });
    res.status(201).json(grupo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear grupo' });
  }
});

// Join a group by code
router.post('/join', authenticateToken, async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ message: 'Code requerido' });
  try {
    const grupo = await prisma.grupo.findUnique({ where: { code } });
    if (!grupo) return res.status(404).json({ message: 'Grupo no encontrado' });
    const exists = await prisma.participacion.findFirst({
      where: { userId: req.userId, grupoId: grupo.id },
    });
    if (exists) return res.status(409).json({ message: 'Ya en el grupo' });
    await prisma.participacion.create({
      data: { userId: req.userId, grupoId: grupo.id },
    });
    res.json({ message: 'Unido al grupo' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al unirse al grupo' });
  }
});

// List groups for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const participaciones = await prisma.participacion.findMany({
      where: { userId: req.userId },
      include: { grupo: true },
    });
    const base = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    const grupos = participaciones.map((p) => ({
      ...p.grupo,
      inviteLink: `${base}/index.html?code=${p.grupo.code}`,
    }));
    res.json(grupos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener grupos' });
  }
});

module.exports = router;
