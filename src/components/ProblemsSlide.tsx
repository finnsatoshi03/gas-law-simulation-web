import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  Puzzle,
  GripVertical,
  Plus,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";
import { useWalkthrough } from "@/contexts/WalkthroughProvider";

export interface Problem {
  id: string;
  type:
    | "boyles"
    | "charles"
    | "combined"
    | "ideal"
    | "gay-lussac"
    | "avogadros";
  title: string;
  question: string;
  hint?: string;
  solution?: string;
}

interface ProblemsSlideProps {
  type: Problem["type"];
  className?: string;
  isExpanded?: boolean;
  setIsExpanded?: (expanded: boolean) => void;
}

export default function ProblemsSlide({
  type,
  className,
  isExpanded: controlledIsExpanded,
  setIsExpanded: onToggleExpand,
}: ProblemsSlideProps) {
  const { state, setUiState } = useWalkthrough();

  const isWalkthroughActive = state.tourActive;
  const isWalkthroughOpen =
    state.uiState["problems-slide"]?.isExpanded || false;

  const [uncontrolledIsExpanded, setUncontrolledIsExpanded] = useState(false);

  const isExpanded = isWalkthroughActive
    ? isWalkthroughOpen
    : controlledIsExpanded ?? uncontrolledIsExpanded;

  const setIsExpanded = (newExpandedState: boolean) => {
    if (isWalkthroughActive) {
      setUiState("problems-slide", { isExpanded: newExpandedState });
    } else if (onToggleExpand) {
      onToggleExpand(newExpandedState);
    } else {
      setUncontrolledIsExpanded(newExpandedState);
    }
  };

  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    const storedProblems = localStorage.getItem("gas_laws_problems");
    if (storedProblems) {
      const allProblems = JSON.parse(storedProblems);
      const filteredProblems = allProblems.filter(
        (problem: Problem) => problem.type === type
      );
      setProblems(filteredProblems);
      setCurrentIndex(0);
      // Reset visibility states when changing problems
      setShowHint(false);
      setShowAnswer(false);
    }
  }, [type]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? problems.length - 1 : prev - 1));
    // Reset visibility states when changing problems
    setShowHint(false);
    setShowAnswer(false);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === problems.length - 1 ? 0 : prev + 1));
    // Reset visibility states when changing problems
    setShowHint(false);
    setShowAnswer(false);
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 2, 32));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 2, 12));
  };

  if (problems.length === 0) {
    return null;
  }

  const currentProblem: Problem = problems[currentIndex];

  const getGasLawTitle = (type: Problem["type"]) => {
    switch (type) {
      case "boyles":
        return "Boyle's Law";
      case "charles":
        return "Charles's Law";
      case "combined":
        return "Combined Gas Law";
      case "ideal":
        return "Ideal Gas Law";
      case "gay-lussac":
        return "Gay-Lussac's Law";
      case "avogadros":
        return "Avogadro's Law";
      default:
        return "Gas Law Problems";
    }
  };

  if (!isExpanded) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => setIsExpanded(true)}
            className="problems-slide-button"
          >
            <Puzzle />
            Practice {getGasLawTitle(type)}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          Click to practice {getGasLawTitle(type)} problems
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Draggable handle=".drag-handle">
      <Card
        className={cn(
          "problems-slide-expanded bg-sidebar border-sidebar-border shadow-md",
          className
        )}
      >
        <CardHeader className="drag-handle cursor-move">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <GripVertical className="size-4 text-muted-foreground drag-handle cursor-grab active:cursor-grabbing -ml-1" />
              <CardTitle className="text-lg font-semibold">
                {getGasLawTitle(type)}
              </CardTitle>
              <p className="text-sm text-gray-500">
                Problem {currentIndex + 1} of {problems.length}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex gap-2 problems-slide-font-controls">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={decreaseFontSize}
                  disabled={fontSize <= 12}
                  title="Decrease font size"
                  className="p-1 h-8 w-8"
                >
                  <Minus size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={increaseFontSize}
                  disabled={fontSize >= 32}
                  title="Increase font size"
                  className="p-1 h-8 w-8"
                >
                  <Plus size={16} />
                </Button>
              </div>
              <div className="flex gap-2 problems-slide-navigation">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className="p-1 h-8 w-8"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  className="p-1 h-8 w-8"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="p-1 h-8 w-8"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className={`space-y-4 max-w-md ${className || ""}`}>
          <div>
            <h3
              className="font-medium mb-1"
              style={{ fontSize: `${fontSize * 1.125}px` }}
            >
              {currentProblem.title}
            </h3>
            <p className="text-gray-600" style={{ fontSize: `${fontSize}px` }}>
              {currentProblem.question}
            </p>
          </div>
          <div className="problems-slide-hint-answer">
            {currentProblem.hint && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className="font-medium"
                    style={{ fontSize: `${fontSize * 0.875}px` }}
                  >
                    Hint
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowHint(!showHint)}
                    className="h-6 px-2"
                  >
                    {showHint ? (
                      <EyeOff className="h-4 w-4 mr-1" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    {showHint ? "Hide" : "Show"}
                  </Button>
                </div>
                {showHint && (
                  <p
                    className="text-gray-600"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {currentProblem.hint}
                  </p>
                )}
              </div>
            )}
            {currentProblem.solution && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4
                    className="font-medium"
                    style={{ fontSize: `${fontSize * 0.875}px` }}
                  >
                    Answer
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="h-6 px-2"
                  >
                    {showAnswer ? (
                      <EyeOff className="h-4 w-4 mr-1" />
                    ) : (
                      <Eye className="h-4 w-4 mr-1" />
                    )}
                    {showAnswer ? "Hide" : "Show"}
                  </Button>
                </div>
                {showAnswer && (
                  <p
                    className="text-gray-600"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {currentProblem.solution}
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Draggable>
  );
}
