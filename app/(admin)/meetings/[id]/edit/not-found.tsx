/* ==========================================================
 * app/(admin)/meetings/[id]/edit/not-found.tsx — Missing meeting
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A friendly page that says "Meeting not found"
 *   with a link back to all meetings.
 * LOGIC: When the edit page calls notFound(), Next.js shows this
 *   file instead of the page (and sends a 404 status).
 * WHY WE NEED IT: The assignment asks for a not-found page for
 *   meeting ids that don't exist, like /meetings/9999/edit.
 * LEARNING GAP: 404 means "that thing doesn't exist" (the user's
 *   address is wrong). That is different from error.tsx, which
 *   is for when OUR code or the database breaks (a 500).
 * ========================================================== */
import Link from 'next/link';

export default function MeetingNotFound() {
  return (
    <div className="rounded-xl border border-navy/10 bg-white p-8 text-center shadow-sm">
      <h1 className="font-heading text-3xl font-bold text-navy">Meeting not found</h1>
      <p className="mt-3 text-slate-700">
        We couldn&apos;t find that meeting. It may have been deleted, or the address may be
        wrong.
      </p>
      <Link
        href="/meetings"
        className="mt-6 inline-block rounded-full bg-navy px-5 py-2 font-semibold text-white hover:bg-navy/90"
      >
        Back to all meetings
      </Link>
    </div>
  );
}
