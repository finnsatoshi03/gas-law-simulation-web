import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

// Frequently-changing recording state (re-renders consumers on every update).
interface WallCollisionState {
  collisionCount: number;
  elapsedTime: number;
  isPlaying: boolean;
}

// Referentially-stable actions (never change identity, so consuming them alone
// never causes a re-render — important for the molecule simulation, which only
// needs `incrementCollision`).
interface WallCollisionActions {
  startRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
  incrementCollision: () => void;
}

type WallCollisionContextType = WallCollisionState & WallCollisionActions;

const WallCollisionStateContext = createContext<WallCollisionState | undefined>(
  undefined
);
const WallCollisionActionsContext = createContext<
  WallCollisionActions | undefined
>(undefined);

export const WallCollisionProvider: React.FC<{
  children: React.ReactNode;
  samplingInterval?: number;
}> = ({
  children,
  samplingInterval = 1000, // Default 1 second sampling
}) => {
  const [collisionCount, setCollisionCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Collisions arrive in bursts — hundreds per animation frame. Accumulate them
  // in a ref and flush to React state on a fixed cadence so the counter (and its
  // consumers) re-render a handful of times per second instead of per collision.
  const pendingCollisionsRef = useRef(0);
  // Mirror `isPlaying` in a ref so `incrementCollision` can stay referentially
  // stable (no deps) and never force the molecule simulation to re-subscribe.
  const isPlayingRef = useRef(isPlaying);
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    let elapsedIntervalId: NodeJS.Timeout;
    let flushIntervalId: NodeJS.Timeout;

    if (isPlaying) {
      elapsedIntervalId = setInterval(() => {
        setElapsedTime((prev) => prev + samplingInterval / 1000);
      }, samplingInterval);

      flushIntervalId = setInterval(() => {
        if (pendingCollisionsRef.current > 0) {
          const pending = pendingCollisionsRef.current;
          pendingCollisionsRef.current = 0;
          setCollisionCount((prev) => prev + pending);
        }
      }, 200);
    }

    return () => {
      if (elapsedIntervalId) clearInterval(elapsedIntervalId);
      if (flushIntervalId) clearInterval(flushIntervalId);
      // Flush any leftover collisions captured before recording stopped.
      if (pendingCollisionsRef.current > 0) {
        const pending = pendingCollisionsRef.current;
        pendingCollisionsRef.current = 0;
        setCollisionCount((prev) => prev + pending);
      }
    };
  }, [isPlaying, samplingInterval]);

  const incrementCollision = useCallback(() => {
    if (isPlayingRef.current) {
      pendingCollisionsRef.current += 1;
    }
  }, []);

  const startRecording = useCallback(() => {
    pendingCollisionsRef.current = 0;
    setIsPlaying(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resetRecording = useCallback(() => {
    pendingCollisionsRef.current = 0;
    setCollisionCount(0);
    setElapsedTime(0);
    setIsPlaying(false);
  }, []);

  const stateValue = useMemo(
    () => ({ collisionCount, elapsedTime, isPlaying }),
    [collisionCount, elapsedTime, isPlaying]
  );

  // All callbacks are referentially stable, so this object is created once and
  // never changes — consumers of actions-only never re-render.
  const actionsValue = useMemo(
    () => ({
      startRecording,
      stopRecording,
      resetRecording,
      incrementCollision,
    }),
    [startRecording, stopRecording, resetRecording, incrementCollision]
  );

  return (
    <WallCollisionActionsContext.Provider value={actionsValue}>
      <WallCollisionStateContext.Provider value={stateValue}>
        {children}
      </WallCollisionStateContext.Provider>
    </WallCollisionActionsContext.Provider>
  );
};

/** Actions only — referentially stable, so using this never triggers a
 *  re-render when collision counts change. Prefer this when you only need to
 *  report collisions or control recording. */
export const useWallCollisionActions = (): WallCollisionActions => {
  const context = useContext(WallCollisionActionsContext);
  if (context === undefined) {
    throw new Error(
      "useWallCollisionActions must be used within a WallCollisionProvider"
    );
  }
  return context;
};

/** Full state + actions. Re-renders the consumer whenever collision count,
 *  elapsed time, or playing state changes. */
export const useWallCollisions = (): WallCollisionContextType => {
  const state = useContext(WallCollisionStateContext);
  const actions = useContext(WallCollisionActionsContext);
  if (state === undefined || actions === undefined) {
    throw new Error(
      "useWallCollisions must be used within a WallCollisionProvider"
    );
  }
  return { ...state, ...actions };
};
