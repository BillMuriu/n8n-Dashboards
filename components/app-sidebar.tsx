"use client";

import * as React from "react";
import {
  IconBookmark,
  IconHelp,
  IconHome,
  IconInnerShadowTop,
  IconPick,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/dashboard",
      icon: IconHome,
    },
    {
      title: "Explore by Subreddit",
      url: "/my-subreddits",
      icon: IconBookmark,
    },
    {
      title: "Mine posts",
      url: "/trending",
      icon: IconPick,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
    {
      title: "Help",
      url: "/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "/search",
      icon: IconSearch,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="*:data-[slot=sidebar-menu-button]:from-primary/5 *:data-[slot=sidebar-menu-button]:to-card *:data-[slot=sidebar-menu-button]:bg-gradient-to-t dark:*:data-[slot=sidebar-menu-button]:bg-card *:data-[slot=sidebar-menu-button]:shadow-xs"
      {...props}
    >
      <SidebarHeader className="bg-gradient-to-l from-primary/5 to-card dark:bg-card shadow-xs">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-gradient-to-l from-primary/5 to-card dark:bg-card shadow-xs">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="bg-gradient-to-l from-primary/5 to-card dark:bg-card shadow-xs">
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
