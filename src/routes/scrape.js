const express = require('express');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const prisma = require('../prismaClient');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.post('/torneo', authenticateToken, async (req, res) => {
  try {
    const html = fs.readFileSync(path.join(__dirname, '..', '..', 'public', 'torneo_sample.html'), 'utf8');
    const $ = cheerio.load(html);
    const title = $('h1').text(); // e.g., Mundial de Clubes 2025
    const parts = title.split(' ');
    const year = parseInt(parts.pop(), 10);
    const nombre = parts.join(' ');

    const torneo = await prisma.torneo.create({
      data: {
        nombre: nombre.trim(),
        year,
        startDate: new Date('2025-06-20'),
        endDate: new Date('2025-07-05'),
      },
    });

    const equipos = [];
    $('#equipos tr td').each((_, el) => {
      equipos.push($(el).text());
    });

    for (const eq of equipos) {
      await prisma.equipo.create({ data: { nombre: eq, torneoId: torneo.id } });
    }

    $('#partidos tr').slice(1).each(async (_, el) => {
      const tds = $(el).find('td');
      const localName = $(tds[0]).text();
      const visitanteName = $(tds[1]).text();
      const fecha = new Date($(tds[2]).text());
      const local = await prisma.equipo.findFirst({ where: { nombre: localName, torneoId: torneo.id } });
      const visitante = await prisma.equipo.findFirst({ where: { nombre: visitanteName, torneoId: torneo.id } });
      if (local && visitante) {
        await prisma.partido.create({
          data: {
            torneoId: torneo.id,
            localId: local.id,
            visitanteId: visitante.id,
            fecha,
          },
        });
      }
    });

    res.json({ message: 'Torneo cargado', torneoId: torneo.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al procesar torneo' });
  }
});

module.exports = router;
