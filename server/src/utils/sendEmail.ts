import { spawn } from "node:child_process";

import { env } from "../config/env";

export async function sendEmail(id: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const pythonScriptPath = "./py/send_email.py";

    const venvPath =
      env.envType === "windows" ? "./venv/Scripts/python" : "./venv/bin/python";

    const pythonProcess = spawn(venvPath, [pythonScriptPath, id]);

    let output = "";
    let errorOutput = "";

    pythonProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Erro ao executar o script Python: ${errorOutput}`);
      }
    });
  });
}
