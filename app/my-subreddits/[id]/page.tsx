"use client";

import { supabase } from "@/lib/supabaseClient";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

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
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Subreddit</h1>
      <Button onClick={fetchData}>Load Posts</Button>
      <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default Subreddit;
