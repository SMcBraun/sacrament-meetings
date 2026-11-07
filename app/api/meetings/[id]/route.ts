/* ==========================================================
 * app/api/meetings/[id]/route.ts — GET /api/meetings/[id]
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Sends back ONE meeting, chosen by its id.
 * LOGIC: Read the id from the address → check it's a number →
 *   look it up → send 200, 400, or 404.
 * WHY WE NEED IT: The meeting detail page gets its data here.
 * LEARNING GAP: Same job as GET /books/:id in CSE 341.
 *   [id] in the folder name = a "dynamic" part of the address.
 *   200 = found, 400 = bad id (not a number), 404 = not found.
 * ========================================================== */
import { getMeetingById } from '@/lib/meetings-db';

/* ----------------------------------------------------------
 * GET handler
 * PLAIN ENGLISH: Runs when someone visits /api/meetings/1.
 * LOGIC:
 *   - In this Next.js version, params is a Promise, so we
 *     "await" it to get the id.
 *   - Number('abc') gives NaN ("not a number") → 400.
 *   - No meeting with that id → 404.
 *   - Otherwise → 200 with the meeting.
 * WHY WE NEED IT: Returns clear status codes, like a real API.
 * LEARNING GAP: Number.isInteger() also rejects decimals like
 *   1.5. The id from the address is always text at first, so
 *   it must be converted to a number.
 * ---------------------------------------------------------- */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = Number(id);

  if (!Number.isInteger(meetingId)) {
    return Response.json({ error: 'Invalid meeting id. Use a number.' }, { status: 400 });
  }

  const meeting = getMeetingById(meetingId);

  if (!meeting) {
    return Response.json({ error: 'Meeting not found.' }, { status: 404 });
  }

  return Response.json(meeting);
}
