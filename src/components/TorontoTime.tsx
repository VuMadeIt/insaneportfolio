"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Toronto",
  hour: "numeric",
  minute: "2-digit",
});

const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 15_000);
  return () => clearInterval(id);
};
const now = () => format.format(new Date());

/** My local time, with a moon after dark (footer-reference.png). Empty until it is on the client. */
export function TorontoTime() {
  const time = useSyncExternalStore(subscribe, now, () => "");
  // "9:46 PM": night is 6 PM to 6 AM.
  const h = Number(time.split(":")[0]) % 12;
  const night = time.endsWith("PM") ? h >= 6 : h < 6;
  return (
    <p className="mt-2 flex h-[1.6em] items-center gap-1.5 text-[14px] text-muted">
      {time && (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            {night ? (
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            ) : (
              <>
                <circle cx="12" cy="12" r="5" />
                <path
                  d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </>
            )}
          </svg>
          {time}, Toronto
        </>
      )}
    </p>
  );
}
