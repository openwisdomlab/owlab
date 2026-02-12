"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface DataPoint {
  label: string;
  [key: string]: string | number;
}

export interface SeriesConfig {
  key: string;
  name: string;
  color: string;
}

export interface DataTrendChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  series: SeriesConfig[];
}

/**
 * GenUI component rendered inline in chat when AI discusses metrics or trends.
 * Dynamic version of NeonAreaChart that accepts data via props.
 */
export function DataTrendChart({
  title,
  description,
  data,
  series,
}: DataTrendChartProps) {
  return (
    <motion.div
      className="rounded-xl overflow-hidden my-2"
      style={{
        background:
          "linear-gradient(145deg, rgba(14,14,20,0.95), rgba(20,20,35,0.9))",
        border: "1px solid rgba(139, 92, 246, 0.25)",
        boxShadow:
          "0 0 20px rgba(139, 92, 246, 0.08), 0 4px 20px rgba(0,0,0,0.1)",
      }}
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Top accent bar */}
      <div
        className="h-1"
        style={{
          background:
            "linear-gradient(90deg, #8B5CF6, #00D9FF)",
        }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{
              background:
                "linear-gradient(135deg, rgba(139,92,246,0.15), rgba(0,217,255,0.1))",
              border: "1px solid rgba(139,92,246,0.3)",
            }}
          >
            <TrendingUp className="w-4 h-4" style={{ color: "#8B5CF6" }} />
          </div>
          <div>
            <h4
              className="text-sm font-bold"
              style={{
                background: "linear-gradient(90deg, #8B5CF6, #00D9FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {title}
            </h4>
            {description && (
              <p
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                {series.map((s) => (
                  <linearGradient
                    key={`grad-${s.key}`}
                    id={`genui-grad-${s.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={s.color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={s.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                ))}
                <filter id="genui-glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.9)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "0.75rem",
                  backdropFilter: "blur(12px)",
                }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#e2e8f0" }}
              />
              {series.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.name}
                  stroke={s.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#genui-grad-${s.key})`}
                  filter="url(#genui-glow)"
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-2 justify-center">
          {series.map((s) => (
            <div key={s.key} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{
                  background: s.color,
                  boxShadow: `0 0 6px ${s.color}`,
                }}
              />
              <span
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
