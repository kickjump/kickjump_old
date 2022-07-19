import { custom } from './custom.js';
import { githubApi, githubWebsite } from './github.js';

export function mockDomains() {
  githubApi();
  githubWebsite();
  custom();
}
