"use client";

import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    // 初始状态
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 在线状态恢复后，3秒后隐藏提示
  useEffect(() => {
    if (isOnline && showOffline) {
      const timer = setTimeout(() => {
        setShowOffline(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOffline]);

  if (!showOffline && isOnline) return null;

  return (
    <div
      className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-5 ${
        isOnline ? "animate-out slide-out-to-top-5" : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`px-4 py-2 rounded-full shadow-lg backdrop-blur-sm ${
          isOnline
            ? "bg-green-500/90 text-white"
            : "bg-amber-500/90 text-white"
        }`}
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          {isOnline ? (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>已重新连接</span>
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
              <span>离线模式 - 已访问内容仍可查看</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
