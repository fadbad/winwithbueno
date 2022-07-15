/// <reference lib="svelte2tsx" />
import type {SvelteComponentTyped} from 'svelte';
import type {Readable, Writable} from 'svelte/store';
import type {ObjectSchema} from 'yup';

export type FormProps<Inf = Record<string, unknown>> = {
  context?: FormState;
  initialValues?: Inf;
  onSubmit?: ((values: Inf) => any) | ((values: Inf) => Promise<any>);
  validate?: (values: Inf) => any | undefined;
  validationSchema?: ObjectSchema<any>;
} & svelte.JSX.HTMLAttributes<HTMLFormElement>;

type FormState<Inf = Record<string, any>> = {
  form: Writable<Inf>;
  errors: Writable<Record<keyof Inf, string>>;
  touched: Writable<Record<keyof Inf, boolean>>;
  modified: Readable<Record<keyof Inf, boolean>>;
  isValid: Readable<boolean>;
  isSubmitting: Writable<boolean>;
  isValidating: Writable<boolean>;
  isModified: Readable<boolean>;
  updateField: (field: keyof Inf, value: any) => void;
  updateValidateField: (field: keyof Inf, value: any) => void;
  updateTouched: (field: keyof Inf, value: any) => void;
  validateField: (field: keyof Inf) => Promise<any>;
  updateInitialValues: (newValues: Inf) => void;
  handleReset: () => void;
  state: Readable<{
    form: Inf;
    errors: Record<keyof Inf, string>;
    touched: Record<keyof Inf, boolean>;
    modified: Record<keyof Inf, boolean>;
    isValid: boolean;
    isSubmitting: boolean;
    isValidating: boolean;
    isModified: boolean;
  }>;
  handleChange: (event: Event) => any;
  handleSubmit: (event: Event) => any;
};

declare function createForm<Inf = Record<string, any>>(formProperties: {
  initialValues: Inf;
  onSubmit: (values: Inf) => any | Promise<any>;
  validate?: (values: Inf) => any | undefined;
  validationSchema?: ObjectSchema<any>;
}): FormState<Inf>;

declare class Form extends SvelteComponentTyped<
  FormProps,
  Record<string, unknown>,
  {
    default: FormState;
  }
> {}

export {createForm, Form};
