import express from 'express';
import { toggleSuspendStudent } from '../controllers/student/suspendStudent.ts';

const router = express.Router();

router.post('/suspend', toggleSuspendStudent);

export default router;
