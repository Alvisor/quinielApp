const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock prisma client
jest.mock('../src/prismaClient', () => ({
  grupo: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
  participacion: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
}));

const prisma = require('../src/prismaClient');
const groupsRoutes = require('../src/routes/groups');
const authMiddleware = require('../src/middleware/auth');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api/groups', groupsRoutes);
  return app;
}

function generateToken(id = 1) {
  return jwt.sign({ userId: id }, 'secret');
}

describe('Groups routes', () => {
  let app;
  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  test('creates a group', async () => {
    prisma.grupo.create.mockResolvedValue({ id: 1, code: 'abc123' });
    prisma.participacion.create.mockResolvedValue();
    const res = await request(app)
      .post('/api/groups')
      .set('Authorization', 'Bearer ' + generateToken())
      .send({ nombre: 'Test', torneoId: 2 });
    expect(res.statusCode).toBe(201);
    expect(prisma.grupo.create).toHaveBeenCalled();
  });
});
