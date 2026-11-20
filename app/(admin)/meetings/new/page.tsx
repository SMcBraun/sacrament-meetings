/* ==========================================================
 * app/(admin)/meetings/new/page.tsx — Create a meeting
 * ----------------------------------------------------------
 * PLAIN ENGLISH: The page where a bishopric member adds a new
 *   Sunday program.
 * LOGIC: Shows a heading and the shared MeetingForm, and hands
 *   it the createMeeting Server Action.
 * WHY WE NEED IT: The assignment says to wire the create form
 *   to createMeeting.
 * LEARNING GAP: URL is /meetings/new. "new" is a fixed word, so
 *   Next.js picks it over the [id] page. This page stays a
 *   Server Component; only MeetingForm is a Client Component.
 * WHERE THE DATA COMES FROM: Nothing to load. The form starts
 *   blank, and createMeeting saves to the Neon "meetings" table.
 * ========================================================== */
import type { Metadata } from 'next';
import MeetingForm from '@/components/MeetingForm';
import { createMeeting } from '@/lib/actions';

export const metadata: Metadata = {
  title: 'Create Meeting | Waianae Ward',
};

export default function NewMeetingPage() {
  return (
    <>
      <h1 className="font-heading text-3xl font-bold text-navy">Create Meeting</h1>
      <p className="mt-2 text-slate-700">
        Fill in the program for one Sunday. Boxes marked (required) must be filled in.
      </p>
      <MeetingForm action={createMeeting} submitLabel="Create meeting" />
    </>
  );
}
