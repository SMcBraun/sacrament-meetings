/* ==========================================================
 * app/api/meetings/[id]/route.ts — GET /api/meetings/[id]
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Sends back ONE meeting, chosen by its id.
 * LOGIC: Read the id from the address → check it's a valid
 *   number → look it up in the database → send 200, 400, or 404.
 * WHY WE NEED IT: The meeting detail page gets its data here.
 * LEARNING GAP: Same job as GET /books/:id in CSE 341.
 *   [id] in the folder name = a "dynamic" part of the address.
 *   200 = found, 400 = bad id (not a number), 404 = not found.
 * WHERE THE DATA COMES FROM: The Neon "meetings" table, through
 *   getMeetingById() in lib/meetings-db.ts.
 * ========================================================== */
import { getMeetingById } from '@/lib/meetings-db';

/* ----------------------------------------------------------
 * MAX_DB_ID — the biggest id the database can store
 * PLAIN ENGLISH: The id column (SERIAL) can't hold numbers
 *   bigger than this.
 * LOGIC: SERIAL is a 4-byte integer, which tops out at
 *   2,147,483,647.
 * WHY WE NEED IT: A huge id like 99999999999 would make the
 *   database throw an error (500). Checking first sends a clear
 *   400 instead.
 * LEARNING GAP: This is a safety check I added; it isn't in the
 *   assignment's example.
 * ---------------------------------------------------------- */
const MAX_DB_ID = 2147483647;

/* ----------------------------------------------------------
 * GET handler
 * PLAIN ENGLISH: Runs when someone visits /api/meetings/1.
 * LOGIC:
 *   - params is a Promise in this Next.js version, so we
 *     "await" it to get the id.
 *   - Number('abc') gives NaN ("not a number") → 400.
 *   - Ids below 1 or above MAX_DB_ID → 400.
 *   - "await getMeetingById" waits for the database.
 *   - No meeting with that id → 404.
 *   - Otherwise → 200 with the meeting.
 * WHY WE NEED IT: Returns clear status codes, like a real API.
 * LEARNING GAP: Without "await", meeting would be a Promise
 *   (a "please wait" ticket). A ticket is never empty, so the
 *   404 check would never run.
 * ---------------------------------------------------------- */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId) || meetingId < 1 || meetingId > MAX_DB_ID) {
    return Response.json({ error: 'Invalid meeting id. Use a number.' }, { status: 400 });
  }

  const meeting = await getMeetingById(meetingId);

  if (!meeting) {
    return Response.json({ error: 'Meeting not found.' }, { status: 404 });
  }

  return Response.json(meeting);
}
