"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { TrendingUp, Users, Eye, Clock } from "lucide-react";
import { NeonAreaChart } from "@/components/dashboard/NeonAreaChart";
import { DataTable } from "@/components/dashboard/DataTable";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");

  const metrics = [
    {
      key: "visitors",
      value: "24,521",
      change: "+12.5%",
      icon: Users,
      color: "var(--neon-cyan)",
    },
    {
      key: "pageViews",
      value: "89,234",
      change: "+8.2%",
      icon: Eye,
      color: "var(--neon-violet)",
    },
    {
      key: "bounceRate",
      value: "32.4%",
      change: "-2.1%",
      icon: TrendingUp,
      color: "var(--neon-green)",
    },
    {
      key: "avgSession",
      value: "4m 32s",
      change: "+15.3%",
      icon: Clock,
      color: "var(--neon-pink)",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">
            {t("title")}
          </h1>
          <p className="text-[var(--muted-foreground)]">{t("description")}</p>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {metrics.map((metric) => (
            <motion.div
              key={metric.key}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${metric.color}20` }}
                >
                  <metric.icon
                    className="w-5 h-5"
                    style={{ color: metric.color }}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    metric.change.startsWith("+")
                      ? "text-[var(--neon-green)]"
                      : "text-red-400"
                  }`}
                >
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{metric.value}</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                {t(`metrics.${metric.key}`)}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Chart Section */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">{t("chart.title")}</h2>
          <NeonAreaChart />
        </motion.div>

        {/* Table Section */}
        <motion.div variants={itemVariants} className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">{t("table.title")}</h2>
          <DataTable />
        </motion.div>
      </motion.div>
    </div>
  );
}
