import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useCatch, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { requireUserId } from '~/utils/auth.server';
import { type Project, ProjectModel } from '~/utils/db.server';

interface LoaderData {
  project: Project;
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.id, 'project not found');

  const project = await ProjectModel.get({ userId, id: params.id });

  if (!project) {
    throw new Response('Not Found', { status: 404 });
  }

  return json<LoaderData>({ project });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.id, 'project not found');

  await ProjectModel.remove({ userId, id: params.id });

  return redirect('/projects');
};

export default function NoteDetailsPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <h3 className='text-2xl font-bold'>{data.project.title}</h3>
      <p className='py-6'>{data.project.description}</p>
      <hr className='my-4' />
      <Form method='post'>
        <button
          type='submit'
          className='rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400'
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
