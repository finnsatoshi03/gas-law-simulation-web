import { DocumentationSection } from "@/components/docs/DocsSection";
import { Separator } from "@/components/ui/separator";
import { NavigationFooter } from "@/components/docs/NavFooter";
import { QuickShortcutCards } from "@/components/docs/QuickShortcutCards";
import { Link } from "react-router-dom";
import {
  Settings as SettingsIcon,
  Table,
  Beaker,
  ArrowUpRight,
} from "lucide-react";
import { OnThisPage } from "@/components/docs/OnThisPage";

export default function Docs_Settings() {
  const pageSections = [
    { id: "settings-overview", title: "Settings Page" },
    { id: "settings-page-structure", title: "Page Structure" },
    { id: "simulation-settings", title: "Simulation Settings" },
    { id: "sample-problems", title: "Sample Problems Management" },
    { id: "about-section", title: "About Gas Law Simulator" },
    { id: "quick-shortcuts", title: "Quick Shortcuts" },
  ];

  return (
    <>
      <div className="space-y-12">
        <DocumentationSection
          id="settings-overview"
          title="Settings Page"
          subtitle="Comprehensive Configuration for Gas Law Simulation"
          description="A detailed guide to understanding and customizing your gas law simulation experience."
        />

        <Separator />

        <DocumentationSection
          id="settings-page-structure"
          title="Page Structure"
        >
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Settings page is designed with a user-friendly tabbed
              interface, providing quick access to three primary sections:
            </p>
            <div className="md:grid-cols-2 gap-4 grid">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Settings Tab:</strong> Customize simulation parameters
                </li>
                <li>
                  <strong>Sample Problems Tab:</strong> Practice and manage gas
                  law problems
                </li>
                <li>
                  <strong>About Tab:</strong> Learn about the Gas Law Simulator
                </li>
              </ul>
              <img src="tabs.png" alt="Tabs UI Preview" className="w-full" />
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="simulation-settings"
          title="Simulation Settings"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <SettingsIcon className="size-6 text-blue-500" /> Configuration
              Options
            </h3>

            <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                <strong>Key Feature:</strong> Comprehensive simulation
                customization with real-time visual feedback
              </p>
            </div>

            <h4 className="font-semibold mt-4">1. Container Size Limit</h4>
            <div className="md:grid-cols-2 gap-4 grid">
              <ul className="list-disc pl-8 space-y-2">
                <li>Adjust the maximum size of the simulation container</li>
                <li>Range: 10 to 500 volume units</li>
                <li>Impacts molecule movement and simulation space</li>
              </ul>
              <img
                src="container.png"
                alt="Container UI Preview"
                className="w-full"
              />
            </div>

            <h4 className="font-semibold mt-4">
              2. Barometer Range Calibration
            </h4>
            <div className="md:grid-cols-2 gap-4 grid">
              <ul className="list-disc pl-8 space-y-2">
                <li>Define the upper limit of atmospheric pressure</li>
                <li>Range: 5 to 200 atmospheres</li>
                <li>
                  Ensures accurate pressure readings within the simulation
                </li>
              </ul>
              <img
                src="barometer-range.png"
                alt="Barometer Range Setter UI Preview"
                className="w-full"
              />
            </div>

            <h4 className="font-semibold mt-4">3. Molecule Size Adjustment</h4>
            <div className="md:grid-cols-2 gap-4 grid">
              <ul className="list-disc pl-8 space-y-2">
                <li>Customize the visual size of molecules</li>
                <li>Real-time preview of molecule scaling</li>
                <li>
                  Supports multiple molecule types (Oxygen, Carbon Dioxide,
                  Nitrogen)
                </li>
              </ul>
              <img
                src="molecule-size.png"
                alt="Molecule Size Setter UI Preview"
                className="w-full"
              />
            </div>

            <h4 className="font-semibold mt-4">4. Molecule Ratio Settings</h4>
            <div className="md:grid-cols-2 gap-4 grid">
              <ul className="list-disc pl-6 space-y-2">
                <li>Choose between exact molecule counts or scaled ratios</li>
                <li>Options: 1:1, 1:0.1, 1:0.01, 1:0.001</li>
                <li>
                  Allows flexible representation of molecular interactions
                </li>
              </ul>
              <img
                src="molecule-ratio.png"
                alt="Molecule Ratio Setter UI Preview"
                className="w-full"
              />
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="sample-problems"
          title="Sample Problems Management"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Table className="size-6 text-green-500" /> Problem Management
              Features
            </h3>

            <div className="bg-green-100 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-700">
                <strong>Supported Gas Laws:</strong> Boyle's Law, Charles's Law,
                Combined Gas Law, Ideal Gas Law, Gay-Lussac's Law, Avogadro's
                Law
              </p>
            </div>

            <ul className="list-disc pl-6 space-y-2">
              <li>Filter problems by specific gas law</li>
              <li>
                <strong>Add Custom Problems:</strong> Create personalized
                problem sets
              </li>
              <li>
                <strong>Problem Management:</strong> View, Edit, and Delete
                problems
              </li>
              <li>Local storage preservation of problem sets</li>
            </ul>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-700">
                <strong>Activation Criteria:</strong> Problem management
                features are available when
                <Link
                  to="/docs/parameters-and-units#calculation-dynamics"
                  className="text-blue-700 inline-flex font-semibold ml-1"
                >
                  all required parameters are fulfilled{" "}
                  <ArrowUpRight size={12} />
                </Link>
              </p>
            </div>

            <div className="mt-4">
              <p className="text-sm">
                Want to learn more about Sample Problems?
                <Link
                  to="/docs/sample-problems"
                  className="text-blue-700 inline-flex font-semibold ml-1"
                >
                  View Sample Problems Documentation <ArrowUpRight size={12} />
                </Link>
              </p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="about-section"
          title="About Gas Law Simulator"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Beaker className="size-6 text-purple-500" /> Educational Tool
              Overview
            </h3>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Interactive simulation for chemistry and physics education
              </li>
              <li>Real-time visualization of gas molecule behavior</li>
              <li>Customizable experimental conditions</li>
              <li>Designed for students and educators</li>
            </ul>

            <div className="bg-purple-100 border-l-4 border-purple-500 p-4">
              <p className="text-sm text-purple-700">
                <strong>Owned By:</strong> Romaric Bucayu, Licensed Science
                Teacher
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
            title: "Solution",
            url: "/docs/solution",
          }}
          // next={{
          //   title: "Parameters and Units",
          //   url: "/docs/parameters-and-units",
          // }}
        />
      </div>
      <OnThisPage sections={pageSections} />
    </>
  );
}
