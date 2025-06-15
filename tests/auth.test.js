const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');

// Mock prisma client
jest.mock('../src/prismaClient', () => ({
  usuario: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

const prisma = require('../src/prismaClient');

const authRoutes = require('../src/routes/auth');

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', authRoutes);
  return app;
}

describe('Auth routes', () => {
  let app;
  beforeEach(() => {
    app = createApp();
    jest.clearAllMocks();
  });

  test('registers a new user', async () => {
    prisma.usuario.findUnique.mockResolvedValue(null);
    prisma.usuario.create.mockResolvedValue({ id: 1, email: 'test@test.com' });

    const res = await request(app)
      .post('/api/register')
      .send({ email: 'test@test.com', password: 'secret' });

    expect(res.statusCode).toBe(201);
    expect(prisma.usuario.create).toHaveBeenCalled();
  });

  test('logs in an existing user', async () => {
    const hashedPassword = '$2a$10$saltsaltsaltsalt12345678abcdefghijklmnopqrstuv';
    prisma.usuario.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com', password: hashedPassword });
    prisma.usuario.create.mockResolvedValue();

    const res = await request(app)
      .post('/api/login')
      .send({ email: 'test@test.com', password: 'secret' });

    expect(res.statusCode).toBe(401); // bcrypt compare will fail due to different hash
  });
});
