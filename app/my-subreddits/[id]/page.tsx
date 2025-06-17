"use client";

import { supabase } from "@/lib/supabaseClient";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/siteheader";
import { SubredditNavigation } from "../_components/subreddit-navigation";
import { DataTableDemo } from "../_components/theme/demo-datatable";

const Subreddit = () => {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    const { data, error } = await supabase.from("reddit_posts").select("*");
    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      setData(data);
    }
  };

  return (
    <SidebarInset>
      <SiteHeader title="n8n" />
      <div className="px-4  space-y-2">
        <h1 className="text-xl font-semibold">Subreddit</h1>

        {/* 🧭 Navigation Component */}
        <SubredditNavigation />

        {/* 🧾 JSON Output */}
        <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          {JSON.stringify(data, null, 2)}
        </pre>
        <DataTableDemo />
      </div>
    </SidebarInset>
  );
};

export default Subreddit;
