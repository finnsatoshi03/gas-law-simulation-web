import React, { useEffect, useRef } from "react";
import Joyride, { CallBackProps, EVENTS, ACTIONS } from "react-joyride";
import { useNavigate, useLocation } from "react-router-dom";
import { useWalkthrough } from "@/contexts/WalkthroughProvider";
import { useAccessibility } from "@/contexts/AccessibilityProvider";
import { getTourSteps } from "@/lib/walkthrough-steps";

export default function WalkthroughWrapper({
  children,
}: {
  children?: React.ReactNode;
}) {
  const {
    setState,
    state: { run, stepIndex, steps, tourActive },
    setUiState,
    speakStepContent,
    stopSpeaking,
    saveTourProgress,
    clearTourProgress,
  } = useWalkthrough();
  const { settings: accessibilitySettings } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  // Track the last spoken step to prevent duplicates
  const lastSpokenStepRef = useRef<number>(-1);

  useEffect(() => {
    const tourSteps = getTourSteps();
    setState({ steps: tourSteps });
  }, [setState]);

  useEffect(() => {
    // Note: Route-based step finding removed as steps don't contain route data
    // The walkthrough will progress naturally through user actions
  }, [location.pathname, steps, tourActive, setState]);

  // Reset step tracking when the step index changes
  useEffect(() => {
    // Reset the tracking when we move to a different step
    lastSpokenStepRef.current = -1;
  }, [stepIndex]);

  // Monitor tour active state and ensure consistency
  useEffect(() => {
    if (!tourActive && run) {
      setState({ run: false });
    }
  }, [tourActive, run, setState]);

  const handleCallback = (data: CallBackProps) => {
    const {
      index,
      step: { data: stepData } = {},
      step,
      type,
      action,
      status,
    } = data;

    // Debug logging for walkthrough issues (can be removed in production)
    console.log("Joyride callback:", {
      type,
      action,
      status,
      index,
      target: step?.target,
      stepData,
    });

    // Handle immediate close action first
    if (action === ACTIONS.CLOSE) {
      console.log("Close action detected - saving progress for resume");
      stopSpeaking();
      saveTourProgress(index); // Save progress so user can resume later
      lastSpokenStepRef.current = -1;
      setState({
        run: false,
        stepIndex: 0,
        tourActive: false,
      });
      return;
    }

    // Handle skip action
    if (action === ACTIONS.SKIP) {
      console.log("Skip action detected - saving progress for resume");
      stopSpeaking();
      saveTourProgress(index); // Save progress so user can resume later
      lastSpokenStepRef.current = -1;
      setState({
        run: false,
        stepIndex: 0,
        tourActive: false,
      });
      return;
    }

    const isUnitSelectorStep =
      stepData?.current === ".input-unit-pressure-1-selector" ||
      stepData?.current === ".input-unit-pressure-1-selector-content";

    if (type === EVENTS.STEP_AFTER) {
      // Remove the speech call from here to avoid duplication

      if (isUnitSelectorStep) {
        const selectTrigger = document.querySelector(
          '.input-unit-pressure-1-selector [role="combobox"]'
        ) as HTMLElement;
        if (selectTrigger) {
          selectTrigger.click();
        }

        setUiState("collision-counter", { isMinimized: false });
      }

      if (
        stepData?.current === ".history-button" ||
        stepData?.openHistoryDrawer
      ) {
        setUiState("calculation-history", {
          isOpen: true,
        });

        setTimeout(() => {
          setUiState("calculation-history", {
            isOpen: true,
            showContent: true,
          });
        }, 500);
      }

      if (stepData?.current === ".info-sheet-button") {
        setUiState("collision-counter", { isMinimized: true });

        setUiState("info-sheet", {
          isOpen: true,
        });

        setTimeout(() => {
          setUiState("info-sheet", {
            isOpen: true,
            showContent: true,
          });
        }, 500);
      }

      if (stepData?.current === ".info-sheet-pagination") {
        setUiState("info-sheet", {
          isOpen: false,
        });
      }

      if (stepData?.current === ".problems-slide-button") {
        setUiState("problems-slide", {
          isExpanded: true,
        });
      }

      if (stepData?.current === ".boyles-simulation") {
        setUiState("problems-slide", {
          isExpanded: false,
        });
      }

      if (action === "prev" && stepData?.previous) {
        // Stop current speech when navigating
        stopSpeaking();

        // Handle previous navigation
        if (
          typeof stepData.previous === "string" &&
          stepData.previous.startsWith("/")
        ) {
          navigate(stepData.previous);
        }
        setState({
          run: true,
          stepIndex: index - 1,
        });
      } else if (action === "next" && stepData?.next) {
        // Stop current speech when navigating
        stopSpeaking();

        // Handle special case for closing history drawer
        if (stepData?.closeHistoryOnNext) {
          setUiState("calculation-history", {
            isOpen: false,
            showContent: false,
          });
          setUiState("collision-counter", { isMinimized: false });

          // Wait for UI to update before proceeding
          setTimeout(() => {
            if (index < steps.length - 1) {
              setState({
                run: true,
                stepIndex: index + 1,
              });
            } else {
              // Tour completed
              setState({
                run: false,
                stepIndex: 0,
                tourActive: false,
              });
            }
          }, 400);
          return; // Exit early to prevent immediate navigation
        }

        // Handle next navigation
        if (
          typeof stepData.next === "string" &&
          stepData.next.startsWith("/")
        ) {
          navigate(stepData.next);
        }

        if (index < steps.length - 1) {
          const nextIndex = index + 1;
          setState({
            run: true,
            stepIndex: nextIndex,
          });
          // Save progress with the next step index
          saveTourProgress(nextIndex);
        } else {
          // Tour completed - this is the last step, user finished naturally
          console.log("Tour completed naturally - clearing progress");
          stopSpeaking();
          clearTourProgress(); // Clear progress since tour is complete
          lastSpokenStepRef.current = -1;
          setState({
            run: false,
            stepIndex: 0,
            tourActive: false,
          });
        }
      }
    } else if (type === EVENTS.TOOLTIP) {
      if (accessibilitySettings.autoReadWalkthrough && step) {
        // Always allow speech for different step indices
        if (lastSpokenStepRef.current !== index) {
          stopSpeaking();

          lastSpokenStepRef.current = index;

          setTimeout(() => {
            speakStepContent(step);
          }, 200);
        }
      }
    } else if (type === "error:target_not_found") {
      // Handle target not found errors
      console.warn("Target not found:", step?.target, "at index:", index);

      // If it's the clear-history-button, try to proceed anyway after a delay
      if (step?.target === ".clear-history-button") {
        console.log(
          "Attempting to recover from missing clear-history-button..."
        );

        // Ensure the calculation history is open so the button can render
        setUiState("calculation-history", {
          isOpen: true,
          showContent: true,
        });

        // Wait a bit and try to continue
        setTimeout(() => {
          setState({
            run: true,
            stepIndex: index,
          });
        }, 500);
      }

      // If it's the problems-slide-button, try to proceed anyway after a delay
      if (step?.target === ".problems-slide-button") {
        console.log(
          "Attempting to recover from missing problems-slide-button..."
        );

        // Force a re-render by updating the UI state
        setUiState("problems-slide", { isExpanded: false });

        // Wait a bit and try to continue
        setTimeout(() => {
          setState({
            run: true,
            stepIndex: index,
          });
        }, 500);
      }
    }
  };

  return (
    <>
      <Joyride
        key={`joyride-${tourActive ? "active" : "inactive"}-${stepIndex}`}
        callback={handleCallback}
        continuous
        run={run && tourActive && steps.length > 0}
        stepIndex={stepIndex}
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: "#3182ce",
            textColor: "#2d3748",
          },
        }}
        showProgress
        showSkipButton
        disableScrolling
        disableCloseOnEsc={false}
        hideCloseButton={false}
        locale={{
          skip: accessibilitySettings.isTextToSpeechEnabled
            ? "Skip & Stop Speech"
            : "Skip",
          last: "Finish",
          next: "Next",
          back: "Back",
          close: "Close",
        }}
      />
      {children}
    </>
  );
}
