"use client";

import { useState, useCallback } from "react";
import {
  Flame,
  Lightbulb,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface SimulationState {
  heatmap: boolean;
  lighting: boolean;
  zoneInfo: boolean;
  opacity: number;
}

interface SimulationPanelProps {
  state: SimulationState;
  onChange: (state: SimulationState) => void;
}

/**
 * Glass-card control panel for toggling simulation overlays,
 * adjusting opacity, and showing the heatmap legend.
 * Positioned as an overlay on the 3D canvas.
 */
export function SimulationPanel({ state, onChange }: SimulationPanelProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(
    (key: keyof Omit<SimulationState, "opacity">) => {
      onChange({ ...state, [key]: !state[key] });
    },
    [state, onChange]
  );

  const setOpacity = useCallback(
    (val: number) => {
      onChange({ ...state, opacity: val });
    },
    [state, onChange]
  );

  const anyActive = state.heatmap || state.lighting || state.zoneInfo;

  return (
    <div
      className="absolute top-4 right-4 z-10 select-none"
      style={{ minWidth: collapsed ? "auto" : "220px" }}
    >
      {/* Header bar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`
          flex items-center gap-2 w-full px-3 py-2 rounded-t-lg text-sm font-medium transition-all
          ${
            anyActive
              ? "bg-[var(--neon-violet)]/20 text-[var(--neon-violet)] border border-[var(--neon-violet)]/50"
              : "bg-white/10 text-white/70 border border-white/20"
          }
          ${collapsed ? "rounded-b-lg" : ""}
        `}
      >
        <Flame className="w-4 h-4" />
        <span>Simulation</span>
        <span className="ml-auto">
          {collapsed ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronUp className="w-4 h-4" />
          )}
        </span>
      </button>

      {/* Panel body */}
      {!collapsed && (
        <div
          className="rounded-b-lg p-3 space-y-3"
          style={{
            background: "rgba(10, 10, 30, 0.85)",
            backdropFilter: "blur(12px)",
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {/* Toggle buttons */}
          <div className="space-y-2">
            <ToggleButton
              active={state.heatmap}
              onClick={() => toggle("heatmap")}
              icon={<Flame className="w-4 h-4" />}
              label="Traffic Heatmap"
              color="var(--neon-orange, #f97316)"
            />
            <ToggleButton
              active={state.lighting}
              onClick={() => toggle("lighting")}
              icon={<Lightbulb className="w-4 h-4" />}
              label="Lighting Analysis"
              color="var(--neon-cyan, #22d3ee)"
            />
            <ToggleButton
              active={state.zoneInfo}
              onClick={() => toggle("zoneInfo")}
              icon={<Info className="w-4 h-4" />}
              label="Zone Info"
              color="var(--neon-green, #10b981)"
            />
          </div>

          {/* Opacity slider */}
          {anyActive && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Opacity</span>
                <span>{Math.round(state.opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(state.opacity * 100)}
                onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, rgba(139,92,246,0.8) ${state.opacity * 100}%, rgba(255,255,255,0.15) ${state.opacity * 100}%)`,
                }}
              />
            </div>
          )}

          {/* Legend (shown when heatmap is active) */}
          {state.heatmap && (
            <div className="pt-2 border-t border-white/10">
              <div className="text-xs text-white/50 mb-2">Traffic Density</div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-white/40">Low</span>
                <div
                  className="flex-1 h-2 rounded-full"
                  style={{
                    background:
                      "linear-gradient(to right, #3b82f6, #06b6d4, #22c55e, #eab308, #ef4444)",
                  }}
                />
                <span className="text-[10px] text-white/40">High</span>
              </div>
            </div>
          )}

          {/* Lighting legend */}
          {state.lighting && (
            <div className="pt-2 border-t border-white/10">
              <div className="text-xs text-white/50 mb-2">Light Types</div>
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: "#fbbf24" }}
                  />
                  <span className="text-white/60">Warm (task)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: "#e0f2fe" }}
                  />
                  <span className="text-white/60">Cool (general)</span>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-1.5">
                <div
                  className="w-2.5 h-2.5 rounded"
                  style={{ backgroundColor: "rgba(40,40,80,0.8)" }}
                />
                <span className="text-[10px] text-white/40">
                  Dim spots (coverage gaps)
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Individual toggle button */
function ToggleButton({
  active,
  onClick,
  icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full px-2.5 py-1.5 rounded-md text-xs font-medium transition-all"
      style={{
        background: active ? `color-mix(in srgb, ${color} 15%, transparent)` : "rgba(255,255,255,0.05)",
        border: active ? `1px solid color-mix(in srgb, ${color} 40%, transparent)` : "1px solid rgba(255,255,255,0.1)",
        color: active ? color : "rgba(255,255,255,0.6)",
      }}
    >
      {icon}
      <span>{label}</span>
      <span
        className="ml-auto w-2 h-2 rounded-full"
        style={{
          backgroundColor: active ? color : "rgba(255,255,255,0.2)",
        }}
      />
    </button>
  );
}
