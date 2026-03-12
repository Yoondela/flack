import 'dotenv/config'

import { buildApp } from './app.js';
import { connectMongo } from './db/mongo.js'

const start = async () => {

  await connectMongo();

  const app = buildApp();

  try {
    await app.listen({
      port: 4000,
      host: '0.0.0.0',
    });

    app.log.info('Server running on port 4000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
