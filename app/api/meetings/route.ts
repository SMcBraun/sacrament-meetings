/* ==========================================================
 * app/api/meetings/route.ts — GET /api/meetings
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Sends back meetings from the database, or only
 *   the meeting on a certain date.
 * LOGIC: Read ?date= from the web address → if there is a date,
 *   call getMeetingsByDate(); if not, call getMeetings() →
 *   send the result as JSON.
 * WHY WE NEED IT: Other apps (and testers) can get the meeting
 *   data as plain JSON from this address.
 * LEARNING GAP: Same job as GET /books in my CSE 341 API.
 *   Examples: /api/meetings and /api/meetings?date=2026-03-01
 * WHERE THE DATA COMES FROM: The Neon "meetings" table, through
 *   the functions in lib/meetings-db.ts.
 * ========================================================== */
import { getMeetings, getMeetingsByDate } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

/* ----------------------------------------------------------
 * GET handler
 * PLAIN ENGLISH: Runs when someone visits /api/meetings.
 * LOGIC: searchParams.get('date') returns the date text, or
 *   null if there's no ?date=. The "? :" picks which function to
 *   call: date given → exact date; no date → getMeetings().
 * WHY WE NEED IT: Lets the app ask for meetings or one date.
 * LEARNING GAP: "await" waits for the database to answer.
 *   Without it, the code would send back a Promise (a "please
 *   wait" ticket) instead of the actual meetings.
 *   getMeetings() with no inputs returns page 1 (the 5 newest),
 *   the same way the assignment's example works.
 * ---------------------------------------------------------- */
export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get('date');
  const meetings: SacramentMeeting[] = date
    ? await getMeetingsByDate(date)
    : await getMeetings();
  return Response.json(meetings);
}
