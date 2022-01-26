import { superstructResolver } from '@hookform/resolvers/superstruct';
import { type ChangeEventHandler, useMemo } from 'react';
import type {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormProps,
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form';
import { useForm } from 'react-hook-form';
import * as s from 'superstruct';

import { NumberField } from './number-field';
import { TextField } from './text-field';

export interface CreateTokenFormProps {
  onSubmit: (data: CreateTokenFormData) => void;
}

const FieldName = {
  Name: 'name',
  Symbol: 'symbol',
  Description: 'description',
  BuyRoyalty: 'buyRoyalty',
  SellRoyalty: 'sellRoyalty',
} as const;

const CreateTokenFormData = s.object({
  [FieldName.Name]: s.nonempty(s.string()),
  [FieldName.Symbol]: s.nonempty(s.string()),
  [FieldName.Description]: s.optional(s.string()),
  [FieldName.BuyRoyalty]: s.max(s.min(s.number(), 0), 1),
  [FieldName.SellRoyalty]: s.optional(s.max(s.min(s.number(), 0), 1)),
});

export type CreateTokenFormData = s.Infer<typeof CreateTokenFormData>;
// interface CreateTokenFormData extends s.Infer<typeof CreateTokenFormData>  {}
// interface CreateTokenFormData extends Simplify<s.Infer<typeof CreateTokenFormData>>  {}
// export interface CreateTokenFormData {
//   name: string;
//   symbol: string;
//   buyRoyalty: number;
//   description?: string | undefined;
//   sellRoyalty?: number | undefined;
// }

type UseFormRegister<Values extends FieldValues> = <
  FieldName extends FieldPath<Values> = FieldPath<Values>,
>(
  name: FieldName,
  options?: RegisterOptions<Values, FieldName>,
) => Omit<UseFormRegisterReturn, 'onChange'> & {
  onChangeEvent: ChangeEventHandler<HTMLInputElement>;
};

function useAriaForm<Values extends FieldValues = FieldValues, Context extends object = object>(
  props?: UseFormProps<Values, Context>,
): Omit<UseFormReturn<Values, Context>, 'register'> & {
  register: UseFormRegister<Values>;
} {
  const { register, ...rest } = useForm(props);

  return useMemo(
    () => ({
      ...rest,
      register: (path, options) => {
        const { onChange, ...other } = register(path, options);
        return { ...other, onChangeEvent: onChange };
      },
    }),
    [register, rest],
  );
}

export const CreateTokenForm = (props: CreateTokenFormProps) => {
  const { register, handleSubmit, formState, setValue } = useAriaForm<CreateTokenFormData>({
    resolver: superstructResolver(CreateTokenFormData),
  });

  return (
    <form onSubmit={handleSubmit((data) => props.onSubmit(data))}>
      <TextField
        label='Name'
        type='text'
        placeholder='Awesome'
        errorMessage={formState.errors[FieldName.Name]?.message}
        {...register(FieldName.Name, {})}
      />
      <TextField
        label='Symbol'
        type='text'
        placeholder='AWE'
        {...register(FieldName.Symbol)}
        errorMessage={formState.errors[FieldName.Symbol]?.message}
      />
      <TextField
        label='Description'
        type='text'
        placeholder='...'
        {...register(FieldName.Description)}
        errorMessage={formState.errors[FieldName.Description]?.message}
      />
      <NumberField
        label='Buy Royalty'
        maxValue={1}
        minValue={0}
        defaultValue={0.05}
        step={0.005}
        // formatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
        errorMessage={formState.errors[FieldName.BuyRoyalty]?.message}
        {...register(FieldName.BuyRoyalty, {
          valueAsNumber: true,
          setValueAs: percentStringToNumber,
        })}
        onChange={(value) => {
          setValue(FieldName.BuyRoyalty, value);
        }}
      />
      <NumberField
        label='Sell Royalty'
        maxValue={1}
        minValue={0}
        defaultValue={0}
        step={0.005}
        // formatOptions={{ style: 'percent', maximumFractionDigits: 1 }}
        errorMessage={formState.errors[FieldName.SellRoyalty]?.message}
        {...register(FieldName.SellRoyalty, {
          valueAsNumber: true,
          setValueAs: percentStringToNumber,
        })}
        onChange={(value) => {
          setValue(FieldName.SellRoyalty, value);
        }}
      />
      <button type='submit'>Submit</button>
    </form>
  );
};

function percentStringToNumber(percent: unknown) {
  if (!s.string().is(percent)) {
    return 0;
  }

  return Number.parseFloat(percent.replace(/%/, ''));
}
