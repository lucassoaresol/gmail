import Fastify from 'fastify';

import { errorHandler } from './errors/handleError.js';
import router from './routes/index.js';

const app = Fastify();

app.register(router);

app.setErrorHandler(errorHandler);

export default app;
