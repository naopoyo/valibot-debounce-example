import { useCallback, useRef, useState } from 'react';

type CheckFn<T> = (value: T) => Promise<boolean> | boolean;

type Options<T> = {
  delay?: number;
  negate?: boolean;
  defaultValue?: T;
};

/**
 * デバウンスされたチェッカ関数と最後の結果を返します。
 *
 * check: (value) => Promise<boolean> | boolean
 * このフックは、呼び出されると `check` への呼び出しをデバウンスし、
 * チェック結果で解決する関数を返します。`negate` が true の場合、解決されたブール値が反転されます。
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
