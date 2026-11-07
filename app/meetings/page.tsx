/* ==========================================================
 * app/meetings/page.tsx — All meetings list (URL: "/meetings")
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Shows a card for every Sunday, newest first.
 * LOGIC: Fetch /api/meetings → sort by date (newest first) →
 *   show a MeetingCard for each one.
 * WHY WE NEED IT: The assignment requires this page to fetch
 *   from the API route and render MeetingCards.
 * LEARNING GAP: cache: 'no-store' always gets fresh data.
 *   [...meetings] makes a copy before sorting, so the original
 *   list isn't changed. 'YYYY-MM-DD' dates sort correctly as text.
 * ========================================================== */
import type { Metadata } from 'next';
import MeetingCard from '@/components/MeetingCard';
import { getBaseUrl } from '@/lib/base-url';
import type { SacramentMeeting } from '@/lib/types';

export const metadata: Metadata = {
  title: 'All Meetings | Waianae Ward',
};

export default async function MeetingsPage() {
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings`, { cache: 'no-store' });

  if (!response.ok) {
    throw new Error('Could not load meetings.');
  }

  const meetings: SacramentMeeting[] = await response.json();
  const newestFirst = [...meetings].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <h1 className="font-heading text-3xl font-bold text-navy">All Meetings</h1>
      <p className="mt-2 text-slate-700">Newest first. Choose a Sunday to view or print its program.</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {newestFirst.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </>
  );
}
