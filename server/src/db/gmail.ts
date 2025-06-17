import { Database } from 'pg-utils';

import getDatabase from './database';

const databaseGmailPromise: Promise<Database> = (async () => {
  return await getDatabase('gmail');
})();

export default databaseGmailPromise;
