import React, { useState } from "react";
import { Cylinder, Lock, LogOut, Menu, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExitDialog } from "@/components/ExitDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { useProfile } from "@/contexts/ProfileContext";
import { FEATURE, FeatureKey } from "@/lib/features";
import { canAccess, PERMISSION } from "@/lib/permissions";

const navMain = [
  {
    title: "Playground",
    icon: Cylinder,
    items: [
      {
        featureKey: FEATURE.BOYLES_LAW_SIMULATION,
        title: "Boyle's Law",
        url: "/boyles",
      },
      {
        featureKey: FEATURE.CHARLES_LAW_SIMULATION,
        title: "Charles' Law",
        url: "/charles",
      },
      {
        featureKey: FEATURE.GAY_LUSSACS_LAW_SIMULATION,
        title: "Gay Lussac's Law",
        url: "/lussac",
      },
      {
        featureKey: FEATURE.AVOGADROS_LAW_SIMULATION,
        title: "Avogadro's Law",
        url: "/avogadros",
      },
      {
        featureKey: FEATURE.COMBINED_GAS_LAW_SIMULATION,
        title: "Combined Gas Law",
        url: "/combined",
      },
      {
        featureKey: FEATURE.IDEAL_GAS_LAW_SIMULATION,
        title: "Ideal Gas Law",
        url: "/ideal",
      },
    ],
  },
];

