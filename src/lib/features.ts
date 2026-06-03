export const FEATURE = {
  ACCESSIBILITY_CONTROLS: "accessibility_controls",
  AVOGADROS_LAW_SIMULATION: "avogadros_law_simulation",
  BOYLES_LAW_SIMULATION: "boyles_law_simulation",
  CALCULATION_HISTORY: "calculation_history",
  CHARLES_LAW_SIMULATION: "charles_law_simulation",
  CLEAR_HISTORY: "clear_history",
  COMBINED_GAS_LAW_SIMULATION: "combined_gas_law_simulation",
  DOCUMENTATION: "documentation",
  GAY_LUSSACS_LAW_SIMULATION: "gay_lussacs_law_simulation",
  GUIDED_WALKTHROUGH: "guided_walkthrough",
  HINTS: "hints",
  HOME: "home",
  IDEAL_GAS_LAW_SIMULATION: "ideal_gas_law_simulation",
  SAMPLE_PROBLEM_MANAGEMENT: "sample_problem_management",
  SAMPLE_PROBLEMS: "sample_problems",
  SIMULATION_SETTINGS: "simulation_settings",
  SOLUTION_SHEETS: "solution_sheets",
} as const;

export type FeatureKey = (typeof FEATURE)[keyof typeof FEATURE];

export interface FeatureDefinition {
  category: string;
  description: string;
  key: FeatureKey;
  name: string;
}

export const FEATURE_REGISTRY: FeatureDefinition[] = [
  {
    category: "Core",
    description: "Landing page and app entry point.",
    key: FEATURE.HOME,
    name: "Home",
  },
  {
    category: "Simulations",
    description: "Boyle's Law simulation route.",
    key: FEATURE.BOYLES_LAW_SIMULATION,
    name: "Boyle's Law",
  },
  {
    category: "Simulations",
    description: "Charles' Law simulation route.",
    key: FEATURE.CHARLES_LAW_SIMULATION,
    name: "Charles' Law",
  },
  {
    category: "Simulations",
    description: "Gay-Lussac's Law simulation route.",
    key: FEATURE.GAY_LUSSACS_LAW_SIMULATION,
    name: "Gay-Lussac's Law",
  },
  {
    category: "Simulations",
    description: "Avogadro's Law simulation route.",
    key: FEATURE.AVOGADROS_LAW_SIMULATION,
    name: "Avogadro's Law",
  },
  {
    category: "Simulations",
    description: "Combined Gas Law simulation route.",
    key: FEATURE.COMBINED_GAS_LAW_SIMULATION,
    name: "Combined Gas Law",
  },
  {
    category: "Simulations",
    description: "Ideal Gas Law simulation route.",
    key: FEATURE.IDEAL_GAS_LAW_SIMULATION,
    name: "Ideal Gas Law",
  },
  {
    category: "Settings",
    description: "Simulation settings page and controls.",
    key: FEATURE.SIMULATION_SETTINGS,
    name: "Simulation settings",
  },
  {
    category: "Learning",
    description: "Documentation and app information pages.",
    key: FEATURE.DOCUMENTATION,
    name: "Documentation",
  },
  {
    category: "Learning",
    description: "Sample problem content.",
    key: FEATURE.SAMPLE_PROBLEMS,
    name: "Sample problems",
  },
  {
    category: "Learning",
    description: "Sample problem management controls.",
    key: FEATURE.SAMPLE_PROBLEM_MANAGEMENT,
    name: "Sample problem management",
  },
  {
    category: "Learning",
    description: "Hint visibility and use.",
    key: FEATURE.HINTS,
    name: "Hints",
  },
  {
    category: "Learning",
    description: "Solution sheet access.",
    key: FEATURE.SOLUTION_SHEETS,
    name: "Solution sheets",
  },
  {
    category: "History",
    description: "Calculation history display.",
    key: FEATURE.CALCULATION_HISTORY,
    name: "Calculation history",
  },
  {
    category: "History",
    description: "Clear calculation history action.",
    key: FEATURE.CLEAR_HISTORY,
    name: "Clear history",
  },
  {
    category: "Accessibility",
    description: "Accessibility dialog and text-to-speech controls.",
    key: FEATURE.ACCESSIBILITY_CONTROLS,
    name: "Accessibility controls",
  },
  {
    category: "Guidance",
    description: "Guided walkthrough launch and resume controls.",
    key: FEATURE.GUIDED_WALKTHROUGH,
    name: "Guided walkthrough",
  },
];

export const FEATURE_DEFINITIONS_BY_KEY = FEATURE_REGISTRY.reduce(
  (accumulator, feature) => {
    accumulator[feature.key] = feature;
    return accumulator;
  },
  {} as Record<FeatureKey, FeatureDefinition>
);

export const isFeatureKey = (value: unknown): value is FeatureKey =>
  Object.values(FEATURE).some((featureKey) => featureKey === value);
