/* ==========================================================
 * app/meetings/current/page.tsx — Jump to this Sunday
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Finds the most recent Sunday and sends you to
 *   that meeting's page. If there's no meeting that day, it sends
 *   you to the list of all meetings.
 * LOGIC: Get today's date in Hawaii → getUTCDay() (0 = Sunday)
 *   → subtract that many days → look up that date in the
 *   database → redirect().
 * WHY WE NEED IT: The assignment requires /meetings/current to
 *   auto-redirect to the current Sunday's meeting.
 * LEARNING GAP: Example: Friday = day 5, so go back 5 days to
 *   Sunday. The date math is done in UTC on purpose so time zones
 *   can't shift the day. redirect() stops the page right there.
 *   The page is now "async" because it waits for the database.
 * WHERE THE DATA COMES FROM: The Neon "meetings" table, through
 *   getMeetingsByDate() in lib/meetings-db.ts.
 * ========================================================== */
import { redirect } from 'next/navigation';
import { getMeetingsByDate } from '@/lib/meetings-db';

export const dynamic = 'force-dynamic';

function getCurrentSundayIso(): string {
  const todayIso = new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Honolulu' });
  const [year, month, day] = todayIso.split('-').map(Number);
  const today = new Date(Date.UTC(year, month - 1, day));
  const sunday = new Date(today);
  sunday.setUTCDate(today.getUTCDate() - today.getUTCDay());
  return sunday.toISOString().slice(0, 10);
}

export default async function CurrentMeetingPage() {
  const [meeting] = await getMeetingsByDate(getCurrentSundayIso());

  if (meeting) {
    redirect(`/meetings/${meeting.id}`);
  }

  redirect('/meetings');
}
