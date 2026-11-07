/* ==========================================================
 * lib/format.ts — Small helpers for showing data nicely
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Turns raw data into friendly text, like
 *   '2026-05-03' → 'Sunday, May 3, 2026'.
 * LOGIC: Plain functions that take data in and return text.
 * WHY WE NEED IT: The card and detail views both need these, so
 *   they're written once here and reused (no copy-paste).
 * LEARNING GAP: The date is built in UTC on purpose. Otherwise
 *   time zones can shift '2026-05-03' back to May 2.
 * ========================================================== */
import type { Hymn, MeetingType } from './types';

/* Turns '2026-05-03' into 'Sunday, May 3, 2026'. */
export function formatMeetingDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/* A friendly name for each meeting type. Record<> means every
   MeetingType must have a label, or TypeScript shows an error. */
export const meetingTypeLabels: Record<MeetingType, string> = {
  testimony: 'Fast and Testimony Meeting',
  regular: 'Sacrament Meeting',
  stake: 'Stake Conference',
  general: 'General Conference',
};

/* Shows '#2 – The Spirit of God'. Number 0 means "no hymn
   number" (conference weeks), so only the title shows. */
export function formatHymn(hymn: Hymn): string {
  return hymn.number > 0 ? `#${hymn.number} – ${hymn.title}` : hymn.title;
}
