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

        <h3 className="text-xl font-semibold mt-6">
          Curriculum Alignment
        </h3>
        <p>
          The Pump It! Gas Laws in Action simulation is designed in alignment
          with the K–12 Science Curriculum for Grade 11 Chemistry. By using
          this application, students will be able to achieve the required
          learning competencies through interactive and visual exploration of
          gas laws concepts.
        </p>
        <p>Specifically, by using this app, students will be able to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Define gas pressure and identify its common units</li>
          <li>
            Explain the relationships described in Boyle's Law, Charles's Law,
            Avogadro's Law, Gay-Lussac's Law, and the Combined Gas Law
          </li>
          <li>
            Manipulate variables such as pressure, volume, and temperature to
            observe their effects on gas behavior
          </li>
          <li>
            Apply gas law equations to solve problems involving pressure,
            volume, and temperature
          </li>
          <li>
            Use the Ideal Gas Law to determine the properties and amount of gas
            under given conditions
          </li>
        </ul>
        <p>
          Through these interactive features, the simulation allows students to
          move beyond abstract understanding and develop a deeper conceptual
          and procedural knowledge of gas laws. This ensures that the tool
          supports competency-based learning and is aligned with the standards
          set by the K–12 curriculum.
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
