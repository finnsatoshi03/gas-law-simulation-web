import { InfoSheetProps } from "@/components/InfoSheet";
import { Problem } from "./types";

export const GAS_LAWS = [
  {
    id: "boyle",
    name: "Boyle's Law",
    link: "/boyles",
    contributor: "Robert Boyle",
    year: 1662,
    description:
      "At constant temperature, the volume of a gas is inversely proportional to its pressure.",
    formula: "P₁V₁ = P₂V₂",
    bgColor: "from-purple-900 to-indigo-800",
    image: "boyle.jpg",
  },
  {
    id: "charles",
    name: "Charles's Law",
    link: "/charles",
    contributor: "Jacques Charles",
    year: 1787,
    description:
      "At constant pressure, the volume of a gas is directly proportional to its absolute temperature.",
    formula: "V₁/T₁ = V₂/T₂",
    bgColor: "from-red-900 to-orange-800",
    image: "charles.jpg",
  },
  {
    id: "avogadro",
    name: "Avogadro's Law",
    link: "/avogadros",
    contributor: "Amedeo Avogadro",
    year: 1811,
    description:
      "Equal volumes of gases contain equal numbers of molecules at the same temperature and pressure.",
    formula: "V ∝ n",
    bgColor: "from-green-900 to-teal-800",
    image: "avogadro.jpg",
  },
  {
    id: "gay-lussac",
    name: "Gay-Lussac's Law",
    link: "/lussac",
    contributor: "Joseph Gay-Lussac",
    year: 1808,
    description:
      "At constant volume, the pressure of a gas is directly proportional to its absolute temperature.",
    formula: "P₁/T₁ = P₂/T₂",
    bgColor: "from-blue-900 to-cyan-800",
    image: "lussac.jpg",
  },
  {
    id: "combined",
    name: "Combined Gas Law",
    link: "/combined",
    contributor: "Multiple Scientists",
    year: 1834,
    description:
      "Combines Boyle's, Charles's, and Gay-Lussac's laws relating pressure, volume, and temperature.",
    formula: "P₁V₁/T₁ = P₂V₂/T₂",
    bgColor: "from-yellow-900 to-amber-800",
    image: "combined.jpg",
  },
  {
    id: "ideal",
    name: "Ideal Gas Law",
    link: "/ideal",
    contributor: "Émile Clapeyron",
    year: 1834,
    description:
      "Describes the behavior of a hypothetical ideal gas, combining all the gas laws.",
    formula: "PV = nRT",
    bgColor: "from-violet-900 to-fuchsia-800",
    image: "emile.jpg",
  },
];

export const GAS_CONSTANTS = {
  atm: { value: "0.0821", unit: "L⋅atm/mol⋅K" },
  kPa: { value: "8.314", unit: "L⋅kPa/mol⋅K" },
  mmHg: { value: "62.364", unit: "L⋅mmHg/mol⋅K" },
  torr: { value: "62.364", unit: "L⋅torr/mol⋅K" },
  pascal: { value: "8314", unit: "L⋅Pa/mol⋅K" },
  bar: { value: "0.083145", unit: "L⋅bar/mol⋅K" },
};

