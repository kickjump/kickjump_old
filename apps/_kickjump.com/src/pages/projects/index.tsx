import { Item, ListBox, Section } from '@kickjump/components';
import type { components } from '@octokit/openapi-types';
import { type ComponentProps, useCallback, useState } from 'react';

import { Layout } from '~/components/layout';
import { useQuery } from '~/hooks/use-trpc';

type OnChange = NonNullable<ComponentProps<typeof ListBox>['onSelectionChange']>;

/**
 * Load the repositories for the current user.
 */
const ProjectsPage = () => {
  const [showList, setShowList] = useState(false);
  const repos = useQuery(['github.repos'], { enabled: showList });
  // repos.data?.data[0]?.stargazers_count;
  // repos.data?.headers.

  const onSelectionChange: OnChange = useCallback((selection) => {}, []);

  return (
    <Layout>
      <>
        <h1>Projects</h1>
        <button
          onClick={() => {
            setShowList(!showList);
          }}
        >
          View Organisations
        </button>
        {showList && (
          <ListBox<{ name: string; id: string; stars: number }>
            disallowEmptySelection
            label='Repositories'
            onSelectionChange={}
          >
            <code>{JSON.stringify(orgs.data, null, 2)}</code>
          </ListBox>
        )}
        <br />
      </>
    </Layout>
  );
};

type Repository = components['schemas']['repository'];
interface RepoProps extends Repository {}

const Repo = (props: RepoProps) => {
  const { name, id } = props;
  return (
    <div>
      <button>
        <span style={{ fontWeight: 'bold' }}>{name}</span>
      </button>
    </div>
  );
};

export default ProjectsPage;
