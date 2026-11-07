/* ==========================================================
 * lib/meetings-db.ts — Temporary in-memory meeting data
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A list of sample Sunday programs, plus two
 *   helper functions to look them up.
 * LOGIC: The data is a plain array (list) that lives in memory.
 *   The functions filter or search that list.
 * WHY WE NEED IT: The API routes need data to send. A real
 *   database comes in later weeks; this is a stand-in for now.
 * LEARNING GAP: "In-memory" means the data resets when the
 *   server restarts. That's fine this week. Same idea as my
 *   CSE 341 Books API model, but without MongoDB.
 * ========================================================== */

/* ----------------------------------------------------------
 * Import the SacramentMeeting type
 * PLAIN ENGLISH: Bring in the "form" from types.ts.
 * LOGIC: "import type" brings in only the shape, not code.
 * WHY WE NEED IT: TypeScript checks that every meeting below
 *   has every required field.
 * LEARNING GAP: './types' means "types.ts in this same folder."
 * ---------------------------------------------------------- */
import type { SacramentMeeting } from './types';

/* ----------------------------------------------------------
 * meetings — the sample data
 * PLAIN ENGLISH: 7 Sundays of programs.
 * LOGIC: An array of SacramentMeeting objects. Each needs a
 *   unique id.
 * WHY WE NEED IT: The assignment requires at least 5 records.
 *   May 3 matches the assignment's test URL, and Oct 25 through
 *   Nov 22 covers "this Sunday" whenever the app is checked.
 * LEARNING GAP: Stake and general conference are not sacrament
 *   meetings, but the type still requires every field, so they
 *   have simple placeholder values.
 * ---------------------------------------------------------- */