export const SAMPLE_PROBLEMS: Problem[] = [
  {
    id: "b1",
    type: "boyles",
    title: "Pressure and Volume Relationship",
    question:
      "A gas occupies 2.0 L at 1.0 atm. What will be its volume when the pressure is increased to 2.0 atm at constant temperature?",
    hint: "Use P₁V₁ = P₂V₂",
    solution: "1.0 L",
  },
  {
    id: "b2",
    type: "boyles",
    title: "Compressed Gas Container",
    question:
      "A gas has a volume of 4.0 L at 3.0 atm. What pressure will it exert if the volume is decreased to 2.0 L at constant temperature?",
    hint: "Apply Boyle's Law: P₁V₁ = P₂V₂",
    solution: "6.0 atm",
  },
  {
    id: "b3",
    type: "boyles",
    title: "Expanding Gas",
    question:
      "A gas at 5.0 L and 2.0 atm expands to 10.0 L. What is the final pressure?",
    hint: "P₁V₁ = P₂V₂",
    solution: "1.0 atm",
  },
  {
    id: "b4",
    type: "boyles",
    title: "Scuba Tank Pressure",
    question:
      "A scuba tank contains gas at 8.0 atm in 3.0 L. If the gas expands to 6.0 L, what is the new pressure?",
    hint: "Use Boyle’s Law",
    solution: "4.0 atm",
  },
  {
    id: "b5",
    type: "boyles",
    title: "Gas Compression",
    question:
      "A gas at 10.0 L and 1.5 atm is compressed to 5.0 L. What is the new pressure?",
    hint: "P₁V₁ = P₂V₂",
    solution: "3.0 atm",
  },
  {
    id: "b6",
    type: "boyles",
    title: "Balloon Expansion",
    question:
      "A balloon with 3.0 L of gas at 2.0 atm expands to 6.0 L. What is the new pressure?",
    hint: "Use Boyle’s Law",
    solution: "1.0 atm",
  },
  {
    id: "b7",
    type: "boyles",
    title: "Gas Cylinder",
    question:
      "A gas at 7.0 atm in a 2.0 L cylinder expands to 4.0 L. Find the new pressure.",
    hint: "P₁V₁ = P₂V₂",
    solution: "3.5 atm",
  },
  {
    id: "b8",
    type: "boyles",
    title: "Compression in a Syringe",
    question:
      "A gas sample at 5.0 L and 3.0 atm is compressed to 2.5 L. Find the final pressure.",
    hint: "Use Boyle’s Law",
    solution: "6.0 atm",
  },
  {
    id: "b9",
    type: "boyles",
    title: "Underwater Pressure",
    question:
      "A diver's air volume is 1.2 L at 1 atm. What is the volume at 3 atm?",
    hint: "P₁V₁ = P₂V₂",
    solution: "0.4 L",
  },
  {
    id: "b10",
    type: "boyles",
    title: "Pressure Change in a Gas Tank",
    question:
      "A gas tank holds 50 L at 5 atm. If the volume decreases to 25 L, what is the new pressure?",
    hint: "Use Boyle’s Law",
    solution: "10 atm",
  },

  // Charles's Law Problems (10)
  {
    id: "c1",
    type: "charles",
    title: "Temperature and Volume Relationship",
    question:
      "A gas has a volume of 1.0 L at 273 K. Calculate its volume at 546 K if the pressure remains constant.",
    hint: "Use V₁/T₁ = V₂/T₂",
    solution: "2.0 L",
  },
  {
    id: "c2",
    type: "charles",
    title: "Cooling Effect on Volume",
    question:
      "A balloon contains 2.5 L of gas at 300 K. What will be its volume when cooled to 250 K?",
    hint: "Apply Charles's Law: V₁/T₁ = V₂/T₂",
    solution: "2.08 L",
  },
  {
    id: "c3",
    type: "charles",
    title: "Heating a Gas",
    question:
      "A gas at 3.0 L and 400 K is heated to 800 K. What is the new volume?",
    hint: "V₁/T₁ = V₂/T₂",
    solution: "6.0 L",
  },
  {
    id: "c4",
    type: "charles",
    title: "Balloon Expansion",
    question:
      "A 5.0 L gas sample at 250 K is heated to 500 K. Find the new volume.",
    hint: "Use Charles’s Law",
    solution: "10.0 L",
  },
  {
    id: "c5",
    type: "charles",
    title: "Volume Change with Cooling",
    question:
      "A 10.0 L gas sample at 600 K is cooled to 300 K. Find the new volume.",
    hint: "V₁/T₁ = V₂/T₂",
    solution: "5.0 L",
  },
  {
    id: "c6",
    type: "charles",
    title: "Gas Expansion",
    question:
      "A 2.0 L gas at 200 K is heated to 400 K. What is the new volume?",
    hint: "Use Charles’s Law",
    solution: "4.0 L",
  },
  {
    id: "c7",
    type: "charles",
    title: "Cooling and Shrinking",
    question:
      "A gas at 4.0 L and 350 K is cooled to 175 K. What is the final volume?",
    hint: "V₁/T₁ = V₂/T₂",
    solution: "2.0 L",
  },
  {
    id: "c8",
    type: "charles",
    title: "Weather Balloon Expansion",
    question:
      "A balloon at 3.0 L and 270 K expands to 6.0 L. Find the new temperature.",
    hint: "Use Charles’s Law",
    solution: "540 K",
  },
  {
    id: "c9",
    type: "charles",
    title: "Thermal Expansion of Gas",
    question:
      "A 1.5 L gas sample at 300 K expands to 3.0 L. Find the final temperature.",
    hint: "V₁/T₁ = V₂/T₂",
    solution: "600 K",
  },
  {
    id: "c10",
    type: "charles",
    title: "Refrigeration Effect",
    question:
      "A 2.5 L gas sample at 350 K shrinks to 1.25 L. Find the final temperature.",
    hint: "Use Charles’s Law",
    solution: "175 K",
  },

  // Combined Gas Law Problems (10)
  {
    id: "cg1",
    type: "combined",
    title: "Multiple Variable Changes",
    question:
      "A gas has an initial volume of 3.0 L at 2.0 atm and 300 K. What is its final volume at 1.0 atm and 450 K?",
    hint: "Use (P₁V₁)/T₁ = (P₂V₂)/T₂",
    solution: "9.0 L",
  },
  {
    id: "cg2",
    type: "combined",
    title: "Expanding Gas with Pressure Change",
    question:
      "A gas initially at 5.0 L, 3.0 atm, and 350 K expands to 7.5 L and 400 K. What is the final pressure?",
    hint: "Use Combined Gas Law",
    solution: "2.8 atm",
  },
  {
    id: "cg3",
    type: "combined",
    title: "Shrinking Volume with Temperature Change",
    question:
      "A gas at 8.0 L, 2.0 atm, and 500 K cools to 250 K and is compressed to 4.0 L. Find the new pressure.",
    hint: "Use Combined Gas Law",
    solution: "4.0 atm",
  },
  {
    id: "cg4",
    type: "combined",
    title: "Pressure Change in a Cylinder",
    question:
      "A gas at 10.0 L, 4.0 atm, and 600 K is cooled to 300 K and expands to 20.0 L. Find the final pressure.",
    hint: "Use Combined Gas Law",
    solution: "2.0 atm",
  },
  {
    id: "cg5",
    type: "combined",
    title: "Compressed Air in a Tank",
    question:
      "A gas at 3.0 atm, 15.0 L, and 450 K is compressed to 7.5 L and heated to 900 K. Find the new pressure.",
    hint: "Use Combined Gas Law",
    solution: "12.0 atm",
  },

  // Ideal Gas Law Problems (10)
  {
    id: "i1",
    type: "ideal",
    title: "Ideal Gas Equation",
    question:
      "Calculate the pressure of 2.0 moles of an ideal gas in a 10.0 L container at 300 K. (R = 0.0821 L⋅atm/mol⋅K)",
    hint: "Use PV = nRT",
    solution: "4.93 atm",
  },
  {
    id: "i2",
    type: "ideal",
    title: "Finding Volume",
    question:
      "What is the volume of 1.5 moles of an ideal gas at 2.0 atm and 350 K?",
    hint: "Use Ideal Gas Law",
    solution: "21.52 L",
  },
  {
    id: "i3",
    type: "ideal",
    title: "Temperature Determination",
    question:
      "A gas occupies 10.0 L at 1.5 atm with 0.5 moles. Find its temperature.",
    hint: "Use PV = nRT",
    solution: "366 K",
  },
  {
    id: "i4",
    type: "ideal",
    title: "Gas Density Calculation",
    question:
      "Find the density of a gas with a molar mass of 44 g/mol at 2.0 atm and 300 K in a 5.0 L container.",
    hint: "Use Ideal Gas Law",
    solution: "7.28 g/L",
  },

  // Gay-Lussac's Law Problems (10)
  {
    id: "g1",
    type: "gay-lussac",
    title: "Pressure-Temperature Relationship",
    question:
      "A gas exerts 2.0 atm pressure at 300 K. What will be its pressure at 400 K if the volume remains constant?",
    hint: "Use P₁/T₁ = P₂/T₂",
    solution: "2.67 atm",
  },
  {
    id: "g2",
    type: "gay-lussac",
    title: "Cooling Effect on Pressure",
    question:
      "A gas at 4.0 atm and 500 K cools to 250 K. Find the new pressure.",
    hint: "Use Gay-Lussac’s Law",
    solution: "2.0 atm",
  },
  {
    id: "g3",
    type: "gay-lussac",
    title: "Heating Gas at Constant Volume",
    question:
      "A gas at 1.5 atm and 350 K is heated to 700 K. Find the final pressure.",
    hint: "Use P₁/T₁ = P₂/T₂",
    solution: "3.0 atm",
  },
  {
    id: "g4",
    type: "gay-lussac",
    title: "Oven Heating Effect",
    question:
      "A sealed gas at 5.0 atm and 320 K is heated to 640 K. Find the final pressure.",
    hint: "Use Gay-Lussac’s Law",
    solution: "10.0 atm",
  },

  // Avogadro's Law Problems (10)
  {
    id: "a1",
    type: "avogadros",
    title: "Volume-Moles Relationship",
    question:
      "If 2.0 moles of gas occupy 5.0 L, what volume will 4.0 moles occupy under the same conditions?",
    hint: "Use V₁/n₁ = V₂/n₂",
    solution: "10.0 L",
  },
  {
    id: "a2",
    type: "avogadros",
    title: "Doubling Moles",
    question:
      "A gas at 3.0 L and 1.5 moles increases to 3.0 moles. Find the final volume.",
    hint: "Use Avogadro’s Law",
    solution: "6.0 L",
  },
  {
    id: "a3",
    type: "avogadros",
    title: "Moles Reduction",
    question:
      "A gas at 8.0 L and 4.0 moles is reduced to 2.0 moles. Find the new volume.",
    hint: "Use Avogadro’s Law",
    solution: "4.0 L",
  },
  {
    id: "a4",
    type: "avogadros",
    title: "Expanding Gas Sample",
    question:
      "A gas at 7.0 L with 2.5 moles expands to 5.0 moles. Find the new volume.",
    hint: "Use Avogadro’s Law",
    solution: "14.0 L",
  },
  {
    id: "a5",
    type: "avogadros",
    title: "Reduction in Gas Moles",
    question:
      "A gas at 12.0 L and 6.0 moles decreases to 3.0 moles. Find the new volume.",
    hint: "Use Avogadro’s Law",
    solution: "6.0 L",
  },
];

