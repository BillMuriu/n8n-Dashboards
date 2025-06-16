"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface ThemeCardProps {
  title: string;
  posts: number;
  growth?: string;
}

export function ThemeCard({ title, posts, growth }: ThemeCardProps) {
  return (
    <Card className="w-full max-w-md h-12 bg-gradient-to-r from-primary/5 to-card dark:bg-card shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-1 px-2 h-full">
        <div className="flex flex-col justify-center">
          <CardDescription className="text-xs text-muted-foreground">
            {posts} posts this week
          </CardDescription>
          <CardTitle className="text-sm font-medium leading-tight">
            {title}
          </CardTitle>
        </div>
        {growth && (
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            {growth}
          </Badge>
        )}
      </CardHeader>
    </Card>
  );
}
