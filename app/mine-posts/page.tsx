import React from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/siteheader";

const MinePosts = () => {
  return (
    <SidebarInset>
      <SiteHeader title="My Subreddits" />
    </SidebarInset>
  );
};

export default MinePosts;