export const BOYLES_LAW_INFO: InfoSheetProps = {
  title: "Boyle's Law",
  subtitle: "Gas Property",
  proponents: [
    {
      name: "Robert Boyle",
      birthYear: 1627,
      deathYear: 1691,
      description:
        "Robert Boyle was an Anglo-Irish natural philosopher, chemist, physicist, and inventor. He is largely regarded today as the first modern chemist, and therefore one of the founders of modern chemistry, and one of the pioneers of modern experimental scientific method.",
      image: "boyle.jpg",
    },
  ],
  sections: [
    {
      title: "Description",
      type: "paragraph",
      content:
        'Boyle\'s Law states that "the pressure and volume of a gas are inversely proportional when temperature and the amount of gas remain constant". Mathematically, it is expressed as:',
    },
    { type: "formula", content: "{P_1 V_1} = {P_2 V_2}" },
    { type: "paragraph", content: "Where:" },
    {
      type: "list",
      content: [
        "P₁ and P₂ are the initial and final pressures, respectively,",
        "V₁​ and V₂ are the initial and final volumes, respectively.",
      ],
    },
    { type: "paragraph", content: "Relationship:" },
    {
      type: "list",
      content: [
        "As pressure increases, the volume decreases.",
        "As pressure decreases, the volume increases.",
      ],
    },
    {
      type: "paragraph",
      content:
        "This inverse relationship means that when you compress a gas (increase pressure), it takes up less space (lower volume), and when you expand it (decrease pressure), it takes up more space (higher volume).",
    },
  ],
  examples: [
    {
      title: "Syringes",
      description: [
        "When you pull the plunger, volume (V) increases, and pressure (P) decreases, allowing liquid or air to enter. Pushing the plunger decreases volume and increases pressure, forcing liquid out.",
      ],
      images: ["syringe-gif.gif", "syringe-pressure-change.webp"],
    },
    {
      title: "Scuba Diving",
      description: [
        "As a diver goes deeper, water pressure (P) increases, compressing the air in their lungs (decreasing volume, V). When ascending, pressure decreases, allowing the lungs to expand.",
      ],
      images: ["breathing.gif", "scuba-diver.gif", "air-tank.jpg"],
    },
    {
      title: "Balloon in a Vacuum Chamber",
      description: [
        "If a balloon is placed in a vacuum chamber and air is removed, external pressure (P) decreases. To balance this, the gas inside the balloon expands, increasing its volume (V).",
      ],
      images: ["balloon-in-chamber.gif", "balloon-in-chamber.jpg"],
    },
    {
      title: "Compressed Gas Cylinders",
      description: [
        "Gases are stored in high-pressure (P) tanks, such as LPG or oxygen tanks. When the gas is released, pressure decreases, allowing the gas to expand in volume (V).",
      ],
      images: ["air-tank.jpg", "compressed-air-tank.webp"],
    },
  ],
};

