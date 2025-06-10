import { DocumentationSection } from "@/components/docs/DocsSection";
import { Separator } from "@/components/ui/separator";
import { NavigationFooter } from "@/components/docs/NavFooter";
import { OnThisPage } from "@/components/docs/OnThisPage";
import { QuickShortcutCards } from "@/components/docs/QuickShortcutCards";
import { Volume2, Mic2, Settings2, Accessibility, VolumeX } from "lucide-react";

export default function Docs_Accessibility() {
  const pageSections = [
    { id: "accessibility-overview", title: "Accessibility Features" },
    { id: "accessibility-button", title: "Accessibility Button" },
    { id: "text-to-speech", title: "Text-to-Speech Functionality" },
    { id: "voice-settings", title: "Voice Customization" },
    { id: "auto-read", title: "Auto-Read Walkthrough" },
    { id: "quick-shortcuts", title: "Quick Shortcuts" },
  ];

  return (
    <>
      <div className="space-y-12">
        <DocumentationSection
          id="accessibility-overview"
          title="Accessibility Features"
          subtitle="Making Gas Law Simulation Accessible to All Users"
          description="The Gas Law Simulation includes comprehensive accessibility features to ensure that all users, including those with disabilities, can effectively engage with and learn from the application."
        />

        <Separator />

        <DocumentationSection
          id="accessibility-button"
          title="Accessibility Button"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Accessibility className="size-6 text-blue-500" /> Accessing
              Accessibility Controls
            </h3>

            <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
              <p className="text-sm text-blue-700">
                <strong>Key Feature:</strong> The accessibility button is always
                available in the bottom right corner of the screen, providing
                quick access to all accessibility settings.
              </p>
            </div>

            <div className="md:grid-cols-2 gap-4 grid">
              <div>
                <p>
                  The Accessibility Button serves as a gateway to all
                  accessibility features:
                </p>
                <ul className="list-disc pl-8 space-y-2 mt-4">
                  <li>
                    Fixed position in the bottom right for consistent access
                  </li>
                  <li>
                    Visual indicator shows whether text-to-speech is enabled
                  </li>
                  <li>Opens a comprehensive accessibility control panel</li>
                  <li>Remains available across all pages of the application</li>
                </ul>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="border p-4 rounded-lg shadow-md bg-white">
                  <div className="flex items-center space-x-2 p-2">
                    <Accessibility className="h-5 w-5" />
                    <Volume2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-xs text-center mt-2">
                    Accessibility Button with Text-to-Speech enabled
                  </p>
                </div>
                <div className="border p-4 rounded-lg shadow-md bg-white mt-4">
                  <div className="flex items-center space-x-2 p-2">
                    <Accessibility className="h-5 w-5" />
                    <VolumeX className="h-4 w-4 text-gray-400" />
                  </div>
                  <p className="text-xs text-center mt-2">
                    Accessibility Button with Text-to-Speech disabled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection
          id="text-to-speech"
          title="Text-to-Speech Functionality"
        >
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Volume2 className="size-6 text-green-500" /> Text-to-Speech
              Features
            </h3>

            <div className="bg-green-100 border-l-4 border-green-500 p-4">
              <p className="text-sm text-green-700">
                <strong>Purpose:</strong> Text-to-speech functionality helps
                users with visual impairments, reading difficulties, or those
                who prefer auditory learning.
              </p>
            </div>

            <div className="md:grid-cols-2 gap-4 grid">
              <div>
                <h4 className="font-semibold mt-4">Core Functionality</h4>
                <ul className="list-disc pl-8 space-y-2">
                  <li>Enable/disable text-to-speech with a simple toggle</li>
                  <li>
                    Test voice feature lets you preview how speech will sound
                  </li>
                  <li>
                    Playback controls (play, pause, stop) for speech output
                  </li>
                  <li>
                    Automatically strips HTML tags for cleaner audio output
                  </li>
                  <li>Persists user preferences across sessions</li>
                </ul>
              </div>
              <div className="border p-4 rounded-lg shadow-md bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Text-to-Speech</span>
                  </div>
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex space-x-2">
                    <button className="border rounded px-2 py-1 text-xs flex items-center">
                      <Mic2 className="h-3 w-3 mr-1" />
                      Test Voice
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection id="voice-settings" title="Voice Customization">
          <div className="space-y-4 text-sm md:text-base">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings2 className="size-6 text-purple-500" /> Voice
              Personalization Options
            </h3>

            <p>
              The accessibility controls offer extensive voice customization to
              ensure the text-to-speech feature meets individual user needs:
            </p>

            <div className="md:grid-cols-2 gap-4 grid">
              <div>
                <h4 className="font-semibold mt-4">Adjustable Parameters</h4>
                <ul className="list-disc pl-8 space-y-2">
                  <li>
                    <strong>Voice Selection:</strong> Choose from available
                    system voices
                  </li>
                  <li>
                    <strong>Speech Rate:</strong> Adjust from 0.5× (slower) to
                    2× (faster)
                  </li>
                  <li>
                    <strong>Speech Pitch:</strong> Customize from 0.5 (lower) to
                    2 (higher)
                  </li>
                  <li>
                    <strong>Volume Control:</strong> Set from 0% to 100%
                  </li>
                </ul>
                <div className="bg-purple-100 border-l-4 border-purple-500 p-4 mt-4">
                  <p className="text-sm text-purple-700">
                    <strong>Note:</strong> Available voices depend on your
                    operating system and browser. The application automatically
                    detects and displays all available voices.
                  </p>
                </div>
              </div>
              <div className="border p-4 rounded-lg shadow-md bg-white">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Voice</label>
                    <div className="border rounded p-2 mt-1 text-sm">
                      Select a voice
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Speech Rate: 1.0×
                    </label>
                    <div className="h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-2 bg-blue-500 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Speech Pitch: 1.0
                    </label>
                    <div className="h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-2 bg-blue-500 rounded-full w-1/2"></div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Volume: 100%</label>
                    <div className="h-2 bg-gray-200 rounded-full mt-1">
                      <div className="h-2 bg-blue-500 rounded-full w-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DocumentationSection>

        <Separator />

        <DocumentationSection id="auto-read" title="Auto-Read Walkthrough">
          <div className="space-y-4 text-sm md:text-base">
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-700">
                <strong>Interactive Learning:</strong> The auto-read feature
                automatically reads walkthrough steps, making guided tours
                accessible to all users.
              </p>
            </div>

            <div className="md:grid-cols-2 gap-4 grid">
              <div>
                <h4 className="font-semibold mt-4">Auto-Read Features</h4>
                <ul className="list-disc pl-8 space-y-2">
                  <li>Toggle on/off auto-reading of walkthrough steps</li>
                  <li>Automatically reads content when new steps appear</li>
                  <li>Works seamlessly with the application's guided tours</li>
                  <li>
                    Can be enabled even when general text-to-speech is disabled
                  </li>
                </ul>
              </div>
              <div className="border p-4 rounded-lg shadow-md bg-white">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Auto-read Walkthrough Steps
                  </label>
                  <div className="w-10 h-5 bg-blue-500 rounded-full relative">
                    <div className="absolute right-0.5 top-0.5 bg-white w-4 h-4 rounded-full"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  When enabled, walkthrough steps will be automatically read
                  aloud as they appear
                </p>
              </div>
            </div>

            <p className="mt-4">
              The auto-read feature is particularly useful for:
            </p>
            <ul className="list-disc pl-8 space-y-2">
              <li>Users with visual impairments who need audio guidance</li>
              <li>Learners who process information better through audio</li>
              <li>
                Multitasking scenarios where users can't focus on the screen
              </li>
              <li>Creating a more immersive learning experience</li>
            </ul>
          </div>
        </DocumentationSection>

        <Separator />

        <section id="quick-shortcuts">
          <h2 className="text-2xl font-bold mb-6">Quick Shortcuts</h2>
          <QuickShortcutCards />
        </section>

        <Separator />

        <NavigationFooter
          prev={{
            title: "Parameters and Units",
            url: "/docs/parameters-and-units#",
          }}
          next={{ title: "Settings", url: "/docs/settings#" }}
        />
      </div>
      <OnThisPage sections={pageSections} />
    </>
  );
}
