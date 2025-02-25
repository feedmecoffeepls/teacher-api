import request from 'supertest';
import express from 'express';
import registerRoutes from '../../src/routes/registerRoutes.ts';
import { db } from '../../src/db/db.ts';
import { teachers, students } from '../../src/db/schema.ts';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/api', registerRoutes);

describe('POST /api/register', () => {

  beforeAll(async () => {
    await db.insert(teachers).values({ email: 'teacherregistertest@gmail.com' });
  });

  it('should register students successfully', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        teacher: 'teacherregistertest@gmail.com',
        students: ['student1@example.com', 'student2@example.com']
      });

    expect(response.status).toBe(204);
  });

  it('should return 207 for partially successful registrations', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        teacher: 'teacherregistertest@gmail.com',
        students: ['student1@example.com', 'student2@example.com', 'student1@example.com']
      });

    expect(response.status).toBe(207);
    expect(response.body.message).toBe('Some registrations were skipped:');
    expect(response.body.skippedRegistrations).toContain('student1@example.com');
  });


  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        teacher: '',
        students: 'not-an-array'
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('teacher is required');
    expect(response.body.errors).toContain('Invalid type for students, expected array');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({
        teacher: 'invalid-email',
        students: ['student1@example.com', 'invalid-email']
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('Invalid email format for teacher');
    expect(response.body.errors).toContain('Invalid email format in students array');
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

  afterAll(async () => {
    await db.delete(students).where(eq(students.email, 'student1@example.com'));
    await db.delete(students).where(eq(students.email, 'student2@example.com'));
    await db.delete(teachers).where(eq(teachers.email, 'teacherregistertest@gmail.com'));
  });

});
