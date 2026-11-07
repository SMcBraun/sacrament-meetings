/* ==========================================================
 * lib/types.ts — The "shapes" of my data (TypeScript types)
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Describes what a sacrament meeting looks like,
 *   like a blank printed program with labeled boxes.
 * LOGIC: "type" and "interface" define the fields each piece of
 *   data must have, and what kind of value goes in each one.
 * WHY WE NEED IT: Every file that uses meeting data follows these
 *   same rules. TypeScript warns me if I forget a field or put
 *   the wrong kind of value in one.
 * LEARNING GAP: These types only exist while coding. They don't
 *   show up on the website itself. "?" means optional.
 * ========================================================== */

/* ----------------------------------------------------------
 * MeetingType — the 4 allowed kinds of meetings
 * PLAIN ENGLISH: A meeting must be one of these 4 words.
 * LOGIC: The "|" means "or." Any other word causes an error.
 * WHY WE NEED IT: Prevents typos like 'testimonee'.
 * LEARNING GAP: stake and general are NOT sacrament meetings,
 *   but the app still tracks them on the calendar.
 * ---------------------------------------------------------- */
export type MeetingType =
  | 'testimony'
  | 'regular'
  | 'stake'
  | 'general';

/* ----------------------------------------------------------
 * Hymn — one hymn
 * PLAIN ENGLISH: A hymn has a number and a title.
 * LOGIC: number is a number; title is text.
 * WHY WE NEED IT: Used for the opening, sacrament, and closing
 *   hymns, so it's written once and reused 3 times.
 * LEARNING GAP: number has no quotes (169), title does.
 * ---------------------------------------------------------- */
export interface Hymn {
  number: number;
  title: string;
}

/* ----------------------------------------------------------
 * SpeakerItem — one speaker OR one musical number
 * PLAIN ENGLISH: Each item in the program body has a name, a
 *   topic, and says whether it's a talk or music.
 * LOGIC: type can only be 'speaker' or 'musical-number'.
 * WHY WE NEED IT: Talks and music share one list, in program
 *   order, so they print in the right sequence.
 * LEARNING GAP: For a musical number, topic can be '' (empty).
 * ---------------------------------------------------------- */
export interface SpeakerItem {
  name: string;
  topic: string;
  type: 'speaker' | 'musical-number';
}

/* ----------------------------------------------------------
 * WardBusinessItem — one item of ward business
 * PLAIN ENGLISH: Things like releases and sustainings.
 * LOGIC: Just one text field: description.
 * WHY WE NEED IT: A meeting can have several of these.
 * LEARNING GAP: It's an object (not plain text) so more fields
 *   can be added later without breaking anything.
 * ---------------------------------------------------------- */
export interface WardBusinessItem {
  description: string;
}

/* ----------------------------------------------------------
 * SacramentMeeting — the full program for one Sunday
 * PLAIN ENGLISH: Every box on the printed program.
 * LOGIC: Uses the smaller types above (Hymn, SpeakerItem, etc.).
 *   [] means "a list of." announcements? is optional.
 * WHY WE NEED IT: This is the main "form" the whole app uses.
 * LEARNING GAP: date is text in 'YYYY-MM-DD' format, for
 *   example '2026-05-03'. That makes dates easy to compare.
 * ---------------------------------------------------------- */
export interface SacramentMeeting {
  id: number;
  date: string; // ISO date string: 'YYYY-MM-DD'
  meetingType: MeetingType;
  presiding: string;
  conducting: string;
  announcements?: string[];
  openingHymn: Hymn;
  openingPrayer: string;
  wardBusiness: WardBusinessItem[];
  stakeBusiness: boolean;
  sacramentHymn: Hymn;
  speakers: SpeakerItem[];
  closingHymn: Hymn;
  closingPrayer: string;
}
