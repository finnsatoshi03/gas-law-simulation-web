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
        "Boyle's Law explains the relationship between the pressure and volume of a gas when the temperature is kept constant. It states that:",
    },
    {
      //   title: "Description",
      type: "paragraph",
      content:
        '"The pressure of a gas is inversely proportional to its volume, provided the temperature and the amount of gas remain unchanged."',
    },
    { type: "paragraph", content: "It means:" },
    {
      type: "list",
      content: [
        "If you squeeze a gas (decreasing its volume), its pressure increases.",
        "If you let the gas expand (increasing its volume), its pressure decreases.",
      ],
    },
  ],
  examples: [
    {
      title: "Syringes",
      description: [
        "When you pull back the plunger of a syringe, the volume inside increases, causing the pressure to drop. This creates a vacuum that draws liquid or air into the syringe. When you push the plunger, the volume decreases, increasing the pressure and forcing the liquid or air out.",
      ],
      images: ["syringe-gif.gif", "syringe-pressure-change.webp"],
    },
    {
      title: "Scuba Diving",
      description: [
        "Underwater, the pressure around a scuba diver increases as they go deeper. This compresses the air in their lungs and tank, reducing its volume. Divers must be cautious during ascent; if they rise too quickly without releasing the air, the expanding air (due to decreasing pressure) can damage their lungs",
      ],
      images: ["breathing.gif", "scuba-diver.gif", "air-tank.jpg"],
    },
    {
      title: "Balloon Compression",
      description: [
        "When you squeeze a balloon, the air inside is forced into a smaller space, reducing its volume. As a result, the pressure inside the balloon increases, making it harder to compress further. If squeezed too much, the pressure gets so high that the balloon pops.",
      ],
      images: ["balloon-science.gif", "balloon-compression.gif"],
    },
    {
      title: "Vacuum-Sealed Bags",
      description: [
        "In food preservation, vacuum-sealed bags remove air from the packaging. When the air is sucked out, the pressure inside the bag decreases. The reduced pressure compresses the bag tightly around the food, keeping it fresh by minimizing exposure to oxygen and bacteria.",
      ],
      images: ["vacuum-sealing-machine.webp", "vacuum-sealed-food.gif"],
    },
    {
      title: "Air in a Tire",
      description: [
        "When you inflate a bicycle or car tire, you're increasing the amount of air inside, reducing its available volume. As the volume decreases, the pressure inside the tire rises, allowing it to support the weight of the vehicle. Overinflating increases pressure too much, which can cause a blowout.",
      ],
      images: ["tire-inflation.gif", "pressure-gauge-tire.jpg"],
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
        "Charles's Law explains the relationship between the volume and temperature of a gas when the pressure is kept constant. It states:",
    },
    {
      //   title: "Description",
      type: "paragraph",
      content:
        '"The volume of a gas is directly proportional to its temperature, provided the pressure and the amount of gas remain unchanged."',
    },
    { type: "paragraph", content: "It means:" },
    {
      type: "list",
      content: [
        "If you heat a gas, it expands (its volume increases).",
        "If you cool a gas, it shrinks (its volume decreases).",
      ],
    },
  ],
  examples: [
    {
      title: "Hot Air Balloons",
      description: [
        "When the air inside a hot air balloon is heated, its temperature rises, causing the air to expand and become less dense than the cooler air outside. This allows the balloon to rise. When the air is cooled, the volume decreases, and the balloon descends.",
      ],
      images: [
        "hot-air-balloon-inflation.gif",
        "hot-air-balloon-rising.jpg",
        "balloon-heating-process.jpg",
      ],
    },
    {
      title: "Deflated Balloons in Cold Weather",
      description: [
        "Have you ever noticed that a fully inflated balloon looks deflated on a cold day? As the temperature drops, the air inside the balloon cools, reducing its volume and making the balloon appear smaller.",
      ],
      images: ["cold-weather-balloon.webp", "weather-balloon-launch.png"],
    },
    {
      title: "Cooking with a Pressure Cooker Lid Off",
      description: [
        "If you heat a pot of food with the lid off, the steam above the liquid expands as it heats, taking up more volume. This demonstrates how heating a gas increases its volume, as per Charles's Law.",
      ],
      images: ["steam-rising-from-pot.webp", "pressure-cooker-cooking.gif"],
    },
    {
      title: "Car Tires in Summer and Winter",
      description: [
        "In summer, the air inside car tires gets hotter as the temperature rises, causing the air to expand and slightly increase the tire's volume. In winter, the opposite happens—the cooler temperatures reduce the air's volume, making the tires appear underinflated.",
      ],
      images: ["summer-tire-temperature.jpg", "winter-tire-pressure.gif"],
    },
    {
      title: "Popping Popcorn",
      description: [
        "When popcorn kernels are heated, the water inside them turns to steam. As the temperature rises, the steam expands rapidly, increasing in volume until the kernel bursts open, forming popcorn.",
      ],
      images: ["popcorn-kernel-heating.gif", "popping-popcorn-close-up.gif"],
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
        "The Combined Gas Law brings together Boyle's Law, Charles's Law, and Gay-Lussac's Law to show the relationship between pressure (P), volume (V), and temperature (T) of a gas when the amount of gas is constant.",
    },
    {
      //   title: "Description",
      type: "paragraph",
      content: "It states:",
    },
    {
      type: "paragraph",
      content:
        '"The pressure, volume, and temperature of a gas are related such that the ratio P⋅V/T remains constant."',
    },
  ],
  examples: [
    {
      title: "Weather Balloons",
      description: [
        "Weather balloons are filled with gas at the ground level. As they rise into the atmosphere, the pressure around them decreases, causing the balloon to expand (increase in volume). Additionally, the temperature outside drops as the balloon ascends, affecting its volume further.",
      ],
      images: [
        "weather-balloon-launch.png",
        "atmospheric-pressure-diagram.png",
        "high-altitude-balloon.jpg",
      ],
    },
    {
      title: "Compressed Air Tanks",
      description: [
        "In scuba diving or firefighting, air is stored in high-pressure tanks. As the temperature inside the tank rises (e.g., due to heat exposure), the pressure increases, while changes in external conditions can also affect the pressure and volume of the air.",
      ],
      images: ["compressed-air-tank.webp", "air-tank.jpg"],
    },
    {
      title: "Car Engine Combustion",
      description: [
        "Inside a car engine, fuel-air mixtures are compressed in a small volume (reducing volume) and ignited, causing a rapid increase in temperature. This expansion of gases due to heating drives the pistons, demonstrating the interplay of pressure, volume, and temperature.",
      ],
      images: [
        "car-engine-cross-section.jpg",
        "combustion-process-diagram.jpg",
        "piston-movement.gif",
      ],
    },
    {
      title: "Aerosol Cans",
      description: [
        "Aerosol cans are pressurized containers. If the can is heated (e.g., left in the sun), the gas inside expands due to the increased temperature, raising the pressure. If the pressure gets too high, the can may rupture, showing how changes in temperature and volume affect pressure.",
      ],
      images: ["aerosol-can-heating.webp", "pressure-warning-on-can.jpg"],
    },
    {
      title: "Airplane Cabin Pressure",
      description: [
        "As an airplane ascends, the external air pressure decreases, and the cabin's internal air pressure and temperature must be regulated to ensure comfort. The changes in these variables are managed using the principles of the Combined Gas Law.",
      ],
      images: [
        "airplane-altitude-diagram.jpg",
        "cabin-pressure-control.png",
        "airplane-in-flight.gif",
      ],
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
        "Avogadro’s Law explains the relationship between the volume and the amount (number of moles) of a gas when the pressure and temperature are kept constant. It states:",
    },
    {
      //   title: "Description",
      type: "paragraph",
      content:
        '"The volume of a gas is directly proportional to the number of moles of gas, provided the temperature and pressure remain unchanged."',
    },
    { type: "paragraph", content: "It means:" },
    {
      type: "list",
      content: [
        "Adding more gas to a container increases its volume.",
        "Removing gas decreases its volume.",
      ],
    },
  ],
  examples: [
    {
      title: "Inflating Balloons",
      description: [
        "When you blow air into a balloon, you're increasing the number of gas molecules inside. As a result, the balloon expands in volume. If you release some air, the number of molecules decreases, and the balloon shrinks.",
      ],
      images: [
        "balloon-inflation-process.gif",
        "balloon-science.gif",
        "multiple-inflated-balloons.jpg",
      ],
    },
    {
      title: "Breathing (Lung Expansion)",
      description: [
        "When you inhale, air enters your lungs, increasing the number of gas molecules inside them. This causes your lungs to expand in volume. When you exhale, the number of gas molecules decreases, and your lung volume shrinks.",
      ],
      images: ["lung-breathing-diagram.png", "breathing.gif"],
    },
    {
      title: "Tires on a Long Trip",
      description: [
        "As you drive, more heat is generated in your tires, which can cause the air inside to expand. Adding more air (increasing moles) also increases the tire's volume to maintain proper pressure.",
      ],
      images: [
        "pressure-gauge-tire.jpg",
        "tire-inflation.gif",
        "tire-air-volume-demonstration.gif",
      ],
    },
    {
      title: "Carbonated Drinks",
      description: [
        "When you shake a soda bottle, gas is released from the liquid into the space above it. As the amount of gas molecules increases, the pressure builds, and the volume of the gas increases, which is why the bottle feels harder to squeeze.",
      ],
      images: ["carbonated-drink-opening.gif", "fizzy-drink-pressure.jpg"],
    },
    {
      title: "Helium in Party Balloons",
      description: [
        "Filling multiple party balloons with helium gas demonstrates Avogadro's Law. Each balloon expands to accommodate the number of gas molecules added, showing the direct relationship between moles and volume.",
      ],
      images: ["helium-balloon-filling.jpg", "balloon-volume-comparison.jpg"],
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
        "Gay-Lussac’s Law explains the relationship between the pressure and temperature of a gas when the volume and the amount of gas are kept constant. It states:",
    },
    {
      //   title: "Description",
      type: "paragraph",
      content:
        '"The pressure of a gas is directly proportional to its temperature, provided the volume and the amount of gas remain constant."',
    },
    { type: "paragraph", content: "It means:" },
    {
      type: "list",
      content: [
        "Heating a gas increases its pressure.",
        "Cooling a gas decreases its pressure.",
      ],
    },
  ],
  examples: [
    {
      title: "Pressure Cookers",
      description: [
        "When you heat a pressure cooker, the temperature inside rises, causing the gas molecules to move faster and collide with the container walls more frequently. This increases the pressure inside the cooker, allowing food to cook faster.",
      ],
      images: ["pressure-cooker-cooking.gif", "pressure-gauge-cooking.jpg"],
    },
    {
      title: "Aerosol Cans",
      description: [
        "When an aerosol can is exposed to high heat (e.g., left in a hot car), the temperature of the gas inside increases. This raises the pressure, which could cause the can to burst if it becomes too high.",
      ],
      images: ["aerosol-can-in-heat.webp", "pressure-warning-on-can.jpg"],
    },
    {
      title: "Car Tires in Summer",
      description: [
        "On a hot day, the air inside car tires heats up, causing the temperature to rise. This increases the pressure inside the tires. That's why it's important to monitor tire pressure during extreme weather changes.",
      ],
      images: [
        "summer-tire-temperature.jpg",
        "pressure-gauge-tire.jpg",
        "winter-tire-pressure.gif",
      ],
    },
    {
      title: "Firing a Bullet",
      description: [
        "When gunpowder in a bullet cartridge is ignited, it rapidly produces hot gases. The high temperature increases the pressure inside the cartridge, forcing the bullet out of the barrel at high speed.",
      ],
      images: [
        "bullet-cartridge-cross-section.webp",
        "gunpowder-explosion.gif",
        "bullet-firing-mechanism.gif",
      ],
    },
    {
      title: "Heating a Sealed Balloon",
      description: [
        "If you heat a balloon sealed tightly, the gas inside expands due to the increased pressure caused by the higher temperature. Eventually, the pressure may become too great for the balloon to contain, causing it to burst.",
      ],
      images: [
        "balloon-heating-experiment.png",
        "balloon-science.gif",
        "balloon-compression.gif",
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
        "The Ideal Gas Law combines all the individual gas laws into a single equation that describes the behavior of an ideal gas. It relates the pressure (P), volume (V), temperature (T), and the number of moles (n) of a gas using the gas constant (R).",
    },
    {
      type: "paragraph",
      content:
        "The Ideal Gas Law is a powerful tool for understanding how gases behave under various conditions. It works best for gases at high temperatures and low pressures.",
    },
  ],
  examples: [
    {
      title: "Airbags in Cars",
      description: [
        "When a car crashes, chemical reactions inside the airbag produce gas almost instantly. The gas fills the airbag, and the Ideal Gas Law helps determine the amount of gas needed to inflate the airbag to the right size and pressure to protect passengers.",
      ],
      images: [
        "car-airbag-deployment.gif",
        "airbag-inflation-process.png",
        "airbag-cross-section.png",
      ],
    },
    {
      title: "Lungs and Breathing",
      description: [
        "When you inhale, your lungs expand, and air flows in to equalize the pressure. The Ideal Gas Law explains how the pressure, volume, and temperature of the air in your lungs change during breathing.",
      ],
      images: ["breathing.gif", "chest-expansion-during-breath.jpg"],
    },
    {
      title: "Diving Tanks",
      description: [
        "Scuba divers use tanks filled with compressed air. The Ideal Gas Law helps calculate how much air is needed for a dive based on the pressure, volume, and temperature of the tank, ensuring divers have enough air underwater.",
      ],
      images: ["air-tank.jpg", "compressed-air-tank.webp"],
    },
    {
      title: "Hot Air Balloons",
      description: [
        "The Ideal Gas Law explains why hot air balloons rise. Heating the air inside the balloon increases its temperature, decreasing its density (and thus its weight) compared to the cooler air outside, allowing the balloon to float.",
      ],
      images: [
        "hot-air-balloon-inflation.gif",
        "balloon-heating-process.jpg",
        "hot-air-balloon-rising.jpg",
      ],
    },
    {
      title: "Tires in Varying Weather",
      description: [
        "When the temperature changes, the air pressure inside a tire also changes, as predicted by the Ideal Gas Law. For example, in cold weather, the temperature drop reduces the pressure, making tires appear underinflated.",
      ],
      images: [
        "pressure-gauge-tire.jpg",
        "winter-tire-pressure.gif",
        "summer-tire-temperature.jpg",
      ],
    },
  ],
};
