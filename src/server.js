import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import cookieParser from 'cookie-parser';
import { getEnvVar } from './utils/getEnv.js';
import router from './routers/contacts.js';
import { errorHandler } from './middlewars/errorHandler.js';
import { notFoundErr } from './middlewars/notFoundError.js';
import { authRouter } from './routers/auth.js';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = Number(getEnvVar('PORT'));

export async function setupServer() {
  const app = express();

  app.use(express.json());

  app.use(
    cors(),
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cookieParser());

  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(authRouter);

  app.use(router);

  app.use(notFoundErr);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
