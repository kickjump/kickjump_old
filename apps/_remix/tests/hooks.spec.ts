import { validateEmail } from '../app/hooks/use-optional-user';

test('validateEmail returns false for non-emails', () => {
  expect(validateEmail()).toBe(false);
  expect(validateEmail(null)).toBe(false);
  expect(validateEmail('')).toBe(false);
  expect(validateEmail('not-an-email')).toBe(false);
  expect(validateEmail('n@')).toBe(false);
});

test('validateEmail returns true for emails', () => {
  expect(validateEmail('kody@example.com')).toBe(true);
});