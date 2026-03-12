import Fastify from 'fastify';
import healthRoutes from './routes/health.js'
import websocketPlugin from './plugins/websocket.js'

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  app.register(websocketPlugin)

  app.register(healthRoutes, { prefix: '/api' });

  return app;
}
