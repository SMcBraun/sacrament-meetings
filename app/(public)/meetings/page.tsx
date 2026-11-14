/* ==========================================================
 * app/(public)/meetings/page.tsx — Meetings list (URL: "/meetings")
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Shows meeting cards, 5 per page, with a search
 *   box and Previous/Next links.
 * LOGIC: Read ?query= and ?page= from the address → ask the
 *   database for that page AND the total page count at the same
 *   time (Promise.all) → show the cards and page links.
 * WHY WE NEED IT: The assignment's search + pagination page.
 * LEARNING GAP: searchParams is a Promise in this Next.js
 *   version, so we "await" it. Math.max(1, ...) stops bad pages
 *   like ?page=-3 from breaking the database query.
 * WHERE THE DATA COMES FROM: The Neon "meetings" table, through
 *   getMeetings() and getMeetingsTotalPages() in lib/meetings-db.ts.
 * ========================================================== */
import type { Metadata } from 'next';
import MeetingCard from '@/components/MeetingCard';
import MeetingSearch from '@/components/MeetingSearch';
import Pagination from '@/components/Pagination';
import { getMeetings, getMeetingsTotalPages } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'All Meetings | Waianae Ward',
};

export default async function MeetingsPage(props: {
  searchParams: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Math.max(1, Math.floor(Number(searchParams?.page)) || 1);

  const [meetings, totalPages] = await Promise.all([
    getMeetings(query, currentPage),
    getMeetingsTotalPages(query),
  ]);

  return (
    <>
      <h1 className="font-heading text-3xl font-bold text-navy">All Meetings</h1>
      <p className="mt-2 text-slate-700">Newest first. Choose a Sunday to view or print its program.</p>
      <MeetingSearch />
      {meetings.length === 0 ? (
        <p className="mt-6 text-slate-700">No meetings match your search.</p>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meetings.map((m) => (
            <MeetingCard key={m.id} meeting={m} />
          ))}
        </div>
      )}
      <Pagination totalPages={totalPages} />
    </>
  );
}
