// ! it's not possible to dynamically update an app's webhook and callback urls.

import ngrok from 'ngrok';
import * as path from 'node:path';
import { App } from 'octokit';
import { type Plugin, loadEnv } from 'vite';

import * as s from '../src/lib/structs.js';

const Config = s.object({
  /**
   * The base path to the github webhook.
   */
  webhook: s.string(),

  /**
   * The path to the base github callback url.
   */
  callback: s.string(),
});
type Config = s.Infer<typeof Config>;

export async function updateGitHubApp(config: Config, env: Record<string, string>) {
  const {
    GITHUB_CLIENT_ID = '',
    GITHUB_CLIENT_SECRET = '',
    GITHUB_APP_NAME = '',
    GITHUB_APP_ID: appId = '',
    GITHUB_APP_PRIVATE_KEY: privateKey = '',
  } = env;

  const app = new App({ appId, privateKey });
  // app.octokit.rest.orgs.repo
}

/**
 * Creates an ngrok instance everytime vite is started up.
 */
export function vitePluginNgrok(config: Config): Plugin {
  let url: string | undefined;
  return {
    name: 'vite-plugin-ngrok',
    async config({ root = process.cwd(), envDir, server }, { mode }) {
      const resolvedRoot = path.resolve(root);
      envDir = envDir ? path.resolve(resolvedRoot, envDir) : resolvedRoot;
      const env = loadEnv(mode, envDir);
      const addr = server?.port ?? 3000;

      url = await ngrok.connect({ addr, authtoken: env.NGROK_AUTH_TOKEN });

      // update the configuration

      return {};
    },
  };
}
