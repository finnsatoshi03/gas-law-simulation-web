/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useMemo, ReactNode } from "react";
import { useSetState } from "react-use";
import { Step } from "react-joyride";
import { useAccessibility } from "./AccessibilityProvider";

interface WalkthroughState {
  run: boolean;
  stepIndex: number;
  steps: Step[];
  tourActive: boolean;
  uiState: {
    [key: string]: {
      isOpen?: boolean;
      [key: string]: any;
    };
  };
}

const getStoredTourProgress = () => {
  try {
    const stored = localStorage.getItem("walkthrough-progress");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getRouteForStep = (stepIndex: number, steps: any[]) => {
  if (stepIndex === 0) return "/home";

  // Since step 0 goes to "/boyles", most steps after that are on boyles page
  // unless we find a different route navigation
  let currentRoute = "/boyles";

  // Look forward from step 0 to current step to find the latest route
  for (let i = 0; i <= stepIndex && i < steps.length; i++) {
    const step = steps[i];
    if (
      step?.data?.next &&
      typeof step.data.next === "string" &&
      step.data.next.startsWith("/")
    ) {
      currentRoute = step.data.next;
    }
  }

  return currentRoute;
};

const initialState: WalkthroughState = {
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
  uiState: {},
};

interface WalkthroughContextType {
  state: WalkthroughState;
  setState: (state: Partial<WalkthroughState>) => void;
  setUiState: (componentId: string, state: { [key: string]: any }) => void;
  getUiState: (componentId: string) => { [key: string]: any };
  speakStepContent: (step: Step) => void;
  stopSpeaking: () => void;
  saveTourProgress: (currentStepIndex?: number) => void;
  clearTourProgress: () => void;
  getStoredProgress: () => { stepIndex: number; timestamp: number } | null;
  startTour: (forceRestart?: boolean) => void;
  getRouteForStep: (stepIndex: number) => string;
}

const WalkthroughContext = createContext<WalkthroughContextType | undefined>(
  undefined
);
WalkthroughContext.displayName = "WalkthroughContext";

interface WalkthroughProviderProps {
  children: ReactNode;
}

export function WalkthroughProvider({ children }: WalkthroughProviderProps) {
  const [state, setState] = useSetState<WalkthroughState>(initialState);
  const { speak, stop, settings } = useAccessibility();

  const setUiState = (
    componentId: string,
    newState: { [key: string]: any }
  ) => {
    setState((prevState) => ({
      uiState: {
        ...prevState.uiState,
        [componentId]: {
          ...prevState.uiState[componentId],
          ...newState,
        },
      },
    }));
  };

  const getUiState = (componentId: string) => {
    return state.uiState[componentId] || {};
  };

  const speakStepContent = (step: Step) => {
    if (settings.autoReadWalkthrough && settings.isTextToSpeechEnabled) {
      let textToSpeak = "";

      if (typeof step.content === "string") {
        textToSpeak = step.content;
        if (textToSpeak.trim()) {
          speak(textToSpeak);
        }
      } else if (step.content && typeof step.content === "object") {
        // For React elements, we need to extract text from the rendered tooltip
        // Try multiple approaches with different delays to ensure we capture the content

        const attemptExtraction = (attempt = 1, maxAttempts = 5) => {
          const selectors = [
            '[data-test-id="tooltip"]',
            ".react-joyride__tooltip",
            '[role="tooltip"]',
            ".react-joyride__tooltip__body",
            ".react-joyride__tooltip__content",
          ];

          let joyrideTooltip = null;

          // Try each selector
          for (const selector of selectors) {
            joyrideTooltip = document.querySelector(selector);
            if (joyrideTooltip) {
              break;
            }
          }

          if (joyrideTooltip) {
            const textContent = joyrideTooltip.textContent || "";

            if (textContent.trim()) {
              // Clean up the text before speaking
              const cleanText = textContent
                .replace(/\s+/g, " ") // Normalize whitespace
                .replace(/Skip & Stop Speech/gi, "") // Remove skip button text
                .replace(/Skip.*?Speech/gi, "") // Remove variations of skip button
                .replace(/Back/gi, "") // Remove back button
                .replace(/Next/gi, "") // Remove next button
                .replace(/\(Step \d+ of \d+\)/gi, "") // Remove step indicators like "(Step 3 of 41)"
                .replace(/Step \d+ of \d+/gi, "") // Remove step counters
                .replace(/^\d+:\d+$/, "") // Remove time indicators like "1:25"
                .replace(/\s+/g, " ") // Normalize whitespace again after all replacements
                .trim();

              if (cleanText.length > 0) {
                speak(cleanText);
                return;
              }
            }
          }

          // If we didn't find content and haven't reached max attempts, try again
          if (attempt < maxAttempts) {
            setTimeout(
              () => attemptExtraction(attempt + 1, maxAttempts),
              150 * attempt
            );
          }
        };

        // Start attempting extraction with a small initial delay
        setTimeout(() => attemptExtraction(), 100);
        return;
      }
    }
  };

  const stopSpeaking = () => {
    stop();
  };

  const saveTourProgress = (currentStepIndex?: number) => {
    const stepToSave =
      currentStepIndex !== undefined ? currentStepIndex : state.stepIndex;
    if (state.tourActive && stepToSave > 0) {
      const progress = {
        stepIndex: stepToSave,
        timestamp: Date.now(),
      };
      localStorage.setItem("walkthrough-progress", JSON.stringify(progress));
    }
  };

  const clearTourProgress = () => {
    localStorage.removeItem("walkthrough-progress");
  };

  const getStoredProgress = () => {
    return getStoredTourProgress();
  };

  const getRouteForStepFunc = (stepIndex: number) => {
    return getRouteForStep(stepIndex, state.steps);
  };

  const startTour = (forceRestart = false) => {
    if (forceRestart) {
      clearTourProgress();
      setState({
        run: true,
        stepIndex: 0,
        tourActive: true,
      });
    } else {
      const storedProgress = getStoredTourProgress();
      if (storedProgress && storedProgress.stepIndex > 0) {
        // We'll handle the resume/restart dialog in the UI component
        setState({
          run: true,
          stepIndex: storedProgress.stepIndex,
          tourActive: true,
        });
      } else {
        setState({
          run: true,
          stepIndex: 0,
          tourActive: true,
        });
      }
    }
  };

  const value = useMemo(
    () => ({
      state,
      setState,
      setUiState,
      getUiState,
      speakStepContent,
      stopSpeaking,
      saveTourProgress,
      clearTourProgress,
      getStoredProgress,
      startTour,
      getRouteForStep: getRouteForStepFunc,
    }),
    [
      setState,
      state,
      speak,
      stop,
      settings.autoReadWalkthrough,
      settings.isTextToSpeechEnabled,
    ]
  );

  return (
    <WalkthroughContext.Provider value={value}>
      {children}
    </WalkthroughContext.Provider>
  );
}

export function useWalkthrough() {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error("useWalkthrough must be used within a WalkthroughProvider");
  }
  return context;
}
