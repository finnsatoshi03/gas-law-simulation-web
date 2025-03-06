import { DocumentationSection } from "@/components/docs/DocsSection";
import { Separator } from "@/components/ui/separator";
import { NavigationFooter } from "@/components/docs/NavFooter";
import { QuickShortcutCards } from "@/components/docs/QuickShortcutCards";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  GripVertical,
  Eye,
  EyeOff,
  Puzzle,
  Ellipsis,
  Plus,
  Edit,
  Trash,
} from "lucide-react";
import { OnThisPage } from "@/components/docs/OnThisPage";

export default function Docs_SampleProblems() {
  const pageSections = [
    { id: "sample-problems-overview", title: "Sample Problems Management" },
    {
      id: "problems-slide-introduction",
      title: "Problems Slide: Interactive Practice",
    },
    { id: "accessing-problems-slide", title: "Accessing the Problems Slide" },
    { id: "problems-slide-interactions", title: "Problems Slide Interactions" },
    { id: "sample-problems-management", title: "Sample Problems Management" },
    { id: "quick-shortcuts", title: "Quick Shortcuts" },
  ];

  return (
    <>
      <div className="space-y-12">
        <DocumentationSection
          id="sample-problems-overview"
          title="Sample Problems Management"
          subtitle="Mastering Gas Law Problem Practice"
          description="A comprehensive guide to creating, managing, and practicing gas law problems in the simulation."
        />

        <Separator />

        <DocumentationSection
          id="problems-slide-introduction"
          title="Problems Slide: Interactive Practice"
        >
          <div className="space-y-4 text-sm md:text-base">
            <p>
              The Problems Slide is an interactive learning tool designed to
              help you practice and understand different gas law problems.
            </p>

            <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                <strong>Key Feature:</strong> Practice problems for each gas law
                type with dynamic navigation and learning aids.
              </p>
            </div>

            <h3 className="text-lg font-semibold">Problems Slide Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Available for each gas law type (Boyle's, Charles's, etc.)
              </li>
              <li>Draggable interface for flexible positioning</li>
              <li>Customizable font size</li>
              <li>Optional hints and solutions</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="accessing-problems-slide"
          title="Accessing the Problems Slide"
        >
          <div className="space-y-4 text-sm md:text-base">
            <div className="flex items-center gap-2 mb-4">
              <Puzzle className="size-6 text-blue-600" />
              <h3 className="text-lg font-semibold">Slide Activation</h3>
            </div>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                Click the <Puzzle className="inline-block size-4" /> puzzle icon
                to open the Problems Slide
              </li>
              <li>Each gas law type has its own dedicated problem set</li>
              <li>Can be opened and closed at any time during simulation</li>
            </ul>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="text-sm text-yellow-700">
                <strong>Pro Tip:</strong> Use the Problems Slide to reinforce
                your understanding of different gas law calculations.
              </p>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="problems-slide-interactions"
          title="Problems Slide Interactions"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GripVertical className="size-5" /> Drag Feature
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Click and hold the vertical grip handle to move the slide</li>
              <li>Reposition the slide anywhere on the screen</li>
              <li>Maintains full functionality in any location</li>
            </ul>

            <h3 className="text-lg font-semibold flex items-center gap-2 pt-4">
              Navigation Controls
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use navigation arrows to cycle through problems</li>
              <li>Displays current problem number out of total problems</li>
              <li>Automatically resets when reaching first or last problem</li>
            </ul>

            <h3 className="text-lg font-semibold flex items-center gap-2 pt-4">
              Hint and Solution Visibility
            </h3>
            <div className="flex items-center gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Eye className="size-5 text-blue-600" />
                <span>Show</span>
              </div>
              <div className="flex items-center gap-2">
                <EyeOff className="size-5 text-gray-600" />
                <span>Hide</span>
              </div>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Toggle visibility of hints and solutions</li>
              <li>Independent control for hints and answers</li>
              <li>Helps simulate problem-solving process</li>
            </ul>

            <h3 className="text-lg font-semibold flex items-center gap-2 pt-4">
              Font Size Customization
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Adjust text size for better readability</li>
              <li>Range: 12px to 32px</li>
              <li>Affects problem title, question, hints, and solutions</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="sample-problems-management"
          title="Sample Problems Management"
        >
          <div className="space-y-4 text-sm md:text-base">
            <p>
              Manage your gas law problems with an intuitive interface powered
              by localStorage.
            </p>

            <div className="bg-green-100 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-700">
                <strong>Access Management:</strong> Customize your problem set
                via
                <Link
                  to="/settings"
                  className="text-blue-700 inline-flex font-semibold ml-1"
                >
                  Settings <ArrowUpRight size={12} />
                </Link>
                under the "Sample Problems" tab.
              </p>
            </div>

            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="size-5" /> Adding Problems
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Click "Add Problem" button</li>
              <li>Fill in title, question, optional hint, and solution</li>
              <li>Automatically assigned to selected gas law type</li>
            </ul>

            <h3 className="text-lg font-semibold flex items-center gap-2 pt-4">
              <Ellipsis className="size-5" /> Problem Actions
            </h3>
            <div className="flex gap-4 mb-2">
              <div className="flex items-center gap-2">
                <Eye className="size-4" /> View
                <Edit className="size-4 ml-2" /> Edit
                <Trash className="size-4 ml-2" /> Delete
              </div>
            </div>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use dropdown menu for each problem</li>
              <li>View full problem details</li>
              <li>Edit existing problems</li>
              <li>Delete problems you no longer need</li>
            </ul>

            <h3 className="text-lg font-semibold pt-4">
              Local Storage Management
            </h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Problems are saved in browser's localStorage</li>
              <li>Persists across browser sessions</li>
              <li>Includes sample problems by default</li>
              <li>Can be reset or customized</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <section id="quick-shortcuts">
          <h2 className="text-2xl font-bold mb-6">Quick Shortcuts</h2>
          <QuickShortcutCards />
        </section>

        <NavigationFooter
          prev={{
            title: "Wall Collission Dynamics",
            url: "/docs/wall-collision-dynamics",
          }}
          next={{
            title: "Solution",
            url: "/docs/solution",
          }}
        />
      </div>
      <OnThisPage sections={pageSections} />
    </>
  );
}
