"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatDuration } from "@/lib/recipes";

/** A short chime, synthesised so the app ships no audio files. */
function playChime() {
  try {
    const AudioCtx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    // A rising third: pleasant, and distinct from a phone notification.
    [660, 880].forEach((frequency, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = frequency;
      const start = now + index * 0.18;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.3, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.5);
    });
    setTimeout(() => void ctx.close(), 1200);
  } catch {
    // Audio is a bonus; the visual state already says the tea is ready.
  }
}

export default function BrewTimer({
  seconds,
  label,
}: {
  seconds: number;
  label: string;
}) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  // Wall-clock deadline, so a backgrounded tab doesn't drift or pause.
  const deadlineRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;

    const tick = () => {
      if (deadlineRef.current === null) return;
      const left = Math.max(
        0,
        Math.round((deadlineRef.current - Date.now()) / 1000),
      );
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        setDone(true);
        deadlineRef.current = null;
        playChime();
      }
    };

    const id = window.setInterval(tick, 250);
    tick();
    return () => window.clearInterval(id);
  }, [running]);

  const start = useCallback(() => {
    // Starting from a finished timer means brewing again from the top.
    const base = remaining === 0 ? seconds : remaining;
    setRemaining(base);
    setDone(false);
    deadlineRef.current = Date.now() + base * 1000;
    setRunning(true);
  }, [remaining, seconds]);

  const pause = useCallback(() => {
    setRunning(false);
    deadlineRef.current = null;
  }, []);

  const reset = useCallback(() => {
    setRunning(false);
    setDone(false);
    deadlineRef.current = null;
    setRemaining(seconds);
  }, [seconds]);

  const progress = seconds === 0 ? 0 : 1 - remaining / seconds;
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-sm">
      <div className="flex flex-col items-center gap-5">
        <div className="relative grid place-items-center">
          <svg width="180" height="180" className="-rotate-90" aria-hidden="true">
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="var(--line)"
              strokeWidth="8"
            />
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={done ? "var(--leaf)" : "var(--brew)"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-300 ease-linear"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span
              className="font-display text-4xl font-semibold tabular-nums"
              role="timer"
              aria-live="off"
            >
              {formatDuration(remaining)}
            </span>
            <span className="mt-1 text-xs tracking-wide text-muted uppercase">
              {done ? "Ready" : running ? "Steeping" : label}
            </span>
          </div>
        </div>

        {/* Announced separately so screen readers get the result, not every tick. */}
        <p aria-live="polite" className="sr-only">
          {done ? "Your tea is ready." : ""}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={running ? pause : start}
            className="rounded-full bg-brew px-6 py-2.5 text-sm font-semibold text-cream transition-transform hover:scale-[1.03] active:scale-95"
          >
            {running ? "Pause" : done ? "Brew again" : remaining === seconds ? "Start timer" : "Resume"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:border-brew hover:text-brew"
          >
            Reset
          </button>
        </div>

        {done && (
          <p className="text-center text-sm font-medium text-leaf">
            Time&apos;s up — take it off the heat.
          </p>
        )}
      </div>
    </div>
  );
}
