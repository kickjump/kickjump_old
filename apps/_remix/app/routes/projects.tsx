import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, NavLink, Outlet, useLoaderData } from '@remix-run/react';

import { useUser } from '~/hooks/use-user';
import { requireUserId } from '~/utils/auth.server';
import { ProjectModel } from '~/utils/db.server';

interface LoaderData {
  projects: Awaited<ReturnType<typeof ProjectModel['getForUser']>>;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const projects = await ProjectModel.getForUser({ userId });
  return json<LoaderData>({ projects });
};

export default function ProjectsPage() {
  const data = useLoaderData<LoaderData>();
  const user = useUser();

  return (
    <div className='flex h-full min-h-screen flex-col'>
      <header className='flex items-center justify-between bg-slate-800 p-4 text-white'>
        <h1 className='text-3xl font-bold'>
          <Link to='.'>Notes</Link>
        </h1>
        <p>{user.email}</p>
        <Form action='/logout' method='post'>
          <button
            type='submit'
            className='rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600'
          >
            Logout
          </button>
        </Form>
      </header>

      <main className='flex h-full bg-white'>
        <div className='h-full w-80 border-r bg-gray-50'>
          <Link to='new' className='block p-4 text-xl text-blue-500'>
            + New Note
          </Link>

          <hr />

          {data.projects.length === 0 ? (
            <p className='p-4'>No projects yet</p>
          ) : (
            <ol>
              {data.projects.map((project) => (
                <li key={project.id}>
                  <NavLink
                    className={({ isActive }) =>
                      `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`
                    }
                    to={project.id}
                  >
                    📝 {project.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className='flex-1 p-6'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
