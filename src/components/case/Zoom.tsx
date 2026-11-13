"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";

const WIDTH = 1100;
const STEPS = [1, 1.5, 2.25, 3];

/**
 * A figure that opens full screen at its desktop width, for phones: it starts fitted to the screen,
 * then − / + (or a pinch) zoom in and the figure pans in both directions. Desktops never need it.
 */
export function Zoom({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [fit, setFit] = useState(1);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open) d.showModal();
    else if (d.open) d.close();
  }, [open]);
  const show = () => {
    setFit(Math.min(1, (window.innerWidth - 32) / WIDTH));
    setStep(0);
    setOpen(true);
  };

  const tool =
    "grid size-11 place-items-center rounded-full bg-ink text-[20px] leading-none text-wall disabled:opacity-35";
  return (
    <>
      {children}
      <button
        type="button"
        onClick={show}
        className="mx-auto mt-5 flex items-center gap-2 rounded-full border border-ink/25 px-4 py-2 text-[14px] md:hidden"
      >
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="size-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" />
        </svg>
        Zoom in
      </button>
      <dialog
        ref={ref}
        aria-label={label}
        onClose={() => setOpen(false)}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none bg-wall p-0 text-ink backdrop:bg-ink/60"
      >
        {open && (
          <div className="flex h-full flex-col">
            <div className="flex items-center gap-2 border-b border-ink/10 px-4 py-3">
              <button
                type="button"
                aria-label="Zoom out"
                className={tool}
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
              >
                −
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                className={tool}
                disabled={step === STEPS.length - 1}
                onClick={() => setStep((s) => s + 1)}
              >
                +
              </button>
              <span className="ml-1 text-[14px] tabular-nums text-muted">
                {Math.round(fit * STEPS[step]! * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="ml-auto rounded-full bg-ink px-5 py-2.5 text-[15px] text-wall"
              >
                Close
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-4 [touch-action:pan-x_pan-y_pinch-zoom]">
              <div
                className="@container rounded-lg bg-panel p-8"
                style={{ width: WIDTH, zoom: fit * STEPS[step]! }}
              >
                {children}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
