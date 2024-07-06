import express from 'express';
import { registerStudent } from '../controllers/register/register.ts';

const router = express.Router();

router.post('/register', registerStudent);

export default router;
