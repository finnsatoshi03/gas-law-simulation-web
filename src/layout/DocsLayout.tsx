import { Outlet } from "react-router-dom";
import { useSectionScroll } from "@/hooks/useSectionScroll";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { DocsSidebar } from "./DocsSidebar";
import { Navbar } from "./Navbar";

export function DocsLayout() {
  useSectionScroll();
  return (
    <SidebarProvider>
      <DocsSidebar />
      <SidebarInset className="flex flex-col flex-1">
        <header className="sticky top-0 left-0 right-0 z-50 flex w-full items-center gap-2 border-b bg-white">
          <div className="flex items-center gap-2 px-3 w-full">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Navbar />
          </div>
        </header>
        <div className="flex-1 max-w-7xl mx-auto p-4 grid md:grid-cols-[1fr_0.2fr] gap-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
