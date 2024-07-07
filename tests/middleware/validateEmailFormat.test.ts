import validateEmailFormat from '../../src/middleware/validateEmailFormat.ts';
import express from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

const emailSchema = {
  teacher: 'string',
  students: ['string']
};

app.post('/test-email-format', validateEmailFormat(emailSchema), (req, res) => {
  res.status(200).send('Valid input');
});

describe('validateEmailFormat Middleware', () => {
  it('should return 400 if teacher email is invalid', async () => {
    const response = await request(app)
      .post('/test-email-format')
      .send({
        teacher: 'invalid-email',
        students: ['student1@example.com']
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('Invalid email format for teacher');
  });

  it('should return 400 if any student email is invalid', async () => {
    const response = await request(app)
      .post('/test-email-format')
      .send({
        teacher: 'teacher@example.com',
        students: ['invalid-email']
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('Invalid email format in students array');
  });

  it('should return 400 if teacher email is missing', async () => {
    const response = await request(app)
      .post('/test-email-format')
      .send({
        students: ['student1@example.com']
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('teacher is required');
  });

  it('should return 400 if students array is empty', async () => {
    const response = await request(app)
      .post('/test-email-format')
      .send({
        teacher: 'teacher@example.com',
        students: []
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain('students array should not be empty');
  });

  it('should return 200 if input is valid', async () => {
    const response = await request(app)
      .post('/test-email-format')
      .send({
        teacher: 'teacher@example.com',
        students: ['student1@example.com']
      });

    expect(response.status).toBe(200);
    expect(response.text).toBe('Valid input');
  });
});
