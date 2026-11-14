/* ==========================================================
 * app/(public)/meetings/[id]/page.tsx — One meeting (URL: /meetings/1)
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Shows the full program for one Sunday, with a
 *   Print button.
 * LOGIC: Read the id → check it's a valid number → ask the
 *   database for that meeting → if none, show "not found" →
 *   otherwise show MeetingDetail.
 * WHY WE NEED IT: The detail page for each meeting card.
 * LEARNING GAP: Before, this page fetched its OWN API over the
 *   internet, and that round trip failed on Vercel. Now it calls
 *   getMeetingById() directly, the same way the list page does.
 *   params is a Promise, so it's awaited. notFound() shows the
 *   built-in 404 page.
 * WHERE THE DATA COMES FROM: The Neon "meetings" table, through
 *   getMeetingById() in lib/meetings-db.ts.
 * ========================================================== */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import { getMeetingById } from '@/lib/meetings-db';

const MAX_DB_ID = 2147483647;

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId < 1 || meetingId > MAX_DB_ID) {
    notFound();
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    notFound();
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link href="/meetings" className="font-semibold text-navy hover:underline">
          ← Back to all meetings
        </Link>
        <PrintButton />
      </div>
      <MeetingDetail meeting={meeting} />
    </>
  );
}
