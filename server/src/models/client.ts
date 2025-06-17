import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

import { env } from '../config/env';
import databaseGmailPromise from '../db/gmail';

class Client {
  private id: string;

  constructor(id: string) {
    this.id = id;
  }

  public async save() {
    const database = await databaseGmailPromise;

    await database.insertIntoTable({
      table: 'clients',
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

    const files = ['client_secret.json', 'gmail_token.json'];
    for (const file of files) {
      const filePath = join(path, file);
      try {
        await access(filePath);
        console.log(`Arquivo já existe: ${filePath}`);
      } catch {
        await writeFile(filePath, '');
        console.log(`Arquivo criado: ${filePath}`);
      }
    }
  }

  public async isReady(): Promise<boolean> {
    const credentialsPath = `./credentials/${this.id}`;
    const files = ['client_secret.json', 'gmail_token.json'];

    for (const file of files) {
      const filePath = join(credentialsPath, file);
      try {
        const content = await readFile(filePath, 'utf8');
        if (!content.trim()) {
          console.log(`Arquivo ${file} está vazio.`);
          return false;
        }
      } catch (error) {
        console.error(`Erro ao ler o arquivo ${file}: ${error}`);
        return false;
      }
    }

    console.log('Todos os arquivos estão prontos para uso.');
    return true;
  }

  public async hasPendingEmail(): Promise<boolean> {
    const credentialsPath = `./credentials/${this.id}`;

    const filePath = join(credentialsPath, 'send_email.json');

    try {
      await access(filePath);
      console.log(
        'Arquivo send_email.json encontrado. Email pendente de envio.',
      );
      return true;
    } catch {
      console.log('Nenhum email pendente de envio.');
      return false;
    }
  }

  public async sendEmail({ attachments, bcc, body, cc, subject, to }: {
    to: string,
    subject: string,
    body: string,
    cc?: string[]
    bcc?: string[]
    attachments?: string[]
  }): Promise<void> {
    const emailData = {
      to,
      subject,
      body,
      cc: cc || [],
      bcc: bcc || [],
      attachments: attachments || [],
    };

    const pythonScriptPath = './py/send_email.py';

    const venvPath =
      env.envType === 'windows' ? './venv/Scripts/python' : './venv/bin/python';

    try {
      const process = spawn(venvPath, [
        pythonScriptPath,
        this.id,
        '--to',
        emailData.to,
        '--subject',
        emailData.subject,
        '--body',
        emailData.body,
        '--cc',
        ...emailData.cc,
        '--bcc',
        ...emailData.bcc,
        '--attachments',
        ...emailData.attachments,
      ]);

      process.stdout.on('data', (data) => {
        console.log(`Python output: ${data}`);
      });

      process.stderr.on('data', (data) => {
        console.error(`Python error: ${data}`);
      });

      process.on('close', (code) => {
        console.log(`Processo Python finalizado com código ${code}`);
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      return;
    }
  }
}

export default Client;