export const CHARLES_LAW_INFO: InfoSheetProps = {
  title: "Charles's Law",
  subtitle: "Gas Property",
  proponents: [
    {
      name: "Jacques Charles",
      birthYear: 1746,
      deathYear: 1823,
      description:
        "French physicist and inventor who discovered the direct relationship between temperature and volume of gases.",
      image: "charles.jpg",
    },
  ],
  sections: [
    {
      title: "Description",
      type: "paragraph",
      content:
        'Charles\'s Law states that "the volume of a gas is directly proportional to its absolute temperature when pressure and the amount of gas remain constant." Mathematically, it is expressed as:',
    },
    {
      type: "formula",
      content: "\\frac{V_1}{T_1} = \\frac{V_2}{T_2}",
    },
    {
      //   title: "Description",
      type: "paragraph",
      content: "Where:",
    },

    {
      type: "list",
      content: [
        "V₁​ and V₂ are the initial and final volumes, respectively,",
        "T₁ and T₂ are the initial and final absolute temperatures (in Kelvin), respectively.",
      ],
    },
    {
      type: "paragraph",
      content: "Relationship:",
    },
    {
      type: "list",
      content: [
        "As temperature increases, the volume increases.",
        "As temperature decreases, the volume decreases.",
      ],
    },
    {
      type: "paragraph",
      content:
        "This direct relationship means that when a gas is heated(increase in temperature), its volume expands, and when it is cooled (decrease in temperature) , its volume contracts, assuming pressure remains constant.",
    },
  ],
  examples: [
    {
      title: "Hot Air Balloons",
      description: [
        "Heating the air inside the balloon increases its temperature (T), causing the gas to expand and volume (V) to increase, making the balloon rise. Cooling the air reduces the volume, causing descent.",
      ],
      images: [
        "hot-air-balloon-inflation.gif",
        "hot-air-balloon-rising.jpg",
        "balloon-heating-process.jpg",
      ],
    },
    {
      title: "Basketball in Cold Weather",
      description: [
        "A fully inflated basketball left outside in cold weather shrinks because as temperature (T) decreases, the gas inside contracts, reducing its volume (V).",
      ],
      images: ["basketball-cold.jpeg", "basketball-play.gif"],
    },
    {
      title: "Car Tires in Summer and Winter",
      description: [
        "In summer, the air inside car tires gets hotter as the temperature rises, causing the air to expand and slightly increase the tire's volume. In winter, the opposite happens—the cooler temperatures reduce the air's volume, making the tires appear underinflated.",
      ],
      images: ["summer-tire-temperature.jpg", "winter-tire-pressure.gif"],
    },
    {
      title: "Baking Bread",
      description: [
        "When baking, heat increases the temperature (T) of gases inside the dough, causing them to expand and increase in volume (V), making the bread rise.",
      ],
      images: ["baking-bread.webp", "baking-bread.gif"],
    },
  ],
};

