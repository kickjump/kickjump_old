/* eslint-disable unicorn/filename-case */

import { PROJECT_CREATE_STEPS } from '$modules/create-project';

import type { RequestHandler } from './__types/[step=int]-[name].js';

const NOT_FOUND = { status: 404 } as const;

export const GET: RequestHandler = async (event) => {
  const { step, name } = event.params;
  let index = Number.parseInt(step, 10);

  if (!index || !Number.isInteger(index)) {
    return NOT_FOUND;
  }

  index--;

  const data = PROJECT_CREATE_STEPS.at(index);

  if (!data || data.name !== name) {
    return NOT_FOUND;
  }

  return {
    status: 200,
    body: { index },
  };
};
