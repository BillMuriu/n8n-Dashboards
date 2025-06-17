"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/siteheader";
import { SubredditNavigation } from "../_components/subreddit-navigation";
import { DataTableDemo } from "../_components/theme/demo-datatable";
import { ThemeService, ThemeConfig } from "@/services/themeService";
import { TimePeriod } from "@/services/timeSeriesService";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabaseClient";

const Subreddit = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig | null>(null);
  const [themeData, setThemeData] = useState<any[]>([]);
  const [isLoadingThemeData, setIsLoadingThemeData] = useState(false);
  const [solutionRequestCount, setSolutionRequestCount] = useState<
    number | null
  >(null);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("weekly");

  // Original fetch all data function
  const fetchData = async () => {
    const { data, error } = await supabase.from("reddit_posts").select("*");
    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      setData(data);
    }
  };

  // Fetch data for selected theme
  const handleThemeSelect = async (theme: ThemeConfig | null) => {
    setSelectedTheme(theme);

    if (!theme) {
      setThemeData([]);
      return;
    }

    setIsLoadingThemeData(true);
    try {
      const data = await ThemeService.fetchThemeData(theme.dbField);
      setThemeData(data || []);
    } catch (error) {
      console.error(`Failed to fetch data for ${theme.title}:`, error);
      setThemeData([]);
    } finally {
      setIsLoadingThemeData(false);
    }
  };

  const fetchSolutionRequestCount = async () => {
    const { count, error } = await supabase
      .from("reddit_posts")
      .select("*", { count: "exact", head: true })
      .eq("solution_requests", true);

    if (error) {
      console.error("Error fetching count:", error.message);
    } else {
      setSolutionRequestCount(count);
    }
  };

  return (
    <SidebarInset>
      <SiteHeader title="n8n" />
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Subreddit</h1>

          {/* Time Period Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Period:</span>
            <Select
              value={timePeriod}
              onValueChange={(value: TimePeriod) => setTimePeriod(value)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 🧭 Navigation Component */}
        <SubredditNavigation
          onThemeSelect={handleThemeSelect}
          selectedTheme={selectedTheme}
          timePeriod={timePeriod}
        />

        {/* Theme Data Display */}
        {selectedTheme && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedTheme.title} Data
                <Badge variant="secondary">
                  {isLoadingThemeData
                    ? "Loading..."
                    : `${themeData.length} posts`}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingThemeData ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-muted-foreground">
                    Loading theme data...
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {themeData.length > 0 ? (
                    <>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span>
                          Showing {themeData.length} posts for "
                          {selectedTheme.title}"
                        </span>
                        {selectedTheme.growthData && (
                          <Badge
                            variant={
                              selectedTheme.growthData.growthPercentage >= 0
                                ? "default"
                                : "destructive"
                            }
                          >
                            {selectedTheme.growthData.growthDisplay} vs previous{" "}
                            {timePeriod.slice(0, -2)}
                          </Badge>
                        )}
                      </div>
                      <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md max-h-96 overflow-y-auto">
                        {JSON.stringify(themeData, null, 2)}
                      </pre>
                    </>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No posts found for "{selectedTheme.title}"
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Original controls */}
        <div className="flex gap-2">
          <Button onClick={fetchData}>Fetch All Data</Button>
          <Button onClick={fetchSolutionRequestCount}>
            Fetch Solution Requests Count
          </Button>
        </div>

        {/* Solution Request Count Display */}
        {solutionRequestCount !== null && (
          <p className="text-sm text-muted-foreground">
            Solution Requests: {solutionRequestCount}
          </p>
        )}

        {/* All Data Display */}
        {data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>All Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 p-4 rounded-md max-h-96 overflow-y-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <DataTableDemo />
      </div>
    </SidebarInset>
  );
};

export default Subreddit;
