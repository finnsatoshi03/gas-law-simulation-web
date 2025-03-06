import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
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

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPlaying) {
      intervalId = setInterval(() => {
        setElapsedTime((prev) => prev + samplingInterval / 1000);
      }, samplingInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, samplingInterval]);

  const incrementCollision = useCallback(() => {
    if (isPlaying) {
      setCollisionCount((prev) => prev + 1);
    }
  }, [isPlaying]);

  const startRecording = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const stopRecording = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resetRecording = useCallback(() => {
    setCollisionCount(0);
    setElapsedTime(0);
    setIsPlaying(false);
  }, []);

  return (
    <WallCollisionContext.Provider
      value={{
        collisionCount,
        elapsedTime,
        isPlaying,
        startRecording,
        stopRecording,
        resetRecording,
        incrementCollision,
      }}
    >
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
