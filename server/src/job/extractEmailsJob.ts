import { CronJob } from "cron";

import { getClientManager } from "../models/clientManager";
import { extractEmails } from "../utils/extractEmails";

let isRunning = false;

CronJob.from({
  cronTime: "*/5 * * * *",
  onTick: async () => {
    if (isRunning) {
      console.log("A tarefa ainda está em execução. Ignorando esta execução.");
      return;
    }
    isRunning = true;
    try {
      const clientManager = await getClientManager();
      const clients = clientManager.getClients();

      const tasks = clients.map(async ({ id, client }) => {
        const isReady = await client.isReady();
        if (isReady) {
          await extractEmails(id);
        }
      });

      await Promise.all(tasks);
    } catch (error) {
      console.error("Erro ao executar a tarefa:", error);
    } finally {
      isRunning = false;
    }
  },
  start: true,
});
