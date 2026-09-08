import request from 'supertest';
import express from 'express';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import authRoutes from '../routes/auth.route.js';
import cookieParser from 'cookie-parser';

let mongoServer;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe('Auth API Integration Tests', () => {
  it('should signup a new user successfully', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'John Doe Testing',
      email: 'johntest@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.fullName).toBe('John Doe Testing');
    expect(res.body.email).toBe('johntest@example.com');
    // Ensure JWT cookie is set
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should not allow signup with short password', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: 'pass',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Password must be at least 6 characters');
  });

  it('should login an existing user', async () => {
    // Setup: Create a user first
    await request(app).post('/api/auth/signup').send({
      fullName: 'Login Tester',
      email: 'logintester@example.com',
      password: 'password123',
    });

    // Test Login
    const res = await request(app).post('/api/auth/login').send({
      email: 'logintester@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(200);
    expect(res.body.email).toBe('logintester@example.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should reject invalid credentials during login', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
