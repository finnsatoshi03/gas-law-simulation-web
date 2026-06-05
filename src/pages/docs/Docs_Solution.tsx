import { DocumentationSection } from "@/components/docs/DocsSection";
import { Separator } from "@/components/ui/separator";
import { NavigationFooter } from "@/components/docs/NavFooter";
import { QuickShortcutCards } from "@/components/docs/QuickShortcutCards";
import { Link } from "react-router-dom";
import { ArrowUpRight, Lightbulb, ShieldCheck } from "lucide-react";
import { OnThisPage } from "@/components/docs/OnThisPage";

export default function Docs_Solution() {
  const pageSections = [
    { id: "solution-sheet-overview", title: "Solution Sheet" },
    { id: "solution-sheet-introduction", title: "What is the Solution Sheet?" },
    { id: "solution-sheet-trigger", title: "Solution Button Activation" },
    { id: "solution-access-control", title: "Solution Access Control" },
    {
      id: "solution-content-interactions",
      title: "Solution Content Display",
    },
    {
      id: "solution-sheet-features",
      title: "Advanced Solution Sheet Features",
    },
    { id: "quick-shortcuts", title: "Quick Shortcuts" },
  ];

  return (
    <>
      <div className="space-y-12">
        <DocumentationSection
          id="solution-sheet-overview"
          title="Solution Sheet"
          subtitle="Comprehensive Problem-Solving Insights"
          description="A detailed guide to understanding and using the Solution Sheet for gas law calculations."
        />

        <Separator />

        <DocumentationSection
          id="solution-sheet-introduction"
          title="What is the Solution Sheet?"
        >
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Solution Sheet is an advanced learning tool designed to
              provide step-by-step breakdown of gas law calculations with
              mathematical rigor.
            </p>

            <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                <strong>Key Feature:</strong> Detailed mathematical solutions
                with LaTeX-rendered equations for each gas law calculation.
              </p>
            </div>

            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Lightbulb className="size-6 text-yellow-500" /> Solution Button
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Appears dynamically when calculation parameters are complete
              </li>
              <li>Indicates availability with a pulsing animation</li>
              <li>Provides access to comprehensive solution steps</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="solution-sheet-trigger"
          title="Solution Button Activation"
        >
          <div className="space-y-4 text-sm md:text-base">
            <div className="bg-green-100 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-700">
                <strong>Activation Criteria:</strong> Solution button appears
                when all required parameters for the selected
                <Link
                  to="/docs/parameters-and-units#calculation-dynamics"
                  className="text-blue-700 inline-flex font-semibold ml-1"
                >
                  Parameters Panel <ArrowUpRight size={12} />
                </Link>
                are fulfilled.
              </p>
            </div>

            <h3 className="text-lg font-semibold">Real-Time Responsiveness</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dynamically updates based on input changes</li>
              <li>Instantly shows/hides solution button</li>
              <li>Connects directly with calculation parameters</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="solution-access-control"
          title="Solution Access Control"
        >
          <div className="space-y-4 text-sm md:text-base">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="size-6 text-emerald-700" />
              <h3 className="text-lg font-semibold">Account-Based Access</h3>
            </div>

            <p>
              Solution access uses the same account and feature-access rules as
              the rest of the application.
            </p>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Active users can access solutions when the feature is enabled
              </li>
              <li>
                Feature locks can restrict solution sheets for standard users
              </li>
              <li>Administrators retain access through existing admin rules</li>
            </ul>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-700">
                <strong>Feature Locking:</strong> When solution sheets are
                locked, the application displays the configured locked-feature
                message instead of solution content.
              </p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="solution-content-interactions"
          title="Solution Content Display"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold">Direct Solution Display</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Open the Solution button after completing a calculation</li>
              <li>Solution steps display immediately when access is allowed</li>
              <li>
                No additional solution password or visibility toggle is
                required
              </li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="solution-sheet-features"
          title="Advanced Solution Sheet Features"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold">
              Comprehensive Solution Breakdown
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>LaTeX-rendered mathematical equations</li>
              <li>Step-by-step calculation process</li>
              <li>Detailed unit conversion tracking</li>
              <li>Final calculated value with units</li>
            </ul>

            <div className="bg-purple-100 border-l-4 border-purple-500 p-4">
              <p className="text-sm text-purple-700">
                <strong>Supported Gas Laws:</strong> Boyle's Law, Charles's Law,
                Combined Gas Law, Ideal Gas Law, Avogadro's Law, Gay-Lussac's
                Law
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
            title: "Sample Problems",
            url: "/docs/sample-problems",
          }}
          next={{
            title: "Settings",
            url: "/docs/settings",
          }}
        />
      </div>
      <OnThisPage sections={pageSections} />
    </>
  );
}
