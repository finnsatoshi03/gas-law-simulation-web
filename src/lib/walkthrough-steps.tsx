import { Placement } from "react-joyride";

export const getTourSteps = () => {
  const tourSteps = [
    {
      target: ".home-tour-start",
      content: (
        <div>
          <h3 className="font-bold text-lg">🌟 Welcome!</h3>
          <p>
            Let's explore gas laws together! This app makes learning fun with
            interactive simulations.
          </p>
        </div>
      ),
      data: { next: "/boyles" },
      disableBeacon: true,
      placement: "center" as Placement,
    },
    {
      target: ".sidebar-navigation",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧭 Sidebar Navigation</h3>
          <p>
            Use this sidebar to move between different sections. It's your
            shortcut to exploring gas laws!
          </p>
        </div>
      ),
      data: { previous: "/home", next: ".home-nav-item" },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".home-nav-item",
      content: (
        <div>
          <h3 className="font-bold text-lg">🏠 Home</h3>
          <p>Click here anytime to go back to the main page and start fresh.</p>
        </div>
      ),
      data: { previous: ".sidebar-navigation", next: ".playground-nav-item" },
      disableBeacon: true,
    },
    {
      target: ".playground-nav-item",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧪 Playground</h3>
          <p>
            This is where the fun happens! Try different gas law simulations and
            see how they work.
          </p>
        </div>
      ),
      data: { previous: ".home-nav-item", next: ".settings-nav-item" },
      disableBeacon: true,
    },
    {
      target: ".settings-nav-item",
      content: (
        <div>
          <h3 className="font-bold text-lg">⚙️ Settings</h3>
          <p>
            Customize your experience by changing themes and adjusting settings.
          </p>
        </div>
      ),
      data: { previous: ".playground-nav-item", next: ".boyles-law-nav-item" },
      disableBeacon: true,
    },
    {
      target: ".boyles-law-nav-item",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔬 Boyle's Law</h3>
          <p>
            Let's start with Boyle's Law! It sets the foundation for all gas law
            simulations.
          </p>
        </div>
      ),
      data: {
        previous: ".settings-nav-item",
        next: ".boyles-law-input-group",
      },
      disableBeacon: true,
    },
    {
      target: ".boyles-law-input-group",
      content: (
        <div>
          <h3 className="font-bold text-lg">📊 Gas Law Parameters</h3>
          <p>
            Each gas law has unique parameters. These interactive fields let you
            input and explore different gas scenarios.
          </p>
          <p className="mt-2 bg-zinc-50 p-2 text-sm rounded-md border border-zinc-200">
            <span className="font-bold">Tip</span>: Parameters change depending
            on the specific gas law you're exploring!
          </p>
        </div>
      ),
      data: {
        previous: ".boyles-law-nav-item",
        next: ".initial-parameters-group",
      },
      disableBeacon: true,
    },
    {
      target: ".initial-parameters-group",
      content: (
        <div>
          <h3 className="font-bold text-lg">🟢 Initial Parameters Group</h3>
          <p>
            This section represents the starting conditions of your gas system
            before any changes occur.
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>Initial Volume (V1)</li>
            <li>Initial Pressure (P1)</li>
          </ul>
          <p className="mt-2 bg-slate-50 p-2 text-xs rounded-md border border-slate-200">
            Think of this as the "before" snapshot of your gas system.
          </p>
        </div>
      ),
      data: {
        previous: ".input-pressure-2",
        next: ".final-parameters-group",
      },
      disableBeacon: true,
    },
    {
      target: ".final-parameters-group",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔴 Final Parameters Group</h3>
          <p>
            This section shows the gas system's conditions after changes have
            been applied.
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>Final Volume (V2)</li>
            <li>Final Pressure (P2)</li>
          </ul>
          <p className="mt-2 bg-slate-50 p-2 text-xs rounded-md border border-slate-200">
            This is the "after" snapshot of your gas system.
          </p>
        </div>
      ),
      data: {
        previous: ".initial-parameters-group",
        next: ".note-initial-final-difference",
      },
      disableBeacon: true,
    },
    {
      target: ".note-initial-final-difference",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔄 Initial vs Final</h3>
          <p>
            Most gas laws compare initial and final states to understand how the
            system changes.
          </p>
          <p className="mt-2 bg-zinc-50 p-2 text-sm rounded-md border border-zinc-200">
            <strong>Note: </strong> Some gas laws (like Ideal Gas Law) might
            handle constants differently, so parameters can vary.
          </p>
          <div className="mt-2 bg-yellow-50 p-2 text-sm rounded-md border border-yellow-200">
            <strong>Pro Tip:</strong> The relationship between initial and final
            states reveals how the gas behaves under different conditions.
          </div>
        </div>
      ),
      data: {
        previous: ".final-parameters-group",
        next: ".input-volume-1",
      },
      disableBeacon: true,
    },
    {
      target: ".input-volume-1",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔹 Initial Volume (V1)</h3>
          <p>
            In Boyle's Law, initial volume represents the starting volume of a
            gas at a specific pressure.
          </p>
          <p className="mt-2 bg-yellow-50 p-2 text-sm rounded-md border border-yellow-200">
            <strong>Pro Tip:</strong> Different gas laws will have different key
            variables!
          </p>
        </div>
      ),
      data: {
        previous: ".boyles-law-input-group",
        next: ".input-pressure-1",
      },
      disableBeacon: true,
    },
    {
      target: ".input-pressure-1",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔹 Initial Pressure (P1)</h3>
          <p>
            Initial pressure is the starting pressure of the gas before any
            changes.
          </p>
          <p className="mt-2 bg-red-50 p-2 text-sm rounded-md border border-red-200">
            <strong>Remember:</strong> Pressure and volume have an inverse
            relationship in Boyle's Law!
          </p>
        </div>
      ),
      data: {
        previous: ".input-volume-1",
        next: ".input-volume-2",
      },
      disableBeacon: true,
    },
    {
      target: ".input-volume-2",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔹 Final Volume (V2)</h3>
          <p>Final volume shows the gas volume after a change in pressure.</p>
          <p className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            Some values might be calculated automatically based on your inputs!
          </p>
        </div>
      ),
      data: {
        previous: ".input-pressure-1",
        next: ".input-pressure-2",
      },
      disableBeacon: true,
    },
    {
      target: ".input-pressure-2",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔹 Final Pressure (P2)</h3>
          <p>
            Final pressure represents the gas pressure after volume changes.
          </p>
          <p className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            Boyle's Law helps predict how pressure and volume interact!
          </p>
        </div>
      ),
      data: {
        previous: ".input-volume-2",
        next: ".input-unit-pressure-1-selector",
      },
      disableBeacon: true,
    },
    {
      target: ".input-unit-pressure-1-selector",
      content: (
        <div>
          <h3 className="font-bold text-lg">📏 Unit Selectors</h3>
          <p>
            Each parameter has a unit selector to convert between different
            measurement units seamlessly.
          </p>
          <div className="mt-2 text-sm bg-blue-50 p-2 rounded-md border border-blue-200">
            <strong>Pro Tip:</strong> The app automatically converts values when
            you change units, maintaining accuracy.
          </div>
        </div>
      ),
      data: {
        previous: ".input-pressure-2",
        current: ".input-unit-pressure-1-selector",
        next: ".input-unit-pressure-1-selector-content",
      },
      disableBeacon: true,
      placement: "auto" as const,
    },
    {
      target: ".input-unit-pressure-1-selector-content",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔢 Unit Selection Explained</h3>
          <p>
            Different gas laws and variables require specific unit measurements.
            This dropdown adapts to help you precisely track your calculations.
          </p>

          <div className="mt-2 space-y-2">
            <div className="bg-blue-50 p-2 text-sm rounded-md border border-blue-200">
              <strong>Unit Variety by Variable Type:</strong>
              <ul className="list-disc pl-5 text-sm mt-1">
                <li>
                  <strong>Pressure Units:</strong> atm, mmHg, kPa, bar, psi
                </li>
                <li>
                  <strong>Volume Units:</strong> mL, L, cm³, m³, ft³
                </li>
                <li>
                  <strong>Temperature Units:</strong> Celsius, Kelvin,
                  Fahrenheit
                </li>
              </ul>
            </div>

            <div className="bg-green-50 p-2 text-sm rounded-md border border-green-200">
              <strong>🔄 Automatic Conversion Magic</strong>
              <p className="text-sm mt-1">
                When you switch units, the app instantly:
                <ul className="list-disc pl-5">
                  <li>Recalculates the value</li>
                  <li>Maintains precise scientific accuracy</li>
                  <li>Adapts to different measurement systems</li>
                </ul>
              </p>
            </div>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            💡 Units change based on the specific gas law and variable you're
            exploring.
          </p>
        </div>
      ),
      data: {
        previous: ".input-unit-pressure-1-selector",
        next: ".reset-button",
      },
      disableBeacon: true,
      placement: "auto" as const,
    },
    {
      target: ".reset-button",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔄 Reset Calculation</h3>
          <p>Quickly clear all inputs and start fresh.</p>
          <div className="mt-2 bg-blue-50 p-2 rounded-md border border-blue-200">
            <strong>What It Does:</strong>
            <ul className="list-disc pl-5 text-sm">
              <li>Clears all fields</li>
              <li>Resets results</li>
              <li>Prepares for a new calculation</li>
            </ul>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            💡 A fast way to start over without manual clearing.
          </p>
        </div>
      ),
      data: {
        previous: ".input-unit-pressure-1-selector-content",
        current: ".reset-button",
        next: ".history-button",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".history-button",
      content: (
        <div>
          <h3 className="font-bold text-lg">📜 Calculation History</h3>
          <p>Review and track your recent calculations.</p>
          <div className="mt-2 bg-blue-50 p-2 rounded-md border border-blue-200">
            <strong>Features:</strong>
            <ul className="list-disc pl-5 text-sm">
              <li>Stores last 50 calculations</li>
              <li>2-sec debounce for smooth saving</li>
              <li>Tracks inputs, results, and timestamps</li>
            </ul>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            💡 Prevents excessive storage operations for better performance.
          </p>
        </div>
      ),
      data: {
        previous: ".reset-button",
        current: ".history-button",
        next: ".calculation-history-content",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".calculation-history-content",
      content: (
        <div>
          <h3 className="font-bold text-lg">📊 Exploring History</h3>
          <p>View and manage past calculations.</p>
          <div className="mt-2 bg-blue-50 p-2 rounded-md border border-blue-200">
            <strong>Details:</strong>
            <ul className="list-disc pl-5 text-sm">
              <li>Stores up to 50 recent entries</li>
              <li>Separate history for each gas law</li>
              <li>Captures inputs, results, and timestamps</li>
            </ul>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            💡 Keeps recent calculations easily accessible.
          </p>
        </div>
      ),
      data: {
        previous: ".history-button",
        current: ".calculation-history-content",
        next: ".clear-history-button",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".clear-history-button",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧹 Clear History</h3>
          <p>Remove past calculations for a clean slate.</p>
          <div className="mt-2 bg-blue-50 p-2 rounded-md border border-blue-200">
            <strong>What It Does:</strong>
            <ul className="list-disc pl-5 text-sm">
              <li>Clears history for the current gas law</li>
              <li>Keeps other gas laws' data intact</li>
            </ul>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            💡 Helps maintain a focused workspace.
          </p>
        </div>
      ),
      data: {
        previous: ".calculation-history-content",
        current: ".clear-history-button",
        next: ".collision-counter",
        closeHistoryOnNext: true,
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".collision-counter",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧱 Wall Collision Tracker</h3>
          <p>
            This panel helps you understand how gas particles interact with
            container walls during simulations.
          </p>
          <div className="mt-2 bg-blue-50 p-2 rounded-md border border-blue-200">
            <strong>What You'll See:</strong>
            <ul className="list-disc pl-5 text-sm">
              <li>
                <strong>Collision Count:</strong> Number of times gas particles
                hit the walls
              </li>
              <li>
                <strong>Elapsed Time:</strong> Duration of the simulation
              </li>
            </ul>
          </div>
          <div className="mt-2 bg-green-50 p-2 rounded-md border border-green-200">
            <strong>Controls:</strong>
            <ul className="list-disc pl-5 text-sm">
              <li>
                <strong>Play (▶):</strong> Start tracking wall collisions
              </li>
              <li>
                <strong>Pause (⏸):</strong> Temporarily stop tracking
              </li>
              <li>
                <strong>Reset (🔄):</strong> Clear current tracking data
              </li>
            </ul>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            💡 These collisions help visualize gas behavior under different
            conditions.
          </p>
        </div>
      ),
      data: {
        previous: ".clear-history-button",
        next: ".info-sheet-button",
      },
      disableBeacon: true,
      placement: "auto" as const,
    },
    {
      target: ".info-sheet-button",
      content: (
        <div>
          <h3 className="font-bold text-lg">ℹ️ Information Sheet</h3>
          <p>
            Discover detailed information about the current gas law, its
            history, and key contributors.
          </p>
        </div>
      ),
      data: {
        previous: ".collision-counter",
        current: ".info-sheet-button",
        next: ".info-sheet-content",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".info-sheet-content",
      content: (
        <div>
          <h3 className="font-bold text-lg">📘 Detailed Information</h3>
          <p>
            Explore comprehensive details about the gas law, including key
            proponents, scientific principles, and real-world examples.
          </p>
        </div>
      ),
      data: {
        previous: ".info-sheet-button",
        next: ".info-sheet-font-controls",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".info-sheet-font-size-controls",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔠 Font Size Controls</h3>
          <p>Customize your reading experience by adjusting text size:</p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>
              <strong>Decrease Font (-) Button:</strong> Reduce text size for
              more compact reading
            </li>
            <li>
              <strong>Increase Font (+) Button:</strong> Enlarge text for easier
              readability
            </li>
          </ul>
          <div className="mt-2 bg-blue-50 p-2 text-sm rounded-md border border-blue-200">
            💡 Range: 12px to 32px, perfect for personalizing your learning
            experience
          </div>
        </div>
      ),
      data: {
        previous: ".info-sheet-font-controls",
        next: ".info-sheet-expand-control",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".info-sheet-expand-control",
      content: (
        <div>
          <h3 className="font-bold text-lg">📏 Page View Control</h3>
          <p>Optimize your reading space with view controls:</p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>
              <strong>Expand Button:</strong> Maximize the info sheet to
              full-screen view
            </li>
            <li>
              <strong>Minimize Button:</strong> Return to the default compact
              view
            </li>
          </ul>
          <div className="mt-2 bg-yellow-50 p-2 text-sm rounded-md border border-yellow-200">
            💡 Perfect for diving deep into content or quick reference
          </div>
        </div>
      ),
      data: {
        previous: ".info-sheet-font-size-controls",
        next: ".info-sheet-pagination",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".info-sheet-pagination",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔍 Example Navigation</h3>
          <p>Explore additional context and real-world examples:</p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>
              <strong>Previous Button:</strong> Move to the previous example or
              return to main content
            </li>
            <li>
              <strong>Next Button:</strong> Advance to the next example
            </li>
            <li>
              <strong>Slide Indicator:</strong> Shows your current position in
              the examples
            </li>
          </ul>
          <div className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            💡 Helps you understand real-world applications of the gas law
          </div>
        </div>
      ),
      data: {
        previous: ".info-sheet-expand-control",
        current: ".info-sheet-pagination",
        next: ".boyles-simulation",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".problems-slide-button",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧩 Practice Problems</h3>
          <p>
            Challenge yourself with interactive problem-solving exercises for
            gas laws.
          </p>
          <div className="mt-2 bg-blue-50 p-2 text-sm rounded-md border border-blue-200">
            💡 Click to open a collection of problems tailored to the current
            gas law
          </div>
        </div>
      ),
      data: {
        previous: ".info-sheet-pagination",
        current: ".problems-slide-button",
        next: ".problems-slide-expanded",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".problems-slide-expanded",
      content: (
        <div>
          <h3 className="font-bold text-lg">📝 Problem Workspace</h3>
          <p>
            Explore detailed problems that test your understanding of gas laws.
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>Draggable window for flexible positioning</li>
            <li>Problem title and detailed question</li>
            <li>Multiple problems to practice</li>
          </ul>
          <div className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            💡 Each problem helps reinforce your learning of gas law principles
          </div>
        </div>
      ),
      data: {
        previous: ".problems-slide-button",
        next: ".problems-slide-font-controls",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".problems-slide-font-controls",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔠 Problem Font Size Controls</h3>
          <p>Customize your problem-solving experience:</p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>
              <strong>Decrease Font (-) Button:</strong> Reduce text size for
              more compact reading
            </li>
            <li>
              <strong>Increase Font (+) Button:</strong> Enlarge text for easier
              readability
            </li>
          </ul>
          <div className="mt-2 bg-blue-50 p-2 text-sm rounded-md border border-blue-200">
            💡 Adjust text size from 12px to 32px to suit your preference
          </div>
        </div>
      ),
      data: {
        previous: ".problems-slide-expanded",
        next: ".problems-slide-navigation",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".problems-slide-navigation",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧩 Problem Navigation</h3>
          <p>Explore and practice different problem scenarios:</p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>
              <strong>Previous Button:</strong> Move to the previous problem
            </li>
            <li>
              <strong>Next Button:</strong> Advance to the next problem
            </li>
          </ul>
          <div className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            💡 Practice makes perfect! Cycle through multiple problems to
            reinforce your understanding
          </div>
        </div>
      ),
      data: {
        previous: ".problems-slide-font-controls",
        next: ".problems-slide-hint-answer",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".problems-slide-hint-answer",
      content: (
        <div>
          <h3 className="font-bold text-lg">🕵️ Hint and Solution Controls</h3>
          <p>Get help when you need it (but ask for permission 🫢):</p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>
              <strong>Hint Button:</strong> Reveal a helpful hint to guide your
              problem-solving
            </li>
            <li>
              <strong>Answer Button:</strong> Check the complete solution when
              you're ready
            </li>
          </ul>
          <div className="mt-2 bg-yellow-50 p-2 text-sm rounded-md border border-yellow-200">
            💡 Use hints to learn and solutions to verify your understanding
          </div>
        </div>
      ),
      data: {
        previous: ".problems-slide-navigation",
        next: ".boyles-simulation",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".boyles-simulation",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧪 Gas Law Simulation</h3>
          <p>
            Welcome to the interactive gas law simulation! Here you'll explore
            how different parameters affect gas behavior in real-time.
          </p>
          <p className="mt-2 bg-blue-50 p-2 text-sm rounded-md border border-blue-200">
            💡 Each component helps you understand the intricate relationships
            between pressure, volume, temperature, and gas molecules.
          </p>
        </div>
      ),
      data: {
        next: ".simulation-gases",
        current: ".boyles-simulation",
        previous: ".problems-slide-hint-answer",
      },
      disableBeacon: true,
      placement: "center" as Placement,
    },
    {
      target: ".simulation-gas-tanks",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧬 Gas Selection Tanks</h3>
          <p>
            Choose which gases you want to include in your simulation. Each gas
            has unique properties that affect its behavior.
          </p>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>Nitrogen (N₂)</li>
            <li>Carbon Dioxide (CO₂)</li>
            <li>Oxygen (O₂)</li>
          </ul>
          <div className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            💡 Click on each gas icon to select or deselect it in the
            simulation.
          </div>
        </div>
      ),
      data: {
        previous: ".boyles-simulation",
        next: ".simulation-air-pump",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".simulation-air-pump",
      content: (
        <div>
          <h3 className="font-bold text-lg">🔧 Air Pump</h3>
          <p>
            The air pump allows you to manually add or remove gas molecules in
            the system, helping you visualize pressure changes.
          </p>
          <div className="mt-2 bg-blue-50 p-2 text-sm rounded-md border border-blue-200">
            <strong>How to Use:</strong>
            <ul className="list-disc pl-5">
              <li>Drag the pump handle up and down</li>
              <li>Observe how molecule count and pressure change</li>
            </ul>
          </div>
        </div>
      ),
      data: {
        previous: ".simulation-gas-tanks",
        next: ".simulation-barometer",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".simulation-barometer",
      content: (
        <div>
          <h3 className="font-bold text-lg">📊 Barometer Visualization</h3>
          <p>
            The barometer provides a visual representation of the system's
            pressure. The needle moves to show real-time pressure changes.
          </p>
          <div className="mt-2 bg-yellow-50 p-2 text-sm rounded-md border border-yellow-200">
            <strong>Visual Feedback:</strong>
            <p>
              Observe how the barometer needle reflects changes in the system's
              pressure.
            </p>
          </div>
        </div>
      ),
      data: {
        previous: ".simulation-air-pump",
        next: ".simulation-barometer-slider",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".simulation-barometer-slider",
      content: (
        <div>
          <h3 className="font-bold text-lg">🎚️ Pressure Slider</h3>
          <p>
            Directly control the system's pressure using this interactive
            slider.
          </p>
          <div className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            <strong>How to Use:</strong>
            <ul className="list-disc pl-5">
              <li>Drag the slider up or down</li>
              <li>Observe how the pressure changes</li>
              <li>See the corresponding barometer movement</li>
            </ul>
          </div>
        </div>
      ),
      data: {
        previous: ".simulation-barometer",
        next: ".simulation-cylinder",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".simulation-cylinder",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧪 Cylinder</h3>
          <p>
            The main container where gas interactions and transformations occur.
            Visualize how gases behave under different conditions.
          </p>
          <div className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            <strong>Key Features:</strong>
            <ul className="list-disc pl-5">
              <li>Play/Pause molecular motion</li>
              <li>Drag volume control to change container size</li>
              <li>Observe molecular behavior in real-time</li>
            </ul>
          </div>
        </div>
      ),
      data: {
        previous: ".simulation-barometer-slider",
        next: ".simulation-thermometer",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".simulation-thermometer",
      content: (
        <div>
          <h3 className="font-bold text-lg">🌡️ Thermometer Visualization</h3>
          <p>
            The thermometer provides a visual representation of the system's
            temperature. Observe how the temperature changes affect molecular
            behavior.
          </p>
          <div className="mt-2 bg-blue-50 p-2 text-sm rounded-md border border-blue-200">
            <strong>Temperature Insights:</strong>
            <ul className="list-disc pl-5">
              <li>Watch how the thermometer reflects temperature changes</li>
              <li>Observe the impact on molecular motion</li>
            </ul>
          </div>
        </div>
      ),
      data: {
        previous: ".simulation-cylinder",
        next: ".simulation-temperature-slider",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".simulation-temperature-slider",
      content: (
        <div>
          <h3 className="font-bold text-lg">🎚️ Temperature Slider</h3>
          <p>
            Directly control the system's temperature using this interactive
            slider.
          </p>
          <div className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            <strong>How to Use:</strong>
            <ul className="list-disc pl-5">
              <li>Drag the slider left or right</li>
              <li>Observe how the temperature changes</li>
              <li>See the corresponding thermometer movement</li>
              <li>Notice the impact on molecular motion</li>
            </ul>
          </div>
        </div>
      ),
      data: {
        previous: ".simulation-thermometer",
        next: ".simulation-play-pause",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".simulation-play-pause",
      content: (
        <div>
          <h3 className="font-bold text-lg">
            ▶️ Play/Pause Molecular Animation
          </h3>
          <p>Control the molecular motion visualization in the simulation.</p>
          <div className="mt-2 bg-green-50 p-2 text-sm rounded-md border border-green-200">
            <strong>Animation Controls:</strong>
            <ul className="list-disc pl-5">
              <li>
                <strong>Play (▶️):</strong> Start molecular motion animation
              </li>
              <li>
                <strong>Pause (⏸️):</strong> Freeze molecular movement
              </li>
            </ul>
          </div>
          <div className="mt-2 bg-yellow-50 p-2 text-sm rounded-md border border-yellow-200">
            <strong>Pro Tip:</strong>
            <p>
              Use this to observe molecular behavior at different stages of your
              simulation
            </p>
          </div>
        </div>
      ),
      data: {
        previous: ".simulation-temperature-slider",
        next: ".simulation-clear-molecules",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".simulation-clear-molecules",
      content: (
        <div>
          <h3 className="font-bold text-lg">🧹 Clear Molecules</h3>
          <p>
            Use this control to reset the molecular composition of the
            simulation, allowing you to start fresh or remove existing
            molecules.
          </p>
          <div className="mt-2 bg-blue-50 p-2 text-sm rounded-md border border-blue-200">
            <strong>What It Does:</strong>
            <ul className="list-disc pl-5">
              <li>Removes all current molecules from the simulation</li>
              <li>Provides a clean slate for new experiments</li>
              <li>Helps in isolating specific gas law behaviors</li>
            </ul>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            💡 Useful when you want to reset the simulation without changing
            parameters
          </p>
        </div>
      ),
      data: {
        previous: ".simulation-play-pause",
        next: ".boyles-simulation",
      },
      disableBeacon: true,
      placement: "auto" as Placement,
    },
    {
      target: ".boyles-simulation",
      content: (
        <div>
          <h3 className="font-bold text-lg">🎉 Walkthrough Complete!</h3>
          <p>
            Congratulations! You've successfully completed the gas law
            simulation walkthrough. You now have all the knowledge you need to
            explore and experiment!
          </p>

          <div className="mt-3 bg-gradient-to-r from-blue-50 to-green-50 p-3 text-sm rounded-md border border-blue-200">
            <strong>🚀 Ready to Explore:</strong>
            <ul className="list-disc pl-5 mt-2">
              <li>
                <strong>Experiment</strong> with different gas combinations
              </li>
              <li>
                <strong>Adjust</strong> temperature, pressure, and volume
              </li>
              <li>
                <strong>Observe</strong> how molecules behave in real-time
              </li>
              <li>
                <strong>Practice</strong> with the problem sets
              </li>
              <li>
                <strong>Track</strong> your calculations in the history
              </li>
            </ul>
          </div>

          <div className="mt-3 bg-yellow-50 p-3 text-sm rounded-md border border-yellow-200">
            <strong>💡 Pro Tips:</strong>
            <ul className="list-disc pl-5 mt-1">
              <li>Try extreme values to see dramatic changes</li>
              <li>Compare different gas laws side by side</li>
              <li>Use the collision counter to understand pressure</li>
              <li>Don't forget to save interesting calculations!</li>
            </ul>
          </div>

          <div className="mt-3 bg-green-50 p-3 text-sm rounded-md border border-green-200 text-center">
            <strong>🌟 The world of gas laws awaits your discovery!</strong>
            <p className="mt-1 text-xs">
              Click "Finish" to start your journey!
            </p>
          </div>
        </div>
      ),
      data: {
        previous: ".simulation-clear-molecules",
      },
      disableBeacon: true,
      placement: "center" as Placement,
    },
  ];

  return tourSteps;
};
