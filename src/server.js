// --- Remaining imports -----
import { createServer } from 'http';
import { createApp } from './create-app';
import { config } from './config';

const port = process.env.APP_PORT; // can be mapped using docker
const app = createApp();
const server = createServer(app);
server.listen(port, () => {
  console.info(process.env.APP_NAME + ' Listening on port ' + port);
});

// -----------------------------------------------------------------------------
// When SIGINT is received (i.e. Ctrl-C is pressed), shutdown services
// -----------------------------------------------------------------------------
process.on('SIGINT', () => {
  console.info('SIGINT received ...');
  console.info('Shutting down the server');

  server.close(() => {
    console.info('Server has been shutdown');
    console.info('Exiting process ...');
    process.exit(0);
  });
});