export const COMBINED_LAW_INFO: InfoSheetProps = {
  title: "Combined Gas Law",
  subtitle: "Gas Property",
  proponents: [
    {
      name: "Robert Boyle",
      birthYear: 1627,
      deathYear: 1691,
      description:
        "Irish natural philosopher known for Boyle's Law, describing the inverse relationship between pressure and volume.",
      image: "boyle.jpg",
    },
    {
      name: "Jacques Charles",
      birthYear: 1746,
      deathYear: 1823,
      description:
        "French physicist who formulated Charles's Law, demonstrating the direct relationship between temperature and volume.",
      image: "charles.jpg",
    },
    {
      name: "Joseph Louis Gay-Lussac",
      birthYear: 1778,
      deathYear: 1850,
      description:
        "French chemist who established Gay-Lussac's Law, linking gas pressure and temperature.",
      image: "lussac.jpg",
    },
  ],
  sections: [
    {
      title: "Description",
      type: "paragraph",
      content:
        "Combined Gas Law states that \"the pressure, volume, and absolute temperature of a gas are related, combining Boyle's, Charles's, and Gay-Lussac's Laws.\" Mathematically, it is expressed as:",
    },
    {
      type: "formula",
      content: "\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}",
    },
    {
      //   title: "Description",
      type: "paragraph",
      content: "Where:",
    },

    {
      type: "list",
      content: [
        "P₁​ and P₂ are the initial and final pressures, respectively,",
        "V₁​ and V₂ are the initial and final volumes, respectively,",
        "T₁ and T₂ are the initial and final absolute temperatures (in Kelvin), respectively.",
      ],
    },
    {
      type: "paragraph",
      content: "Relationship:",
    },
    {
      type: "list",
      content: [
        "If temperature increases while pressure remains constant, volume increases.",
        "If pressure increases while temperature remains constant, volume decreases.",
        "If temperature increases while volume remains constant, pressure increases.",
      ],
    },
    {
      type: "paragraph",
      content:
        "This equation allows for calculations when multiple gas variables change simultaneously.",
    },
  ],
  examples: [
    {
      title: "Weather Balloons",
      description: [
        "As a weather balloon rises, external pressure (P) decreases, and temperature (T) drops. To compensate, the volume (V) of the balloon expands until it eventually bursts, following the Combined Gas Law.",
      ],
      images: [
        "weather-balloon-launch.png",
        "atmospheric-pressure-diagram.png",
        "high-altitude-balloon.jpg",
      ],
    },
    {
      title: "Airplane Cabin Pressure",
      description: [
        "At high altitudes, both air pressure (P) and temperature (T) decrease. To ensure passenger safety, airplane cabins are pressurized by adjusting the air’s volume (V) and temperature (T) to maintain stable conditions.",
      ],
      images: [
        "airplane-altitude-diagram.jpg",
        "cabin-pressure-control.png",
        "airplane-in-flight.gif",
      ],
    },
    {
      title: "Car Engine Combustion",
      description: [
        "Inside an engine cylinder, fuel is compressed (decreasing volume, V), then ignited, causing a rapid increase in temperature (T) and pressure (P). This gas expansion powers the engine.",
      ],
      images: [
        "car-engine-cross-section.jpg",
        "combustion-process-diagram.jpg",
        "piston-movement.gif",
      ],
    },
    {
      title: "Compressed Gas Tanks (Scuba Diving, Oxygen Tanks)",
      description: [
        "If a gas tank is left in the sun, temperature (T) increases, causing pressure (P) to rise. Without regulation, excessive pressure buildup could make the tank dangerous.",
      ],
      images: ["compressed-air-tank.webp", "air-tank.jpg"],
    },
  ],
};

