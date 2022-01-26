import { type AriaTextFieldOptions, useTextField } from '@react-aria/textfield';
import { useObjectRef } from '@react-aria/utils';
import type { ChangeEventHandler } from 'react';
import { type ForwardedRef, forwardRef } from 'react';

export interface TextFieldProps extends AriaTextFieldOptions<'input'> {
  onChangeEvent?: ChangeEventHandler<HTMLInputElement>;
}

const TextField = (props: TextFieldProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { label, description, errorMessage, onChangeEvent } = props;
  const { labelProps, inputProps, descriptionProps, errorMessageProps } = useTextField(
    props,
    useObjectRef(ref),
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: 200 }}>
      <label {...labelProps}>{label}</label>
      <input
        {...inputProps}
        ref={ref}
        onChange={(event) => {
          inputProps.onChange?.(event);
          onChangeEvent?.(event);
        }}
      />
      {description && (
        <div {...descriptionProps} style={{ fontSize: 12 }}>
          {description}
        </div>
      )}
      {errorMessage && (
        <div {...errorMessageProps} style={{ color: 'red', fontSize: 12 }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

const _TextField = forwardRef(TextField);
export { _TextField as TextField };
