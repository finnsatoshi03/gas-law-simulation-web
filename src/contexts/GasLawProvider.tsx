import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useCallback,
  useRef,
} from "react";
import { GasLawType } from "@/lib/types";
import { calculateGasLaw } from "@/components/model/calculators/GasLaws";

interface GasLawResult {
  target: string;
  value: string;
  moles?: string;
  originalUnit?: string;
}

interface CalculationHistoryEntry {
  id: string;
  lawType: GasLawType;
  values: Record<string, string>;
  units: Record<string, string>;
  result: GasLawResult | null;
  timestamp: number;
}

interface GasLawContextType {
  result: GasLawResult | null;
  history: CalculationHistoryEntry[];
  calculateResult: (
    lawType: GasLawType,
    values: Record<string, string>,
    units: Record<string, string>
  ) => void;
  clearResult: () => void;
  clearHistory: () => void;
  addToHistory: (entry: CalculationHistoryEntry) => void;
  isLoading: boolean;
  isSaving: boolean;
}

const GasLawContext = createContext<GasLawContextType>({
  result: null,
  history: [],
  calculateResult: () => {},
  clearResult: () => {},
  clearHistory: () => {},
  addToHistory: () => {},
  isLoading: false,
  isSaving: false,
});

export const GasLawProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [result, setResult] = useState<GasLawResult | null>(null);
  const [history, setHistory] = useState<CalculationHistoryEntry[]>(() => {
    // Initialize from localStorage
    const savedHistory = localStorage.getItem("gasLawCalculationHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Add loading and saving states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Ref to store timeout
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const addToHistory = useCallback(
    (entry: CalculationHistoryEntry) => {
      // Only add to history if there's a result
      if (!entry.result) return;

      const updatedHistory = [...history, entry];

      // Clear any existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set saving to true immediately
      setIsSaving(true);

      // Set a new timeout
      saveTimeoutRef.current = setTimeout(() => {
        try {
          // Limit history to last 50 entries
          const limitedHistory = updatedHistory.slice(-50);
          setHistory(limitedHistory);
          localStorage.setItem(
            "gasLawCalculationHistory",
            JSON.stringify(limitedHistory)
          );
        } catch (error) {
          console.error("Failed to save history:", error);
        } finally {
          // Set saving to false when the save operation completes
          setIsSaving(false);
        }
      }, 2000); // 2 seconds debounce

      // Ensure timeout is cleared if component unmounts
      return () => {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
          setIsSaving(false);
        }
      };
    },
    [history]
  );

  const calculateResult = useCallback(
    (
      lawType: GasLawType,
      values: Record<string, string>,
      units: Record<string, string>
    ) => {
      // Set loading to true before calculation
      setIsLoading(true);

      try {
        const calculationResult = calculateGasLaw(lawType, values, units);

        // Only set result and add to history if there's a calculation result
        if (calculationResult) {
          setResult(calculationResult);

          // Create a new history entry
          const newEntry: CalculationHistoryEntry = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            lawType,
            values,
            units,
            result: calculationResult,
            timestamp: Date.now(),
          };
          addToHistory(newEntry);
        }
      } catch (error) {
        console.error("Calculation error:", error);
      } finally {
        // Set loading to false after calculation and history addition
        setIsLoading(false);
      }
    },
    [addToHistory]
  );

  const clearResult = () => {
    setResult(null);
  };

  const clearHistory = useCallback(() => {
    setIsSaving(true);
    try {
      setHistory([]);
      localStorage.removeItem("gasLawCalculationHistory");
    } catch (error) {
      console.error("Failed to clear history:", error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  return (
    <GasLawContext.Provider
      value={{
        result,
        history,
        calculateResult,
        clearResult,
        clearHistory,
        addToHistory,
        isLoading,
        isSaving,
      }}
    >
      {children}
    </GasLawContext.Provider>
  );
};

export const useGasLaw = () => {
  const context = useContext(GasLawContext);
  if (!context) {
    throw new Error("useGasLaw must be used within a GasLawProvider");
  }
  return context;
};
