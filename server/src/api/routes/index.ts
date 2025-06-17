import { FastifyPluginAsync } from 'fastify';

import clientManagerRouter from './clientManager';
import clientRouter from './client';

const router: FastifyPluginAsync = async (fastify) => {
  fastify.register(clientRouter, { prefix: '/clients' });
  fastify.register(clientManagerRouter, { prefix: '/:id' });
};

export default router;
