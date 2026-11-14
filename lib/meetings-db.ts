/* ==========================================================
 * lib/meetings-db.ts — Meeting data from the Neon database
 * ----------------------------------------------------------
 * PLAIN ENGLISH: The functions that ask the database for
 *   sacrament meeting programs.
 * LOGIC: Each function sends a SQL query to Neon (Postgres)
 *   and returns the rows in the SacramentMeeting shape.
 * WHY WE NEED IT: Week 02 kept meetings in a list inside the
 *   code, which reset when the server restarted. Now the data
 *   lives in a real database, so it stays saved.
 * LEARNING GAP: Every function is now "async" (it waits for the
 *   database), so every file that calls them must use "await".
 *   Same idea as my CSE 340 Postgres models, but with Neon.
 * WHERE THE DATA COMES FROM: The "meetings" table I created
 *   and filled in the Vercel Query tab (10 Waianae Ward
 *   meetings). DATABASE_URL in .env.local tells the code where
 *   that database is.
 * ========================================================== */

/* ----------------------------------------------------------
 * Imports
 * PLAIN ENGLISH: Bring in the Neon "phone line" and the
 *   SacramentMeeting form from types.ts.
 * LOGIC: neon() creates a connection; "import type" brings in
 *   only the shape, not code.
 * WHY WE NEED IT: neon lets us run SQL; the type lets
 *   TypeScript check the data we return.
 * LEARNING GAP: '@neondatabase/serverless' is the package I
 *   installed with npm install.
 * ---------------------------------------------------------- */
import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

/* ----------------------------------------------------------
 * sql — the database connection
 * PLAIN ENGLISH: Dial the database using its address.
 * LOGIC: process.env.DATABASE_URL reads the secret address
 *   from .env.local (on my laptop) or from Vercel (online).
 * WHY WE NEED IT: Every query below uses sql`...`.
 * LEARNING GAP: The "!" tells TypeScript "trust me, this value
 *   exists." If DATABASE_URL is missing, the app can't connect.
 * ---------------------------------------------------------- */
const sql = neon(process.env.DATABASE_URL!);

/* ----------------------------------------------------------
 * ITEMS_PER_PAGE — how many meetings per page
 * PLAIN ENGLISH: Show 5 meetings at a time.
 * LOGIC: Used for LIMIT (how many) and OFFSET (how many to skip).
 * WHY WE NEED IT: Pagination. 10 meetings = 2 pages.
 * LEARNING GAP: Page 1 skips 0, page 2 skips 5, page 3 skips 10.
 * ---------------------------------------------------------- */
const ITEMS_PER_PAGE = 5;

/* ----------------------------------------------------------
 * getMeetings — search + one page of meetings
 * PLAIN ENGLISH: "Give me page 2 of meetings that mention
 *   'smith'." No search word = all meetings.
 * LOGIC: ILIKE is a case-insensitive "contains" search. The %
 *   signs mean "anything before or after." ORDER BY date DESC
 *   puts the newest first. LIMIT/OFFSET picks the page.
 * WHY WE NEED IT: The /meetings page search box and the
 *   GET /api/meetings route.
 * LEARNING GAP: "AS "meetingType"" renames database columns
 *   (snake_case) to match my TypeScript names (camelCase).
 *   ${searchTerm} is safely filled in by neon, which stops SQL
 *   injection. Never glue user text into SQL with + signs.
 * ---------------------------------------------------------- */
export async function getMeetings(
  query: string = '',
  currentPage: number = 1
): Promise<SacramentMeeting[]> {
  const searchTerm = `%${query}%`;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE
      presiding     ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;
  return rows as unknown as SacramentMeeting[];
}

/* ----------------------------------------------------------
 * getMeetingsTotalPages — how many pages for a search
 * PLAIN ENGLISH: "How many pages of results are there?"
 * LOGIC: COUNT(*) counts matching rows, then divide by 5 and
 *   round UP with Math.ceil (6 meetings = 2 pages, not 1.2).
 * WHY WE NEED IT: The Pagination component needs to know when
 *   to hide the "Next" link.
 * LEARNING GAP: Uses the SAME WHERE as getMeetings, so the page
 *   count always matches the search results.
 * ---------------------------------------------------------- */
export async function getMeetingsTotalPages(
  query: string = ''
): Promise<number> {
  const searchTerm = `%${query}%`;
  const rows = await sql`
    SELECT COUNT(*) FROM meetings
    WHERE
      presiding     ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
  `;
  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

/* ----------------------------------------------------------
 * getMeetingsByDate — meetings on one exact date
 * PLAIN ENGLISH: "Give me the meeting on 2026-03-01."
 * LOGIC: to_char turns the date into 'YYYY-MM-DD' text, then
 *   compares it to the date from the URL.
 * WHY WE NEED IT: Keeps GET /api/meetings?date=... working.
 *   The new getMeetings searches words, not exact dates.
 * LEARNING GAP: Comparing as text means a bad date like
 *   ?date=abc just returns [] (empty) instead of crashing.
 *   This is my own addition, not in the assignment's example.
 * ---------------------------------------------------------- */
export async function getMeetingsByDate(
  date: string
): Promise<SacramentMeeting[]> {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings
    WHERE to_char(date, 'YYYY-MM-DD') = ${date}
  `;
  return rows as unknown as SacramentMeeting[];
}

/* ----------------------------------------------------------
 * getMeetingById — one meeting by its id
 * PLAIN ENGLISH: "Give me meeting number 3."
 * LOGIC: WHERE id = ${id} finds one row. rows[0] is the first
 *   (and only) match. ?? null returns null if nothing matched.
 * WHY WE NEED IT: GET /api/meetings/[id] and the detail page.
 * LEARNING GAP: Returning null lets the API route send a 404,
 *   just like before. Same name and input as Week 02, so the
 *   route only needs "await" added.
 * ---------------------------------------------------------- */
export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | null> {
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                AS "openingHymn",
      opening_prayer              AS "openingPrayer",
      ward_business               AS "wardBusiness",
      stake_business              AS "stakeBusiness",
      sacrament_hymn              AS "sacramentHymn",
      speakers,
      closing_hymn                AS "closingHymn",
      closing_prayer              AS "closingPrayer"
    FROM meetings WHERE id = ${id}
  `;
  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

/* ----------------------------------------------------------
 * Mutation stubs — add, update, delete (Week 04)
 * PLAIN ENGLISH: Placeholders for creating, editing, and
 *   deleting meetings. They don't work yet on purpose.
 * LOGIC: Each one throws an error that says "coming in Week 04."
 * WHY WE NEED IT: The assignment says to keep these names and
 *   inputs now, so the Week 04 forms can plug right in.
 * LEARNING GAP: Omit<SacramentMeeting, 'id'> means "a meeting
 *   without an id" (the database makes the id). Partial<> means
 *   "only some fields," since an edit may change just one thing.
 * ---------------------------------------------------------- */
export async function addMeeting(
  data: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  throw new Error('addMeeting: database implementation coming in Week 04');
}

export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>
): Promise<SacramentMeeting | null> {
  throw new Error('updateMeeting: database implementation coming in Week 04');
}

export async function deleteMeeting(id: number): Promise<boolean> {
  throw new Error('deleteMeeting: database implementation coming in Week 04');
}