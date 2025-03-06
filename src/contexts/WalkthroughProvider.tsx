/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useMemo, ReactNode } from "react";
import { useSetState } from "react-use";
import { Step } from "react-joyride";

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

  const value = useMemo(
    () => ({
      state,
      setState,
      setUiState,
      getUiState,
    }),
    [setState, state]
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
