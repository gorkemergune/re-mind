import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useBreakStore } from "../stores/breakStore";

function checkBreak() {
  const state = useBreakStore.getState();
  if (state.paused || state.breakActive) return;
  if (Date.now() >= state.nextBreakAt) {
    state.triggerBreak();
  }
}

export function useBreakTimer() {
  useEffect(() => {
    // backend-tick fires every 30 seconds from the Rust thread — immune to WebKit throttling
    const unlistenTick = listen("backend-tick", () => checkBreak());

    // Check immediately when page becomes visible again (catches minimised/hidden window)
    const handleVisibility = () => {
      if (document.visibilityState === "visible") checkBreak();
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Fallback 10-second JS interval for on-screen countdown display updates
    const uiInterval = setInterval(checkBreak, 10_000);

    return () => {
      unlistenTick.then((fn) => fn());
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(uiInterval);
    };
  }, []);

  // Listen for events from the break overlay window
  useEffect(() => {
    const unlisteners = [
      listen("break-completed", () => {
        useBreakStore.getState().onBreakCompleted();
      }),
      listen("break-skipped", () => {
        useBreakStore.getState().onBreakSkipped();
      }),
      listen<{ minutes: number }>("break-snoozed", (event) => {
        useBreakStore.getState().onBreakSnoozed(event.payload.minutes);
      }),
    ];

    return () => {
      unlisteners.forEach((p) => p.then((fn) => fn()));
    };
  }, []);
}
