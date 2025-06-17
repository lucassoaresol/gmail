import { spawn } from 'node:child_process';

import { env } from '../config/env';

export async function runPythonScript(scriptPath: string, args?: string[]) {
  return new Promise((resolve, reject) => {
    const venvPath =
      env.envType === 'windows' ? './venv/Scripts/python' : './venv/bin/python';

    const pythonArgs = [scriptPath, ...(args || [])];

    const pythonProcess = spawn(venvPath, pythonArgs);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(`Erro ao executar o script Python: ${errorOutput}`);
      }
    });
  });
}
