import { useEffect, useState } from "react";

interface BarometerNeedleProps {
  /** Pressure-driven base rotation of the needle (degrees). */
  angle: number;
  /** Molecule count — drives the wobble amplitude. */
  moleculeCount: number;
}

/**
 * The barometer needle, isolated into its own component.
 *
 * The needle "shakes" continuously to convey molecular agitation. Previously
 * that shake lived in the parent simulation's state, so a `setState` fired
 * ~20×/second and re-rendered the ENTIRE tool tree (including every Radix
 * tooltip), which made tooltips stutter/flicker during interactions. Keeping
 * the shake local means only this single <path> re-renders on each tick.
 */
export const BarometerNeedle = ({ angle, moleculeCount }: BarometerNeedleProps) => {
  const [shake, setShake] = useState(0);

  useEffect(() => {
    // No molecules → no agitation, and no need to re-render at all.
    if (moleculeCount <= 0) {
      setShake(0);
      return;
    }

    const maxShake = Math.min((moleculeCount / 500) * 10, 10);
    const shakeInterval = setInterval(() => {
      setShake(Math.sin(Date.now() * 0.1) * maxShake);
    }, 50);

    return () => clearInterval(shakeInterval);
  }, [moleculeCount]);

  return (
    <path
      id="Hand"
      className="cls-28"
      transform={`rotate(${angle + shake}, 451.09, 440.5)`}
      d="m437.39,468.06l21.4-36.4c.57-.95.2-2.24-.88-2.76l-2.25-1.09c-.99-.48-2.19-.07-2.67.92l-17.36,38.37c-.35,1.17,1.14,2,1.75.97Z"
    />
  );
};

export default BarometerNeedle;
