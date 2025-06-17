import { FastifyPluginAsync } from 'fastify';

import { CreateClientController } from '../controllers/client/CreateClientController';
import { ListClientController } from '../controllers/client/ListClientController';

const clientRouter: FastifyPluginAsync = async (fastify) => {
  fastify.post('', CreateClientController.handle);
  fastify.get('', ListClientController.handle);
};

export default clientRouter;
