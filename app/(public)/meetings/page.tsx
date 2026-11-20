/* ==========================================================
 * app/(public)/meetings/page.tsx — Meetings list (URL: "/meetings")
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Shows meeting cards, 5 per page, with a search
 *   box, Previous/Next links, and an "Add meeting" button.
 * LOGIC: Read ?query= and ?page= from the address → ask the
 *   database for that page AND the total page count at the same
 *   time (Promise.all) → show the cards and page links.
 * WHY WE NEED IT: The assignment's search + pagination page, and
 *   (Week 04) the starting point for create, edit, and delete.
 * LEARNING GAP: searchParams is a Promise in this Next.js
 *   version, so we "await" it. Math.max(1, ...) stops bad pages
 *   like ?page=-3 from breaking the database query. After a
 *   create, edit, or delete, revalidatePath('/meetings') in
 *   lib/actions.ts makes this page show fresh data right away.
 * WHERE THE DATA COMES FROM: The Neon "meetings" table, through
 *   getMeetings() and getMeetingsTotalPages() in lib/meetings-db.ts.
 * ========================================================== */
import type { Metadata } from 'next';
import Link from 'next/link';
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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-bold text-navy">All Meetings</h1>
        <Link
          href="/meetings/new"
          className="rounded-full bg-navy px-5 py-2 font-semibold text-white hover:bg-navy/90"
        >
          + Add meeting
        </Link>
      </div>
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
