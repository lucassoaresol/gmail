import { FastifyPluginAsync } from 'fastify';

import { CreateEmailController } from '../controllers/email/CreateEmailController';

const emailRouter: FastifyPluginAsync = async (fastify) => {
  fastify.post('', CreateEmailController.handle);
};

export default emailRouter;
