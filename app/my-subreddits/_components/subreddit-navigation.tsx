"use client";

import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export function SubredditNavigation() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample themes data
  const themes = [
    { title: "Advice Requests", posts: 5, growth: "+8.2%" },
    { title: "Solution Requests", posts: 3, growth: "+12.5%" },
    { title: "Self Promotion", posts: 2 },
    { title: "Money Talk", posts: 6, growth: "+4.1%" },
    { title: "Opportunity Ideas", posts: 7, growth: "+16.7%" },
    { title: "Pain & Anger", posts: 4, growth: "+6.9%" },
    { title: "Other", posts: 1 },
  ];

  // Filter themes based on search query
  const filteredThemes = useMemo(() => {
    if (!searchQuery) return themes;
    return themes.filter((theme) =>
      theme.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, themes]);

  return (
    <div className="flex w-full max-w-4xl flex-col gap-6">
      <Tabs defaultValue="main">
        <TabsList>
          <TabsTrigger value="main">Main</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
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
          <Card>
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

        <TabsContent value="themes">
          <Card className="w-full">
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-48 w-full fade-bottom">
                <div className="flex flex-col gap-2 p-6 pt-0">
                  {filteredThemes.length > 0 ? (
                    filteredThemes.map((theme, index) => (
                      <ThemeCard
                        key={index}
                        title={theme.title}
                        posts={theme.posts}
                        growth={theme.growth}
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
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
