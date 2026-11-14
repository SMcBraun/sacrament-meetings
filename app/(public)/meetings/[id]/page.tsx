/* ==========================================================
 * app/meetings/[id]/page.tsx — One meeting (URL: /meetings/1)
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Shows the full program for one Sunday, with a
 *   Print button.
 * LOGIC: Read the id → fetch /api/meetings/[id] → if 400 or 404,
 *   show the "not found" page → otherwise show MeetingDetail.
 * WHY WE NEED IT: The assignment requires this page to fetch
 *   from the API and render MeetingDetail, plus print mode.
 * LEARNING GAP: params is a Promise in this Next.js version, so
 *   it's awaited. notFound() shows Next.js's built-in 404 page.
 * ========================================================== */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MeetingDetail from '@/components/MeetingDetail';
import PrintButton from '@/components/PrintButton';
import { getBaseUrl } from '@/lib/base-url';
import type { SacramentMeeting } from '@/lib/types';

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const baseUrl = await getBaseUrl();
  const response = await fetch(`${baseUrl}/api/meetings/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  });

  if (response.status === 400 || response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error('Could not load this meeting.');
  }

  const meeting: SacramentMeeting = await response.json();

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
