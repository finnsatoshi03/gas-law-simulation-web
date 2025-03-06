import { DocumentationSection } from "@/components/docs/DocsSection";
import { Separator } from "@/components/ui/separator";
import { NavigationFooter } from "@/components/docs/NavFooter";
import { QuickShortcutCards } from "@/components/docs/QuickShortcutCards";
import { Play, GripVertical, ChevronDown } from "lucide-react";
import { OnThisPage } from "@/components/docs/OnThisPage";

export default function Docs_WallDynamics() {
  const pageSections = [
    { id: "wall-dynamics-overview", title: "Wall Collision Dynamics" },
    { id: "collision-tracking", title: "Collision Tracking Mechanics" },
    { id: "collision-counter-interface", title: "Collision Counter Interface" },
    { id: "minimization-and-positioning", title: "Panel Interactions" },
    { id: "technical-implementation", title: "Technical Implementation" },
    {
      id: "molecular-interaction-insights",
      title: "Molecular Interaction Insights",
    },
    { id: "quick-shortcuts", title: "Quick Shortcuts" },
  ];

  return (
    <>
      <div className="space-y-12">
        <DocumentationSection
          id="wall-dynamics-overview"
          title="Wall Collision Dynamics"
          subtitle="Molecular Interactions and Energy Transfer"
          description="A comprehensive guide to understanding wall collisions, energy transfer, and tracking mechanisms in gas law simulations."
        />

        <Separator />

        <DocumentationSection
          id="collision-tracking"
          title="Collision Tracking Mechanics"
        >
          <div className="space-y-4 text-sm md:text-base">
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                <strong>Key Concept:</strong> Wall collisions are fundamental to
                understanding molecular motion and gas behavior.
              </p>
            </div>

            <h3 className="text-lg font-semibold">Core Tracking Parameters</h3>
            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Parameter</strong>
              <strong>Description</strong>
              <Separator className="col-span-2" />

              <p>Collision Count</p>
              <p>
                Total number of molecular wall interactions during simulation
              </p>
              <Separator className="col-span-2" />

              <p>Elapsed Time</p>
              <p>Duration of active wall collision tracking (in seconds)</p>
              <Separator className="col-span-2" />

              <p>Recording Status</p>
              <p>Indicates whether wall collision tracking is active</p>
            </div>

            <h3 className="text-lg font-semibold pt-4">Tracking Mechanics</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Real-time molecular wall interaction detection</li>
              <li>Precise tracking with 1-second sampling interval</li>
              <li>Synchronized with molecular simulation dynamics</li>
              <li>Minimal computational overhead</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="collision-counter-interface"
          title="Collision Counter Interface"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GripVertical className="size-5" />
              Interface Components
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Draggable panel for flexible positioning</li>
              <li>Large numerical display for collision count</li>
              <li>Elapsed time tracking with one-decimal precision</li>
              <li>Intuitive control buttons</li>
            </ul>

            <h3 className="text-lg font-semibold flex items-center gap-2 pt-4">
              <Play className="size-5" /> Control Buttons
            </h3>
            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Button</strong>
              <strong>Functionality</strong>
              <Separator className="col-span-2" />

              <p>Start Recording</p>
              <p>Begin tracking wall collisions and elapsed time</p>
              <Separator className="col-span-2" />

              <p>Pause Recording</p>
              <p>Temporarily halt collision and time tracking</p>
              <Separator className="col-span-2" />

              <p>Reset</p>
              <p>Clear collision count and elapsed time, stop recording</p>
            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-700">
                <strong>Pro Tip:</strong> Use the reset feature between
                different experimental configurations to ensure clean data.
              </p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="minimization-and-positioning"
          title="Panel Interactions"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GripVertical className="size-5" />
              Drag Feature
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Click and hold the grip handle to reposition the panel</li>
              <li>Repositioning does not affect simulation calculations</li>
              <li>Prevents accidental dragging during interactions</li>
            </ul>

            <h3 className="text-lg font-semibold flex items-center gap-2 pt-4">
              <ChevronDown className="size-5" />
              Minimize Feature
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Collapse panel to reduce screen clutter</li>
              <li>Toggle between full and minimized views</li>
              <li>Maintains all panel functionality when expanded</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="technical-implementation"
          title="Technical Implementation"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold">Context and Provider</h3>
            <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                <strong>Advanced Tracking:</strong> Implemented using React
                Context for efficient state management.
              </p>
            </div>

            <h4 className="text-md font-semibold">Key Tracking Methods</h4>
            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Method</strong>
              <strong>Description</strong>
              <Separator className="col-span-2" />

              <p className="font-mono bg-slate-200 px-2 py-0.5 inline-block w-fit rounded-md text-sm">
                startRecording()
              </p>
              <p>Activate collision and time tracking</p>
              <Separator className="col-span-2" />

              <p className="font-mono bg-slate-200 px-2 py-0.5 inline-block w-fit rounded-md text-sm">
                stopRecording()
              </p>
              <p>Pause tracking, maintain current state</p>
              <Separator className="col-span-2" />

              <p className="font-mono bg-slate-200 px-2 py-0.5 inline-block w-fit rounded-md text-sm">
                resetRecording()
              </p>
              <p>Clear all tracking data and reset state</p>
              <Separator className="col-span-2" />

              <p className="font-mono bg-slate-200 px-2 py-0.5 inline-block w-fit rounded-md text-sm">
                incrementCollision()
              </p>
              <p>Increment collision count during active recording</p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="molecular-interaction-insights"
          title="Molecular Interaction Insights"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold">
              Understanding Wall Collisions
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Direct measure of molecular kinetic energy</li>
              <li>Indicates pressure and temperature relationships</li>
              <li>Helps visualize gas law principles</li>
              <li>Critical for understanding molecular motion dynamics</li>
            </ul>

            <div className="bg-green-100 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-700">
                <strong>Research Potential:</strong> Wall collision data
                provides insights into molecular behavior under various
                conditions.
              </p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <section id="quick-shortcuts">
          <h2 className="text-2xl font-bold mb-6">Quick Shortcuts</h2>
          <QuickShortcutCards />
        </section>

        <NavigationFooter
          prev={{
            title: "Parameters and Units",
            url: "/docs/parameters-and-units",
          }}
          next={{ title: "Sample Problems", url: "/docs/sample-problems" }}
        />
      </div>
      <OnThisPage sections={pageSections} />
    </>
  );
}
