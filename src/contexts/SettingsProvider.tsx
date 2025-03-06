/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

// Types
type MoleculeTemplate = ({ x, y }: { x: number; y: number }) => JSX.Element;

interface MoleculeType {
  type: string;
  template: MoleculeTemplate;
  radius: number;
  mass: number;
}

interface MoleculeRatio {
  type: "exact" | "scaled";
  scale: 1 | 0.1 | 0.01 | 0.001;
}

interface SimulationSettings {
  maxDisplayPressure: number;
  maxSimulationVolume: number;
  moleculeSize: number;
  moleculeTypes: MoleculeType[];
  moleculeRatio: MoleculeRatio;
}

interface SimulationSettingsContextType {
  settings: SimulationSettings;
  updateMaxPressure: (pressure: number) => void;
  updateMaxVolume: (volume: number) => void;
  updateMoleculeSize: (size: number) => void;
  updateMoleculeRatio: (ratio: MoleculeRatio) => void;
  resetSettings: () => void;
}

// LocalStorage key
const STORAGE_KEY = "simulation-settings";

// Default molecule types with dynamic sizing
const createMoleculeTypes = (sizeMultiplier = 1): MoleculeType[] => [
  {
    type: "oxygen",
    template: ({ x, y }) => (
      <g transform={`translate(${x}, ${y})`}>
        <circle r={10 * sizeMultiplier} fill="#f87171" />
        <circle
          r={7 * sizeMultiplier}
          fill="#fca5a5"
          cx={-14 * sizeMultiplier}
          cy={-9 * sizeMultiplier}
        />
        <circle
          r={7 * sizeMultiplier}
          fill="#fca5a5"
          cx={14 * sizeMultiplier}
          cy={-9 * sizeMultiplier}
        />
      </g>
    ),
    radius: 18 * sizeMultiplier,
    mass: 32,
  },
  {
    type: "carbonDioxide",
    template: ({ x, y }) => (
      <g transform={`translate(${x}, ${y})`}>
        <circle r={10 * sizeMultiplier} fill="#4ade80" />
        <circle
          r={8 * sizeMultiplier}
          fill="#86efac"
          cx={-16 * sizeMultiplier}
          cy={0}
        />
        <circle
          r={8 * sizeMultiplier}
          fill="#86efac"
          cx={16 * sizeMultiplier}
          cy={0}
        />
      </g>
    ),
    radius: 22 * sizeMultiplier,
    mass: 44,
  },
  {
    type: "nitrogen",
    template: ({ x, y }) => (
      <g transform={`translate(${x}, ${y})`}>
        <circle r={9 * sizeMultiplier} fill="#a78bfa" />
        <circle
          r={9 * sizeMultiplier}
          fill="#c4b5fd"
          cx={0}
          cy={-15 * sizeMultiplier}
        />
      </g>
    ),
    radius: 20 * sizeMultiplier,
    mass: 28,
  },
];

// Default settings
const defaultSettings: SimulationSettings = {
  maxDisplayPressure: 100,
  maxSimulationVolume: 50,
  moleculeSize: 1,
  moleculeTypes: createMoleculeTypes(1),
  moleculeRatio: {
    type: "exact",
    scale: 1,
  },
};

// Helper functions for localStorage
const loadSettings = (): SimulationSettings => {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      // Recreate molecule types with templates since they can't be serialized
      return {
        ...parsed,
        moleculeTypes: createMoleculeTypes(parsed.moleculeSize),
      };
    }
  } catch (error) {
    console.error("Error loading settings from localStorage:", error);
  }
  return defaultSettings;
};

const saveSettings = (settings: SimulationSettings) => {
  try {
    // Create a copy without the template functions for storage
    const settingsForStorage = {
      ...settings,
      moleculeTypes: settings.moleculeTypes.map(
        ({ template, ...rest }) => rest
      ),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsForStorage));
  } catch (error) {
    console.error("Error saving settings to localStorage:", error);
  }
};

// Create context
const SimulationSettingsContext = createContext<
  SimulationSettingsContextType | undefined
>(undefined);

// Provider component
export const SimulationSettingsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [settings, setSettings] = useState<SimulationSettings>(() =>
    loadSettings()
  );

  // Save settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const updateMaxPressure = useCallback((pressure: number) => {
    setSettings((prev) => ({
      ...prev,
      maxDisplayPressure: pressure,
    }));
  }, []);

  const updateMaxVolume = useCallback((volume: number) => {
    setSettings((prev) => ({
      ...prev,
      maxSimulationVolume: volume,
    }));
  }, []);

  const updateMoleculeSize = useCallback((size: number) => {
    setSettings((prev) => ({
      ...prev,
      moleculeSize: size,
      moleculeTypes: createMoleculeTypes(size),
    }));
  }, []);

  const updateMoleculeRatio = useCallback((ratio: MoleculeRatio) => {
    setSettings((prev) => ({
      ...prev,
      moleculeRatio: ratio,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return (
    <SimulationSettingsContext.Provider
      value={{
        settings,
        updateMaxPressure,
        updateMaxVolume,
        updateMoleculeSize,
        updateMoleculeRatio,
        resetSettings,
      }}
    >
      {children}
    </SimulationSettingsContext.Provider>
  );
};

// Custom hook for using the settings context
export const useSimulationSettings = () => {
  const context = useContext(SimulationSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useSimulationSettings must be used within a SimulationSettingsProvider"
    );
  }
  return context;
};
