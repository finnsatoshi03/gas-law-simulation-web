import { ChevronRight, Home, Lock, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { FEATURE, FeatureKey } from "@/lib/features";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    featureKey?: FeatureKey;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      featureKey?: FeatureKey;
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { canAccessFeature, isFeatureLocked } = useAccessControl();
  const canAccessHome = canAccessFeature(FEATURE.HOME);
  const isHomeLocked = isFeatureLocked(FEATURE.HOME) && !canAccessHome;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem className="home-nav-item">
          {canAccessHome ? (
            <Link to="/home">
              <SidebarMenuButton tooltip="Home">
                <Home />
                Home
              </SidebarMenuButton>
            </Link>
          ) : (
            <SidebarMenuButton disabled tooltip="Home is locked">
              <Home />
              Home
              {isHomeLocked ? <Lock className="ml-auto size-3.5" /> : null}
            </SidebarMenuButton>
          )}
        </SidebarMenuItem>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible playground-nav-item"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const canAccessItem = subItem.featureKey
                      ? canAccessFeature(subItem.featureKey)
                      : true;
                    const isLocked =
                      Boolean(subItem.featureKey) && !canAccessItem;

                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        {canAccessItem ? (
                          <SidebarMenuSubButton asChild>
                            <Link
                              to={subItem.url}
                              className={
                                subItem.title === "Boyle's Law"
                                  ? "boyles-law-nav-item"
                                  : ""
                              }
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        ) : (
                          <SidebarMenuSubButton aria-disabled="true">
                            <span>{subItem.title}</span>
                            {isLocked ? <Lock className="size-3.5" /> : null}
                          </SidebarMenuSubButton>
                        )}
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