export const AVOGADROS_LAW_INFO: InfoSheetProps = {
  title: "Avogadro’s Law",
  subtitle: "Gas Property",
  proponents: [
    {
      name: "Amedeo Avogadro",
      birthYear: 1776,
      deathYear: 1856,
      description:
        "Italian scientist who proposed that equal volumes of gases at the same temperature and pressure contain equal numbers of molecules.",
      image: "avogadro.jpg",
    },
  ],
  sections: [
    {
      title: "Description",
      type: "paragraph",
      content:
        'Avogadro\'s Law states that "the volume of a gas is directly proportional to the number of moles of gas when pressure and temperature remain constant." Mathematically, it is expressed as:',
    },
    {
      type: "formula",
      content: "\\frac{V_1}{n_1} = \\frac{V_2}{n_2}",
    },
    { type: "paragraph", content: "Where:" },
    {
      type: "list",
      content: [
        "V₁​ and V₂ are the initial and final volumes, respectively,",
        "n₁ and n₂ are the initial and final number of moles, respectively.",
      ],
    },
    {
      type: "paragraph",
      content: "Relationship:",
    },
    {
      type: "list",
      content: [
        "As the number of moles increases, the volume increases.",
        "As the number of moles decreases, the volume decreases.",
      ],
    },
    {
      type: "paragraph",
      content:
        "This direct relationship means that adding more gas molecules to a container increases its volume, while removing gas molecules decreases the volume, assuming pressure and temperature remain constant.",
    },
  ],
  examples: [
    {
      title: "Inflating Balloons",
      description: [
        "The more air (gas molecules, n) you add, the larger the balloon's volume (V) becomes. Removing air decreases its size, following Avogadro’s Law.",
      ],
      images: [
        "balloon-inflation-process.gif",
        "balloon-science.gif",
        "multiple-inflated-balloons.jpg",
      ],
    },
    {
      title: "Lung Expansion",
      description: [
        "When you inhale, more gas molecules (n) enter your lungs, increasing their volume (V). Exhaling decreases the number of gas molecules, reducing lung volume.",
      ],
      images: ["lung-breathing-diagram.png", "breathing.gif"],
    },
    {
      title: "Tire Inflation",
      description: [
        "Adding more gas molecules (n) into a tire increases its volume (V). Releasing air reduces the number of molecules, causing the tire to shrink.",
      ],
      images: [
        "pressure-gauge-tire.jpg",
        "tire-inflation.gif",
        "tire-air-volume-demonstration.gif",
      ],
    },
    {
      title: "Blowing Bubbles",
      description: [
        "When you shake a soda bottle, gas is released from the liquid into the space above it. As the amount of gas molecules increases, the pressure builds, and the volume of the gas increases, which is why the bottle feels harder to squeeze.",
      ],
      images: ["blowing-bubbles.jpeg", "blowing-bubbles.gif"],
    },
  ],
};

