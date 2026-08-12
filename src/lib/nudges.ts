/**
 * Reminder cadence: a day, two days, a week — then leave people alone.
 * Pure, so the cron route is trivial and the schedule is testable.
 */

export const NUDGE_SCHEDULE = [24, 48, 168] as const;

type Invite = {
  sentAt: Date | null;
  reminderCount: number;
  submittedAt: Date | null;
};

const hoursSince = (d: Date, now: Date): number => (now.getTime() - d.getTime()) / 3600_000;

export const nextNudgeDue = (invite: Invite, now: Date = new Date()): boolean => {
  if (invite.submittedAt !== null) return false;
  if (invite.sentAt === null) return false;
  if (invite.reminderCount >= NUDGE_SCHEDULE.length) return false;
  return hoursSince(invite.sentAt, now) >= NUDGE_SCHEDULE[invite.reminderCount];
};
