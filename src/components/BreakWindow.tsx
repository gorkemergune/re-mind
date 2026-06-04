import { useEffect, useRef, useState } from "react";
import { emit } from "@tauri-apps/api/event";
import {
  getSettings,
  closeBreakOverlay,
  recordBreakTaken,
  recordBreakSkipped,
} from "../lib/commands";
import { getTranslation } from "../i18n";
import type { Locale } from "../i18n";
import { playNotificationSound } from "../lib/sound";
import { fireCelebration } from "../lib/confetti";

type Phase = "select" | "countdown" | "complete";

const DURATION_OPTIONS = [1, 2, 3, 5, 10];

export function BreakWindow() {
  const [phase, setPhase] = useState<Phase>("select");
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [locale, setLocale] = useState<Locale>("en");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch settings and play arrival sound
  useEffect(() => {
    getSettings()
      .then((s) => {
        const lang = (s.language === "tr" ? "tr" : "en") as Locale;
        setLocale(lang);
        setSoundEnabled(s.sound_enabled);
        if (s.sound_enabled) playNotificationSound();
      })
      .catch(() => {});
  }, []);

  const t = getTranslation(locale);

  // Countdown timer
  useEffect(() => {
    if (phase !== "countdown") return;

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase("complete");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  // Play sound + confetti on completion
  useEffect(() => {
    if (phase === "complete") {
      if (soundEnabled) playNotificationSound();
      fireCelebration();
    }
  }, [phase, soundEnabled]);

  const handleSelectDuration = async (minutes: number) => {
    const secs = minutes * 60;
    setTotalSeconds(secs);
    setRemaining(secs);
    setPhase("countdown");
    try {
      await recordBreakTaken();
    } catch {
      // ignore
    }
  };

  const handleSkip = async () => {
    try {
      await recordBreakSkipped();
    } catch {
      // ignore
    }
    await emit("break-skipped");
    try {
      await closeBreakOverlay();
    } catch {
      // ignore
    }
  };

  const handleSnooze = async () => {
    await emit("break-snoozed", { minutes: 10 });
    try {
      await closeBreakOverlay();
    } catch {
      // ignore
    }
  };

  const handleContinue = async () => {
    await emit("break-completed");
    try {
      await closeBreakOverlay();
    } catch {
      // ignore
    }
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  return (
    <div className="h-screen w-screen bg-[#0a0b14]/95 backdrop-blur-xl flex items-center justify-center select-none">
      <div className="w-full max-w-lg mx-4">
        {phase === "select" && (
          <SelectPhase
            t={t}
            durations={DURATION_OPTIONS}
            onSelect={handleSelectDuration}
            onSkip={handleSkip}
            onSnooze={handleSnooze}
          />
        )}
        {phase === "countdown" && (
          <CountdownPhase
            t={t}
            timeStr={timeStr}
            progress={progress}
          />
        )}
        {phase === "complete" && (
          <CompletePhase t={t} onContinue={handleContinue} />
        )}
      </div>
    </div>
  );
}

// --- Phase Components ---

interface SelectPhaseProps {
  t: ReturnType<typeof getTranslation>;
  durations: number[];
  onSelect: (minutes: number) => void;
  onSkip: () => void;
  onSnooze: () => void;
}

function SelectPhase({ t, durations, onSelect, onSkip, onSnooze }: SelectPhaseProps) {
  return (
    <div className="text-center animate-fade-in">
      {/* Icon */}
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </div>

      {/* Heading */}
      <h1 className="text-3xl font-semibold text-white mb-2">
        {t.break_timeForBreak}
      </h1>
      <p className="text-base text-[#9ca3bf] mb-8">
        {t.break_workingHard}
      </p>

      {/* Wellness suggestions */}
      <div className="flex justify-center gap-6 mb-10">
        <Suggestion icon="droplet" label={t.break_standUp} color="text-blue-400" />
        <Suggestion icon="stretch" label={t.break_stretch} color="text-emerald-400" />
        <Suggestion icon="water" label={t.break_drinkWater} color="text-cyan-400" />
      </div>

      {/* Duration selection */}
      <p className="text-sm text-[#6b7194] mb-4 uppercase tracking-wider font-medium">
        {t.break_selectDuration}
      </p>
      <div className="flex justify-center gap-3 mb-6">
        {durations.map((min) => (
          <button
            key={min}
            onClick={() => onSelect(min)}
            className="px-5 py-3 rounded-xl text-sm font-semibold
                       text-white bg-emerald-500 hover:bg-emerald-600
                       transition-all duration-150 cursor-pointer
                       shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30
                       hover:-translate-y-0.5 active:translate-y-0"
          >
            {min} {t.break_minutes}
          </button>
        ))}
      </div>

      {/* Skip and Snooze */}
      <div className="flex justify-center gap-3">
        <button
          onClick={onSnooze}
          className="px-5 py-2.5 rounded-xl text-sm font-medium
                     text-amber-400 bg-amber-500/10 hover:bg-amber-500/20
                     transition-colors duration-150 cursor-pointer"
        >
          {t.break_snooze10}
        </button>
        <button
          onClick={onSkip}
          className="px-5 py-2.5 rounded-xl text-sm font-medium
                     text-[#6b7194] bg-white/5 hover:bg-white/10
                     transition-colors duration-150 cursor-pointer"
        >
          {t.break_skipBreak}
        </button>
      </div>
    </div>
  );
}

interface CountdownPhaseProps {
  t: ReturnType<typeof getTranslation>;
  timeStr: string;
  progress: number;
}

function CountdownPhase({ t, timeStr, progress }: CountdownPhaseProps) {
  return (
    <div className="text-center animate-fade-in">
      {/* Wellness suggestions */}
      <div className="flex justify-center gap-6 mb-10">
        <Suggestion icon="droplet" label={t.break_standUp} color="text-blue-400" />
        <Suggestion icon="stretch" label={t.break_stretch} color="text-emerald-400" />
        <Suggestion icon="water" label={t.break_drinkWater} color="text-cyan-400" />
      </div>

      {/* Timer */}
      <p className="text-sm text-[#6b7194] mb-3 uppercase tracking-wider font-medium">
        {t.break_breakEndsIn}
      </p>
      <div className="text-7xl font-light text-white tabular-nums tracking-tight mb-8">
        {timeStr}
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mx-auto h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface CompletePhaseProps {
  t: ReturnType<typeof getTranslation>;
  onContinue: () => void;
}

function CompletePhase({ t, onContinue }: CompletePhaseProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    btnRef.current?.focus();
  }, []);

  return (
    <div className="text-center animate-fade-in">
      {/* Checkmark icon */}
      <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>

      <h1 className="text-3xl font-semibold text-white mb-2">
        {t.break_breakComplete}
      </h1>
      <p className="text-base text-[#9ca3bf] mb-10">
        {t.break_letsGetBack}
      </p>

      <button
        ref={btnRef}
        onClick={onContinue}
        className="px-8 py-3 rounded-xl text-sm font-semibold
                   text-white bg-primary-500 hover:bg-primary-600
                   transition-all duration-150 cursor-pointer
                   shadow-lg shadow-primary-500/20"
      >
        {t.break_continue}
      </button>
    </div>
  );
}

// --- Shared Components ---

function Suggestion({ icon, label, color }: { icon: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
        <SuggestionIcon name={icon} className={`w-6 h-6 ${color}`} />
      </div>
      <span className="text-xs text-[#9ca3bf]">{label}</span>
    </div>
  );
}

function SuggestionIcon({ name, className }: { name: string; className: string }) {
  switch (name) {
    case "droplet":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      );
    case "stretch":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
      );
    case "water":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a8.25 8.25 0 0 0 6.364-13.636L12 1.636 5.636 7.364A8.25 8.25 0 0 0 12 21Z" />
        </svg>
      );
    default:
      return null;
  }
}
