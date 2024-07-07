import request from 'supertest';
import express from 'express';
import registerRoutes from '../../src/routes/registerRoutes.ts';
import { db } from '../../src/db/db.ts';
import { teachers, students, registrations, SelectTeacher, SelectStudent } from '../../src/db/schema.ts';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/api', registerRoutes);

const testTeachers = [{ email: 'teachermin@example.com'},{ email: 'teacherlonely@example.com' }];
const testStudents = [
  { email: 'studentalice@example.com' },
  { email: 'studentguy@example.com' }
];

beforeAll(async () => {
  const insertedTeachers: SelectTeacher[] = [];
  for (const teacher of testTeachers) {
    const [insertedTeacher] = await db.insert(teachers).values(teacher).returning() as SelectTeacher[];
    insertedTeachers.push(insertedTeacher);
  }

  const insertedStudents: SelectStudent[] = [];
  for (const student of testStudents) {
    const [insertedStudent] = await db.insert(students).values(student).returning() as SelectStudent[];
    insertedStudents.push(insertedStudent);
  }

  const firstTeacher = insertedTeachers[0];
  await db.insert(registrations).values([
    { teacherId: firstTeacher.id, studentId: insertedStudents[0].id },
    { teacherId: firstTeacher.id, studentId: insertedStudents[1].id }
  ]);
});
afterAll(async () => {
  await db.delete(registrations).where(eq(registrations.teacherId, 1));
  for (const student of testStudents) {
    await db.delete(students).where(eq(students.email, student.email));
  }
  for (const teacher of testTeachers) {
    await db.delete(teachers).where(eq(teachers.email, teacher.email));
  }
});

describe('POST /retrievefornotifications', () => {
  it('should return 400 if teacher email is missing', async () => {
    const response = await request(app)
      .post('/api/retrievefornotifications')
      .send({ notification: 'Hello students!' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('teacher is required');
  });

  it('should return 400 if notification is missing', async () => {
    const response = await request(app)
      .post('/api/retrievefornotifications')
      .send({ teacher: 'teachermin@example.com' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Missing Notifications');
  });

  it('should return 400 for invalid email format', async () => {
    const response = await request(app)
      .post('/api/retrievefornotifications')
      .send({ teacher: 'invalid-email', notification: 'Hello students!' });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('Invalid email format for teacher');
  });

  it('should return 404 if teacher is not found', async () => {
    const response = await request(app)
      .post('/api/retrievefornotifications')
      .send({ teacher: 'nonexistentteacher@example.com', notification: 'Hello students!' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Teacher not found');
  });

  it('should return 404 if no valid recipients are found', async () => {
    const response = await request(app)
      .post('/api/retrievefornotifications')
      .send({ teacher: testTeachers[1].email, notification: 'Hello students!' });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No valid recipients found for the notification');
  });

  it('should return 207 if some mentioned recipients are not found', async () => {
    const response = await request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teachermin@example.com',
        notification: 'Hello @studentalice@example.com and @nonexistentstudent@example.com'
      });

    expect(response.status).toBe(207);
    expect(response.body).toHaveProperty('recipients');
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Some mentioned recipients were not found');
    expect(response.body.recipients).toContain('studentalice@example.com');
    expect(response.body.recipients).not.toContain('nonexistentstudent@example.com');
  });

  it('should return 200 with valid recipients', async () => {
    const response = await request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teachermin@example.com',
        notification: 'Hello @studentalice@example.com'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('recipients');
    expect(response.body.recipients).toContain('studentalice@example.com');
  });

  it('should return 500 for internal server error', async () => {
    jest.spyOn(db, 'select').mockImplementationOnce(() => {
      throw new Error('Internal server error');
    });

    const response = await request(app)
      .post('/api/retrievefornotifications')
      .send({
        teacher: 'teachermin@example.com',
        notification: 'Hello @studentalice@example.com'
      });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });
});
