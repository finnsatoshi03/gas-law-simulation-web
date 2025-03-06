import AutoPlayVideo from "@/components/AutoPlayVideo";
import { DocumentationSection } from "@/components/docs/DocsSection";
import { NavigationFooter } from "@/components/docs/NavFooter";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { QuickShortcutCards } from "@/components/docs/QuickShortcutCards";
import { Separator } from "@/components/ui/separator";

export default function Docs_SimulationBasics() {
  const pageSections = [
    { id: "simulation", title: "Simulation Basics" },
    { id: "gas-law-simulation", title: "Gas Law Simulation" },
    { id: "gas-tanks", title: "Gas Selection Tanks" },
    { id: "air-pump", title: "Air Pump" },
    { id: "barometer", title: "Barometer Visualization" },
    { id: "sliders", title: "Interactive Sliders" },
    { id: "cylinder-motion", title: "Cylinder & Molecular Motion" },
    { id: "thermometer", title: "Thermometer Visualization" },
    { id: "quick-shortcuts", title: "Quick Shortcuts" },
  ];

  return (
    <>
      <div className="space-y-12">
        <DocumentationSection
          id="simulation"
          title="Simulation Basics"
          subtitle="Mastering the Gas Law Simulation Interface"
          description="This guide provides a comprehensive walkthrough of the Gas Law Simulation's key components and interactions. Whether you're a student, educator, or science enthusiast, this documentation will help you navigate and understand the simulation's features."
        />

        <Separator />

        <DocumentationSection
          id="gas-law-simulation"
          title="Gas Law Simulation"
        >
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Gas Law Simulation is an interactive tool designed to help
              users explore and understand fundamental gas behaviors through
              dynamic visualizations. It supports multiple gas laws including
              Boyle's Law, Charles' Law, and the Ideal Gas Law.
            </p>

            <h3 className="text-lg font-semibold mt-4">Key Features:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Real-time molecular motion visualization</li>
              <li>Interactive parameter adjustments</li>
              <li>Multiple gas type selection</li>
              <li>Comprehensive visual feedback</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection id="gas-tanks" title="Gas Selection Tanks">
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Gas Selection Tanks allow you to customize your simulation by
              choosing specific gases. Currently, three gases are available:
            </p>

            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Gas</strong>
              <strong>Description</strong>
              <Separator className="col-span-2" />

              <p>Nitrogen (N₂)</p>
              <p>
                A colorless, odorless gas that makes up approximately 78% of
                Earth's atmosphere
              </p>
              <Separator className="col-span-2" />

              <p>Carbon Dioxide (CO₂)</p>
              <p>
                A greenhouse gas essential for photosynthesis and climate
                regulation
              </p>
              <Separator className="col-span-2" />

              <p>Oxygen (O₂)</p>
              <p>
                A critical gas for respiration, making up about 21% of Earth's
                atmosphere
              </p>
            </div>

            <h3 className="text-lg font-semibold mt-4">Interaction Guide:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Click on a gas tank to select or deselect it</li>
              <li>You can select up to 3 gases simultaneously</li>
              <li>
                Selected gases will have full opacity, while unselected gases
                will be slightly transparent
              </li>
            </ul>

            <AutoPlayVideo
              src="gas-selection-demo.mp4"
              poster="video-placeholder.png"
            />
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection id="air-pump" title="Air Pump">
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Air Pump is a critical component for manipulating the number
              of gas molecules in the simulation.
            </p>

            <h3 className="text-lg font-semibold">Functionality:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Manually add gas molecules to the system</li>
              <li>Observe real-time changes in molecule count</li>
              <li>Provides a tactile way to understand gas behavior</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Interaction Details:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Drag the pump handle up and down</li>
              <li>Each pump action adds approximately 5 molecules</li>
              <li>
                A cooldown period prevents rapid, unrealistic molecule addition
              </li>
              <li>Maximum molecule count is set to 500</li>
            </ul>
            <AutoPlayVideo
              src="air-pump-demo.mp4"
              poster="video-placeholder.png"
            />
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection id="barometer" title="Barometer Visualization">
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Barometer provides a dynamic, visual representation of system
              pressure.
            </p>

            <h3 className="text-lg font-semibold">Key Features:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Needle movement reflects current system pressure</li>
              <li>Integrated slider for direct pressure manipulation</li>
              <li>Visual feedback on pressure changes</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">
              Pressure Characteristics:
            </h3>
            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Parameter</strong>
              <strong>Details</strong>
              <Separator className="col-span-2" />

              <p>Default Unit</p>
              <p>Atmospheres (atm)</p>
              <Separator className="col-span-2" />

              <p>Maximum Pressure</p>
              <p>Configurable via simulation settings (default: 5 atm)</p>
              <Separator className="col-span-2" />

              <p>Interaction</p>
              <p>
                Use slider to adjust pressure, observe real-time needle movement
              </p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection id="sliders" title="Interactive Sliders">
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold">Temperature Slider</h3>
            <p>
              Adjust the system temperature to observe molecular motion changes.
            </p>

            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Parameter</strong>
              <strong>Details</strong>
              <Separator className="col-span-2" />

              <p>Default Unit</p>
              <p>Kelvin (K)</p>
              <Separator className="col-span-2" />

              <p>Initial Temperature</p>
              <p>295 K (Room temperature)</p>
              <Separator className="col-span-2" />

              <p>Interaction</p>
              <p>Drag slider left/right to change temperature</p>
            </div>

            <h3 className="text-lg font-semibold pt-4">Pressure Slider</h3>
            <p>Directly control system pressure using an intuitive slider.</p>

            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Parameter</strong>
              <strong>Details</strong>
              <Separator className="col-span-2" />

              <p>Range</p>
              <p>0-100% (maps to 0-5 atm)</p>
              <Separator className="col-span-2" />

              <p>Interaction</p>
              <p>Drag slider up/down to adjust pressure</p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="cylinder-motion"
          title="Cylinder & Molecular Motion"
        >
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Cylinder is the primary visualization space for molecular
              interactions and gas behavior.
            </p>

            <h3 className="text-lg font-semibold">Features:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dynamic volume control</li>
              <li>Play/Pause molecular motion</li>
              <li>Visualize gas molecule behavior</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">Volume Control:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Drag container walls to change volume</li>
              <li>Maximum simulation volume: Configurable in settings</li>
              <li>Volume changes reflect real-time molecular distribution</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">
              Molecular Motion Controls:
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Play/Pause button to start or stop molecular animation</li>
              <li>Molecule movement speed influenced by temperature</li>
              <li>Molecule count affects system dynamics</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="thermometer"
          title="Thermometer Visualization"
        >
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Thermometer provides a real-time visual representation of
              system temperature.
            </p>

            <h3 className="text-lg font-semibold">
              Temperature Characteristics:
            </h3>
            <div className="grid grid-cols-[0.3fr_1fr] gap-4">
              <strong>Parameter</strong>
              <strong>Details</strong>
              <Separator className="col-span-2" />

              <p>Visualization</p>
              <p>Color-coded thermometer reflecting current temperature</p>
              <Separator className="col-span-2" />

              <p>Temperature Range</p>
              <p>Customizable via simulation settings</p>
              <Separator className="col-span-2" />

              <p>Molecular Impact</p>
              <p>
                Higher temperatures increase molecular motion and kinetic energy
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
          prev={{ title: "Introduction", url: "/docs#" }}
          next={{
            title: "Parameters and Units",
            url: "/docs/parameters-and-units#",
          }}
        />
      </div>
      <OnThisPage sections={pageSections} />
    </>
  );
}