export const LUSSAC_LAW_INFO: InfoSheetProps = {
  title: "Gay-Lussac’s Law",
  subtitle: "Gas Property",
  proponents: [
    {
      name: "Joseph Louis Gay-Lussac",
      birthYear: 1778,
      deathYear: 1850,
      description:
        "French chemist and physicist who formulated the law relating gas pressure and temperature.",
      image: "lussac.jpg",
    },
  ],
  sections: [
    {
      title: "Description",
      type: "paragraph",
      content:
        'Gay-Lussac\'s Law states that "the pressure of a gas is directly proportional to its absolute temperature when volume and the amount of gas remain constant ". Mathematically, it is expressed as:',
    },
    {
      type: "formula",
      content: "\\frac{P_1}{T_1} = \\frac{P_2}{T_2}",
    },
    {
      //   title: "Description",
      type: "paragraph",
      content: "Where",
    },
    {
      type: "list",
      content: [
        "P₁ and P₂ are the initial and final pressures, respectively,",
        "T₁ and T₂ are the initial and final absolute temperatures (in Kelvin), respectively.",
      ],
    },
    { type: "paragraph", content: "Relationship:" },
    {
      type: "list",
      content: [
        "As temperature increases, pressure increases.,",
        "As temperature decreases, pressure decreases.",
      ],
    },
    {
      type: "paragraph",
      content:
        "This direct relationship means that when a gas is heated (increase in temperature), its particles move faster, exerting more pressure on the container, and when cooled (decrease in temperature), the pressure decreases.",
    },
  ],
  examples: [
    {
      title: "Aerosol Cans",
      description: [
        "Heating an aerosol can increases the temperature (T), which raises the pressure (P) inside. If overheated, the pressure becomes too high, causing the can to explode.",
      ],
      images: ["aerosol-can-in-heat.webp", "pressure-warning-on-can.jpg"],
    },
    {
      title: "Pressure Cookers",
      description: [
        "As the temperature (T) inside a pressure cooker rises, the gas pressure (P) increases. This high pressure allows food to cook faster.",
      ],
      images: ["pressure-cooker-cooking.gif", "pressure-gauge-cooking.jpg"],
    },

    {
      title: "Car Tires on a Hot Day",
      description: [
        "On extremely hot days, the air inside tires heats up, increasing temperature (T) and raising pressure (P). If the pressure gets too high, the tire may burst.",
      ],
      images: [
        "summer-tire-temperature.jpg",
        "pressure-gauge-tire.jpg",
        "winter-tire-pressure.gif",
      ],
    },
    {
      title: "Gunpowder in Firearms",
      description: [
        "When gunpowder ignites, the high temperature (T) causes gases to rapidly expand, increasing pressure (P) and generating enough force to fire the bullet.",
      ],
      images: [
        "bullet-cartridge-cross-section.webp",
        "gunpowder-explosion.gif",
        "bullet-firing-mechanism.gif",
      ],
    },
  ],
};

