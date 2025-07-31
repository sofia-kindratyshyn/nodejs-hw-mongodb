import { setupServer } from './server.js';
import { initMongoConnection } from './db/initMongoConnection.js';
import { getAllContacts } from './services/contacts.js';

await initMongoConnection();
setupServer();
getAllContacts();
