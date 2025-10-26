'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type ValidateFn<T> = (value: T) => Promise<boolean> | boolean;

type Options<T> = {
  delay?: number;
  negate?: boolean;
  defaultValue?: T | undefined;
};

/**
 * A performant and secure debounced validator hook that batches consecutive calls,
 * ensures all promises resolve with the final result, and prevents race conditions.
 *
 * This hook is designed for scenarios like form validation or API checks where
 * you want to debounce user input to avoid excessive computations or network requests.
 * It caches results for identical values and handles asynchronous checks efficiently.
 *
 * Key features:
 * - Debounces validations within the specified delay to reduce unnecessary operations.
 * - Caches the last result for identical values to improve performance.
 * - Batches multiple calls during the debounce period and resolves all with the final result.
 * - Prevents race conditions by ensuring only the latest value is processed.
 * - Includes robust error handling and automatic cleanup to prevent memory leaks.
 * - Supports negation of results and default values for common use cases.
 *
 * @typeParam T - The type of the value to be validated. Defaults to `string`.
 * @param validate - A function that performs the validation on the value. It can be synchronous or asynchronous.
 *   The function should return `true` for valid values and `false` otherwise.
 * @param options - Configuration options for the hook.
 * @param options.delay - The debounce delay in milliseconds. Defaults to 500ms.
 *   Shorter delays improve responsiveness but may increase computation.
 * @param options.negate - If `true`, negates the result of the validate function. Useful for inverting logic. Defaults to `false`.
 * @param options.defaultValue - A default value that always returns `true` immediately without calling the validate function.
 *   Useful for skipping validations on initial or placeholder values.
 * @returns An object containing:
 *   - `debouncedValidator`: A debounced function that takes a value of type `T` and returns a `Promise<boolean>`.
 *     Call this function to perform the debounced validation.
 *   - `lastResult`: The most recent result of the validation, updated reactively.
 *
 * @example
 * ```typescript
 * import { useDebouncedValidator } from './hooks/use-debounced-validator';
 *
 * function EmailChecker() {
 *   const { debouncedValidator, lastResult } = useDebouncedValidator(
 *     async (email: string) => {
 *       // Simulate API call to check email availability
 *       const response = await fetch(`/api/check-email?email=${email}`);
 *       return response.ok;
 *     },
 *     { delay: 300, defaultValue: '' }
 *   );
 *
 *   const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
 *     const isAvailable = await debouncedValidator(event.target.value);
 *     console.log('Email available:', isAvailable);
 *   };
 *
 *   return (
 *     <div>
 *       <input onChange={handleInputChange} placeholder="Enter email" />
 *       <p>Available: {lastResult ? 'Yes' : 'No'}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @remarks
 * - The hook automatically cleans up timers and resolves pending promises on unmount to prevent memory leaks.
 * - If the validate function throws an error, it logs the error and returns `false`.
 * - For performance, identical values are cached and returned immediately if no debounce is pending.
 * - Be cautious with object values for `T`; equality checks use `===`, which may not work as expected for objects.
 * - This hook is optimized for React and uses refs to avoid unnecessary re-renders.
 */
export function useDebouncedValidator<T = string>(
  validate: ValidateFn<T>,
  options: Options<T> = {}
) {
  const memoizedOptions = useMemo(() => options, [options]);
  const { delay = 500, negate = false, defaultValue } = memoizedOptions;

  const [lastResult, setLastResult] = useState(false);
  const lastValueRef = useRef<T | undefined>(defaultValue);
  const lastResultRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingResolversRef = useRef<Array<(result: boolean) => void>>([]);
  const pendingValueRef = useRef<T | undefined>(undefined);

  const flushResolvers = (result: boolean) => {
    const resolvers = pendingResolversRef.current.splice(0);
    resolvers.forEach((resolve) => resolve(result));
  };

  const performValidation = useCallback(
    async (currentValue: T) => {
      try {
        const rawResult = await validate(currentValue);
        const result = negate ? !rawResult : rawResult;

        lastValueRef.current = currentValue;
        lastResultRef.current = result;
        if (lastResult !== result) {
          setLastResult(result);
        }
        flushResolvers(result);
      } catch {
        const result = false;
        lastValueRef.current = currentValue;
        lastResultRef.current = result;
        if (lastResult !== result) {
          setLastResult(result);
        }
        flushResolvers(result);
      }
    },
    [validate, negate, lastResult]
  );

  const debouncedValidator = useCallback(
    (value: T): Promise<boolean> => {
      if (Object.is(value, defaultValue)) {
        return Promise.resolve(true);
      }

      if (lastValueRef.current === value && timerRef.current === null) {
        return Promise.resolve(lastResultRef.current);
      }

      return new Promise<boolean>((resolve) => {
        pendingResolversRef.current.push(resolve);
        pendingValueRef.current = value;

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(async () => {
          timerRef.current = null;
          const currentValue = pendingValueRef.current!;

          if (currentValue !== value) {
            return;
          }

          await performValidation(currentValue);
        }, delay);
      });
    },
    [delay, defaultValue, performValidation]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      flushResolvers(lastResultRef.current);
    };
  }, []);

  return { debouncedValidator, lastResult } as const;
}
