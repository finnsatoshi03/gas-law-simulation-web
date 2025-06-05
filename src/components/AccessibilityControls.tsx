import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAccessibility } from "@/contexts/AccessibilityProvider";
import { Volume2, VolumeX, Play, Pause, Square } from "lucide-react";

interface AccessibilityControlsProps {
  className?: string;
}

export const AccessibilityControls: React.FC<AccessibilityControlsProps> = ({
  className = "",
}) => {
  const {
    settings,
    availableVoices,
    toggleTextToSpeech,
    updateSpeechRate,
    updateSpeechPitch,
    updateSpeechVolume,
    updateSpeechVoice,
    toggleAutoReadWalkthrough,
    isPlaying,
    stop,
    pause,
    speak,
  } = useAccessibility();

  const handleTestSpeech = () => {
    const testText =
      "This is a test of the text to speech functionality. You can adjust the settings to customize your experience.";

    if (isPlaying) {
      stop();
    } else {
      // Try using our context's speak function first
      try {
        speak(testText);
      } catch (error) {
        console.error("Error with context speak function:", error);

        // Fallback to native speech synthesis if context fails
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(testText);
          utterance.rate = settings.speechRate;
          utterance.pitch = settings.speechPitch;
          utterance.volume = settings.speechVolume;

          if (settings.speechVoice) {
            const selectedVoice = availableVoices.find(
              (voice) => voice.name === settings.speechVoice
            );
            if (selectedVoice) {
              utterance.voice = selectedVoice;
            }
          }

          window.speechSynthesis.speak(utterance);
        } catch (fallbackError) {
          console.error(
            "Fallback speech synthesis also failed:",
            fallbackError
          );
        }
      }
    }
  };

  return (
    <div
      className={`space-y-6 p-4 bg-white rounded-lg border shadow-sm ${className}`}
    >
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          🎧 Accessibility Settings
        </h3>

        {/* Text-to-Speech Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {settings.isTextToSpeechEnabled ? (
              <Volume2 className="h-4 w-4 text-blue-600" />
            ) : (
              <VolumeX className="h-4 w-4 text-gray-400" />
            )}
            <Label htmlFor="tts-toggle" className="text-sm font-medium">
              Text-to-Speech
            </Label>
          </div>
          <Switch
            id="tts-toggle"
            checked={settings.isTextToSpeechEnabled}
            onCheckedChange={toggleTextToSpeech}
          />
        </div>

        {/* Auto-read Walkthrough Toggle */}
        <div className="flex items-center justify-between">
          <Label htmlFor="auto-read-toggle" className="text-sm font-medium">
            Auto-read Walkthrough Steps
          </Label>
          <Switch
            id="auto-read-toggle"
            checked={settings.autoReadWalkthrough}
            onCheckedChange={toggleAutoReadWalkthrough}
            disabled={!settings.isTextToSpeechEnabled}
          />
        </div>

        {/* Voice Selection */}
        {settings.isTextToSpeechEnabled && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Voice</Label>
              <Select
                value={settings.speechVoice || ""}
                onValueChange={updateSpeechVoice}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {availableVoices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Speech Rate */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Speech Rate: {settings.speechRate.toFixed(1)}x
              </Label>
              <Slider
                value={[settings.speechRate]}
                onValueChange={([value]) => updateSpeechRate(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Speech Pitch */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Speech Pitch: {settings.speechPitch.toFixed(1)}
              </Label>
              <Slider
                value={[settings.speechPitch]}
                onValueChange={([value]) => updateSpeechPitch(value)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Speech Volume */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Volume: {Math.round(settings.speechVolume * 100)}%
              </Label>
              <Slider
                value={[settings.speechVolume]}
                onValueChange={([value]) => updateSpeechVolume(value)}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>

            {/* Test Speech */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Test Speech</Label>
              <div className="flex space-x-2">
                <Button
                  onClick={handleTestSpeech}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Play className="h-3 w-3" />
                  <span>Test Voice</span>
                </Button>

                {isPlaying && (
                  <>
                    <Button
                      onClick={pause}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Pause className="h-3 w-3" />
                      <span>Pause</span>
                    </Button>

                    <Button
                      onClick={stop}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <Square className="h-3 w-3" />
                      <span>Stop</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
