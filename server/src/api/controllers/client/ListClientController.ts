import { FastifyReply, FastifyRequest } from 'fastify';

import { ClientManagerPromise } from '../../../models/clientManager';

export class ListClientController {
  static async handle(request: FastifyRequest, reply: FastifyReply) {
    const clientManager = await ClientManagerPromise;

    const clients = clientManager.listClients();

    return reply.send(clients);
  };
}
