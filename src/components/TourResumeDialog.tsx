import { formatDistanceToNow } from "date-fns";
import { RotateCcw, Play } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface TourResumeDialogProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onCancel: () => void;
  stepIndex: number;
  totalSteps: number;
  timestamp: number;
}

export default function TourResumeDialog({
  isOpen,
  onResume,
  onRestart,
  onCancel,
  stepIndex,
  totalSteps,
  timestamp,
}: TourResumeDialogProps) {
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  const progress = Math.round((stepIndex / totalSteps) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎯 Continue Your Journey?
          </DialogTitle>
          <DialogDescription className="space-y-3 pt-2">
            <p>
              We found that you were in the middle of the walkthrough. You left
              off at{" "}
              <strong>
                step {stepIndex + 1} of {totalSteps}
              </strong>{" "}
              ({progress}% complete) {timeAgo}.
            </p>

            <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-800">
                  Progress
                </span>
                <span className="text-xs text-blue-600">{progress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              What would you like to do?
            </p>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 pt-2">
          <Button onClick={onResume} className="flex items-center gap-2">
            <Play className="h-4 w-4" />
            Continue from Step {stepIndex + 1}
          </Button>

          <Button
            variant="outline"
            onClick={onRestart}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over from Beginning
          </Button>

          <Button variant="ghost" onClick={onCancel} className="text-sm">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
