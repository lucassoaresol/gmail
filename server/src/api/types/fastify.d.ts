/* eslint-disable @typescript-eslint/naming-convention */
import 'fastify';

import Client from '../../models/client';

declare module 'fastify' {
  interface FastifyRequest {
    client: null | Client
  }
}
