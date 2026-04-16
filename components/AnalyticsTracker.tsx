"use client";

import { useEffect, useRef } from "react";

interface AnalyticsTrackerProps {
  username: string;
}

export function AnalyticsTracker({ username }: AnalyticsTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    const trackVisit = async () => {
      try {
        await fetch("/api/track-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username }),
        });
      } catch (error) {
        console.error("Failed to track visit:", error);
      }
    };

    // Small delay to ensure page is actually viewed and not just a quick bot/bounce
    const timeout = setTimeout(trackVisit, 1500);
    return () => clearTimeout(timeout);
  }, [username]);

  return null;
}
