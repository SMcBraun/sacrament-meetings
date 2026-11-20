/* ==========================================================
 * components/MeetingCard.tsx — Summary card for the list page
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A small card for one Sunday, with buttons to
 *   view the full program, edit it, or delete it.
 * LOGIC: Receives one meeting as a prop → shows its type, date,
 *   who's conducting, and how many speakers → View, Edit, and
 *   Delete buttons at the bottom.
 * WHY WE NEED IT: The assignment requires a MeetingCard that
 *   links to the detail page (Week 02), and a delete button on
 *   each card (Week 04).
 * LEARNING GAP: Same idea as ProjectCard in my portfolio.
 *   The sr-only text gives each link and button a unique name
 *   for screen readers (the fix I suggested in my code review!).
 *   This card stays a Server Component; only the small
 *   DeleteMeetingButton inside it is a Client Component.
 * ========================================================== */
import Link from 'next/link';
import DeleteMeetingButton from '@/components/DeleteMeetingButton';
import type { SacramentMeeting } from '@/lib/types';
import { formatMeetingDate, meetingTypeLabels } from '@/lib/format';

interface MeetingCardProps {
  meeting: SacramentMeeting;
}

export default function MeetingCard({ meeting }: MeetingCardProps) {
  const dateText = formatMeetingDate(meeting.date);
  const speakerCount = meeting.speakers.filter((item) => item.type === 'speaker').length;

  return (
    <article className="flex flex-col rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-gold-dark">
        {meetingTypeLabels[meeting.meetingType]}
      </p>
      <h2 className="mt-1 font-heading text-xl font-bold text-navy">{dateText}</h2>
      <p className="mt-2 text-slate-700">Conducting: {meeting.conducting}</p>
      <p className="text-slate-700">Speakers: {speakerCount}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/meetings/${meeting.id}`}
          className="rounded-full bg-navy px-4 py-2 font-semibold text-white hover:bg-navy/90"
        >
          View program<span className="sr-only">: {dateText}</span>
        </Link>
        <Link
          href={`/meetings/${meeting.id}/edit`}
          className="rounded-full border border-navy px-4 py-2 font-semibold text-navy hover:bg-navy/5"
        >
          Edit<span className="sr-only">: {dateText}</span>
        </Link>
        <DeleteMeetingButton id={meeting.id} label={dateText} />
      </div>
    </article>
  );
}
