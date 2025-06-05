import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

interface AccessibilitySettings {
  isTextToSpeechEnabled: boolean;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  speechVoice: string | null;
  autoReadWalkthrough: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  availableVoices: SpeechSynthesisVoice[];
  toggleTextToSpeech: () => void;
  updateSpeechRate: (rate: number) => void;
  updateSpeechPitch: (pitch: number) => void;
  updateSpeechVolume: (volume: number) => void;
  updateSpeechVoice: (voice: string) => void;
  toggleAutoReadWalkthrough: () => void;
  speak: (text: string) => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  isPlaying: boolean;
  resetSettings: () => void;
}

// LocalStorage key
const STORAGE_KEY = "accessibility-settings";

// Default settings
const defaultSettings: AccessibilitySettings = {
  isTextToSpeechEnabled: true,
  speechRate: 1,
  speechPitch: 1,
  speechVolume: 1,
  speechVoice: null,
  autoReadWalkthrough: true,
};

// Helper functions for localStorage
const loadSettings = (): AccessibilitySettings => {
  try {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    if (savedSettings) {
      return { ...defaultSettings, ...JSON.parse(savedSettings) };
    }
  } catch (error) {
    console.error(
      "Error loading accessibility settings from localStorage:",
      error
    );
  }
  return defaultSettings;
};

const saveSettings = (settings: AccessibilitySettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error(
      "Error saving accessibility settings to localStorage:",
      error
    );
  }
};

// Create context
const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

// Provider component
export const AccessibilityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() =>
    loadSettings()
  );

  const [availableVoices, setAvailableVoices] = useState<
    SpeechSynthesisVoice[]
  >([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();

    // Some browsers load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const stop = useCallback(() => {
    speechSynthesis.cancel();
    setIsPlaying(false);
    currentUtteranceRef.current = null;
  }, []);

  const pause = useCallback(() => {
    speechSynthesis.pause();
  }, []);

  const resume = useCallback(() => {
    speechSynthesis.resume();
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (settings.isTextToSpeechEnabled && text.trim()) {
        // Clean up the text for better speech synthesis
        const cleanText = text
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/\s+/g, " ") // Normalize whitespace
          .trim();

        if (cleanText) {
          // Stop any current speech before starting new one
          stop();

          // Create new utterance
          const utterance = new SpeechSynthesisUtterance(cleanText);

          // Apply settings
          utterance.rate = settings.speechRate;
          utterance.pitch = settings.speechPitch;
          utterance.volume = settings.speechVolume;

          // Set voice if selected
          if (settings.speechVoice) {
            const selectedVoice = availableVoices.find(
              (voice) => voice.name === settings.speechVoice
            );
            if (selectedVoice) {
              utterance.voice = selectedVoice;
            }
          }

          // Set up event handlers
          utterance.onstart = () => {
            setIsPlaying(true);
          };

          utterance.onend = () => {
            setIsPlaying(false);
            currentUtteranceRef.current = null;
          };

          utterance.onerror = (event) => {
            console.error("Speech error:", event.error);
            setIsPlaying(false);
            currentUtteranceRef.current = null;
          };

          // Store reference and speak
          currentUtteranceRef.current = utterance;

          try {
            speechSynthesis.speak(utterance);
          } catch (error) {
            console.error("Error calling speechSynthesis.speak():", error);
            setIsPlaying(false);
            currentUtteranceRef.current = null;
          }
        }
      }
    },
    [settings, availableVoices, stop]
  );

  const toggleTextToSpeech = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      isTextToSpeechEnabled: !prev.isTextToSpeechEnabled,
    }));
  }, []);

  const updateSpeechRate = useCallback((rate: number) => {
    setSettings((prev) => ({
      ...prev,
      speechRate: rate,
    }));
  }, []);

  const updateSpeechPitch = useCallback((pitch: number) => {
    setSettings((prev) => ({
      ...prev,
      speechPitch: pitch,
    }));
  }, []);

  const updateSpeechVolume = useCallback((volume: number) => {
    setSettings((prev) => ({
      ...prev,
      speechVolume: volume,
    }));
  }, []);

  const updateSpeechVoice = useCallback((voice: string) => {
    setSettings((prev) => ({
      ...prev,
      speechVoice: voice,
    }));
  }, []);

  const toggleAutoReadWalkthrough = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      autoReadWalkthrough: !prev.autoReadWalkthrough,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        availableVoices,
        toggleTextToSpeech,
        updateSpeechRate,
        updateSpeechPitch,
        updateSpeechVolume,
        updateSpeechVoice,
        toggleAutoReadWalkthrough,
        speak,
        stop,
        pause,
        resume,
        isPlaying,
        resetSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom hook for using the accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};
