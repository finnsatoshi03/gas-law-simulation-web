import { cn } from "@/lib/utils";

type HintPointer = "top" | "bottom" | "left" | "right";

interface ToolHintProps {
  /** x position of the hint anchor in SVG user-space units */
  x: number;
  /** y position of the hint anchor in SVG user-space units */
  y: number;
  /** width of the anchor box used to center the bubble */
  width?: number;
  /** height of the anchor box used to center the bubble */
  height?: number;
  /** copy shown inside the bubble, e.g. "Pump me!" */
  label: string;
  /** whether the hint is currently shown (fades out when false) */
  visible: boolean;
  /** which edge the bubble's pointer sticks out from, toward the tool */
  pointer?: HintPointer;
  className?: string;
}

/**
 * A persistent, attention-grabbing "nudge" bubble that invites the user to
 * interact with a simulation tool (e.g. "Pump me!", "Slide me!"). Rendered as
 * an SVG <foreignObject> so it scales with the responsive simulation viewBox.
 *
 * It never captures pointer events, so the tool underneath stays fully
 * interactive and the bubble can be dismissed on first interaction.
 */
export const ToolHint = ({
  x,
  y,
  width = 120,
  height = 44,
  label,
  visible,
  pointer = "bottom",
  className,
}: ToolHintProps) => {
  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      style={{ overflow: "visible", pointerEvents: "none" }}
      aria-hidden="true"
    >
      <div
        className={cn(
          "flex h-full w-full items-center justify-center transition-all duration-300 ease-out",
          visible ? "opacity-100" : "opacity-0",
          className
        )}
        style={{ pointerEvents: "none" }}
      >
        <span className={cn("tool-hint-bubble", `tool-hint-bubble--${pointer}`)}>
          {label}
        </span>
      </div>
    </foreignObject>
  );
};

export default ToolHint;
