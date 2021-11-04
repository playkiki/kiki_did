import express from 'express';
import { didRouter } from './did';

export const rootRouter = express.Router();
rootRouter.use('/api/v1/kiki', didRouter);
