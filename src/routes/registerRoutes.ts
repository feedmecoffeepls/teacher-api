import express from 'express';
import { registerStudent } from '../controllers/register/register.ts';
import validateEmailFormat from '../middleware/validateEmailFormat.ts';

const router = express.Router();

const emailSchema = {
  teacher: 'string',
  students: ['string']
};

router.post('/register', validateEmailFormat(emailSchema), registerStudent);

export default router;
