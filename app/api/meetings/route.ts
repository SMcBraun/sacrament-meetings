/* ==========================================================
 * app/api/meetings/route.ts — GET /api/meetings
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Sends back the list of all meetings, or only
 *   the meeting on a certain date.
 * LOGIC: Read ?date= from the web address → call getMeetings()
 *   → send the result as JSON.
 * WHY WE NEED IT: The meetings page gets its data from here.
 * LEARNING GAP: Same job as GET /books in my CSE 341 API.
 *   Examples: /api/meetings and /api/meetings?date=2026-05-03
 * ========================================================== */
import { getMeetings } from '@/lib/meetings-db';
import type { SacramentMeeting } from '@/lib/types';

/* ----------------------------------------------------------
 * GET handler
 * PLAIN ENGLISH: Runs when someone visits /api/meetings.
 * LOGIC: new URL(request.url).searchParams.get('date') returns
 *   the date text, or null if there's no ?date= in the address.
 * WHY WE NEED IT: Lets the app ask for all meetings or one date.
 * LEARNING GAP: Response.json() sends data with status 200 (OK)
 *   by default. The "SacramentMeeting[]" type is a promise of
 *   what's being sent back (no "any").
 * ---------------------------------------------------------- */
export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get('date');
  const meetings: SacramentMeeting[] = getMeetings(date);
  return Response.json(meetings);
}
