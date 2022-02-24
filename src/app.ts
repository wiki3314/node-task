require('dotenv').config({ debug: process.env.DEBUG });

import express from 'express';
import path from 'path';

import indexRouter from './routes';

const setupApp = (): Promise<Express.Application> =>
  new Promise((resolve, reject) => {
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, '../public')));

    app.use('/api', indexRouter);

    const port = process.env.port || 3000;
    app.set('port', port);

    // Add GET /health-check express route
    app.get('/health-check', (_req, res) => {
      res.status(200).send('OK');
    });

    resolve(app);
  });

export default setupApp;
