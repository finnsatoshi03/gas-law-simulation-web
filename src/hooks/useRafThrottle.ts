import { useCallback, useEffect, useRef } from "react";

/**
 * Wraps a callback so it fires at most once per animation frame, always with
 * the most recent arguments (trailing-edge). Use for high-frequency events like
 * pointer-move handlers that drive React state — it collapses the burst of
 * calls per frame into a single update without dropping the final value.
 *
 * The returned function is referentially stable and always invokes the latest
 * `callback`, so it's safe to use inside effects and event listeners.
 */
export function useRafThrottle<TArgs extends unknown[]>(
  callback: ((...args: TArgs) => void) | undefined
): (...args: TArgs) => void {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const latestArgsRef = useRef<TArgs | null>(null);
  const frameRef = useRef<number | null>(null);

  const flush = useCallback(() => {
    frameRef.current = null;
    const args = latestArgsRef.current;
    latestArgsRef.current = null;
    if (args) {
      callbackRef.current?.(...args);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: TArgs) => {
      latestArgsRef.current = args;
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(flush);
      }
    },
    [flush]
  );
}
