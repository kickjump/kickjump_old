import exit from 'exit';
import { type ChildProcess, type SpawnOptions, exec as ex, spawn } from 'node:child_process';
import { cwd } from 'node:process';
import { promisify } from 'node:util';
import onExit from 'signal-exit';
import treeKill from 'tree-kill';
import waitForPort from 'wait-port';

const exec = promisify(ex);

let destroy: (() => Promise<void>) | undefined;

export async function setup() {
  destroy = await waitForDatabaseConnection({
    command: process.env.CI ? 'echo "skipping docker command"' : 'docker compose up',
  });
}

export async function teardown() {
  if (process.env.CI) {
    return destroy?.();
  }

  await Promise.all([exec('docker compose down'), destroy?.()]);
}

interface Options {
  command: string;
  /**
   * @default 'localhost'
   */
  host?: string;

  /**
   * @default 3307
   */
  port?: number;

  /**
   * @default 60_000
   */
  timeout?: number;

  /**
   * @default 100
   */
  interval?: number;
}

async function waitForDatabaseConnection(options: Options): Promise<() => Promise<void>> {
  const { command, host = 'localhost', port = 3307, timeout = 60_000, interval = 100 } = options;
  const startTime = Date.now();

  const childProcess = destroyableSpawn(command, { shell: true, cwd: cwd() });

  console.log(`Waiting for port: ${port} to become available at host: ${host}`);
  await waitForPort({ port, host, interval, timeout });

  const destroy = () => childProcess.destroy();

  console.log(`Waiting for prisma MySQL connection`);
  await pollForDatabaseConnection({ timeout, startTime, interval, destroy });

  return destroy;
}

export interface DestroyableChildProcess extends ChildProcess {
  destroy: () => Promise<void>;
}

interface PollForDatabaseConnectionProps {
  timeout: number;
  startTime: number;
  interval: number;
  destroy: () => Promise<void>;
}

async function pollForDatabaseConnection(options: PollForDatabaseConnectionProps) {
  const { timeout, startTime, interval, destroy } = options;

  await new Promise<void>((resolve, reject) => {
    async function loop() {
      process.stdout.write('.');

      try {
        const { stdout, stderr } = await exec('pnpm -w prisma:push:local', { cwd: process.cwd() });

        if (stdout) {
          process.stdout.write(stdout);
        } else {
          process.stdout.write(stderr);
        }

        resolve();
      } catch (error) {
        if (!timeout || Date.now() - startTime < timeout) {
          setTimeout(loop, interval);
          return;
        }

        console.error('\nTimeout');
        await exec('docker compose down');
        await destroy();
        reject(error);
      }
    }

    loop();
  });
}

function destroyableSpawn(command: string, options: SpawnOptions): DestroyableChildProcess {
  const childProcess = <DestroyableChildProcess>spawn(command, options);

  const cleanExit = (code = 1) => {
    if (childProcess?.pid) {
      treeKill(childProcess.pid, () => exit(code));
      return;
    }

    exit(code);
  };

  if (childProcess.stderr) {
    childProcess.stderr.pipe(process.stderr);
  }

  childProcess.on('exit', cleanExit);
  childProcess.on('error', () => cleanExit(1));

  const removeExitHandler = onExit((code) => {
    exec('docker compose down').then(() => {
      cleanExit(typeof code === 'number' ? code : 1);
    });
  });

  childProcess.destroy = async (): Promise<void> => {
    removeExitHandler();
    childProcess.removeAllListeners('exit');
    childProcess.removeAllListeners('error');

    if (typeof childProcess.pid === 'number') {
      treeKill(childProcess.pid);
    }
  };

  return childProcess;
}
