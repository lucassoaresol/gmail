import { FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

import { ClientManagerPromise } from '../../models/clientManager';

import { AppError } from '../errors/appError';

const verifyClient = fp((fastify) => {
  fastify.addHook('preHandler', async (request: FastifyRequest<{ Params: { id: string } }>) => {
    const clientManager = await ClientManagerPromise;
    const client = clientManager.getClient(request.params.id);

    if (!client) {
      throw new AppError('client not found', 404);
    }

    request.client = client;
  });
});

export default verifyClient;
