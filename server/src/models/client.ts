import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

import databasePromise from "../libs/database";
import { sendEmail } from "../utils/sendEmail";

class Client {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  public async save() {
    const database = await databasePromise;

    await database.insertIntoTable({
      table: "clients",
      dataDict: { id: this.id },
    });

    const credentialsPath = `./credentials/${this.id}`;

    await this.ensureCredentialsFolder(credentialsPath);
  }

  private async ensureCredentialsFolder(path: string) {
    try {
      await mkdir(path, { recursive: true });
      console.log(`Pasta criada em: ${path}`);
    } catch (error) {
      console.error(`Erro ao criar a pasta: ${error}`);
    }

    const files = ["client_secret.json", "gmail_token.json"];
    for (const file of files) {
      const filePath = join(path, file);
      try {
        await access(filePath);
        console.log(`Arquivo já existe: ${filePath}`);
      } catch {
        await writeFile(filePath, "");
        console.log(`Arquivo criado: ${filePath}`);
      }
    }
  }

  public async isReady(): Promise<boolean> {
    const credentialsPath = `./credentials/${this.id}`;
    const files = ["client_secret.json", "gmail_token.json"];

    for (const file of files) {
      const filePath = join(credentialsPath, file);
      try {
        const content = await readFile(filePath, "utf8");
        if (!content.trim()) {
          console.log(`Arquivo ${file} está vazio.`);
          return false;
        }
      } catch (error) {
        console.error(`Erro ao ler o arquivo ${file}: ${error}`);
        return false;
      }
    }

    console.log("Todos os arquivos estão prontos para uso.");
    return true;
  }

  public async hasPendingEmail(): Promise<boolean> {
    const credentialsPath = `./credentials/${this.id}`;

    const filePath = join(credentialsPath, "send_email.json");

    try {
      await access(filePath);
      console.log(
        "Arquivo send_email.json encontrado. Email pendente de envio.",
      );
      return true;
    } catch {
      console.log("Nenhum email pendente de envio.");
      return false;
    }
  }

  public async createEmailFileAndSend(
    to: string,
    subject: string,
    body: string,
    cc: string[] | null = null,
    bcc: string[] | null = null,
    attachments: string[] | null = null,
  ): Promise<void> {
    const emailData = {
      to,
      subject,
      body,
      cc,
      bcc,
      attachments,
    };

    const credentialsPath = `./credentials/${this.id}`;

    const filePath = join(credentialsPath, "send_email.json");

    try {
      await writeFile(filePath, JSON.stringify(emailData, null, 2), "utf8");
      console.log(`Arquivo ${filePath} criado com sucesso.`);
    } catch (error) {
      console.error("Erro ao criar o arquivo send_email.json:", error);
      return;
    }

    await sendEmail(this.id);
  }
}

export default Client;
