/**
 * Search Analytics - Track search behavior and performance
 */

export interface SearchEvent {
  type: "search" | "click" | "no_results" | "escalation";
  query: string;
  mode: "auto" | "basic" | "semantic" | "agentic";
  locale: string;
  resultCount: number;
  processingTime: number;
  timestamp: number;
  // For click events
  clickedUrl?: string;
  clickedPosition?: number;
  // For escalation events
  escalatedFrom?: string;
  escalatedTo?: string;
}

export interface SearchMetrics {
  totalSearches: number;
  uniqueQueries: number;
  averageProcessingTime: number;
  clickThroughRate: number;
  noResultsRate: number;
  escalationRate: number;
  topQueries: { query: string; count: number }[];
  searchesByMode: Record<string, number>;
  searchesByLocale: Record<string, number>;
}

// In-memory storage for analytics (for demo purposes)
// In production, this would be sent to an analytics service
const analyticsEvents: SearchEvent[] = [];
const MAX_EVENTS = 1000;

/**
 * Track a search event
 */
export function trackSearchEvent(event: Omit<SearchEvent, "timestamp">): void {
  const fullEvent: SearchEvent = {
    ...event,
    timestamp: Date.now(),
  };

  analyticsEvents.push(fullEvent);

  // Keep only last MAX_EVENTS
  if (analyticsEvents.length > MAX_EVENTS) {
    analyticsEvents.shift();
  }

  // In production, send to analytics service
  if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
    // Example: Send to analytics endpoint
    // fetch("/api/analytics/search", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(fullEvent),
    // }).catch(console.error);
  }

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.debug("[Search Analytics]", fullEvent);
  }
}

/**
 * Track a search query
 */
export function trackSearch(
  query: string,
  mode: SearchEvent["mode"],
  locale: string,
  resultCount: number,
  processingTime: number
): void {
  trackSearchEvent({
    type: resultCount > 0 ? "search" : "no_results",
    query,
    mode,
    locale,
    resultCount,
    processingTime,
  });
}

/**
 * Track a result click
 */
export function trackClick(
  query: string,
  url: string,
  position: number,
  locale: string
): void {
  trackSearchEvent({
    type: "click",
    query,
    mode: "auto",
    locale,
    resultCount: 0,
    processingTime: 0,
    clickedUrl: url,
    clickedPosition: position,
  });
}

/**
 * Track search mode escalation
 */
export function trackEscalation(
  query: string,
  fromMode: string,
  toMode: string,
  locale: string
): void {
  trackSearchEvent({
    type: "escalation",
    query,
    mode: toMode as SearchEvent["mode"],
    locale,
    resultCount: 0,
    processingTime: 0,
    escalatedFrom: fromMode,
    escalatedTo: toMode,
  });
}

/**
 * Get search metrics for the last N days
 */
export function getSearchMetrics(days: number = 7): SearchMetrics {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recentEvents = analyticsEvents.filter((e) => e.timestamp >= cutoff);

  const searches = recentEvents.filter((e) => e.type === "search" || e.type === "no_results");
  const clicks = recentEvents.filter((e) => e.type === "click");
  const noResults = recentEvents.filter((e) => e.type === "no_results");
  const escalations = recentEvents.filter((e) => e.type === "escalation");

  // Count unique queries
  const uniqueQueries = new Set(searches.map((e) => e.query)).size;

  // Calculate average processing time
  const totalTime = searches.reduce((sum, e) => sum + e.processingTime, 0);
  const averageProcessingTime = searches.length > 0 ? totalTime / searches.length : 0;

  // Calculate rates
  const clickThroughRate = searches.length > 0 ? clicks.length / searches.length : 0;
  const noResultsRate = searches.length > 0 ? noResults.length / searches.length : 0;
  const escalationRate = searches.length > 0 ? escalations.length / searches.length : 0;

  // Count top queries
  const queryCounts = new Map<string, number>();
  searches.forEach((e) => {
    queryCounts.set(e.query, (queryCounts.get(e.query) || 0) + 1);
  });
  const topQueries = Array.from(queryCounts.entries())
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // Count by mode
  const searchesByMode: Record<string, number> = {};
  searches.forEach((e) => {
    searchesByMode[e.mode] = (searchesByMode[e.mode] || 0) + 1;
  });

  // Count by locale
  const searchesByLocale: Record<string, number> = {};
  searches.forEach((e) => {
    searchesByLocale[e.locale] = (searchesByLocale[e.locale] || 0) + 1;
  });

  return {
    totalSearches: searches.length,
    uniqueQueries,
    averageProcessingTime,
    clickThroughRate,
    noResultsRate,
    escalationRate,
    topQueries,
    searchesByMode,
    searchesByLocale,
  };
}

/**
 * Clear all analytics events (for testing)
 */
export function clearAnalytics(): void {
  analyticsEvents.length = 0;
}

/**
 * Export analytics events (for debugging)
 */
export function exportAnalytics(): SearchEvent[] {
  return [...analyticsEvents];
}
