/**
 * Search Suggestions - Popular searches and smart recommendations
 */

export interface SearchSuggestion {
  query: string;
  category: "popular" | "module" | "tool" | "recent";
  icon?: string;
}

// Popular search suggestions by locale
export const popularSearches: Record<string, SearchSuggestion[]> = {
  zh: [
    { query: "创客空间设计", category: "popular" },
    { query: "安全规范", category: "module" },
    { query: "设备清单", category: "module" },
    { query: "4P理论", category: "popular" },
    { query: "AI 工具指南", category: "tool" },
    { query: "项目设计", category: "module" },
    { query: "评价体系", category: "module" },
    { query: "开放日活动", category: "popular" },
  ],
  en: [
    { query: "maker space design", category: "popular" },
    { query: "safety guidelines", category: "module" },
    { query: "equipment list", category: "module" },
    { query: "4P theory", category: "popular" },
    { query: "AI tools guide", category: "tool" },
    { query: "project design", category: "module" },
    { query: "assessment system", category: "module" },
    { query: "open day activities", category: "popular" },
  ],
};

// Module-based quick links
export const moduleQuickLinks: Record<string, { title: string; path: string }[]> = {
  zh: [
    { title: "M01 发射台", path: "/zh/docs/core/01-foundations" },
    { title: "M02 新航道", path: "/zh/docs/core/02-governance" },
    { title: "M03 空间站", path: "/zh/docs/core/03-space" },
    { title: "M04 探索线", path: "/zh/docs/core/04-programs" },
    { title: "M05 装备舱", path: "/zh/docs/core/05-tools" },
    { title: "M06 安全舱", path: "/zh/docs/core/06-safety" },
    { title: "M07 领航员", path: "/zh/docs/core/07-people" },
    { title: "M08 补给站", path: "/zh/docs/core/08-operations" },
    { title: "M09 成长轨", path: "/zh/docs/core/09-assessment" },
  ],
  en: [
    { title: "M01 Launchpad", path: "/en/docs/core/01-foundations" },
    { title: "M02 Starway", path: "/en/docs/core/02-governance" },
    { title: "M03 Space Station", path: "/en/docs/core/03-space" },
    { title: "M04 Flight Path", path: "/en/docs/core/04-programs" },
    { title: "M05 Equipment Bay", path: "/en/docs/core/05-tools" },
    { title: "M06 Safety Pod", path: "/en/docs/core/06-safety" },
    { title: "M07 Navigator", path: "/en/docs/core/07-people" },
    { title: "M08 Supply Station", path: "/en/docs/core/08-operations" },
    { title: "M09 Star Trail", path: "/en/docs/core/09-assessment" },
  ],
};

/**
 * Get suggestions based on query prefix
 */
export function getAutocompleteSuggestions(
  query: string,
  locale: string = "zh",
  limit: number = 5
): SearchSuggestion[] {
  if (!query || query.length < 2) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const suggestions = popularSearches[locale] || popularSearches.zh;

  return suggestions
    .filter((s) => s.query.toLowerCase().includes(lowerQuery))
    .slice(0, limit);
}

/**
 * Get popular searches for a locale
 */
export function getPopularSearches(locale: string = "zh"): SearchSuggestion[] {
  return popularSearches[locale] || popularSearches.zh;
}

/**
 * Get module quick links for a locale
 */
export function getModuleQuickLinks(locale: string = "zh") {
  return moduleQuickLinks[locale] || moduleQuickLinks.zh;
}

/**
 * Analyze query intent for smart routing
 */
export function analyzeQueryIntent(query: string): {
  type: "question" | "keyword" | "navigation";
  confidence: number;
  suggestedMode: "basic" | "semantic" | "agentic";
} {
  const questionPatterns = [
    /^(什么是|如何|为什么|怎么|哪里|谁|when|what|how|why|where|who)/i,
    /\?$/,
    /(是什么|怎么办|有什么|应该)/,
  ];

  const navigationPatterns = [
    /^(M0[1-9]|模块|module)/i,
    /^(去|打开|跳转|open|go to)/i,
  ];

  // Check for question patterns
  for (const pattern of questionPatterns) {
    if (pattern.test(query)) {
      return {
        type: "question",
        confidence: 0.8,
        suggestedMode: "semantic",
      };
    }
  }

  // Check for navigation patterns
  for (const pattern of navigationPatterns) {
    if (pattern.test(query)) {
      return {
        type: "navigation",
        confidence: 0.9,
        suggestedMode: "basic",
      };
    }
  }

  // Default to keyword search
  return {
    type: "keyword",
    confidence: 0.6,
    suggestedMode: "basic",
  };
}
