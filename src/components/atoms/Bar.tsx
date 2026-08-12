"use client";

/** Atom — a filled track. Receives a percentage; never computes one. */

type Props = {
  pct: number;
  tone: string;
  track: string;
  testId?: string;
};

export function Bar({ pct, tone, track, testId = "bar-fill" }: Props) {
  return (
    <div className="relative mt-2 h-1.5" style={{ backgroundColor: track }}>
      <div
        className="h-full"
        data-testid={testId}
        style={{ width: `${pct}%`, backgroundColor: tone }}
      />
    </div>
  );
}
