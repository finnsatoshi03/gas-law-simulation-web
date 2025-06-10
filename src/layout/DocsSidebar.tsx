import { GalleryVerticalEnd } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const data = {
  navMain: [
    {
      title: "Introduction",
      url: "/docs#overview",
      items: [
        {
          title: "Overview",
          url: "/docs#overview",
        },
        {
          title: "What is the Gas Law Simulation?",
          url: "/docs#what-is",
        },
        {
          title: "Main Features",
          url: "/docs#features",
        },
        {
          title: "How to Use This Documentation",
          url: "/docs#how-to",
        },
      ],
    },
    {
      title: "Simulation Basics",
      url: "/docs/simulation-basics#",
      items: [
        {
          title: "Gas Law Simulations",
          url: "/docs/simulation-basics#simulations",
        },
        {
          title: "Gas Selection Tanks",
          url: "/docs/simulation-basics#gas-tanks",
        },
        {
          title: "Air Pump",
          url: "/docs/simulation-basics#air-pump",
        },
        {
          title: "Barometer Visualization",
          url: "/docs/simulation-basics#barometer",
        },
        {
          title: "Interactive Sliders",
          url: "/docs/simulation-basics#sliders",
        },
        {
          title: "Cylinder & Molecular Motion",
          url: "/docs/simulation-basics#cylinder-motion",
        },
        {
          title: "Thermometer Visualization",
          url: "/docs/simulation-basics#thermometer",
        },
      ],
    },
    {
      title: "Parameters & Units",
      url: "/docs/parameters-and-units#",
      items: [
        {
          title: "Real Time Unit Conversion",
          url: "/docs/parameters-and-units#real-time-unit-conversion",
        },
        {
          title: "Calculation Dynamics",
          url: "/docs/parameters-and-units#calculation-dynamics",
        },
        {
          title: "Universal Gas Constants",
          url: "/docs/parameters-and-units#universal-gas-constant",
        },
        {
          title: "Parameters Panel Controls",
          url: "/docs/parameters-and-units#parameters-panel-controls",
        },
        {
          title: "Calculator History",
          url: "/docs/parameters-and-units#calculation-history",
        },
      ],
    },
    {
      title: "Wall Collision Dynamics",
      url: "/docs/wall-collision-dynamics#",
      items: [
        {
          title: "Collision Tracking Mechanics",
          url: "/docs/wall-collision-dynamics#collision-tracking",
        },
        {
          title: "Collision Counter Interface",
          url: "/docs/wall-collision-dynamics#collision-counter-interface",
        },
        {
          title: "Panel Interactions",
          url: "/docs/wall-collision-dynamics#minimization-and-positioning",
        },
        {
          title: "Technical Implementation",
          url: "/docs/wall-collision-dynamics#technical-implementation",
        },
        {
          title: "Molecular Interaction Insights",
          url: "/docs/wall-collision-dynamics#molecular-interaction-insights",
        },
      ],
    },
    {
      title: "Sample Problems",
      url: "/docs/sample-problems#",
      items: [
        {
          title: "Problems Slide",
          url: "/docs/sample-problems#problems-slide-introduction",
        },
        {
          title: "Accessing the Problems Slide",
          url: "/docs/sample-problems#accessing-problems-slide",
        },
        {
          title: "Problems Slide Interactions",
          url: "/docs/sample-problems#problems-slide-interactions",
        },
        {
          title: "Creating Custom Problems",
          url: "/docs/sample-problems#creating-custom-problems",
        },
        {
          title: "Sample Problems Management",
          url: "/docs/sample-problems#sample-problems-management",
        },
      ],
    },
    {
      title: "Solution",
      url: "/docs/solution#",
      items: [
        {
          title: "What is the Solution Sheet?",
          url: "/docs/solution#solution-sheet-introduction",
        },
        {
          title: "Solution Button Activation",
          url: "/docs/solution#solution-sheet-trigger",
        },
        {
          title: "Solution Access Authentication",
          url: "/docs/solution#solution-authentication",
        },
        {
          title: "Solution Content Interactions",
          url: "/docs/solution#solution-content-interactions",
        },
        {
          title: "Advanced Solution Sheet Features",
          url: "/docs/solution#solution-sheet-feature",
        },
      ],
    },
    {
      title: "Accessibility",
      url: "/docs/accessibility#",
      items: [
        {
          title: "Accessibility Features",
          url: "/docs/accessibility#accessibility-overview",
        },
        {
          title: "Accessibility Button",
          url: "/docs/accessibility#accessibility-button",
        },
        {
          title: "Text-to-Speech Functionality",
          url: "/docs/accessibility#text-to-speech",
        },
        {
          title: "Voice Customization",
          url: "/docs/accessibility#voice-settings",
        },
        {
          title: "Auto-Read Walkthrough",
          url: "/docs/accessibility#auto-read",
        },
      ],
    },
    {
      title: "Settings",
      url: "/docs/settings#",
      items: [
        {
          title: "Page Structure",
          url: "/docs/settings#settings-page-structure",
        },
        {
          title: "Simulation Settings",
          url: "/docs/settings#simulation-settings",
        },
        {
          title: "Sample Problems Management",
          url: "/docs/settings#sample-problems",
        },
        {
          title: "About Gas Law Simulator",
          url: "/docs/settings#about-section",
        },
      ],
    },
  ],
};

export function DocsSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  const isActive = (url: string) => {
    return (
      location.pathname + location.hash === url ||
      location.pathname === url.split("#")[0]
    );
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              className={isActive("/docs#overview") ? "bg-primary/10" : ""}
            >
              <Link to="/docs#overview" className="cursor-pointer">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Documentation</span>
                  <span className="text-xs">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem
                key={item.title}
                className={`h-fit ${isActive(item.url) ? "bg-primary/10" : ""}`}
              >
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    className={`font-medium h-fit ${
                      isActive(item.url) ? "text-primary font-bold" : ""
                    }`}
                  >
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem
                        key={subItem.title}
                        className={isActive(subItem.url) ? "bg-primary/5" : ""}
                      >
                        <SidebarMenuSubButton asChild>
                          <Link
                            to={subItem.url}
                            className={`h-fit ${
                              isActive(subItem.url)
                                ? "text-primary font-semibold"
                                : ""
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
