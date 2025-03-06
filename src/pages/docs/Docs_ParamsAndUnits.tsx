import { DocumentationSection } from "@/components/docs/DocsSection";
import { Separator } from "@/components/ui/separator";
import { NavigationFooter } from "@/components/docs/NavFooter";
import { QuickShortcutCards } from "@/components/docs/QuickShortcutCards";
import AutoPlayVideo from "@/components/AutoPlayVideo";
import { ChevronDown, Clock, GripVertical, RefreshCw } from "lucide-react";
import { OnThisPage } from "@/components/docs/OnThisPage";

export default function Docs_ParamsAndUnits() {
  const pageSections = [
    { id: "parameters-overview", title: "Parameters and Units" },
    { id: "real-time-unit-conversion", title: "Real-Time Unit Conversion" },
    { id: "calculation-dynamics", title: "Calculation Dynamics" },
    { id: "universal-gas-constant", title: "Universal Gas Constant" },
    { id: "parameters-panel-controls", title: "Parameter Panel Interactions" },
    { id: "calculation-history", title: "Calculation History" },
    { id: "quick-shortcuts", title: "Quick Shortcuts" },
  ];

  return (
    <>
      <div className="space-y-12">
        <DocumentationSection
          id="parameters-overview"
          title="Parameters and Units"
          subtitle="Mastering Gas Law Calculations"
          description="A comprehensive guide to understanding parameters, unit conversions, and calculation dynamics in the Gas Law Simulation."
        />

        <Separator />

        <DocumentationSection
          id="real-time-unit-conversion"
          title="Real-Time Unit Conversion"
        >
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Gas Law Simulation provides seamless, real-time unit
              conversions across four key measurement types:
            </p>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-700">
                <strong>Pro Tip:</strong> Unit conversions are instantaneous and
                maintain the precise physical meaning of your measurements.
              </p>
            </div>

            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Measurement Type</strong>
              <strong>Available Units</strong>
              <Separator className="col-span-2" />

              <p>Pressure</p>
              <p>
                Atmospheres (atm), Millimeters of Mercury (mmHg), Torr, Pascals
                (Pa), Bar, Kilopascals (kPa)
              </p>
              <Separator className="col-span-2" />

              <p>Volume</p>
              <p>
                Liters (L), Milliliters (mL), Cubic Meters (m³), Cubic
                Centimeters (cm³), Cubic Feet (ft³)
              </p>
              <Separator className="col-span-2" />

              <p>Temperature</p>
              <p>Kelvin (K), Celsius (°C), Fahrenheit (°F)</p>
              <Separator className="col-span-2" />

              <p>Moles</p>
              <p>
                Moles (mol), Millimoles (mmol), Micromoles (µmol), Nanomoles
                (nmol), Kilomoles (kmol)
              </p>
            </div>

            <h3 className="text-lg font-semibold pt-4">
              Conversion Mechanics:
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Instantaneous conversion when changing units</li>
              <li>Preserves the relative value across different unit scales</li>
              <li>
                Supports conversion for temperature, accounting for different
                zero points
              </li>
              <li>Synchronized unit changes for related variables</li>
            </ul>

            <h3 className="text-lg font-semibold pt-4">Example Conversion:</h3>
            <p>
              When changing pressure from atmospheres (atm) to millimeters of
              mercury (mmHg), the value automatically adjusts while maintaining
              the same physical meaning.
            </p>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="calculation-dynamics"
          title="Calculation Dynamics"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold">
              Automatic Calculation Rules
            </h3>

            <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                <strong>Scenario 1: One Variable Missing</strong> When all
                fields are filled except one, the simulation automatically
                calculates the missing variable based on the specific gas law
                being used.
              </p>
            </div>

            <div className="bg-green-100 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-700">
                <strong>Scenario 2: Multiple Variables Missing</strong> If more
                than one variable is missing, the calculation will wait until
                sufficient information is provided to solve the equation
                uniquely.
              </p>
            </div>
            <AutoPlayVideo
              src="input-dynamics-demo.mp4"
              poster="video-placeholder.png"
            />

            <h3 className="text-lg font-semibold pt-4">Supported Gas Laws</h3>
            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Gas Law</strong>
              <strong>Key Variables</strong>
              <Separator className="col-span-2" />

              <p>Boyle's Law</p>
              <p>
                Pressure (P1, P2), Volume (V1, V2), Temperature (T), Moles (n)
              </p>
              <Separator className="col-span-2" />

              <p>Charles's Law</p>
              <p>
                Volume (V1, V2), Temperature (T1, T2), Pressure (P), Moles (n)
              </p>
              <Separator className="col-span-2" />

              <p>Gay-Lussac's Law</p>
              <p>
                Pressure (P1, P2), Temperature (T1, T2), Volume (V), Moles (n)
              </p>
              <Separator className="col-span-2" />

              <p>Avogadro's Law</p>
              <p>
                Volume (V1, V2), Moles (n1, n2), Pressure (V), Temperature (n)
              </p>
              <Separator className="col-span-2" />

              <p>Combined Gas Law</p>
              <p>
                Pressure (P1, P2), Volume (V1, V2), Temperature (T1, T2), Moles
                (n)
              </p>
              <Separator className="col-span-2" />

              <p>Ideal Gas Law</p>
              <p>Pressure (P), Volume (V), Moles (n), Temperature (T)</p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="universal-gas-constant"
          title="Universal Gas Constant"
        >
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Universal Gas Constant (R) is a fundamental constant used in
              the Ideal Gas Law, varying slightly based on the pressure units
              used in the calculation.
            </p>

            <h3 className="text-lg font-semibold">Constant Variations</h3>
            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Pressure Unit</strong>
              <strong>Gas Constant Value</strong>
              <Separator className="col-span-2" />

              <p>Atmospheres (atm)</p>
              <p>0.08206 L⋅atm/(mol⋅K)</p>
              <Separator className="col-span-2" />

              <p>Pascals (Pa)</p>
              <p>8.314 J/(mol⋅K)</p>
              <Separator className="col-span-2" />

              <p>Bar</p>
              <p>0.08314 L⋅bar/(mol⋅K)</p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="parameters-panel-controls"
          title="Parameter Panel Interactions"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GripVertical className="size-5" />
              Drag Feature
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Click and hold the grip handle (vertical dots) to move the
                parameter panel
              </li>
              <li>Repositioning does not affect calculations</li>
              <li>Prevents dragging when interacting with inputs or buttons</li>
            </ul>

            <h3 className="text-lg font-semibold flex items-center gap-2 pt-4">
              <ChevronDown className="size-5" />
              Minimize Feature
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Collapse the parameter panel to reduce screen clutter</li>
              <li>Toggle between full view and minimized state</li>
              <li>Maintains all panel functionality when expanded</li>
            </ul>

            <h3 className="text-lg font-semibold flex items-center gap-2 pt-4">
              <RefreshCw className="size-5" />
              Reset Feature
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Quickly reset all editable fields to default values</li>
              <li>Clears calculation history</li>
              <li>Boyle's Law defaults temperature to 275K</li>
              <li>Other laws reset to empty fields</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="calculation-history"
          title="Calculation History"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="size-5" /> Tracking Your Calculations
            </h3>

            <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                <strong>Learn and Track</strong> Keep a comprehensive record of
                your gas law calculations across different law types.
              </p>
            </div>

            <h4 className="text-md font-semibold pt-4">Key Features</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Automatically saves each successful calculation</li>
              <li>Maintains a separate history for each gas law type</li>
              <li>Stores up to 50 most recent calculations</li>
              <li>Persists across browser sessions</li>
            </ul>

            <h4 className="text-md font-semibold pt-4">Saving Mechanism</h4>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-700">
                <strong>Performance Optimization:</strong> Real-time
                calculations with intelligent saving to prevent performance
                interruptions.
              </p>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Calculations happen instantly as you input values</li>
              <li>2-second debounce prevents multiple rapid save operations</li>
              <li>Ensures smooth user experience without storage delays</li>
              <li>Prevents unnecessary writes to local storage</li>
            </ul>

            <h4 className="text-md font-semibold pt-4">
              History Entry Details
            </h4>
            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Information</strong>
              <strong>Description</strong>
              <Separator className="col-span-2" />
              <p>Timestamp</p>
              <p>Exact date and time of the calculation</p>
              <Separator className="col-span-2" />
              <p>Input Values</p>
              <p>All parameters used in the calculation</p>
              <Separator className="col-span-2" />
              <p>Calculated Result</p>
              <p>The solved variable and its value</p>
            </div>

            <h4 className="text-md font-semibold pt-4">
              Accessing Calculation History
            </h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Click the <Clock className="inline-block size-4" /> History
                button in the calculation panel
              </li>
              <li>View opens a side drawer (mobile) or left panel (desktop)</li>
              <li>Scroll through past calculations</li>
              <li>Option to clear history for specific gas law types</li>
            </ul>

            <div className="bg-green-100 border-l-4 border-green-500 p-4 mt-4">
              <p className="text-sm text-green-700">
                <strong>Pro Tip:</strong> Use the Calculation History to track
                your learning progress, review previous calculations, and
                understand your problem-solving patterns.
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
          prev={{ title: "Simulation Basics", url: "/docs/simulation-basics#" }}
          next={{
            title: "Wall Collision Dynamics",
            url: "/docs/wall-collision-dynamics#",
          }}
        />
      </div>
      <OnThisPage sections={pageSections} />
    </>
  );
}
