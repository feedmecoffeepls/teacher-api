import express from 'express';
import { toggleSuspendStudent } from '../controllers/student/suspendStudent.ts';
import validateEmailFormat from '../middleware/validateEmailFormat.ts';

const router = express.Router();

const emailSchema = {
  email: 'string'
};

router.post('/suspend', validateEmailFormat(emailSchema), toggleSuspendStudent);

export default router;
