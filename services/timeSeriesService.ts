// services/timeSeriesService.ts

export type TimePeriod = "daily" | "weekly" | "monthly";

export interface TimeRange {
  start: number;
  end: number;
}

export interface TimePeriodRanges {
  current: TimeRange;
  previous: TimeRange;
}

export interface GrowthData {
  currentCount: number;
  previousCount: number;
  growthPercentage: number;
  growthDisplay: string;
}

export class TimeSeriesService {
  /**
   * Get time ranges for current and previous periods
   */
  static getTimeRanges(periodType: TimePeriod = "weekly"): TimePeriodRanges {
    const now = Math.floor(Date.now() / 1000);

    const periodSeconds = {
      daily: 24 * 60 * 60, // 1 day
      weekly: 7 * 24 * 60 * 60, // 7 days
      monthly: 30 * 24 * 60 * 60, // 30 days
    };

    const seconds = periodSeconds[periodType];

    return {
      current: {
        start: now - seconds,
        end: now,
      },
      previous: {
        start: now - 2 * seconds,
        end: now - seconds,
      },
    };
  }

  /**
   * Calculate growth percentage between two values
   */
  static calculateGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0; // If no previous data but current exists, show 100% growth
    }

    return ((current - previous) / previous) * 100;
  }

  /**
   * Format growth percentage for display
   */
  static formatGrowthDisplay(percentage: number): string {
    if (percentage === 0) {
      return "0%";
    }

    const sign = percentage > 0 ? "+" : "";
    return `${sign}${percentage.toFixed(1)}%`;
  }

  /**
   * Create growth data object with all calculations
   */
  static createGrowthData(
    currentCount: number,
    previousCount: number
  ): GrowthData {
    const growthPercentage = this.calculateGrowthPercentage(
      currentCount,
      previousCount
    );
    const growthDisplay = this.formatGrowthDisplay(growthPercentage);

    return {
      currentCount,
      previousCount,
      growthPercentage,
      growthDisplay,
    };
  }

  /**
   * Get human-readable period description
   */
  static getPeriodDescription(periodType: TimePeriod): string {
    const descriptions = {
      daily: "today vs yesterday",
      weekly: "this week vs last week",
      monthly: "this month vs last month",
    };

    return descriptions[periodType];
  }

  /**
   * Check if a Unix timestamp is within a time range
   */
  static isWithinTimeRange(timestamp: number, range: TimeRange): boolean {
    return timestamp >= range.start && timestamp <= range.end;
  }

  /**
   * Convert Unix timestamp to human-readable date
   */
  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  /**
   * Get the start of today in Unix timestamp
   */
  static getStartOfToday(): number {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    return Math.floor(startOfDay.getTime() / 1000);
  }

  /**
   * Get custom time range (useful for date pickers)
   */
  static getCustomTimeRange(daysBack: number): TimeRange {
    const now = Math.floor(Date.now() / 1000);
    const seconds = daysBack * 24 * 60 * 60;

    return {
      start: now - seconds,
      end: now,
    };
  }
}
