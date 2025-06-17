import { FastifyPluginAsync } from 'fastify';

import verifyClient from '../plugins/verifyClient';

import emailRouter from './email';

const clientManagerRouter: FastifyPluginAsync = async (fastify) => {
  fastify.register(verifyClient);

  fastify.register(emailRouter, { prefix: '/emails' });
};

export default clientManagerRouter;
