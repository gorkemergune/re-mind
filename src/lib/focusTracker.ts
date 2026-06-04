import { useEffect, useRef } from "react";
import { recordFocusTime } from "./commands";

export function useFocusTracker() {
  const sessionStartRef = useRef<number | null>(null);
  const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const flush = () => {
    if (document.visibilityState !== "visible") return;
    if (sessionStartRef.current === null) return;

    const now = Date.now();
    const sessionStart = sessionStartRef.current;
    sessionStartRef.current = now; // reset reference point

    recordFocusMinutes(sessionStart, now);
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        sessionStartRef.current = Date.now();
      } else {
        flush();
        sessionStartRef.current = null;
      }
    };

    // Start tracking if already visible
    if (document.visibilityState === "visible") {
      sessionStartRef.current = Date.now();
    }

    document.addEventListener("visibilitychange", handleVisibility);

    // Flush every 60 seconds to record incremental focus time
    flushIntervalRef.current = setInterval(flush, 60_000);

    return () => {
      flush(); // flush on unmount
      document.removeEventListener("visibilitychange", handleVisibility);
      if (flushIntervalRef.current) clearInterval(flushIntervalRef.current);
    };
  }, []);
}

function recordFocusMinutes(startMs: number, endMs: number) {
  const durationMs = endMs - startMs;
  if (durationMs < 5_000) return; // ignore very short blips

  // Split the session across hour boundaries
  let cursor = new Date(startMs);
  const end = new Date(endMs);

  while (cursor < end) {
    const hourEnd = new Date(cursor);
    hourEnd.setMinutes(0, 0, 0);
    hourEnd.setHours(hourEnd.getHours() + 1);

    const sliceEnd = hourEnd < end ? hourEnd : end;
    const sliceMinutes = (sliceEnd.getTime() - cursor.getTime()) / 60_000;

    const date = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    const hour = cursor.getHours();

    recordFocusTime(date, hour, sliceMinutes).catch(console.error);

    cursor = sliceEnd;
  }
}
