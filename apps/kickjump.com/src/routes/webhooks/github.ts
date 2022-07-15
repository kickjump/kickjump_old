import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { env } from '$server/env';
import { App } from 'octokit';
import { emitterEventNames } from '@octokit/webhooks';
import { s } from '@kickjump/trpc/client';

const WebhookSchema = s.type({
  id: s.string(),
  name: s.enums(emitterEventNames),
  signature: s.string(),
  payload: s.string(),
});

export async function post(event: RequestEvent): Promise<Response> {
  const { request } = event;
  const {
    GITHUB_APP_ID: appId, GITHUB_APP_PRIVATE_KEY: privateKey, GITHUB_WEBHOOK_SECRET: secret,
  } = env;
  const app = new App({ appId, privateKey, webhooks: { secret } });
  const received = s.create(
    {
      id: request.headers.get('x-github-delivery'),
      name: request.headers.get('x-github-event'),
      signature: request.headers.get('x-hub-signature-256'),
      payload: await request.text(),
    },
    WebhookSchema
  );

  // check that whether the webhook is valid.
  await app.webhooks.verifyAndReceive(received);

  const json = JSON.parse(received.payload);

  if (received.name === 'installation.created') {
    // do something
  }

  if (received.name === 'installation.deleted') {
    // do something
  }


  // Return as valid.
  return new Response(null, { status: 202 })
}
