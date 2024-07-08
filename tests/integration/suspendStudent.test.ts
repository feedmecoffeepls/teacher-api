import request from 'supertest';
import express from 'express';
import studentRoutes from '../../src/routes/studentRoutes.ts';
import { db } from '../../src/db/db.ts';
import { students } from '../../src/db/schema.ts';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/api', studentRoutes);

describe('POST /api/suspend', () => {

  beforeAll(async () => {
    await db.insert(students).values({ email: 'test@student.com', suspended: false });
  });

  afterAll(async () => {
    await db.delete(students).where(eq(students.email, 'test@student.com'));
  });

  it('should suspend a student successfully', async () => {
    const response = await request(app)
      .post('/api/suspend')
      .send({ email: 'test@student.com' });

    expect(response.status).toBe(204);
  });

  it('should return 404 if student is not found', async () => {
    const response = await request(app)
      .post('/api/suspend')
      .send({ email: 'nonexistent@student.com' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Student not found');
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/api/suspend')
      .send({ email: '' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('email is required');
  });

});
