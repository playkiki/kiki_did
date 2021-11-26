import express from 'express';
import { didRouter } from './did';
import { docclaimRouter } from './docclaim';
import { reqclaimRouter } from './reqclaim';

export const rootRouter = express.Router();
rootRouter.use('/api/v1/kiki', didRouter);
rootRouter.use('/api/v1/kiki', docclaimRouter);
rootRouter.use('/api/v1/kiki', reqclaimRouter);