export const IDEAL_LAW_INFO: InfoSheetProps = {
  title: "Ideal Gas Law",
  subtitle: "Gas Property",
  proponents: [
    {
      name: "Emile Clapeyron",
      birthYear: 1799,
      deathYear: 1864,
      description:
        "French engineer and physicist who formulated the Ideal Gas Law by combining earlier gas laws into a single equation.",
      image: "emile.jpg",
      contribution:
        "Developed the equation PV = nRT, combining Boyle's, Charles's, and Avogadro's laws into the Ideal Gas Law.",
    },
  ],
  sections: [
    {
      title: "Description",
      type: "paragraph",
      content:
        'Ideal Gas Law states that "the relationship among pressure, volume, temperature, and the number of moles of a gas can be described using a single equation."  Mathematically, it is expressed as:',
    },
    {
      type: "formula",
      content: "{PV} = {nRT}",
    },
    {
      //   title: "Description",
      type: "paragraph",
      content: "Where:",
    },

    {
      type: "list",
      content: [
        "P= pressure (in atm, kPa, or other units),",
        "V= volume (in liters),",
        "n = number of moles of gas,",
        "R= universal gas constant (0.0821 L·atm/mol·K),",
        "T= absolute temperature (in Kelvin).",
      ],
    },
    {
      type: "paragraph",
      content: "Relationship:",
    },
    {
      type: "list",
      content: [
        "Increasing temperature increases pressure and volume if other factors remain constant.",
        "Increasing the number of moles increases pressure and volume.",
        "Decreasing volume increases pressure if temperature and moles remain constant.",
      ],
    },
    {
      type: "paragraph",
      content:
        "This equation describes the behavior of an ideal gas and is used to calculate any unknown variable when the others are known.",
    },
  ],
  examples: [
    {
      title: "Airbags in Cars",
      description: [
        "When a car crashes, a chemical reaction inside the airbag generates nitrogen gas. The rapid increase in gas molecules (n) causes the airbag to expand (V) instantly, following the Ideal Gas Law.",
      ],
      images: [
        "car-airbag-deployment.gif",
        "airbag-inflation-process.png",
        "airbag-cross-section.png",
      ],
    },
    {
      title: "Diving and Scuba Tanks",
      description: [
        "Scuba tanks store air at high pressure (P) and low volume (V). As a diver goes deeper, external pressure increases, affecting the gas inside the tank. The amount of air needed at different depths is calculated using the Ideal Gas Law.",
      ],
      images: ["air-tank.jpg", "compressed-air-tank.webp"],
    },
    {
      title: "Breathing and Respiration",
      description: [
        "When you inhale, your lung volume (V) increases, causing pressure inside to drop, allowing air to flow in. The relationship between gas amount (n), temperature (T), and pressure (P) follows the Ideal Gas Law during breathing.",
      ],
      images: ["breathing.gif", "chest-expansion-during-breath.jpg"],
    },
    {
      title: "Helium Balloons",
      description: [
        "A helium balloon expands when temperature (T) increases because volume (V) increases while pressure remains constant. On a cold day, the balloon shrinks due to lower temperatures.",
      ],
      images: ["helium-balloon-filling.jpg", "multiple-inflated-balloons.jpg"],
    },
  ],
};
