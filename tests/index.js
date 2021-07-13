import request from 'supertest';
import { createServer } from 'http';
import faker from 'faker/locale/ko';
import { createApp } from '../src/create-app';
import { config } from '../src/config';

let server;

beforeAll(async () => {
  // TODO DB initialize - TX start

  // DO Web Server initalize
  const app = createApp();
  const port = process.env.APP_PORT;
  server = await createServer(app).listen(port, () => {
    console.log(`${process.env.APP_NAME} Listening on port ${port}`);
  });
  global.agent = request.agent(server);
});

afterAll(async () => {
  // DO Web Server close
  await server.close();
  // TODO DB close - TX rollback
  await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
});
