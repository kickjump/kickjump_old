import type { RequestHandler } from '@sveltejs/kit';

import { stringToUint8Array } from '$utils/core';

// ! not yet supported see issue https://github.com/sveltejs/kit/issues/3419

export const get: RequestHandler = async (_event) => {
  const { readable, writable } = new TransformStream<Uint8Array>();
  const headers = new Headers();
  headers.append('Content-Type', 'text/event-stream');
  headers.append('Cache-Control', 'no-cache');
  headers.append('Connection', 'keep-alive');
  headers.append('Access-Control-Allow-Origin', '*');
  headers.append('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  writeToStream(writable);
  return new Response(readable, { status: 200, statusText: 'ok', headers: headers });
};

async function writeToStream(writable: WritableStream<Uint8Array>) {
  const writer = writable.getWriter();
  const id = 'id-test';

  // send first message
  await constructSSE(writer, id, 'first message');

  // send message every 5 second
  setInterval(() => {
    constructSSE(writer, id, 'repeated message');
  }, 5000);
}

async function constructSSE(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  id: string,
  data: string,
) {
  await writer.write(stringToUint8Array(`id: ${id}\n\n`));
  await writer.write(stringToUint8Array(`data: ${data} - SSE Server - \n\n`));
}
