'use client';

import { valibotResolver } from '@hookform/resolvers/valibot';
import { useForm } from 'react-hook-form';
import * as v from 'valibot';

import { useDebouncedCheck } from './use-debounce-check';

export const inputSchema = (debouncedCheck: (value: string) => Promise<boolean>) =>
  v.objectAsync({
    name: v.pipe(v.string(), v.minLength(1, '必須項目です')),
    email: v.pipeAsync(
      v.string(),
      v.minLength(1, '必須項目です'),
      v.checkAsync(debouncedCheck, 'このEmailは使用できません。')
    ),
  });

export type Inputs = v.InferOutput<ReturnType<typeof inputSchema>>;

export default function useSignupForm() {
  const isInvalidEmail = async (value: string) => {
    const response = await fetch('/api?email=' + encodeURIComponent(value), {
      method: 'GET',
    });
    const data = (await response.json()) as { result: boolean };
    return data.result === false;
  };

  const { debouncedCheck } = useDebouncedCheck<string>(isInvalidEmail, {
    delay: 500,
    negate: true,
  });

  const schema = inputSchema(debouncedCheck);

  const form = useForm({
    mode: 'all',
    resolver: valibotResolver(schema, {}, { mode: 'async' }),
    defaultValues: { name: '', email: '' },
  });

  return form;
}
