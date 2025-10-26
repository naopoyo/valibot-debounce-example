import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { useDebouncedValidator } from '../use-debounced-validator';

/**
 * Test suite for useDebouncedValidator hook.
 * This hook provides debounced validation with caching, error handling, and race condition prevention.
 */
describe('useDebouncedValidator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Default value handling', () => {
    /**
     * Verifies that default values return true immediately without calling the validate function.
     */
    it('should return true for default value immediately', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() =>
        useDebouncedValidator(validate, { defaultValue: 'default' })
      );

      const isValid = await result.current.debouncedValidator('default');
      expect(isValid).toBe(true);
      expect(validate).not.toHaveBeenCalled();
    });

    /**
     * Verifies that object values work correctly with defaultValue, using reference equality.
     */
    it('should handle object values correctly for defaultValue', async () => {
      const defaultObj = { id: 1 };
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() =>
        useDebouncedValidator(validate, { defaultValue: defaultObj })
      );

      const isValid = await result.current.debouncedValidator(defaultObj);
      expect(isValid).toBe(true);
      expect(validate).not.toHaveBeenCalled();

      // Different object with same content should not match
      const differentObj = { id: 1 };
      const promise = result.current.debouncedValidator(differentObj);
      vi.advanceTimersByTime(500);
      const isValid2 = await promise;
      expect(isValid2).toBe(true);
      expect(validate).toHaveBeenCalledTimes(1);
    });
  });

  describe('Debouncing behavior', () => {
    /**
     * Verifies that synchronous validation is debounced, processing only the last call after the delay.
     */
    it('should debounce synchronous validation', async () => {
      const validate = vi.fn().mockReturnValue(true);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

      const promise1 = result.current.debouncedValidator('test1');
      const promise2 = result.current.debouncedValidator('test2');

      expect(validate).not.toHaveBeenCalled();

      vi.advanceTimersByTime(100);

      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate).toHaveBeenCalledWith('test2');

      expect(await promise1).toBe(true);
      expect(await promise2).toBe(true);
    });

    /**
     * Verifies that asynchronous validation is debounced, waiting for the delay before calling validate.
     */
    it('should debounce asynchronous validation', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

      const promise = result.current.debouncedValidator('test');

      vi.advanceTimersByTime(100);

      expect(validate).toHaveBeenCalledWith('test');

      expect(await promise).toBe(true);
    });

    /**
     * Verifies that the hook works correctly with zero delay.
     */
    it('should work with zero delay', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 0 }));

      const promise = result.current.debouncedValidator('test');

      vi.runOnlyPendingTimers();

      expect(validate).toHaveBeenCalledWith('test');
      expect(await promise).toBe(true);
    });
  });

  describe('Caching', () => {
    /**
     * Verifies that identical values are cached and returned immediately without debounce.
     */
    it('should cache result for identical values without debounce', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

      // First call
      const promise1 = result.current.debouncedValidator('test');
      vi.advanceTimersByTime(100);
      await promise1;

      // Second call with same value
      const promise2 = result.current.debouncedValidator('test');
      expect(await promise2).toBe(true);
      expect(validate).toHaveBeenCalledTimes(1);
    });

    /**
     * Verifies that object values are cached properly using reference equality.
     */
    it('should cache object values properly', async () => {
      const obj = { id: 1 };
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

      // First call
      const promise1 = result.current.debouncedValidator(obj);
      vi.advanceTimersByTime(100);
      await promise1;

      // Second call with same reference
      const promise2 = result.current.debouncedValidator(obj);
      expect(await promise2).toBe(true);
      expect(validate).toHaveBeenCalledTimes(1);

      // Call with different object should trigger validation
      const differentObj = { id: 1 };
      const promise3 = result.current.debouncedValidator(differentObj);
      vi.advanceTimersByTime(100);
      await promise3;
      expect(validate).toHaveBeenCalledTimes(2);
    });
  });

  describe('Options and result manipulation', () => {
    /**
     * Verifies that the negate option inverts the validation result.
     */
    it('should negate the result when negate is true', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() =>
        useDebouncedValidator(validate, { delay: 100, negate: true })
      );

      const promise = result.current.debouncedValidator('test');
      vi.advanceTimersByTime(100);

      expect(validate).toHaveBeenCalledWith('test');

      expect(await promise).toBe(false);
    });

    /**
     * Verifies that validation functions returning false are handled correctly.
     */
    it('should handle validation returning false', async () => {
      const validate = vi.fn().mockResolvedValue(false);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

      const promise = result.current.debouncedValidator('test');
      vi.advanceTimersByTime(100);

      expect(validate).toHaveBeenCalledWith('test');
      expect(await promise).toBe(false);
    });

    /**
     * Verifies that cache size is limited and old entries are removed.
     */
    it('should limit cache size and remove old entries', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() =>
        useDebouncedValidator(validate, { delay: 100, maxCacheSize: 2 })
      );

      // Add first value
      const promise1 = result.current.debouncedValidator('value1');
      vi.advanceTimersByTime(100);
      await promise1;
      expect(validate).toHaveBeenCalledTimes(1);

      // Add second value
      const promise2 = result.current.debouncedValidator('value2');
      vi.advanceTimersByTime(100);
      await promise2;
      expect(validate).toHaveBeenCalledTimes(2);

      // Add third value - should remove first
      const promise3 = result.current.debouncedValidator('value3');
      vi.advanceTimersByTime(100);
      await promise3;
      expect(validate).toHaveBeenCalledTimes(3);

      // First value should be removed from cache, so validation is called again
      const promise4 = result.current.debouncedValidator('value1');
      vi.advanceTimersByTime(100);
      await promise4;
      expect(validate).toHaveBeenCalledTimes(4);
    });

    /**
     * Verifies that negate works correctly with cached results.
     */
    it('should apply negate to cached results', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() =>
        useDebouncedValidator(validate, { delay: 100, negate: true })
      );

      // First call
      const promise1 = result.current.debouncedValidator('test');
      vi.advanceTimersByTime(100);
      expect(await promise1).toBe(false);
      expect(validate).toHaveBeenCalledTimes(1);

      // Second call - should use cache and negate
      const promise2 = result.current.debouncedValidator('test');
      expect(await promise2).toBe(false);
      expect(validate).toHaveBeenCalledTimes(1); // Not called again
    });
  });

  describe('Error handling and edge cases', () => {
    /**
     * Verifies that validation errors are handled gracefully, returning false.
     */
    it('should handle validation errors gracefully', async () => {
      const validate = vi.fn().mockRejectedValue(new Error('Validation failed'));
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

      const promise = result.current.debouncedValidator('test');
      vi.advanceTimersByTime(100);

      expect(validate).toHaveBeenCalledWith('test');

      expect(await promise).toBe(false);
    });

    /**
     * Verifies that race conditions are prevented by resolving all pending promises with the final result.
     */
    it('should prevent race conditions by resolving all pending promises with final result', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 0 }));

      const promise1 = result.current.debouncedValidator('test1');
      const promise2 = result.current.debouncedValidator('test2');

      vi.runOnlyPendingTimers();

      expect(validate).toHaveBeenCalledTimes(1);
      expect(validate).toHaveBeenCalledWith('test2');

      expect(await promise1).toBe(true);
      expect(await promise2).toBe(true);
    });

    /**
     * Verifies that validation functions returning undefined are handled correctly.
     */
    it('should handle undefined return from validate function', async () => {
      const validate = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

      const promise = result.current.debouncedValidator('test');
      vi.advanceTimersByTime(100);

      expect(validate).toHaveBeenCalledWith('test');
      expect(await promise).toBe(false);
    });

    /**
     * Verifies that validation functions returning null are handled correctly.
     */
    it('should handle null return from validate function', async () => {
      const validate = vi.fn().mockResolvedValue(null);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

      const promise = result.current.debouncedValidator('test');
      vi.advanceTimersByTime(100);

      expect(validate).toHaveBeenCalledWith('test');
      expect(await promise).toBe(false);
    });

    /**
     * Verifies that negative delay values are handled by defaulting to immediate execution.
     */
    it('should handle negative delay by defaulting to immediate execution', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: -100 }));

      const promise = result.current.debouncedValidator('test');

      vi.runOnlyPendingTimers();

      expect(validate).toHaveBeenCalledWith('test');
      expect(await promise).toBe(true);
    });

    /**
     * Verifies that very long delays work correctly.
     */
    it('should handle very long delay', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 10000 }));

      const promise = result.current.debouncedValidator('test');

      vi.advanceTimersByTime(10000);

      expect(validate).toHaveBeenCalledWith('test');
      expect(await promise).toBe(true);
    });

    /**
     * Verifies that a large number of unique values do not cause caching issues.
     */
    it('should handle large number of unique values without caching issues', async () => {
      const validate = vi.fn().mockResolvedValue(true);
      const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 0 }));

      const uniqueValues = Array.from({ length: 100 }, (_, i) => `value${i}`);

      for (const value of uniqueValues) {
        const promise = result.current.debouncedValidator(value);
        vi.runOnlyPendingTimers();
        await promise;
      }

      expect(validate).toHaveBeenCalledTimes(100);
    });

    describe('Reactive updates and cleanup', () => {
      /**
       * Verifies that lastResult updates reactively after validation.
       */
      it('should update lastResult reactively', async () => {
        const validate = vi.fn().mockResolvedValue(true);
        const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

        expect(result.current.lastResult).toBe(false);

        await act(async () => {
          const promise = result.current.debouncedValidator('test');
          vi.advanceTimersByTime(100);
          await promise;
        });

        expect(result.current.lastResult).toBe(true);
      });

      /**
       * Verifies that timers are cleaned up on component unmount to prevent memory leaks.
       */
      it('should clean up timer on unmount', () => {
        const validate = vi.fn().mockResolvedValue(true);
        const { result, unmount } = renderHook(() =>
          useDebouncedValidator(validate, { delay: 100 })
        );

        result.current.debouncedValidator('test');

        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
      });

      /**
       * Verifies that setLastResult is not called when lastResult is already the same as the new result.
       */
      it('should not update lastResult if it is already the same', async () => {
        const validate = vi.fn().mockResolvedValue(false); // Same as initial lastResult
        const { result } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

        expect(result.current.lastResult).toBe(false);

        await act(async () => {
          const promise = result.current.debouncedValidator('test');
          vi.advanceTimersByTime(100);
          await promise;
        });

        expect(result.current.lastResult).toBe(false); // Should remain false
        expect(validate).toHaveBeenCalledWith('test');
      });

      /**
       * Verifies that cleanup does not call clearTimeout when timerRef is null.
       */
      it('should not call clearTimeout on unmount when timerRef is null', () => {
        const validate = vi.fn().mockResolvedValue(true);
        const { unmount } = renderHook(() => useDebouncedValidator(validate, { delay: 100 }));

        // No calls made, so timerRef is null
        const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

        unmount();

        expect(clearTimeoutSpy).not.toHaveBeenCalled();
      });

      /**
       * Verifies that lastResult updates reactively with negate option.
       */
      it('should update lastResult reactively with negate when result changes', async () => {
        const validate = vi.fn().mockResolvedValue(false);
        const { result } = renderHook(() =>
          useDebouncedValidator(validate, { delay: 100, negate: true })
        );

        expect(result.current.lastResult).toBe(false);

        await act(async () => {
          const promise = result.current.debouncedValidator('test');
          vi.advanceTimersByTime(100);
          await promise;
        });

        expect(result.current.lastResult).toBe(true); // negate=true so false becomes true
      });
    });
  });
});
