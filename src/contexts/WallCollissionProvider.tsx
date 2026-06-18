import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

interface WallCollisionContextType {
  collisionCount: number;
  elapsedTime: number;
  isPlaying: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
  incrementCollision: () => void;
}

const WallCollisionContext = createContext<
  WallCollisionContextType | undefined
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

  const value = useMemo(
    () => ({
      collisionCount,
      elapsedTime,
      isPlaying,
      startRecording,
      stopRecording,
      resetRecording,
      incrementCollision,
    }),
    [
      collisionCount,
      elapsedTime,
      isPlaying,
      startRecording,
      stopRecording,
      resetRecording,
      incrementCollision,
    ]
  );

  return (
    <WallCollisionContext.Provider value={value}>
      {children}
    </WallCollisionContext.Provider>
  );
};

export const useWallCollisions = () => {
  const context = useContext(WallCollisionContext);
  if (context === undefined) {
    throw new Error(
      "useWallCollisions must be used within a WallCollisionProvider"
    );
  }
  return context;
};
