/* ==========================================================
 * app/(admin)/meetings/[id]/edit/page.tsx — Edit a meeting
 * ----------------------------------------------------------
 * PLAIN ENGLISH: The page where a bishopric member fixes an
 *   existing Sunday program. A bad or missing id shows a
 *   friendly "Meeting not found" page instead of crashing.
 * LOGIC: Read the id from the address → check it's a valid
 *   whole number → load the meeting → if none, call notFound()
 *   → otherwise show MeetingForm filled in, wired to
 *   updateMeeting.bind(null, meetingId).
 * WHY WE NEED IT: The assignment's edit form, notFound(), and
 *   bind() requirements.
 * LEARNING GAP: URL is /meetings/3/edit. params is a Promise in
 *   this Next.js version, so we "await" it. bind(null, meetingId)
 *   pre-fills the id, so the form only sends prevState + formData.
 *   notFound() shows not-found.tsx in this same folder.
 * WHERE THE DATA COMES FROM: The Neon "meetings" table, through
 *   getMeetingById() in lib/meetings-db.ts.
 * ========================================================== */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MeetingForm from '@/components/MeetingForm';
import { updateMeeting } from '@/lib/actions';
import { formatMeetingDate } from '@/lib/format';
import { getMeetingById } from '@/lib/meetings-db';

export const metadata: Metadata = {
  title: 'Edit Meeting | Waianae Ward',
};

/* The biggest id a Postgres "integer" column can hold. */
const MAX_DB_ID = 2147483647;

export default async function EditMeetingPage({
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

  const updateMeetingWithId = updateMeeting.bind(null, meetingId);

  return (
    <>
      <h1 className="font-heading text-3xl font-bold text-navy">Edit Meeting</h1>
      <p className="mt-2 text-slate-700">{formatMeetingDate(meeting.date)}</p>
      <MeetingForm
        action={updateMeetingWithId}
        meeting={meeting}
        submitLabel="Save changes"
      />
    </>
  );
}