export function Navbar() {
  const location = useLocation();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const { profile } = useProfile();
  const { canAccessFeature } = useAccessControl();
  const canAccessAdmin = canAccess(
    profile,
    PERMISSION.ACCESS_ADMIN_DASHBOARD
  );
  const canAccessHome = canAccessFeature(FEATURE.HOME);
  const canAccessDocs = canAccessFeature(FEATURE.DOCUMENTATION);
  const canAccessSettings = canAccessFeature(FEATURE.SIMULATION_SETTINGS);

  const isActive = (url: string) => {
    return location.pathname === url;
  };

  const isParentActive = (items: { title: string; url: string }[]) => {
    return items.some((item) => isActive(item.url));
  };

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

  if (isMobile) {
    return (
      <div className="flex items-center justify-between p-4 w-full">
        <Link to="/boyles" className="flex items-center gap-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Cylinder className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Gas Laws</span>
            <span className="truncate text-xs">Simulation</span>
          </div>
        </Link>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 sm:w-80">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Cylinder className="size-4" />
                  <span className="font-semibold">Gas Laws Simulation</span>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                {canAccessHome ? (
                  <Link
                    to="/home"
                    className={cn(
                      "block px-4 py-2 rounded-lg transition-colors",
                      isActive("/home") ? "bg-zinc-100 font-semibold" : ""
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Home
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400">
                    Home
                    <Lock className="size-3.5" />
                  </span>
                )}

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="playground" className="border-none">
                    <AccordionTrigger
                      className={cn(
                        "px-4 py-2 rounded-lg hover:bg-zinc-50 transition-all",
                        isParentActive(navMain[0].items)
                          ? "bg-zinc-100 font-semibold"
                          : ""
                      )}
                    >
                      Playground
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col pl-4 space-y-2">
                        {navMain[0].items.map((item) => {
                          const canAccessItem = item.featureKey
                            ? canAccessFeature(item.featureKey)
                            : true;

                          return canAccessItem ? (
                            <Link
                              key={item.title}
                              to={item.url}
                              className={cn(
                                "px-4 py-2 rounded-lg transition-colors text-sm",
                                isActive(item.url)
                                  ? "bg-zinc-100 font-semibold"
                                  : ""
                              )}
                              onClick={() => setIsOpen(false)}
                            >
                              {item.title}
                            </Link>
                          ) : (
                            <span
                              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400"
                              key={item.title}
                            >
                              {item.title}
                              <Lock className="size-3.5" />
                            </span>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {canAccessDocs ? (
                  <Link
                    to="/docs"
                    className={cn(
                      "block px-4 py-2 rounded-lg transition-colors",
                      isActive("/docs") ? "bg-zinc-100 font-semibold" : ""
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    About the App
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400">
                    About the App
                    <Lock className="size-3.5" />
                  </span>
                )}

                {canAccessSettings ? (
                  <Link
                    to="/settings"
                    className={cn(
                      "block px-4 py-2 rounded-lg transition-colors",
                      isActive("/settings") ? "bg-zinc-100 font-semibold" : ""
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                ) : (
                  <span className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-400">
                    Settings
                    <Lock className="size-3.5" />
                  </span>
                )}
                {canAccessAdmin ? (
                  <Link
                    to="/admin"
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-4 py-2 transition-colors",
                      location.pathname.startsWith("/admin")
                        ? "bg-zinc-100 font-semibold"
                        : ""
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    <ShieldCheck className="size-4" />
                    Admin dashboard
                  </Link>
                ) : null}
                <LogoutButton className="w-full justify-start px-4" />
              </div>

              <button
                onClick={handleCloseApp}
                className="mt-auto items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-zinc-100 transition-colors text-red-500 hidden"
              >
                <LogOut className="size-4" />
                <span>Exit App</span>
              </button>
            </div>
          </SheetContent>
        </Sheet>

        <ExitDialog
          isAlertOpen={isAlertOpen}
          setIsAlertOpen={setIsAlertOpen}
          rememberChoice={rememberChoice}
          setRememberChoice={setRememberChoice}
          closeApp={closeApp}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4 w-full">
      <Link to="/boyles" className="flex items-center gap-2">
        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <Cylinder className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">Gas Laws</span>
          <span className="truncate text-xs">Simulation</span>
        </div>
      </Link>
      <NavigationMenu className="w-full max-w-full">
        <NavigationMenuList className="w-full flex justify-center items-center">
          <NavigationMenuItem
            className={isActive("/home") ? "bg-zinc-100 rounded-lg" : ""}
          >
            {canAccessHome ? (
              <Link to="/home">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/home") ? "font-bold" : ""
                  )}
                >
                  Home
                </NavigationMenuLink>
              </Link>
            ) : (
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "gap-2 cursor-not-allowed text-zinc-400"
                )}
              >
                Home
                <Lock className="size-3.5" />
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
          <NavigationMenuItem
            className={
              isParentActive(navMain[0].items) ? "bg-zinc-100 rounded-lg" : ""
            }
          >
            <NavigationMenuTrigger
              className={isParentActive(navMain[0].items) ? "font-bold" : ""}
            >
              Playground
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid grid-cols-3 w-[700px] gap-3 p-4">
                {navMain[0].items.map((item) => (
                  <ListItem
                    featureKey={item.featureKey}
                    key={item.title}
                    title={item.title}
                    to={item.url}
                    className={
                      isActive(item.url)
                        ? "bg-zinc-100 rounded-lg focus:bg-none font-bold"
                        : ""
                    }
                  >
                    Explore {item.title} simulation
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem
            className={
              isActive("/docs") ? "bg-zinc-100 rounded-lg focus:bg-none" : ""
            }
          >
            {canAccessDocs ? (
              <Link to="/docs">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/docs") ? "font-bold" : ""
                  )}
                >
                  About the App
                </NavigationMenuLink>
              </Link>
            ) : (
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "gap-2 cursor-not-allowed text-zinc-400"
                )}
              >
                About the App
                <Lock className="size-3.5" />
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <NavigationMenu className="justify-self-end">
        <NavigationMenuList>
          <NavigationMenuItem
            className={
              isActive("/settings")
                ? "bg-zinc-100 rounded-lg focus:bg-none"
                : ""
            }
          >
            {canAccessSettings ? (
              <Link to="/settings">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/settings") ? "font-bold" : ""
                  )}
                >
                  Settings
                </NavigationMenuLink>
              </Link>
            ) : (
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "gap-2 cursor-not-allowed text-zinc-400"
                )}
              >
                Settings
                <Lock className="size-3.5" />
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
          {canAccessAdmin ? (
            <NavigationMenuItem
              className={
                location.pathname.startsWith("/admin")
                  ? "bg-zinc-100 rounded-lg focus:bg-none"
                  : ""
              }
            >
              <Link to="/admin">
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "gap-2",
                    location.pathname.startsWith("/admin") ? "font-bold" : ""
                  )}
                >
                  <ShieldCheck className="size-4" />
                  Admin
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ) : null}

          <NavigationMenuItem onClick={handleCloseApp}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "items-center gap-2 cursor-pointer hidden"
              )}
            >
              <LogOut className="size-4" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Exit App</span>
              </div>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <LogoutButton className="h-10" />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <ExitDialog
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
        rememberChoice={rememberChoice}
        setRememberChoice={setRememberChoice}
        closeApp={closeApp}
      />
    </div>
  );
}

const ListItem = React.forwardRef<
  HTMLAnchorElement,
  {
    children: React.ReactNode;
    className?: string;
    featureKey?: FeatureKey;
    title: string;
    to: string;
  }
>(({ className, featureKey, title, children, ...props }, ref) => {
  const { canAccessFeature } = useAccessControl();
  const canAccessItem = featureKey ? canAccessFeature(featureKey) : true;

  if (!canAccessItem) {
    return (
      <li>
        <div className="block select-none space-y-1 rounded-lg p-3 leading-none text-zinc-400">
          <div className="flex items-center gap-2 text-sm font-semibold leading-none">
            {title}
            <Lock className="size-3.5" />
          </div>
          <p className="line-clamp-2 text-xs leading-snug">
            This simulation is currently locked.
          </p>
        </div>
      </li>
    );
  }

  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          className={cn(
            "block select-none space-y-1 p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-100 rounded-lg hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";
