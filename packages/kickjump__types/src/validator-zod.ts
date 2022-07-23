import type {
  AssignableErrors,
  CurrentForm,
  Extender,
  ExtenderHandler,
  Obj,
  ValidationFunction,
} from '@felte/common';
import { _update } from '@felte/common';
import type { AnyZodObject, ZodError } from 'zod';

interface ZodSchema {
  parseAsync: AnyZodObject['parseAsync'];
}

export interface ValidatorConfig {
  schema: ZodSchema;
  level?: 'error' | 'warning';
}

export function validateSchema<Data extends Obj>(schema: ZodSchema): ValidationFunction<Data> {
  function shapeErrors(errors: ZodError): AssignableErrors<Data> {
    // eslint-disable-next-line unicorn/no-array-reduce
    return errors.issues.reduce((err, value) => {
      /* istanbul ignore next */
      if (!value.path) {
        return err;
      }

      return _update(err, value.path.join('.'), (currentValue: undefined | string[]) => {
        if (!currentValue || !Array.isArray(currentValue)) {
          return [value.message];
        }

        return [...currentValue, value.message];
      });
    }, {} as AssignableErrors<Data>);
  }

  return async function validate(values: Data): Promise<AssignableErrors<Data> | undefined> {
    try {
      await schema.parseAsync(values);
    } catch (error) {
      return shapeErrors(error as ZodError<any>);
    }

    return;
  };
}

export function validator<Data extends Obj = Obj>({
  schema,
  level = 'error',
}: ValidatorConfig): Extender<Data> {
  return function extender(currentForm: CurrentForm<Data>): ExtenderHandler<Data> {
    if (currentForm.stage !== 'SETUP') {
      return {};
    }

    const validateFn = validateSchema<Data>(schema);
    currentForm.addValidator(validateFn, { level });
    return {};
  };
}
