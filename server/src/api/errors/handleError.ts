import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

import { AppError } from './appError';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      message: error.message,
    });
  }

  if (error instanceof ZodError) {
    const allMessages = error.errors.map((err) => ({
      path: err.path.join('.') || 'form',
      message: err.message,
    }));
    return reply.code(400).send({ message: allMessages });
  }

  console.log(error);

  return reply.code(500).send({
    message: 'Internal server error',
  });
};
