import { SiteHeader } from "@/components/siteheader";
import { SidebarInset } from "@/components/ui/sidebar";

import data from "./data.json";

export default function Page() {
  return (
    <>
      <SidebarInset>
        <SiteHeader />
        <div>Main page</div>
      </SidebarInset>
    </>
  );
}
