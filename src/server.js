import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { getEnvVar } from './utils/getEnv.js';
import { getAllContacts } from './services/contacts.js';

const PORT = Number(getEnvVar('PORT'));

export async function setupServer() {
  const app = express();
  app.use(
    cors(),
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );
  app.get('/contacts', (req, res) => {
    const contacts = getAllContacts();
    res.json({
      contacts,
    });
  });
  app.get('/contacts/:contactId', (req, res) => {
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
