import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

import {
  Cylinder,
  File,
  Loader2,
  LogOut,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { NavMain } from "./NavMain";
import { ExitDialog } from "@/components/ExitDialog";
import { useLogout } from "@/hooks/use-logout";
import { useProfile } from "@/contexts/ProfileContext";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { FEATURE } from "@/lib/features";
import { canAccess, PERMISSION } from "@/lib/permissions";

const navMain = [
  {
    title: "Playground",
    url: "#",
    icon: Cylinder,
    isActive: true,
    items: [
      {
        featureKey: FEATURE.BOYLES_LAW_SIMULATION,
        title: "Boyle's Law",
        url: "boyles",
      },
      {
        featureKey: FEATURE.CHARLES_LAW_SIMULATION,
        title: "Charles' Law",
        url: "charles",
      },
      {
        featureKey: FEATURE.GAY_LUSSACS_LAW_SIMULATION,
        title: "Gay Lussac's Law",
        url: "lussac",
      },
      {
        featureKey: FEATURE.AVOGADROS_LAW_SIMULATION,
        title: "Avogadro's Law",
        url: "avogadros",
      },
      {
        featureKey: FEATURE.COMBINED_GAS_LAW_SIMULATION,
        title: "Combined Gas Law",
        url: "combined",
      },
      {
        featureKey: FEATURE.IDEAL_GAS_LAW_SIMULATION,
        title: "Ideal Gas Law",
        url: "ideal",
      },
    ],
  },
];

export function AppSidebar() {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);
  const location = useLocation();
  const { handleLogout, isLoggingOut } = useLogout();
  const { profile } = useProfile();
  const { canAccessFeature } = useAccessControl();
  const canAccessAdmin = canAccess(
    profile,
    PERMISSION.ACCESS_ADMIN_DASHBOARD
  );
  const canAccessDocs = canAccessFeature(FEATURE.DOCUMENTATION);
  const canAccessSettings = canAccessFeature(FEATURE.SIMULATION_SETTINGS);

  const handleCloseApp = () => {
    const storedPreference = localStorage.getItem("exitWithoutConfirm");

    if (storedPreference === "true") {
      closeApp();
    } else {
      setIsAlertOpen(true);
    }
  };

  const closeApp = () => {
    if (rememberChoice) {
      localStorage.setItem("exitWithoutConfirm", "true");
    }
    window.close();
  };

  return (
    <>
      <Sidebar className="sidebar-navigation">
        <SidebarHeader>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Cylinder className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Gas Laws</span>
              <span className="truncate text-xs">Simulation</span>
            </div>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navMain} />
        </SidebarContent>
        <SidebarFooter>
          {canAccessAdmin ? (
            <SidebarMenuButton
              size="sm"
              className="settings-nav-item data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              isActive={location.pathname.startsWith("/admin")}
            >
              <Link
                className="flex-1 flex gap-2 items-center text-left text-sm leading-tight"
                to="/admin"
              >
                <ShieldCheck className="size-4" />
                <span className="truncate font-semibold">Admin dashboard</span>
              </Link>
            </SidebarMenuButton>
          ) : null}
          {canAccessDocs ? (
            <SidebarMenuButton
              size="sm"
              className="settings-nav-item data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              isActive={location.pathname === "/docs"}
            >
              <Link
                className="flex-1 flex gap-2 items-center text-left text-sm leading-tight"
                to="/docs"
              >
                <File className="size-4" />
                <span className="truncate font-semibold">About the App</span>
              </Link>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              disabled
              size="sm"
              className="settings-nav-item"
            >
              <File className="size-4" />
              <span className="truncate font-semibold">About the App</span>
            </SidebarMenuButton>
          )}
          {canAccessSettings ? (
            <SidebarMenuButton
              size="sm"
              className="settings-nav-item data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              isActive={location.pathname === "/settings"}
            >
              <Link
                className="flex-1 flex gap-2 items-center text-left text-sm leading-tight"
                to="/settings"
              >
                <Settings className="size-4" />
                <span className="truncate font-semibold">Settings</span>
              </Link>
            </SidebarMenuButton>
          ) : (
            <SidebarMenuButton
              disabled
              size="sm"
              className="settings-nav-item"
            >
              <Settings className="size-4" />
              <span className="truncate font-semibold">Settings</span>
            </SidebarMenuButton>
          )}
          <SidebarMenuButton
            size="sm"
            className="exit-app-nav-item data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hidden"
            onClick={handleCloseApp}
          >
            <LogOut className="size-4" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Exit App</span>
            </div>
          </SidebarMenuButton>
          <SidebarMenuButton
            size="sm"
            aria-busy={isLoggingOut}
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="settings-nav-item text-red-600 hover:bg-red-50 hover:text-red-700 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            {isLoggingOut ? (
              <Loader2 className="size-4 shrink-0 animate-spin" />
            ) : (
              <LogOut className="size-4 shrink-0" />
            )}
            <span className="truncate font-semibold">
              {isLoggingOut ? "Logging out..." : "Log out"}
            </span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>

      <ExitDialog
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        rememberChoice={rememberChoice}
        setRememberChoice={setRememberChoice}
        closeApp={closeApp}
      />
    </>
  );
}
