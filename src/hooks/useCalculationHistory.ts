import { useState, useCallback } from "react";
import { debounce } from "lodash";

interface CalculationHistoryEntry {
  id: string;
  lawType: string;
  values: Record<string, string>;
  units: Record<string, string>;
  result?: { target?: string; value?: string };
  timestamp: number;
}

const useCalculationHistory = () => {
  const [history, setHistory] = useState<CalculationHistoryEntry[]>(() => {
    // Initialize from localStorage
    const savedHistory = localStorage.getItem("gasLawCalculationHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Debounced function to save history to localStorage
  const saveHistoryToLocalStorage = useCallback(
    debounce((updatedHistory: CalculationHistoryEntry[]) => {
      // Limit history to last 50 entries
      const limitedHistory = updatedHistory.slice(-50);
      localStorage.setItem(
        "gasLawCalculationHistory",
        JSON.stringify(limitedHistory)
      );
    }, 5000),
    []
  );

  const addCalculationToHistory = useCallback(
    (
      lawType: string,
      values: Record<string, string>,
      units: Record<string, string>,
      result?: { target?: string; value?: string }
    ) => {
      const newEntry: CalculationHistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        lawType,
        values,
        units,
        result,
        timestamp: Date.now(),
      };

      const updatedHistory = [...history, newEntry];
      setHistory(updatedHistory);
      saveHistoryToLocalStorage(updatedHistory);
    },
    [history, saveHistoryToLocalStorage]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem("gasLawCalculationHistory");
  }, []);

  return {
    history,
    addCalculationToHistory,
    clearHistory,
  };
};

export default useCalculationHistory;
