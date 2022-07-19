import { faker } from '@faker-js/faker';
import type * as GitHubApi from '@octokit/openapi-types';

// set the seed
faker.seed(1001);

export const GITHUB_USERNAMES = ['octocat', 'tolu', 'ahmed'] as const;
export type GitHubUsername = typeof GITHUB_USERNAMES[number];
export interface GitHubUserData {
  user: GitHubApi.components['schemas']['private-user'];
  auth: { accessToken: string; refreshToken: string; code: string; providerAccountId: string };
  repos: Array<GitHubApi.components['schemas']['full-repository']>;
}

function createGitHubUserData(): Record<GitHubUsername, GitHubUserData> {
  const data: Record<GitHubUsername, GitHubUserData> = Object.create(null);

  for (const username of GITHUB_USERNAMES) {
    const instance: GitHubUserData = Object.create(null);

    instance.user = createUser(username);
    instance.auth = {
      accessToken: faker.datatype.hexadecimal(16).slice(2),
      refreshToken: faker.datatype.hexadecimal(20).slice(2),
      code: faker.datatype.hexadecimal(12).slice(2),
      providerAccountId: faker.datatype.hexadecimal(20).slice(2),
    };

    data[username] = instance;
  }

  return data;
}

function createUser(login: GitHubUsername): GitHubUserData['user'] {
  const id = faker.datatype.number();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    login,
    id,
    node_id: btoa(`04:User${id}`),
    avatar_url: faker.image.avatar(),
    gravatar_id: '',
    url: `https://api.github.com/users/${login}`,
    html_url: `https://github.com/${login}`,
    followers_url: `https://api.github.com/users/${login}/followers`,
    following_url: `https://api.github.com/users/${login}/following{/other_user}`,
    gists_url: `https://api.github.com/users/${login}/gists{/gist_id}`,
    starred_url: `https://api.github.com/users/${login}/starred{/owner}{/repo}`,
    subscriptions_url: `https://api.github.com/users/${login}/subscriptions`,
    organizations_url: `https://api.github.com/users/${login}/orgs`,
    repos_url: `https://api.github.com/users/${login}/repos`,
    events_url: `https://api.github.com/users/${login}/events{/privacy}`,
    received_events_url: `https://api.github.com/users/${login}/received_events`,
    type: 'User',
    site_admin: false,
    name: `${firstName} ${lastName}`,
    company: faker.company.companyName(),
    blog: faker.internet.url(),
    location: faker.address.city(),
    email: faker.internet.email(firstName, lastName),
    hireable: false,
    bio: 'There once was...',
    twitter_username: 'monatheoctocat',
    public_repos: faker.datatype.number({ min: 0, max: 200 }),
    public_gists: faker.datatype.number({ min: 0, max: 500 }),
    followers: faker.datatype.number({ min: 0, max: 100_000 }),
    following: faker.datatype.number({ min: 0, max: 500 }),
    created_at: faker.date.past(10).toISOString(),
    updated_at: faker.date.past(1).toISOString(),
    private_gists: faker.datatype.number({ min: 0, max: 500 }),
    total_private_repos: faker.datatype.number({ min: 0, max: 200 }),
    owned_private_repos: faker.datatype.number({ min: 0, max: 100 }),
    disk_usage: 10_000,
    collaborators: faker.datatype.number({ min: 0, max: 20 }),
    two_factor_authentication: faker.datatype.boolean(),
    plan: {
      name: 'Medium',
      space: 400,
      private_repos: 20,
      collaborators: 0,
    },
  };
}

export const USERS = createGitHubUserData();
