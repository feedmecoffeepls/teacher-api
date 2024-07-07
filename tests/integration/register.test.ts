import request from 'supertest';
import express from 'express';
import registerRoutes from '../../src/routes/registerRoutes.ts';
import { db } from '../../src/db/db.ts';
import { students } from '../../src/db/schema.ts';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/api', registerRoutes);

describe('POST /api/register', () => {

  it('should register students successfully', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        teacher: 'teacherken@gmail.com',
        students: ['student1@example.com', 'student2@example.com']
      });

    expect(response.status).toBe(204);
  });

  afterAll(async () => {
    await db.delete(students).where(eq(students.email, 'student1@example.com'));
    await db.delete(students).where(eq(students.email, 'student2@example.com'));
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        teacher: '',
        students: 'not-an-array'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid input');
  });

  it('should return 404 if teacher is not found', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        teacher: 'nonexistentteacher@example.com',
        students: ['student1@example.com']
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Teacher not found');
  });

  it('should return 500 for internal server error', async () => {
    // Simulate internal server error by sending invalid data, assumes teacherken@gmail.com exists
    const response = await request(app)
      .post('/api/register')
      .send({
        teacher: 'teacherken@gmail.com',
        students: [null]
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
