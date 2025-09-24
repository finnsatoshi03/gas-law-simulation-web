import React, { useState } from "react";
import { Clock, Loader } from "lucide-react";
import { format } from "date-fns";

import { useGasLaw } from "@/contexts/GasLawProvider";

import { GasLawType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  formatVariableName,
  formatVariableSymbol,
} from "./ui/variable-formatter";
import { useWalkthrough } from "@/contexts/WalkthroughProvider";

interface CalculationHistoryEntry {
  id: string;
  lawType: GasLawType;
  timestamp: number;
  values: Record<string, string>;
  result?: {
    target: string;
    value: string;
  } | null;
}

const formatLawType = (lawType: GasLawType) => {
  const lawTypeMap: Record<GasLawType, string> = {
    boyles: "Boyle's Law",
    charles: "Charles's Law",
    gayLussac: "Gay-Lussac's Law",
    avogadro: "Avogadro's Law",
    combined: "Combined Gas Law",
    ideal: "Ideal Gas Law",
  };
  return lawTypeMap[lawType] || lawType;
};

interface CalculationHistoryDrawerProps {
  lawType: GasLawType;
}

const CalculationHistoryDrawer: React.FC<CalculationHistoryDrawerProps> = ({
  lawType,
}) => {
  const { history, clearHistory, isSaving, isLoading } = useGasLaw();
  const { setUiState, state } = useWalkthrough();
  const isMobile = useIsMobile();

  const [localOpen, setLocalOpen] = useState(false);

  const isWalkthroughActive = state.tourActive;
  const isWalkthroughOpen =
    state.uiState["calculation-history"]?.isOpen || false;

  const isOpen = isWalkthroughActive ? isWalkthroughOpen : localOpen;

  const handleOpenChange = (open: boolean) => {
    if (isWalkthroughActive) {
      setUiState("calculation-history", { isOpen: open });
    } else {
      setLocalOpen(open);
    }
  };

  const filteredHistory = history.filter((entry) => entry.lawType === lawType);

  const renderHistoryEntry = (entry: CalculationHistoryEntry) => (
    <div
      key={entry.id}
      className="border rounded-lg p-3 bg-muted/50 space-y-2 relative flex flex-col"
    >
      <div className="absolute top-2 right-2 text-xs text-muted-foreground">
        {format(entry.timestamp, "MMM d, yyyy HH:mm:ss")}
      </div>
      <div className="text-sm space-y-2">
        <div>
          <strong className="text-muted-foreground">Input Values</strong>
          <div className="grid grid-cols-2 gap-1 w-full">
            {Object.entries(entry.values)
              .filter(([, value]) => value !== "")
              .map(([key, value]) => (
                <div key={key} className="flex items-center">
                  <span className="font-medium mr-1">
                    {formatVariableName(lawType, key)}:
                  </span>
                  <span>{value}</span>
                </div>
              ))}
          </div>
        </div>
        {entry.result && (
          <div>
            <strong className="text-muted-foreground">Calculated Result</strong>
            <div className="flex items-center">
              <span className="font-semibold text-primary mr-1">
                {formatVariableSymbol(entry.lawType, entry.result.target)}:
              </span>
              <span className="font-bold text-green-600">
                {entry.result.value}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Drawer
      direction={isMobile ? "bottom" : "left"}
      open={isOpen}
      onOpenChange={handleOpenChange}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button
              variant="link"
              size="sm"
              disabled={isLoading || isSaving}
              className="history-button p-0 h-fit w-fit hover:bg-none"
            >
              {isLoading || isSaving ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  <p>Storing..</p>
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4" /> <p>History</p>
                </>
              )}
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {isLoading
            ? "Calculating and storing results..."
            : isSaving
            ? "Saving calculation history..."
            : "View calculation history"}
        </TooltipContent>
      </Tooltip>
      <DrawerContent
        className={cn(
          "calculation-history-content",
          !isMobile ? "h-screen w-[30vw] left-0 right-auto ml-0 mr-0" : ""
        )}
        onInteractOutside={(event) =>
          isWalkthroughOpen ? event.preventDefault() : null
        }
      >
        <DrawerHeader>
          <DrawerTitle className="flex justify-between items-center">
            {formatLawType(lawType)} Calculation History
            {(filteredHistory.length > 0 || isWalkthroughActive) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  const updatedHistory = history.filter(
                    (entry) => entry.lawType !== lawType
                  );
                  localStorage.setItem(
                    "gasLawCalculationHistory",
                    JSON.stringify(updatedHistory)
                  );
                  clearHistory();
                }}
                className="clear-history-button"
                disabled={filteredHistory.length === 0 && isWalkthroughActive}
              >
                Clear History
              </Button>
            )}
          </DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2 overflow-y-auto">
          {filteredHistory.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No calculation history for {formatLawType(lawType)}
            </p>
          ) : (
            filteredHistory.slice().reverse().map(renderHistoryEntry)
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CalculationHistoryDrawer;
