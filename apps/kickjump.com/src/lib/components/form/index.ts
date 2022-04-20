export type InputType =
  | 'text'
  | 'email'
  | 'number'
  | 'password'
  | 'search'
  | 'tel'
  | 'url'
  | 'time'
  | 'date'
  | 'month'
  | 'week'
  | 'datetime-local'
  | 'color'
  | 'textarea';

export { default as Checkbox } from './Checkbox.svelte';
export { default as Form } from './Form.svelte';
export { default as Input } from './Input.svelte';
export { default as Radio } from './Radio.svelte';
export { default as Select } from './Select.svelte';
export { default as Slider } from './Slider.svelte';
export { default as Switch } from './Switch.svelte';
