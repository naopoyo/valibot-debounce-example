'use client';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import { useDebouncedValidator } from './use-debounced-validator';

export const inputSchema = (debouncedValidator: (value: string) => Promise<boolean>) =>
  v.objectAsync({
    name: v.pipe(v.string(), v.minLength(1, 'This field is required')),
    email: v.pipeAsync(
      v.string(),
      v.minLength(1, 'This field is required'),
      v.email('Please enter a valid email format'),
      v.checkAsync(debouncedValidator, 'This email is not available')
    ),
  });

export type Inputs = v.InferOutput<ReturnType<typeof inputSchema>>;

export function useSignupForm() {
  const isValidEmail = async (value: string) => {
    const response = await fetch('/api?email=' + encodeURIComponent(value), {
      method: 'GET',
    });
    const data = (await response.json()) as { result: boolean };
    return !data.result;
  };

  const { debouncedValidator } = useDebouncedValidator<string>(isValidEmail, {
    delay: 500,
  });

  const schema = inputSchema(debouncedValidator);

  const form = useForm({
    mode: 'all',
    resolver: valibotResolver(schema, {}, { mode: 'async' }),
    defaultValues: { name: '', email: '' },
  });

  return form;
}
