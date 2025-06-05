import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAccessibility } from "@/contexts/AccessibilityProvider";
import { AccessibilityControls } from "./AccessibilityControls";
import { Volume2, VolumeX, Accessibility } from "lucide-react";

interface AccessibilityButtonProps {
  className?: string;
}

export const AccessibilityButton: React.FC<AccessibilityButtonProps> = ({
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useAccessibility();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`fixed bottom-4 right-4 z-50 shadow-lg hover:shadow-xl transition-all duration-200 ${className}`}
          aria-label="Accessibility Settings"
        >
          <div className="flex items-center space-x-2">
            <Accessibility className="h-4 w-4" />
            {settings.isTextToSpeechEnabled ? (
              <Volume2 className="h-3 w-3 text-blue-600" />
            ) : (
              <VolumeX className="h-3 w-3 text-gray-400" />
            )}
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Accessibility className="h-5 w-5" />
            <span>Accessibility Settings</span>
          </DialogTitle>
        </DialogHeader>

        <AccessibilityControls />
      </DialogContent>
    </Dialog>
  );
};
