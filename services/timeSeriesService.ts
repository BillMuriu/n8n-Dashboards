export type TimePeriod =
  | "20mins"
  | "30mins"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly";

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
  static getTimeRanges(periodType: TimePeriod = "weekly"): TimePeriodRanges {
    const now = Math.floor(Date.now() / 1000);

    const periodSeconds: Record<TimePeriod, number> = {
      "20mins": 20 * 60,
      "30mins": 30 * 60,
      hourly: 60 * 60,
      daily: 24 * 60 * 60,
      weekly: 7 * 24 * 60 * 60,
      monthly: 30 * 24 * 60 * 60,
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

  static calculateGrowthPercentage(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return ((current - previous) / previous) * 100;
  }

  static formatGrowthDisplay(percentage: number): string {
    if (percentage === 0) {
      return "0%";
    }
    const sign = percentage > 0 ? "+" : "";
    return `${sign}${percentage.toFixed(1)}%`;
  }

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

  static getPeriodDescription(periodType: TimePeriod): string {
    const descriptions: Record<TimePeriod, string> = {
      "20mins": "last 20 minutes vs previous 20 minutes",
      "30mins": "last 30 minutes vs previous 30 minutes",
      hourly: "this hour vs last hour",
      daily: "today vs yesterday",
      weekly: "this week vs last week",
      monthly: "this month vs last month",
    };

    return descriptions[periodType];
  }

  static isWithinTimeRange(timestamp: number, range: TimeRange): boolean {
    return timestamp >= range.start && timestamp <= range.end;
  }

  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString();
  }

  static getStartOfToday(): number {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    return Math.floor(startOfDay.getTime() / 1000);
  }

  static getCustomTimeRange(daysBack: number): TimeRange {
    const now = Math.floor(Date.now() / 1000);
    const seconds = daysBack * 24 * 60 * 60;

    return {
      start: now - seconds,
      end: now,
    };
  }
}
