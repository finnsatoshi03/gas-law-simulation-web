import { useState } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import SimulationSettings from "./SimulationSettings";
import About from "./About";
import SampleProblems from "./SampleProblems";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("settings");

  const getHeaderText = () => {
    switch (activeTab) {
      case "settings":
        return "Simulation Settings: Customize Your Gas Law Experiment";
      case "about":
        return "About Gas Law Simulator: Understanding the Fundamentals";
      case "problems":
        return "Sample Problems: Practice with Gas Laws";
      default:
        return "";
    }
  };

  return (
    <div className="p-2">
      <Tabs
        defaultValue="settings"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <h1 className="text-2xl font-bold mb-8">{getHeaderText()}</h1>

        <TabsList className="grid max-w-xl grid-cols-3 mb-8">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="problems">Sample Problems</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <SimulationSettings />
        </TabsContent>

        <TabsContent value="problems">
          <SampleProblems />
        </TabsContent>

        <TabsContent value="about">
          <About />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
