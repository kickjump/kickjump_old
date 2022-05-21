import { rest } from 'msw';

export const handlers = [rest.get('http://localhost:3030', () => {})];
