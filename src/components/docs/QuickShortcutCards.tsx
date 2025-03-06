import { Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const navigationData = [
  {
    title: "Introduction",
    url: "/docs",
    description:
      "Discover the Gas Law Simulation app's core purpose and how it transforms complex gas behavior into interactive, easy-to-understand visualizations for students and enthusiasts.",
  },
  {
    title: "Simulation Basics",
    url: "/docs/simulation-basics",
    description:
      "Explore the comprehensive toolset of the Gas Law Simulation, including interactive elements, real-time molecular visualization, and advanced simulation capabilities.",
  },
  {
    title: "Parameters & Units",
    url: "/docs/parameters-and-units",
    description:
      "Understand the scientific parameters, measurement units, and conversion methods used in gas law calculations and molecular simulations.",
  },
  {
    title: "Sample Problems",
    url: "/docs/sample-problems",
    description:
      "Explore a comprehensive collection of gas law problems, learn problem-solving strategies, and practice with interactive sample challenges.",
  },
  {
    title: "Solution",
    url: "/docs/solution",
    description:
      "Dive into detailed solution methods, step-by-step calculations, and comprehensive problem-solving insights for gas law simulations.",
  },
  {
    title: "Settings",
    url: "/docs/settings",
    description:
      "Customize your simulation experience with advanced configuration options, manage problem sets, and explore the Gas Law Simulator's full potential.",
  },
];

export const QuickShortcutCards = () => {
  const location = useLocation();
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
      {navigationData
        .filter((section) => section.url !== location.pathname)
        .map((section, index) => (
          <Link key={index} to={section.url} className="no-underline">
            <Card className="hover:shadow-lg transition-all h-full">
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {section.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
    </div>
  );
};
