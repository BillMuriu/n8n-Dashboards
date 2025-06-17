"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ThemeCard } from "./theme-card";
import { ThemesChart } from "./theme/example-chart";
import { DataTableDemo } from "./theme/demo-datatable";
import {
  ThemeService,
  themeConfigs,
  ThemeConfig,
} from "@/services/themeService";
import { TimePeriod } from "@/services/timeSeriesService";

interface SubredditNavigationProps {
  onThemeSelect?: (themeConfig: ThemeConfig | null) => void;
  selectedTheme?: ThemeConfig | null;
  timePeriod?: TimePeriod;
}

export function SubredditNavigation({
  onThemeSelect,
  selectedTheme,
  timePeriod = "weekly",
}: SubredditNavigationProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [themes, setThemes] = useState<ThemeConfig[]>(themeConfigs);
  const [isLoadingCounts, setIsLoadingCounts] = useState(false);

  // Load theme counts when component mounts or timePeriod changes
  useEffect(() => {
    loadThemeCounts();
  }, [timePeriod]);

  const loadThemeCounts = async () => {
    setIsLoadingCounts(true);
    try {
      const updatedThemes = await ThemeService.fetchAllThemeTimeSeries(
        timePeriod
      );
      setThemes(updatedThemes);
    } catch (error) {
      console.error("Failed to load theme counts:", error);
      // Keep using the default counts from themeConfigs
    } finally {
      setIsLoadingCounts(false);
    }
  };

  // Filter themes based on search query
  const filteredThemes = useMemo(() => {
    if (!searchQuery) return themes;
    return themes.filter((theme) =>
      theme.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, themes]);

  const handleThemeClick = (theme: ThemeConfig) => {
    const newSelectedTheme =
      selectedTheme?.dbField === theme.dbField ? null : theme;
    onThemeSelect?.(newSelectedTheme);
  };

  return (
    <div className="flex w-full max-w-4xl flex-col justify-start flex-start gap-6">
      <Tabs defaultValue="main">
        <TabsList className="flex rounded-md overflow-hidden border-gray-900">
          <TabsTrigger
            value="main"
            className="px-4 py-2 text-sm data-[state=active]:border data-[state=active]:border-border data-[state=active]:rounded-md"
          >
            Main
          </TabsTrigger>
          <TabsTrigger
            value="topics"
            className="px-4 py-2 text-sm data-[state=active]:border data-[state=active]:border-border data-[state=active]:rounded-md"
          >
            Topics <Badge>43</Badge>
          </TabsTrigger>
          <TabsTrigger
            value="themes"
            className="px-4 py-2 text-sm data-[state=active]:border data-[state=active]:border-border data-[state=active]:rounded-md"
          >
            Themes <Badge variant="secondary">3</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="main">
          <Card>
            <CardHeader>
              <CardTitle>Main Section</CardTitle>
              <CardDescription>
                Overview and recent posts in this subreddit.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p>This is the main subreddit view.</p>
            </CardContent>
            <CardFooter>
              <Button>Refresh</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="topics">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>Topics</CardTitle>
              <CardDescription>
                Auto-extracted or manually tagged topics.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p>List of topics will appear here.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Manage Topics</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent
          value="themes"
          className="flex flex-col md:flex-row items-stretch gap-5"
        >
          <Card className="w-full md:max-w-md shadow-none bg-gradient-to-t from-primary/5">
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {selectedTheme && (
                <div className="mt-2 space-y-1">
                  <Badge variant="secondary" className="text-xs">
                    Selected: {selectedTheme.title}
                  </Badge>
                  {selectedTheme.growthData && (
                    <div className="text-xs text-muted-foreground">
                      {selectedTheme.posts} posts ({timePeriod})
                    </div>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-48 w-full fade-bottom">
                <div className="flex flex-col gap-2 p-6 pt-0">
                  {isLoadingCounts && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      Loading {timePeriod} data...
                    </div>
                  )}
                  {filteredThemes.length > 0 ? (
                    filteredThemes.map((theme, index) => (
                      <ThemeCard
                        key={theme.dbField}
                        title={theme.title}
                        posts={theme.posts}
                        growth={theme.growth}
                        dbField={theme.dbField}
                        isSelected={selectedTheme?.dbField === theme.dbField}
                        onClick={() => handleThemeClick(theme)}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No themes found matching "{searchQuery}"
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
            <CardFooter className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadThemeCounts}
                disabled={isLoadingCounts}
                className="w-full"
              >
                {isLoadingCounts
                  ? "Refreshing..."
                  : `Refresh ${timePeriod} data`}
              </Button>
            </CardFooter>
          </Card>

          <div className="w-full md:flex-1">
            <ThemesChart />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
