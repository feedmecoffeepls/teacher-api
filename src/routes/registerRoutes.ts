import express from 'express';
import { registerStudent } from '../controllers/register/register.ts';
import { getCommonStudents } from '../controllers/register/commonStudents.ts';
import validateEmailFormat from '../middleware/validateEmailFormat.ts';
import convertToUniqueArray from '../middleware/convertToUniqueArray.ts';

const router = express.Router();

const registerSchema = {
  teacher: 'string',
  students: ['string']
};

const commonStudentsSchema = {
  teacher: ['string'],
}

router.post('/register', validateEmailFormat(registerSchema), registerStudent);

router.get('/commonstudents', convertToUniqueArray, validateEmailFormat(commonStudentsSchema), getCommonStudents);

export default router;
