import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { AppError } from '../../errors/appError';

export class CreateEmailController {
  static schema = z.object({
    to: z.string(),
    subject: z.string(),
    body: z.string(),
    cc: z.array(z.string()).optional(),
    bcc: z.array(z.string()).optional(),
    attachments: z.array(z.string()).optional(),
  });

  static handle = async (request: FastifyRequest, reply: FastifyReply) => {
    const client = request.client;
    const isReady = await client?.isReady();

    if (!isReady) {
      throw new AppError('Client is not ready. Please ensure the required credentials are available.', 503);
    }

    const hasPendingEmail = await client?.hasPendingEmail();
    if (hasPendingEmail) {
      throw new AppError('There is already a pending email for this client.', 409);
    }

    const parsed = this.schema.parse(request.body);

    await request.client?.sendEmail(parsed);

    return reply.code(201).send('Email saved for sending.');
  };
}
