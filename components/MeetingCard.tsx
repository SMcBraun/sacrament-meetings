/* ==========================================================
 * components/MeetingCard.tsx — Summary card for the list page
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A small card for one Sunday, with a link to the
 *   full program.
 * LOGIC: Receives one meeting as a prop → shows its type, date,
 *   who's conducting, and how many speakers.
 * WHY WE NEED IT: The assignment requires a MeetingCard that
 *   takes a SacramentMeeting prop and links to the detail page.
 * LEARNING GAP: Same idea as ProjectCard in my portfolio.
 *   The sr-only text gives each link a unique name for screen
 *   readers (the fix I suggested in my code review!).
 * ========================================================== */
import Link from 'next/link';
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
      <Link
        href={`/meetings/${meeting.id}`}
        className="mt-4 self-start rounded-full bg-navy px-4 py-2 font-semibold text-white hover:bg-navy/90"
      >
        View program<span className="sr-only">: {dateText}</span>
      </Link>
    </article>
  );
}
