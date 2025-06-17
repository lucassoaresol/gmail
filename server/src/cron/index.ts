import { CronJob } from 'cron';

import { listClientMail } from '../libs/axios';
import { runPythonScript } from '../utils/runPythonScript';
import { runShellScript } from '../utils/runShellScript';

let isRunning = false;
let timeoutId: NodeJS.Timeout | null = null;

CronJob.from({
  cronTime: '*/5 * * * *',
  onTick: async () => {
    if (isRunning) {
      console.log('A tarefa ainda está em execução. Ignorando esta execução.');
      return;
    }
    isRunning = true;

    try {
      const clients = await listClientMail();

      timeoutId = setTimeout(() => {
        console.log('A execução demorou demais, abortando...');
        isRunning = false;
      }, 200000);

      const tasks = clients.map(async (id) => await runPythonScript('./py/extract_emails.py', [id]));

      await Promise.all(tasks);
    } catch (error) {
      console.error('Erro ao executar a tarefa:', error);
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      isRunning = false;
    }
  },
  start: true,
});

CronJob.from({
  cronTime: '0 0 * * *',
  onTick: () => {
    const dirs = ['logs'];
    dirs.forEach((el) =>
      runShellScript(`find ${el} -type f -mtime +5 -exec rm {} \\;`),
    );
  },
  start: true,
});
