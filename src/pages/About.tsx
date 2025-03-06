export default function About() {
  return (
    <div className="pt-4">
      <div className="space-y-4">
        <p>
          Welcome to the Gas Law Simulator, an interactive educational tool
          designed to help students and educators explore the fundamental
          principles of gas laws in chemistry and physics.
        </p>

        <h3 className="text-xl font-semibold mt-6">Features</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            Real-time visualization of gas molecule behavior under different
            conditions of pressure, volume, and temperature
          </li>
          <li>
            Customizable simulation parameters to explore various scenarios and
            experimental conditions
          </li>
          <li>
            Interactive controls for adjusting container size, pressure, and
            molecule properties
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6">How to Use</h3>
        <p>
          Use the settings tab to customize your simulation parameters. Adjust
          the container size, pressure range, and molecule properties to create
          different experimental conditions. The simulation will automatically
          update to reflect your changes.
        </p>

        <h3 className="text-xl font-semibold mt-6">About the Owner</h3>
        <div>
          <p className="font-bold">Romaric Bucayu</p>
          <p className="opacity-60 text-sm">Licensed Science Teacher</p>
          <p className="opacity-60 text-sm font-semibold">(09)97-983-4965</p>
        </div>
      </div>
    </div>
  );
}