const meetings: SacramentMeeting[] = [
  {
    id: 1,
    date: '2026-05-03',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: ['Ward temple night: May 10'],
    openingHymn: { number: 2, title: 'The Spirit of God' },
    openingPrayer: 'Sister Williams',
    wardBusiness: [{ description: 'Sustaining of new Primary president' }],
    stakeBusiness: false,
    sacramentHymn: { number: 169, title: 'As Now We Take the Sacrament' },
    speakers: [
      { name: 'Sister Brown', topic: 'Faith in Jesus Christ', type: 'speaker' },
      { name: 'Youth Choir', topic: '', type: 'musical-number' },
      { name: 'Brother Lee', topic: 'The Power of Prayer', type: 'speaker' },
    ],
    closingHymn: { number: 31, title: 'O God, Our Help in Ages Past' },
    closingPrayer: 'Brother Davis',
  },
  {
    id: 2,
    date: '2026-10-04',
    meetingType: 'general',
    presiding: 'First Presidency',
    conducting: 'General Conference Broadcast',
    announcements: ['General Conference: watch at home or at the stake center'],
    openingHymn: { number: 19, title: 'We Thank Thee, O God, for a Prophet' },
    openingPrayer: 'As assigned',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 0, title: 'No sacrament (General Conference)' },
    speakers: [],
    closingHymn: { number: 152, title: 'God Be with You Till We Meet Again' },
    closingPrayer: 'As assigned',
  },
  {
    id: 3,
    date: '2026-10-25',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Tanaka',
    announcements: ['Ward Halloween party: Oct 30 at 6 pm', 'Youth service project: Nov 7'],
    openingHymn: { number: 85, title: 'How Firm a Foundation' },
    openingPrayer: 'Sister Kealoha',
    wardBusiness: [
      { description: 'Release of Sister Park as Relief Society secretary' },
      { description: 'Sustaining of Sister Cruz as Relief Society secretary' },
    ],
    stakeBusiness: true,
    sacramentHymn: { number: 193, title: 'I Stand All Amazed' },
    speakers: [
      { name: 'Brother Cruz', topic: 'Serving Others', type: 'speaker' },
      { name: 'Sister Nakamura', topic: '', type: 'musical-number' },
      { name: 'Sister Fonoti', topic: 'Following the Prophet', type: 'speaker' },
    ],
    closingHymn: { number: 98, title: 'I Need Thee Every Hour' },
    closingPrayer: 'Brother Silva',
  },
  {
    id: 4,
    date: '2026-11-01',
    meetingType: 'testimony',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: ['Fast offerings may be given online or to a member of the bishopric'],
    openingHymn: { number: 136, title: 'I Know That My Redeemer Lives' },
    openingPrayer: 'Brother Wong',
    wardBusiness: [{ description: 'Baby blessing: Kai Mahoe' }],
    stakeBusiness: false,
    sacramentHymn: { number: 171, title: 'With Humble Heart' },
    speakers: [],
    closingHymn: { number: 166, title: 'Abide with Me!' },
    closingPrayer: 'Sister Alapai',
  },
  {
    id: 5,
    date: '2026-11-08',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Tanaka',
    announcements: ['Ward Thanksgiving dinner: Nov 21 at 5 pm'],
    openingHymn: { number: 72, title: 'Praise to the Lord, the Almighty' },
    openingPrayer: 'Sister Kahale',
    wardBusiness: [],
    stakeBusiness: false,
    sacramentHymn: { number: 146, title: 'Gently Raise the Sacred Strain' },
    speakers: [
      { name: 'Sister Aquino', topic: 'Gratitude', type: 'speaker' },
      { name: 'Primary Children', topic: '', type: 'musical-number' },
      { name: 'Brother Kahale', topic: 'Ministering Like the Savior', type: 'speaker' },
    ],
    closingHymn: { number: 116, title: 'Come, Follow Me' },
    closingPrayer: 'Brother Reyes',
  },
  {
    id: 6,
    date: '2026-11-15',
    meetingType: 'stake',
    presiding: 'President Kaleo',
    conducting: 'President Kaleo',
    announcements: ['Stake conference at the stake center at 10 am. No ward meetings today.'],
    openingHymn: { number: 30, title: 'Come, Come, Ye Saints' },
    openingPrayer: 'As assigned',
    wardBusiness: [],
    stakeBusiness: true,
    sacramentHymn: { number: 0, title: 'No sacrament (stake conference)' },
    speakers: [],
    closingHymn: { number: 3, title: 'Now Let Us Rejoice' },
    closingPrayer: 'As assigned',
  },
  {
    id: 7,
    date: '2026-11-22',
    meetingType: 'regular',
    presiding: 'Bishop Smith',
    conducting: 'Brother Jones',
    announcements: ['Christmas program practice: Dec 6 after church'],
    openingHymn: { number: 6, title: 'Redeemer of Israel' },
    openingPrayer: 'Sister Nakamura',
    wardBusiness: [{ description: 'Sustaining of Brother Silva as Sunday School teacher' }],
    stakeBusiness: false,
    sacramentHymn: { number: 172, title: 'In Humility, Our Savior' },
    speakers: [
      { name: 'Brother Wong', topic: 'Thanksgiving and Gratitude', type: 'speaker' },
      { name: 'Sister Cruz', topic: 'Living with Joy', type: 'speaker' },
    ],
    closingHymn: { number: 301, title: 'I Am a Child of God' },
    closingPrayer: 'Sister Aquino',
  },
];

/* ----------------------------------------------------------
 * getMeetings — get all meetings, or one date
 * PLAIN ENGLISH: "Give me every meeting," or "give me the
 *   meeting on this date."
 * LOGIC: If a date is given, filter() keeps only matches.
 *   Otherwise return the whole list.
 * WHY WE NEED IT: Used by GET /api/meetings and the
 *   ?date= search.
 * LEARNING GAP: date?: string | null means the date is
 *   optional AND can be null (what the URL gives when there's
 *   no ?date=). Always returns an array, even if empty.
 * ---------------------------------------------------------- */
export function getMeetings(date?: string | null): SacramentMeeting[] {
  if (date) return meetings.filter((m) => m.date === date);
  return meetings;
}

/* ----------------------------------------------------------
 * getMeetingById — get one meeting by its id
 * PLAIN ENGLISH: "Give me meeting number 3."
 * LOGIC: find() returns the first match. If nothing matches,
 *   ?? null returns null instead of undefined.
 * WHY WE NEED IT: Used by GET /api/meetings/[id].
 * LEARNING GAP: Returning null lets the API route send a 404
 *   (not found), just like my CSE 341 getBookById.
 * ---------------------------------------------------------- */
export function getMeetingById(id: number): SacramentMeeting | null {
  return meetings.find((m) => m.id === id) ?? null;
}
