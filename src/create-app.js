import cors from 'cors';
import express from 'express';
import { rootRouter } from './routes';

export const createApp = () => {
  // Create Express App
  const app = express();

  // Add middleware to enable CORS
  app.use(cors());

  // Add middleware to parse the POST data of the body
  app.use(express.urlencoded({ extended: true }));

  // Add middleware to parse application/json
  app.use(express.json());

  // Add routes
  app.use(rootRouter);

  return app;
};
