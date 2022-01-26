import { useButton } from '@react-aria/button';
import { useLocale } from '@react-aria/i18n';
import { useNumberField } from '@react-aria/numberfield';
import { useObjectRef } from '@react-aria/utils';
import { useNumberFieldState } from '@react-stately/numberfield';
import { type AriaNumberFieldProps } from '@react-types/numberfield';
import type { ChangeEventHandler, ForwardedRef } from 'react';
import { forwardRef, useRef } from 'react';

export interface NumberFieldProps extends AriaNumberFieldProps {
  onChangeEvent?: ChangeEventHandler<HTMLInputElement>;
}

function NumberField(props: NumberFieldProps, ref: ForwardedRef<HTMLInputElement>) {
  const { locale } = useLocale();
  const { label, onChangeEvent, errorMessage } = props;
  const state = useNumberFieldState({ ...props, locale });
  const incrementRef = useRef<HTMLButtonElement>(null);
  const decrementRef = useRef<HTMLButtonElement>(null);
  const objectRef = useObjectRef(ref);
  const {
    labelProps,
    groupProps,
    inputProps,
    incrementButtonProps,
    decrementButtonProps,
    errorMessageProps,
  } = useNumberField(props, state, objectRef);

  const { buttonProps: incrementProps } = useButton(incrementButtonProps, incrementRef);
  const { buttonProps: decrementProps } = useButton(decrementButtonProps, decrementRef);

  return (
    <div>
      <label {...labelProps}>{label}</label>
      <div {...groupProps}>
        <button {...decrementProps} ref={incrementRef}>
          -
        </button>
        <input
          {...inputProps}
          ref={objectRef}
          onChange={(event) => {
            inputProps.onChange?.(event);
            onChangeEvent?.(event);
          }}
        />
        <button {...incrementProps} ref={decrementRef}>
          +
        </button>
      </div>
      {errorMessage && (
        <div {...errorMessageProps} style={{ color: 'red', fontSize: 12 }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
}

const _NumberField = forwardRef(NumberField);

export { _NumberField as NumberField };
