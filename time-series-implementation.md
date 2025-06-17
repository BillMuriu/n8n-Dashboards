1. Data Structure & Time Periods

Define time periods (e.g., current week, previous week, current month, previous month)
Determine the granularity (daily, weekly, monthly aggregations)
Decide on the baseline period for growth calculation

2. Database Query Strategy
   Two main queries per theme:
   ├── Current Period Query
   │ ├── Filter by theme (e.g., advice_requests = true)
   │ ├── Filter by date range (e.g., last 7 days)
   │ └── Count posts
   └── Previous Period Query
   ├── Filter by same theme
   ├── Filter by previous date range (e.g., 7 days before that)
   └── Count posts
3. Growth Calculation Logic
   Growth % = ((Current Period Count - Previous Period Count) / Previous Period Count) × 100

Edge Cases:
├── Previous period = 0, Current > 0 → Show as "New!" or "+∞%"
├── Previous period > 0, Current = 0 → Show as "-100%"
├── Both periods = 0 → Show as "No change" or "0%"
└── Negative growth → Show as red/declining indicator 4. Service Layer Implementation
ThemeTimeSeriesService:
├── getTimeRanges() → Generate current/previous date ranges
├── fetchThemeCountsForPeriod(theme, startDate, endDate)
├── calculateGrowthPercentage(current, previous)
├── fetchAllThemeTimeSeries() → Batch fetch all themes
└── formatGrowthDisplay(percentage) → Handle display formatting 5. Caching & Performance Strategy
├── Cache results for a specific time window (e.g., 1 hour)
├── Batch all theme queries into a single database call if possible
├── Use database date functions for efficiency
└── Consider pre-computed daily/weekly aggregations for large datasets 6. Data Flow Architecture

1. Component Mount
   ├── Load cached data (if available and fresh)
   └── Trigger background refresh

2. Background Refresh
   ├── Calculate time periods
   ├── Fetch current period counts (all themes)
   ├── Fetch previous period counts (all themes)
   ├── Calculate growth percentages
   ├── Update component state
   └── Cache results

3. Real-time Updates (Optional)
   ├── WebSocket/polling for new posts
   ├── Increment current period counts
   └── Recalculate growth on-the-fly
4. Error Handling & Fallbacks
   ├── Database unavailable → Show cached data with stale indicator
   ├── Invalid date ranges → Fall back to default periods
   ├── Missing historical data → Show "N/A" for growth
   └── Calculation errors → Show raw counts without growth
5. Configuration Options
   TimeSeriesConfig:
   ├── period: 'daily' | 'weekly' | 'monthly'
   ├── lookback: number of periods to compare
   ├── timezone: user's timezone for accurate date ranges
   └── refreshInterval: how often to update data
6. Database Optimization Considerations
   ├── Index on (theme_field, created_at) columns
   ├── Consider materialized views for pre-aggregated counts
   ├── Use database window functions for efficient period comparisons
   └── Partition large tables by date if needed
7. UI/UX Flow
   ├── Show loading skeleton while fetching
   ├── Animate number changes when data updates
   ├── Color-code growth (green=positive, red=negative)
   ├── Add tooltips showing exact numbers and date ranges
   └── Allow users to change time periods (dropdown)
