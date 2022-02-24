#!/usr/bin/env node

import http from 'http';
import setupApp from '../app';
import fs from 'fs';

(async () => {
  const app = await setupApp();

  const server = http.createServer(app);

  const port = process.env.PORT || '3000';

  if (!process.env.PORT) process.env.PORT = port;

  /**
   * Event listener for HTTP server "error" event.
   */
  server.on('error', (error: { syscall: string; code: any }) => {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      console.log('Process terminated');
      fs.unlinkSync('users.json');
    });
  });

  /**
   * -------------- SERVER ----------------
   */

  server.listen(port, () => {
    console.log(`\x1b[32m`, `Server listening on ${port}`, `\x1b[0m`);
  });
})();
