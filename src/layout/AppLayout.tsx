import { Outlet } from "react-router-dom";

import { AppSidebar } from "./AppSidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import WalkthroughWrapper from "@/components/WalkthroughWrapper";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <TooltipProvider delayDuration={1000}>
        <WalkthroughWrapper />
        <AppSidebar />
        <main className="p-4 w-full">
          <SidebarTrigger className="relative z-50"/>
          <Outlet />
        </main>
      </TooltipProvider>
    </SidebarProvider>
  );
}
