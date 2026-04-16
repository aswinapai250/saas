"use client";

import React from "react";

interface TrackableLinkProps {
  username: string;
  linkId: string;
  url: string;
  className?: string;
  children: React.ReactNode;
}

export function TrackableLink({ username, linkId, url, className, children }: TrackableLinkProps) {
  const handleClick = async (e: React.MouseEvent) => {
    // We want to track the click but not necessarily wait for it to finish before redirecting
    // However, some browsers might cancel the fetch if the page navigates away too fast.
    // Standard practice is to send the heart beat or use Beacon API, but a simple fetch with no-wait is usually okay
    // or we can prevent default, fetch, then navigate.
    
    // For simplicity and speed, we'll fire and forget
    fetch("/api/track-click", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, linkId }),
    }).catch(err => console.error("Tracking error:", err));
  };

  return (
    <a
      href={url.startsWith("http") ? url : `https://${url}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
