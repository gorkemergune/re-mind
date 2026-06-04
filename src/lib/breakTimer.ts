import { useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { useBreakStore } from "../stores/breakStore";

export function useBreakTimer() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown interval — ticks every second
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const state = useBreakStore.getState();

      if (state.paused || state.breakActive) return;

      const until = state.secondsUntilBreak - 1;
      if (until <= 0) {
        state.triggerBreak();
      } else {
        state.setSecondsUntilBreak(until);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
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
