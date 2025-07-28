import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnv.js';

const PORT = Number(getEnvVar('PORT'));

export function setupServer() {
  const app = express();
  app.use(
    cors(),
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.get('/', (req, res) => {
    res.json({
      message: 'hello user!',
    });
  });
  app.use((req, res) => {
    res.status(404).json({
      message: 'Not Found',
    });
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
