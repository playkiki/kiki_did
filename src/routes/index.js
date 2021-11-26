import express from 'express';
import { docclaimRouter } from './docclaim';
import { reqclaimRouter } from './reqclaim';
import { pubclaimRouter } from './pubclaim';

export const rootRouter = express.Router();
rootRouter.use('/api/v1/kiki', docclaimRouter);
rootRouter.use('/api/v1/kiki', reqclaimRouter);
rootRouter.use('/api/v1/kiki', pubclaimRouter);
