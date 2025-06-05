import React, { useEffect, useRef } from "react";
import Joyride, { CallBackProps, EVENTS } from "react-joyride";
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
    // Find the current step based on the current route
    if (tourActive && steps.length > 0) {
      const currentStepIndex = steps.findIndex(
        (step) => step.data?.route === location.pathname
      );

      if (currentStepIndex !== -1) {
        setState({
          run: true,
          stepIndex: currentStepIndex,
        });
      }
    }
  }, [location.pathname, steps, tourActive, setState]);

  // Reset step tracking when the step index changes
  useEffect(() => {
    // Reset the tracking when we move to a different step
    lastSpokenStepRef.current = -1;
  }, [stepIndex]);

  const handleCallback = (data: CallBackProps) => {
    const { index, step: { data: stepData } = {}, step, type, action } = data;

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
      } else if (stepData?.current === ".clear-history-button") {
        setUiState("calculation-history", {
          isOpen: false,
        });
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
      } else if (stepData?.next) {
        // Stop current speech when navigating
        stopSpeaking();

        // Handle next navigation
        if (
          typeof stepData.next === "string" &&
          stepData.next.startsWith("/")
        ) {
          navigate(stepData.next);
        }
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
    } else if (type === EVENTS.TOUR_END || action === "skip") {
      // Stop speech when tour ends or is skipped
      stopSpeaking();
      // Reset step tracking
      lastSpokenStepRef.current = -1;
      setState({
        run: false,
        stepIndex: 0,
        tourActive: false,
      });
    }
  };

  return (
    <>
      <Joyride
        callback={handleCallback}
        continuous
        run={run}
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
        locale={{
          skip: accessibilitySettings.isTextToSpeechEnabled
            ? "Skip & Stop Speech"
            : "Skip",
          last: "Finish",
          next: "Next",
          back: "Back",
        }}
      />
      {children}
    </>
  );
}
