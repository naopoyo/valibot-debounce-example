import { useCallback, useRef, useState } from 'react';

type CheckFn<T> = (value: T) => Promise<boolean> | boolean;

type Options<T> = {
  delay?: number;
  negate?: boolean;
  defaultValue?: T;
};

/**
 * Returns a debounced checker function and the last result.
 *
 * check: (value) => Promise<boolean> | boolean
 * This hook debounces calls to `check` and returns a function that resolves with the check result.
 * If `negate` is true, the resolved boolean value is inverted.
 */
export function useDebouncedCheck<T = string>(check: CheckFn<T>, options: Options<T> = {}) {
  const { delay = 500, negate = false, defaultValue = null } = options;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastValueRef = useRef<T | null>(defaultValue);
  const [lastResult, setLastResult] = useState<boolean>(false);

  const debouncedCheck = useCallback(
    (value: T) =>
      new Promise<boolean>((resolve) => {
        if (value === defaultValue) {
          resolve(true);
          return;
        }

        if (lastValueRef.current === value) {
          resolve(lastResult);
          return;
        }

        lastValueRef.current = value;

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(async () => {
          try {
            const r = await Promise.resolve(check(value));
            const result = negate ? !r : r;
            setLastResult(result);
            resolve(result);
          } catch {
            setLastResult(false);
            resolve(false);
          }
        }, delay);
      }),
    [check, delay, negate, lastResult, defaultValue]
  );

  return { debouncedCheck, lastResult } as const;
}
