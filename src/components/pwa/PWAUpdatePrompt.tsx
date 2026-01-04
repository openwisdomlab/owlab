"use client";

import { useEffect, useState } from "react";

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [updateWaiting, setUpdateWaiting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      // 监听新 Service Worker 安装
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        if (!newWorker) return;

        newWorker.addEventListener("statechange", () => {
          if (
            newWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            // 有新版本可用
            setShowPrompt(true);
            setUpdateWaiting(true);
          }
        });
      });

      // 检查是否有等待激活的 Service Worker
      if (registration.waiting) {
        setShowPrompt(true);
        setUpdateWaiting(true);
      }
    });

    // 监听来自 Service Worker 的消息
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "CACHE_UPDATED") {
        setShowPrompt(true);
      }
    });
  }, []);

  const handleUpdate = () => {
    if (!updateWaiting) {
      window.location.reload();
      return;
    }

    // 发送消息给等待的 Service Worker，让它跳过等待
    navigator.serviceWorker.ready.then((registration) => {
      if (registration.waiting) {
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
      }
    });

    // 监听控制权转移，然后刷新页面
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      window.location.reload();
    });
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-5"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-gradient-to-br from-[var(--neon-pink)] to-[var(--neon-cyan)] p-[1px] rounded-lg shadow-2xl">
        <div className="bg-[var(--background)] rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5 text-[var(--neon-cyan)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-[var(--foreground)] mb-1">
                📚 OWL 知识库有更新
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mb-3">
                发现新的研究内容和功能改进
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  className="flex-1 px-3 py-1.5 text-xs font-medium rounded-md bg-gradient-to-r from-[var(--neon-pink)] to-[var(--neon-cyan)] text-white hover:opacity-90 transition-opacity"
                >
                  立即更新
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-xs font-medium rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--accent)] transition-colors"
                >
                  稍后
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
