"use client";

import { useState, useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface BannerProps {
  title: string;
  description?: string;
  icon?: ReactNode; // Optional custom icon; defaults to /public/warning.svg
  onDismiss?: () => void; // Optional external dismiss handler
  storageKey?: string; // Optional key to persist dismissal across reloads
}

export default function Banner({ title, description, icon, onDismiss, storageKey }: BannerProps) {
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [show, setShow] = useState(false); // controls opacity/translate for animations
  const [exiting, setExiting] = useState(false); // keep mounted while animating out

  // Initialize from localStorage and trigger enter animation
  useEffect(() => {
    const key = storageKey ?? "banner:dismissed";
    try {
      const isDismissed = typeof window !== "undefined" ? localStorage.getItem(key) === "1" : false;
      setDismissed(isDismissed);
      if (!isDismissed) {
        // Next tick to ensure transition applies
        requestAnimationFrame(() => setShow(true));
      }
    } catch {
      setDismissed(false);
      requestAnimationFrame(() => setShow(true));
    }
  }, [storageKey]);

  // If already dismissed and not exiting, render nothing
  if (dismissed && !exiting) return null;

  const handleDismiss = () => {
    // Trigger exit animation
    setShow(false);
    setExiting(true);
    try {
      const key = storageKey ?? "banner:dismissed";
      localStorage.setItem(key, "1");
    } catch {
      // Ignore persistence errors
    }
    onDismiss?.();
  };

  const handleTransitionEnd = () => {
    // When exit transition completes, finalize dismissal so we unmount
    if (!show && exiting) {
      setExiting(false);
      setDismissed(true);
    }
  };

  return (
    <div
      className={
        [
          "mb-4 rounded-lg p-4 flex items-center gap-3 bg-[#FFF1E3] text-neutral-800",
          // Animation classes
          "transform transition-all ease-out",
          exiting ? "duration-200" : "duration-300",
          show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        ].join(" ")
      }
      role="status"
      aria-live="polite"
      onTransitionEnd={handleTransitionEnd}
    >
      <div className="mt-0.5 shrink-0 text-yellow-700">
        {icon ?? (
          <img src="/warning-yellow.svg" alt="" className="h-6 w-6" aria-hidden="true" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        {description ? (
          <p className="mt-1 text-md leading-5">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className="inline-flex items-center justify-center rounded-md p-1 text-yellow-800 hover:text-yellow-900 hover:bg-[#FFE9D2] focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 transition-colors"
        aria-label="Dismiss warning banner"
      >
        <img src="/close-yellow.svg" alt="" className="h-8 w-8" aria-hidden="true" />
      </button>
    </div>
  );
}
