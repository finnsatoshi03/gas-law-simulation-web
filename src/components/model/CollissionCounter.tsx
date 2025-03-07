/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import {
  Play,
  Pause,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";

import { useWallCollisions } from "@/contexts/WallCollissionProvider";
import { useWalkthrough } from "@/contexts/WalkthroughProvider";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface CollissionCounterProps {
  className?: string;
}

export const CollissionCounter: React.FC<CollissionCounterProps> = ({
  className,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const { getUiState, setUiState } = useWalkthrough();
  const [isLocalMinimized, setIsLocalMinimized] = useState(true);
  const nodeRef = useRef(null);

  const {
    collisionCount,
    elapsedTime,
    isPlaying,
    startRecording,
    stopRecording,
    resetRecording,
  } = useWallCollisions();

  // Initial state sync from context
  useEffect(() => {
    const uiState = getUiState("collision-counter");
    const contextMinimizedState = uiState.isMinimized;

    if (
      contextMinimizedState !== undefined &&
      contextMinimizedState !== isLocalMinimized
    ) {
      setIsLocalMinimized(contextMinimizedState);
    }
  }, [getUiState]);

  const toggleMinimize = () => {
    const newMinimizedState = !isLocalMinimized;
    setIsLocalMinimized(newMinimizedState);

    // Only update context if it's different
    const currentContextState = getUiState("collision-counter").isMinimized;
    if (currentContextState !== newMinimizedState) {
      setUiState("collision-counter", { isMinimized: newMinimizedState });
    }
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      handle=".drag-handle"
      position={position}
      onDrag={(_e: any, data: { x: number; y: number }) => {
        setPosition({ x: data.x, y: data.y });
      }}
    >
      <div
        ref={nodeRef}
        className={cn(
          "absolute space-y-4 p-2 sm:p-4 bg-zinc-100 rounded-lg border border-sidebar-border shadow-md w-[250px] md:w-[320px] max-w-full collision-counter",
          className
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 sm:gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <GripVertical className="size-4 text-muted-foreground drag-handle cursor-grab active:cursor-grabbing" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Drag to move counter</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="link"
                  size="sm"
                  onClick={toggleMinimize}
                  className="flex h-fit w-fit p-0 items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  {isLocalMinimized ? (
                    <ChevronDown className="size-3 sm:size-4" />
                  ) : (
                    <ChevronUp className="size-3 sm:size-4" />
                  )}
                  {isLocalMinimized ? "Show Wall Collisions" : "Minimize"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isLocalMinimized
                    ? "Expand counter panel"
                    : "Collapse counter panel"}
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {!isLocalMinimized && (
          <>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm sm:text-base">
                  Wall Collisions
                </div>
                <div className="text-xl sm:text-2xl text-slate-600 font-semibold">
                  {elapsedTime.toFixed(1)}
                  <span className="text-xs sm:text-sm font-normal"> Time</span>
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold -mt-1">
                {collisionCount}
              </h1>
            </div>
            <div className="flex gap-2 mt-2">
              {!isPlaying ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={startRecording}
                      className="bg-green-500 text-white px-2 sm:px-3 py-1 sm:py-2"
                      size="sm"
                    >
                      <Play className="size-4 sm:size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Start recording collisions</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={stopRecording}
                      className="bg-red-500 text-white px-2 sm:px-3 py-1 sm:py-2"
                      size="sm"
                    >
                      <Pause className="size-4 sm:size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pause recording</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={resetRecording}
                    className="bg-blue-500 text-white text-xs sm:text-sm"
                    size="sm"
                  >
                    <RefreshCw className="mr-1 sm:mr-2 size-3 sm:size-4" />{" "}
                    Reset
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset collision count and timer</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};
