import * as s from 'superstruct';
import { expect, test } from 'vitest';

function isStructError(value: unknown): value is s.StructError {
  return typeof value === 'object' && value instanceof s.StructError;
}

test('super struct stuff', () => {
  const sample = s.object({
    name: s.size(s.string(), 5),
    value: s.number(),
    nested: s.object({
      value: s.boolean(),
    }),
  });

  const data1 = {
    name: 'test',
  };

  let error: s.StructError | undefined;

  try {
    const value = s.create(data1, sample);
  } catch (error_) {
    error = isStructError(error_) ? error_ : undefined;
  }

  // console.log(error.failures());

  // expect(value).toBe({});
});

test('symbol', () => {
  const symbol = Symbol('test');
  const symbol2 = Symbol('test');
  const other = Symbol.for('awesome');
  const other2 = Symbol.for('awesome');

  console.log(symbol.description);
  expect(other).toBe(other2);
});
