import request from 'supertest';
import express from 'express';
import registerRoutes from '../../src/routes/registerRoutes.ts';
import { db } from '../../src/db/db.ts';
import { teachers, students, registrations, SelectTeacher, SelectStudent } from '../../src/db/schema.ts';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use('/api', registerRoutes);

const testTeachers = [
  { email: 'commonteacher1@gmail.com' },
  { email: 'commonteacher2@gmail.com' }
];

const testStudents = [
  { email: 'commonstudent1@gmail.com' },
  { email: 'commonstudent2@gmail.com' },
  { email: 'commonstudent3@gmail.com' }
];

describe('GET /api/commonstudents', () => {

  beforeAll(async () => {
    // Seed the database with test data
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

    await db.insert(registrations).values([
      { teacherId: insertedTeachers[0].id, studentId: insertedStudents[0].id },
      { teacherId: insertedTeachers[0].id, studentId: insertedStudents[1].id },
      { teacherId: insertedTeachers[1].id, studentId: insertedStudents[1].id },
      { teacherId: insertedTeachers[1].id, studentId: insertedStudents[2].id }
    ]);
  });

  afterAll(async () => {
    for (const teacher of testTeachers) {
      await db.delete(teachers).where(eq(teachers.email, teacher.email));
    }

    for (const student of testStudents) {
      await db.delete(students).where(eq(students.email, student.email));
    }
  });

  it('should return common students for given teachers', async () => {
    const response = await request(app)
      .get('/api/commonstudents')
      .query({ teacher: [testTeachers[0].email, testTeachers[1].email] });

    expect(response.status).toBe(200);
    expect(response.body.students).toEqual([testStudents[1].email]);
  });

  it('should return 400 for invalid input', async () => {
    const response = await request(app)
      .get('/api/commonstudents')
      .query({ teacher: '' });

    expect(response.status).toBe(400);
  });

  it('should return 404 if no teachers are found', async () => {
    const response = await request(app)
      .get('/api/commonstudents')
      .query({ teacher: ['nonexistent@example.com'] });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('No teachers found');
  });

  it('should return 500 for internal server error', async () => {
    // Simulate an internal server error by mocking the database call
    jest.spyOn(db, 'select').mockImplementationOnce(() => {
      throw new Error('Internal server error');
    });

    const response = await request(app)
      .get('/api/commonstudents')
      .query({ teacher: [testTeachers[0].email] });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe('Internal server error');
  });

});
