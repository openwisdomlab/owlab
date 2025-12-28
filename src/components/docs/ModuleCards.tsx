"use client";

import { motion } from "framer-motion";
import { Link } from "@/components/ui/Link";
import {
  Lightbulb,
  Network,
  Building2,
  BookOpen,
  Wrench,
  ShieldCheck,
  Users,
  ClipboardList,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

interface Module {
  id: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
  path: string;
  status: "completed" | "in_progress" | "planned";
}

const modules: Module[] = [
  {
    id: "M01",
    icon: Lightbulb,
    titleKey: "理念与理论",
    descKey: "OWL 的意义与理论根基",
    path: "/docs/zh/knowledge-base/01-foundations",
    status: "in_progress",
  },
  {
    id: "M02",
    icon: Network,
    titleKey: "治理与网络",
    descKey: "组织形式与协作规则",
    path: "/docs/zh/knowledge-base/02-governance",
    status: "in_progress",
  },
  {
    id: "M03",
    icon: Building2,
    titleKey: "空间与环境",
    descKey: "创新友好的学习环境",
    path: "/docs/zh/knowledge-base/03-space",
    status: "in_progress",
  },
  {
    id: "M04",
    icon: BookOpen,
    titleKey: "课程与项目",
    descKey: "有效的学习体验设计",
    path: "/docs/zh/knowledge-base/04-programs",
    status: "in_progress",
  },
  {
    id: "M05",
    icon: Wrench,
    titleKey: "工具与资产",
    descKey: "设备管理让创造可能",
    path: "/docs/zh/knowledge-base/05-tools",
    status: "in_progress",
  },
  {
    id: "M06",
    icon: ShieldCheck,
    titleKey: "安全与伦理",
    descKey: "底线守护保驾护航",
    path: "/docs/zh/knowledge-base/06-safety",
    status: "in_progress",
  },
  {
    id: "M07",
    icon: Users,
    titleKey: "人员与能力",
    descKey: "培养点燃学习者的人",
    path: "/docs/zh/knowledge-base/07-people",
    status: "in_progress",
  },
  {
    id: "M08",
    icon: ClipboardList,
    titleKey: "运营手册",
    descKey: "让运营自然流畅",
    path: "/docs/zh/knowledge-base/08-operations",
    status: "in_progress",
  },
  {
    id: "M09",
    icon: BarChart3,
    titleKey: "评价与影响",
    descKey: "看见成长证明价值",
    path: "/docs/zh/knowledge-base/09-assessment",
    status: "in_progress",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

interface ModuleCardsProps {
  locale: string;
}

export function ModuleCards({ locale }: ModuleCardsProps) {
  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {modules.map((module) => (
        <motion.div key={module.id} variants={itemVariants}>
          <Link
            href={`/${locale}${module.path}`}
            className="group block h-full"
          >
            <div className="h-full glass-card p-5 hover:border-[var(--neon-cyan)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--neon-cyan)]/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--neon-cyan)]/10 flex items-center justify-center group-hover:bg-[var(--neon-cyan)]/20 transition-colors">
                  <module.icon className="w-6 h-6 text-[var(--neon-cyan)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-[var(--muted-foreground)]">
                      {module.id}
                    </span>
                    <StatusBadge status={module.status} />
                  </div>
                  <h3 className="text-base font-semibold mb-1 group-hover:text-[var(--neon-cyan)] transition-colors">
                    {module.titleKey}
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                    {module.descKey}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: Module["status"] }) {
  const config = {
    completed: {
      label: "已完成",
      className: "bg-green-500/10 text-green-500",
    },
    in_progress: {
      label: "核心完成",
      className: "bg-yellow-500/10 text-yellow-500",
    },
    planned: {
      label: "计划中",
      className: "bg-gray-500/10 text-gray-400",
    },
  };

  const { label, className } = config[status];

  return (
    <span className={`px-1.5 py-0.5 text-xs rounded ${className}`}>
      {label}
    </span>
  );
}
