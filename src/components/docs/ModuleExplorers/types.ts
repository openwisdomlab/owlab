// 模块探索器通用类型定义

export interface ExplorerItem {
  id: string;
  name: string;
  nameEn?: string;
  description: string;
  details?: string[];
  icon?: string;
}

export interface ExplorerCategory {
  id: string;
  tag: string;
  title: string;
  color: {
    text: string;
    border: string;
    bg: string;
  };
  items: ExplorerItem[];
}

export interface ExplorerConfig {
  moduleId: string;
  title: string;
  subtitle: string;
  description: string;
  categories: ExplorerCategory[];
  footer?: string;
}
