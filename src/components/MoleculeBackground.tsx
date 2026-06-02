import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Reusable animated background that mirrors the playful molecules from the Home
 * / landing screen, layered over the app's deep-space auth gradient. Drop it in
 * as an absolutely-positioned layer behind page content:
 *
 *   <div className="relative ...">
 *     <MoleculeBackground className="absolute inset-0" />
 *     <content with relative z-10 />
 *   </div>
 */

type MoleculeKind = "oxygen" | "carbonDioxide" | "nitrogen";

const MOLECULE_SHAPES: Record<MoleculeKind, JSX.Element> = {
  oxygen: (
    <>
      <circle r={10} fill="#f87171" />
      <circle r={7} fill="#fca5a5" cx={-14} cy={-9} />
      <circle r={7} fill="#fca5a5" cx={14} cy={-9} />
    </>
  ),
  carbonDioxide: (
    <>
      <circle r={10} fill="#4ade80" />
      <circle r={8} fill="#86efac" cx={-16} cy={0} />
      <circle r={8} fill="#86efac" cx={16} cy={0} />
    </>
  ),
  nitrogen: (
    <>
      <circle r={9} fill="#a78bfa" />
      <circle r={9} fill="#c4b5fd" cx={0} cy={-15} />
    </>
  ),
};

const MOLECULE_RADII: Record<MoleculeKind, number> = {
  oxygen: 18,
  carbonDioxide: 22,
  nitrogen: 20,
};

const KINDS: MoleculeKind[] = ["oxygen", "carbonDioxide", "nitrogen"];

// Deep-space gradient shared by every auth screen (from the design reference).
const AUTH_GRADIENT =
  "radial-gradient(120% 80% at 50% -8%, #3b3a86 0%, rgba(59,58,134,0) 55%)," +
  "radial-gradient(90% 70% at 78% 28%, rgba(126,78,170,0.55) 0%, rgba(126,78,170,0) 50%)," +
  "radial-gradient(100% 90% at 18% 12%, rgba(46,71,156,0.5) 0%, rgba(46,71,156,0) 48%)," +
  "linear-gradient(180deg, #241f54 0%, #1b1640 38%, #100c2a 70%, #08060f 100%)";

interface RenderedMolecule {
  id: number;
  kind: MoleculeKind;
  scale: number;
}

interface MoleculeMotion {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
}

interface MoleculeBackgroundProps {
  className?: string;
  /** Scales the molecule count relative to the area. Default 1. */
  density?: number;
}

export const MoleculeBackground = ({
  className,
  density = 1,
}: MoleculeBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupsRef = useRef<(SVGGElement | null)[]>([]);
  const motionRef = useRef<MoleculeMotion[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });
  const frameRef = useRef<number | null>(null);
  const [molecules, setMolecules] = useState<RenderedMolecule[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let seed = 1;
    // Deterministic pseudo-random so molecules don't reshuffle every frame.
    const random = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    const build = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      sizeRef.current = { w, h };

      if (w === 0 || h === 0) {
        return;
      }

      const count = Math.max(
        8,
        Math.min(26, Math.round(((w * h) / 120000) * density))
      );

      const rendered: RenderedMolecule[] = [];
      const motion: MoleculeMotion[] = [];

      for (let i = 0; i < count; i += 1) {
        const kind = KINDS[i % KINDS.length];
        const scale = 0.65 + random() * 0.7;
        const r = MOLECULE_RADII[kind] * scale;

        rendered.push({ id: i, kind, scale });
        motion.push({
          x: r + random() * Math.max(1, w - 2 * r),
          y: r + random() * Math.max(1, h - 2 * r),
          vx: (random() - 0.5) * 0.55,
          vy: (random() - 0.5) * 0.55,
          r,
        });
      }

      motionRef.current = motion;
      groupsRef.current = new Array(count).fill(null);
      setMolecules(rendered);
    };

    build();

    const step = () => {
      const { w, h } = sizeRef.current;
      const motion = motionRef.current;

      for (let i = 0; i < motion.length; i += 1) {
        const m = motion[i];
        m.x += m.vx;
        m.y += m.vy;

        if (m.x < m.r) {
          m.x = m.r;
          m.vx *= -1;
        } else if (m.x > w - m.r) {
          m.x = w - m.r;
          m.vx *= -1;
        }

        if (m.y < m.r) {
          m.y = m.r;
          m.vy *= -1;
        } else if (m.y > h - m.r) {
          m.y = h - m.r;
          m.vy *= -1;
        }

        const group = groupsRef.current[i];
        if (group) {
          group.setAttribute(
            "transform",
            `translate(${m.x.toFixed(2)} ${m.y.toFixed(2)}) scale(${(
              m.r / MOLECULE_RADII[KINDS[i % KINDS.length]]
            ).toFixed(3)})`
          );
        }
      }

      frameRef.current = requestAnimationFrame(step);
    };

    if (!prefersReducedMotion) {
      frameRef.current = requestAnimationFrame(step);
    }

    const resizeObserver = new ResizeObserver(() => build());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [density]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={cn("overflow-hidden", className)}
      style={{ background: AUTH_GRADIENT }}
    >
      <svg className="size-full opacity-60" preserveAspectRatio="xMidYMid slice">
        {molecules.map((molecule, index) => (
          <g
            key={molecule.id}
            ref={(node) => {
              groupsRef.current[index] = node;
            }}
          >
            {MOLECULE_SHAPES[molecule.kind]}
          </g>
        ))}
      </svg>

      {/* Vignette to deepen the edges, matching the reference. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 50% 38%, transparent 52%, rgba(4,3,12,0.55) 100%)",
        }}
      />
    </div>
  );
};
