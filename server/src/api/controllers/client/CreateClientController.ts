import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { ClientManagerPromise } from '../../../models/clientManager';

export class CreateClientController {
  static schema = z.object({
    id: z.string(),
  });

  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = this.schema.parse(request.body);

    const clientManager = await ClientManagerPromise;

    await clientManager.addClient(parsed.id);

    return reply.code(201).send('sucess');
  };
}
