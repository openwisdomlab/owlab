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
    { title: "M01 理念与理论", path: "/zh/docs/knowledge-base/01-foundations" },
    { title: "M02 治理与网络", path: "/zh/docs/knowledge-base/02-governance" },
    { title: "M03 空间与环境", path: "/zh/docs/knowledge-base/03-space" },
    { title: "M04 课程与项目", path: "/zh/docs/knowledge-base/04-curriculum" },
    { title: "M05 工具与资产", path: "/zh/docs/knowledge-base/05-tools" },
    { title: "M06 安全与伦理", path: "/zh/docs/knowledge-base/06-safety" },
    { title: "M07 人员与能力", path: "/zh/docs/knowledge-base/07-people" },
    { title: "M08 运营手册", path: "/zh/docs/knowledge-base/08-operations" },
    { title: "M09 评价与影响", path: "/zh/docs/knowledge-base/09-assessment" },
  ],
  en: [
    { title: "M01 Philosophy & Theory", path: "/en/docs/knowledge-base/01-foundations" },
    { title: "M02 Governance & Network", path: "/en/docs/knowledge-base/02-governance" },
    { title: "M03 Space & Environment", path: "/en/docs/knowledge-base/03-space" },
    { title: "M04 Courses & Projects", path: "/en/docs/knowledge-base/04-curriculum" },
    { title: "M05 Tools & Assets", path: "/en/docs/knowledge-base/05-tools" },
    { title: "M06 Safety & Ethics", path: "/en/docs/knowledge-base/06-safety" },
    { title: "M07 People & Capability", path: "/en/docs/knowledge-base/07-people" },
    { title: "M08 Operations Manual", path: "/en/docs/knowledge-base/08-operations" },
    { title: "M09 Assessment & Impact", path: "/en/docs/knowledge-base/09-assessment" },
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
