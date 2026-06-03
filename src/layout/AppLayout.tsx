import { Outlet } from "react-router-dom";

import { AppSidebar } from "./AppSidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import WalkthroughWrapper from "@/components/WalkthroughWrapper";
import { AccessibilityButton } from "@/components/AccessibilityButton";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { FEATURE } from "@/lib/features";

export default function AppLayout() {
  const { canAccessFeature } = useAccessControl();
  const canAccessAccessibility = canAccessFeature(FEATURE.ACCESSIBILITY_CONTROLS);
  const canAccessWalkthrough = canAccessFeature(FEATURE.GUIDED_WALKTHROUGH);

  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={1000}>
        {canAccessWalkthrough ? <WalkthroughWrapper /> : null}
        <AppSidebar />
        <main className="p-4 w-full">
          <SidebarTrigger className="relative z-50" />
          <Outlet />
        </main>
        {canAccessAccessibility ? <AccessibilityButton /> : null}
      </TooltipProvider>
    </SidebarProvider>
  );
}
