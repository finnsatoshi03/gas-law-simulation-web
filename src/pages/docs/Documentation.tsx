import { DocumentationSection } from "@/components/docs/DocsSection";
import { NavigationFooter } from "@/components/docs/NavFooter";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { QuickShortcutCards } from "@/components/docs/QuickShortcutCards";
import { Separator } from "@/components/ui/separator";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Documentation() {
  const pageSections = [
    { id: "overview", title: "Introduction" },
    { id: "what-is", title: "What is the Gas Law Simulation?" },
    { id: "features", title: "Main Features" },
    { id: "how-to", title: "How to Use This Documentation" },
    { id: "quick-shortcuts", title: "Quick Shortcuts" },
  ];

  return (
    <>
      <div className="space-y-12">
        <DocumentationSection
          id="overview"
          title="Introduction"
          subtitle="Welcome to the Gas Law Simulation Documentation!"
          description="This guide is designed to help you navigate and maximize the features of the Gas Law Simulation app. Whether you're a student, educator, or enthusiast, this app provides an interactive way to explore and understand gas laws through real-time simulations."
        />

        <Separator />

        <DocumentationSection
          id="what-is"
          title="What is the Gas Law Simulation?"
          description="The Gas Law Simulation is an interactive tool that visually demonstrates how gases behave under different conditions. Users can manipulate variables such as pressure, volume, and temperature to observe their effects on gas molecules, enhancing their understanding of fundamental gas laws."
        />

        <Separator />

        <DocumentationSection id="features" title="Main Features">
          <div className="grid grid-cols-[0.3fr_1fr] xl:grid-cols-[0.2fr_1fr] gap-4">
            <h2 className="font-bold">Feature</h2>
            <h2 className="font-bold">Description</h2>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Gas Law Simulations</p>
            <p className="text-sm md:text-base">
              Explore Boyle’s Law, Charles’ Law, and the Ideal Gas Law
              interactively. Adjust pressure, volume, and temperature to see
              real-time results with visual representations that reinforce key
              concepts.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">
              Real-Time Calculation & Synchronization
            </p>
            <p className="text-sm md:text-base">
              Dragging elements in the simulation updates the parameter panel
              instantly. If an initial value is set, the final value updates
              automatically, and vice versa, ensuring seamless interaction
              between inputs and visual changes.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Gas Selection Tanks</p>
            <p className="text-sm md:text-base">
              Choose specific gases like Nitrogen (N₂), Carbon Dioxide (CO₂),
              and Oxygen (O₂) to customize simulations. Add or remove gases
              dynamically with a simple click.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Air Pump</p>
            <p className="text-sm md:text-base">
              Manually add or remove gas molecules to observe pressure changes
              and molecule count fluctuations.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Barometer Visualization</p>
            <p className="text-sm md:text-base">
              Displays real-time pressure changes with a moving needle for easy
              monitoring.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Interactive Sliders</p>
            <p className="text-sm md:text-base">
              Adjust system pressure and temperature with sliders. Changes
              reflect instantly on the barometer and molecular motion.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Cylinder & Molecular Motion</p>
            <p className="text-sm md:text-base">
              Simulate gas behavior in a controlled container. Play/pause
              molecular motion and adjust volume by resizing the container.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Thermometer Visualization</p>
            <p className="text-sm md:text-base">
              Provides instant temperature readings, showing how heat affects
              molecular motion.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Calculation History</p>
            <p className="text-sm md:text-base">
              Automatically saves up to 50 past calculations for easy reference.
              Each gas law has its own organized history, ensuring clarity when
              reviewing previous inputs, results, and timestamps.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Reset Feature</p>
            <p className="text-sm md:text-base">
              Clear all inputs and results with one click for a quick restart.
              No need for manual clearing.
            </p>
            <Separator className=" col-span-2" />

            <p className="text-sm md:text-base">Clear History</p>
            <p className="text-sm md:text-base">
              Delete stored calculations for a fresh start and optimized
              storage.
            </p>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection id="how-to" title="How to Use This Documentation">
          <div className="text-sm md:text-base">
            This guide is designed to help you easily find relevant information.
            It covers{" "}
            <Link to="#" className="text-blue-700 inline-flex font-semibold">
              Navigation & User Interface <ArrowUpRight size={12} />
            </Link>
            , where you’ll learn how to move through the app efficiently. The{" "}
            <Link to="#" className="text-blue-700 inline-flex font-semibold">
              App Features <ArrowUpRight size={12} />
            </Link>{" "}
            section explores the various functionalities available in the
            simulation.{" "}
            <Link to="#" className="text-blue-700 inline-flex font-semibold">
              Interactive Simulation <ArrowUpRight size={12} />
            </Link>{" "}
            explain how to manipulate parameters to better understand gas laws.
            Finally,{" "}
            <Link to="#" className="text-blue-700 inline-flex font-semibold">
              Tips & Best Practices <ArrowUpRight size={12} />
            </Link>{" "}
            provide guidance on maximizing your experience with the app.
          </div>
        </DocumentationSection>

        <Separator />

        <section id="quick-shortcuts">
          <h2 className="text-2xl font-bold mb-6">Quick Shortcuts</h2>
          <QuickShortcutCards />
        </section>

        <Separator />

        <NavigationFooter
          // prev={{ title: "Contact & Support", url: "/docs/support#" }}
          next={{ title: "Simulation Basics", url: "/docs/simulation-basics#" }}
        />
      </div>
      <OnThisPage sections={pageSections} />
    </>
  );
}
