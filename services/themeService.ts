// services/themeService.ts
import { supabase } from "@/lib/supabaseClient";
import { TimeSeriesService, TimePeriod, GrowthData } from "./timeSeriesService";

export interface ThemeConfig {
  title: string;
  dbField: string;
  posts: number;
  growth?: string;
  growthData?: GrowthData;
}

export const themeConfigs: ThemeConfig[] = [
  { title: "Advice Requests", dbField: "advice_requests", posts: 0 },
  { title: "Solution Requests", dbField: "solution_requests", posts: 0 },
  { title: "Self Promotion", dbField: "self_promotion", posts: 0 },
  { title: "Money Talk", dbField: "money_talk", posts: 0 },
  { title: "Opportunity Ideas", dbField: "opportunity_ideas", posts: 0 },
  { title: "Pain & Anger", dbField: "pain_anger", posts: 0 },
  { title: "Other", dbField: "other", posts: 0 },
];

export class ThemeService {
  static async fetchThemeData(dbField: string) {
    try {
      const { data, error } = await supabase
        .from("reddit_posts")
        .select("*")
        .eq(dbField, true);

      if (error) {
        console.error(`Error fetching ${dbField} data:`, error.message);
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Failed to fetch theme data for ${dbField}:`, error);
      throw error;
    }
  }

  static async fetchThemeCount(dbField: string) {
    try {
      const { count, error } = await supabase
        .from("reddit_posts")
        .select("*", { count: "exact", head: true })
        .eq(dbField, true);

      if (error) {
        console.error(`Error fetching ${dbField} count:`, error.message);
        throw error;
      }

      return count;
    } catch (error) {
      console.error(`Failed to fetch theme count for ${dbField}:`, error);
      throw error;
    }
  }

  /**
   * Fetch theme count for a specific time period
   */
  static async fetchThemeCountForPeriod(
    dbField: string,
    startTime: number,
    endTime: number
  ) {
    try {
      const { count, error } = await supabase
        .from("reddit_posts")
        .select("*", { count: "exact", head: true })
        .eq(dbField, true)
        .gte("created_utc", startTime)
        .lte("created_utc", endTime);

      if (error) {
        console.error(
          `Error fetching ${dbField} count for period:`,
          error.message
        );
        throw error;
      }

      return count || 0;
    } catch (error) {
      console.error(
        `Failed to fetch theme count for period ${dbField}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get time series data for a single theme
   */
  static async fetchThemeTimeSeries(
    dbField: string,
    periodType: TimePeriod = "weekly"
  ) {
    try {
      const timeRanges = TimeSeriesService.getTimeRanges(periodType);

      const [currentCount, previousCount] = await Promise.all([
        this.fetchThemeCountForPeriod(
          dbField,
          timeRanges.current.start,
          timeRanges.current.end
        ),
        this.fetchThemeCountForPeriod(
          dbField,
          timeRanges.previous.start,
          timeRanges.previous.end
        ),
      ]);

      const growthData = TimeSeriesService.createGrowthData(
        currentCount,
        previousCount
      );

      return {
        currentCount,
        previousCount,
        growthData,
        periodType,
        timeRanges,
      };
    } catch (error) {
      console.error(`Failed to fetch time series for ${dbField}:`, error);
      throw error;
    }
  }

  /**
   * Fetch all theme counts with time series data
   */
  static async fetchAllThemeTimeSeries(periodType: TimePeriod = "weekly") {
    try {
      const timeSeriesPromises = themeConfigs.map(async (theme) => {
        try {
          const timeSeries = await this.fetchThemeTimeSeries(
            theme.dbField,
            periodType
          );

          return {
            ...theme,
            posts: timeSeries.currentCount,
            growth: timeSeries.growthData.growthDisplay,
            growthData: timeSeries.growthData,
          };
        } catch (error) {
          console.error(
            `Failed to fetch time series for ${theme.title}:`,
            error
          );
          // Return theme with fallback data
          return {
            ...theme,
            posts: 0,
            growth: "N/A",
          };
        }
      });

      const results = await Promise.all(timeSeriesPromises);
      return results;
    } catch (error) {
      console.error("Failed to fetch all theme time series:", error);
      throw error;
    }
  }

  /**
   * Legacy method - now uses time series data
   */
  static async fetchAllThemeCounts() {
    return this.fetchAllThemeTimeSeries("weekly");
  }

  /**
   * Get theme data for a custom time period
   */
  static async fetchThemeDataForPeriod(
    dbField: string,
    startTime: number,
    endTime: number
  ) {
    try {
      const { data, error } = await supabase
        .from("reddit_posts")
        .select("*")
        .eq(dbField, true)
        .gte("created_utc", startTime)
        .lte("created_utc", endTime)
        .order("created_utc", { ascending: false });

      if (error) {
        console.error(
          `Error fetching ${dbField} data for period:`,
          error.message
        );
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Failed to fetch theme data for period ${dbField}:`, error);
      throw error;
    }
  }
}
