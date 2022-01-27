import exit from 'exit';
import mysql from 'mysql';
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
    command: 'docker compose up',
  });
}

export async function teardown() {
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
   * @default root
   */
  user?: string;

  /**
   * @default kickjump
   */
  database?: string;

  /**
   * @default 'kickjump'
   */
  password?: string;
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
  const {
    command,
    host = 'localhost',
    password = 'kickjump',
    port = 3307,
    timeout = 60_000,
    interval = 100,
    database = 'kickjump',
    user = 'root',
  } = options;
  const startTime = Date.now();

  const childProcess = destroyableSpawn(command, { shell: true, cwd: cwd() });

  console.log(`Waiting for port: ${port} to become available at host: ${host}`);
  await waitForPort({ port, host, interval, timeout });

  console.log(`Waiting for MySQL connection`);
  const connection = await pollForDatabaseConnection({
    host,
    password,
    port,
    user,
    timeout,
    startTime,
    interval,
    database,
  });

  return async () => {
    await Promise.all([childProcess.destroy()]);
    connection.end();
  };
}

export interface DestroyableChildProcess extends ChildProcess {
  destroy: () => Promise<void>;
}

interface PollForDatabaseConnectionProps extends Required<Omit<Options, 'command'>> {
  timeout: number;
  startTime: number;
  interval: number;
  keepAlive?: boolean;
}

function pollForDatabaseConnection(options: PollForDatabaseConnectionProps) {
  const {
    host,
    database,
    password,
    port,
    user,
    timeout,
    startTime,
    interval,
    keepAlive = true,
  } = options;

  return new Promise<mysql.Connection>((resolve, reject) => {
    const loop = () => {
      process.stdout.write('.');
      const connection = mysql.createConnection({ host, password, port, user, database });

      connection.connect((err) => {
        if (err) {
          if (timeout && Date.now() - startTime > timeout) {
            console.log('\nTimeout');
            return reject(err);
          }

          //  Run the loop again.
          return setTimeout(loop, interval);
        }

        console.log('\nMySQL Connected!');

        if (!keepAlive) {
          connection.end((err) => {
            if (err) {
              return reject(err);
            }

            resolve(connection);
          });
        } else {
          return resolve(connection);
        }
      });
    };

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
    cleanExit(typeof code === 'number' ? code : 1);
  });

  childProcess.destroy = async (): Promise<void> => {
    removeExitHandler();
    childProcess.removeAllListeners('exit');
    childProcess.removeAllListeners('error');

    treeKill(childProcess.pid);
  };

  return childProcess;
}
