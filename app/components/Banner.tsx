"use client";

import { useState, useEffect, type ReactNode } from "react";
import { X, AlertTriangle, OctagonAlert } from "lucide-react";

interface BannerProps {
  title: string;
  description?: string;
  icon?: ReactNode; // Optional custom icon
  onDismiss?: () => void; // Optional external dismiss handler
  storageKey?: string; // If provided, persists dismissal across reloads
  variant?: "warning" | "error"; // Visual styling variant
}

export default function Banner({ title, description, icon, onDismiss, storageKey, variant = "warning" }: BannerProps) {
  const [dismissed, setDismissed] = useState<boolean | null>(null);
  const [show, setShow] = useState(false); // controls opacity/translate for animations
  const [exiting, setExiting] = useState(false); // keep mounted while animating out

  // Initialize from localStorage (only if storageKey provided) and trigger enter animation
  useEffect(() => {
    try {
      let isDismissed = false;
      if (typeof window !== "undefined" && storageKey) {
        isDismissed = localStorage.getItem(storageKey) === "1";
      }
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
      if (storageKey) {
        localStorage.setItem(storageKey, "1");
      }
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

  const bgClass = variant === "error" ? "bg-red-50 text-red-900" : "bg-[#FFF1E3] text-neutral-800";
  const iconColor = variant === "error" ? "text-red-700" : "text-yellow-700";
  const buttonText = variant === "error" ? "text-red-800 hover:text-red-900 hover:bg-red-100 focus-visible:ring-red-500" : "text-yellow-800 hover:text-yellow-900 hover:bg-[#FFE9D2] focus-visible:ring-yellow-500";
  const ariaLabel = variant === "error" ? "Dismiss error banner" : "Dismiss warning banner";

  return (
    <div
      className={[
        "mb-4 rounded-lg p-4 flex items-center gap-3",
        bgClass,
        // Animation classes
        "transform transition-all ease-out",
        exiting ? "duration-200" : "duration-300",
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
      ].join(" ")}
      role="status"
      aria-live="polite"
      onTransitionEnd={handleTransitionEnd}
    >
      <div className={`mt-0.5 shrink-0 ${iconColor}`}>
        {icon ?? (variant === "error" ? (
          <OctagonAlert className="h-6 w-6" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        ))}
      </div>
      <div className="flex-1">
        <p className="font-bold">{title}</p>
        {description ? <p className="mt-1 text-md leading-5">{description}</p> : null}
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className={`inline-flex items-center justify-center rounded-md p-1 transition-colors focus:outline-none focus-visible:ring-2 ${buttonText}`}
        aria-label={ariaLabel}
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
