import React, { useState } from "react";
import { Cylinder, LogOut, Menu } from "lucide-react";
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

const navMain = [
  {
    title: "Playground",
    icon: Cylinder,
    items: [
      {
        title: "Boyle's Law",
        url: "/boyles",
      },
      {
        title: "Charles' Law",
        url: "/charles",
      },
      {
        title: "Gay Lussac's Law",
        url: "/lussac",
      },
      {
        title: "Avogadros' Law",
        url: "/avogadros",
      },
      {
        title: "Combined Gas Law",
        url: "/combined",
      },
      {
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
                        {navMain[0].items.map((item) => (
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
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Link
                  to="/docs"
                  className={cn(
                    "block px-4 py-2 rounded-lg transition-colors",
                    isActive("/docs") ? "bg-zinc-100 font-semibold" : ""
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  Documentation
                </Link>

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
            <Link to="/docs">
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  isActive("/docs") ? "font-bold" : ""
                )}
              >
                Documentation
              </NavigationMenuLink>
            </Link>
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
          </NavigationMenuItem>

          <NavigationMenuItem onClick={handleCloseApp}>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                "flex items-center gap-2 cursor-pointer"
              )}
            >
              <LogOut className="size-4" />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Exit App</span>
              </div>
            </NavigationMenuLink>
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
  { className?: string; title: string; children: React.ReactNode; to: string }
>(({ className, title, children, ...props }, ref) => {
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
