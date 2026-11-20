'use server';

/* ==========================================================
 * lib/actions.ts — Server Actions: create, update, delete
 * ----------------------------------------------------------
 * PLAIN ENGLISH: The code that runs on the SERVER when a
 *   bishopric member clicks "Create meeting", "Save changes",
 *   or "Delete". It checks the form, saves to the database,
 *   refreshes the list, and sends the user back to /meetings.
 * LOGIC: 'use server' at the very top marks every exported
 *   function in this file as a Server Action. A form can call
 *   one directly with action={...}, with no API route needed.
 * WHY WE NEED IT: The Week 04 assignment requires create,
 *   update, and delete to be handled by Server Actions in
 *   lib/actions.ts, using the live SQL in lib/meetings-db.ts.
 * LEARNING GAP: A Server Action is like a "private hallway"
 *   only my own forms can use. My HomeBase API routes are the
 *   "front desk" any app can call. Same job (saving data),
 *   different door. A 'use server' file may only EXPORT async
 *   functions (and types), so the Zod schema and helpers below
 *   are NOT exported.
 * WHERE THE DATA COMES FROM: The form fields the user typed
 *   (FormData), checked by Zod, then saved to the Neon
 *   "meetings" table through lib/meetings-db.ts.
 * ========================================================== */

/* ----------------------------------------------------------
 * Imports
 * PLAIN ENGLISH: Bring in Zod (the form checker), the Next.js
 *   "refresh" and "go to page" tools, my database functions,
 *   and my types.
 * LOGIC: The database functions are renamed with "as" because
 *   the Server Actions below use the same names.
 * WHY WE NEED IT: Without renaming, there would be two
 *   functions called updateMeeting in one file.
 * LEARNING GAP: "updateMeeting as updateMeetingInDb" means
 *   "inside this file, call it updateMeetingInDb."
 * ---------------------------------------------------------- */
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  addMeeting,
  updateMeeting as updateMeetingInDb,
  deleteMeeting as deleteMeetingInDb,
} from './meetings-db';
import type { SacramentMeeting, SpeakerItem } from './types';

/* ----------------------------------------------------------
 * FieldName + State — what the form gets back
 * PLAIN ENGLISH: The list of form boxes, and the "report card"
 *   the server sends back to the form after a submit.
 * LOGIC: State has a message for the whole form, an optional
 *   list of errors for each box, and the values the user typed
 *   (so the form can refill itself after an error).
 * WHY WE NEED IT: useActionState in the form reads this to show
 *   error messages under the right boxes.
 * LEARNING GAP: Partial<Record<FieldName, string[]>> means
 *   "maybe an error list for some of the boxes," for example
 *   { presiding: ['Presiding is required.'] }.
 * ---------------------------------------------------------- */
export type FieldName =
  | 'date'
  | 'meetingType'
  | 'presiding'
  | 'conducting'
  | 'announcements'
  | 'openingHymnNumber'
  | 'openingHymnTitle'
  | 'openingPrayer'
  | 'wardBusiness'
  | 'stakeBusiness'
  | 'sacramentHymnNumber'
  | 'sacramentHymnTitle'
  | 'speakers'
  | 'closingHymnNumber'
  | 'closingHymnTitle'
  | 'closingPrayer';

export type State = {
  message: string | null;
  errors?: Partial<Record<FieldName, string[]>>;
  values?: Partial<Record<FieldName, string>>;
};

/* ----------------------------------------------------------
 * Helpers — turn text boxes into lists
 * PLAIN ENGLISH: The form uses "one item per line" text boxes.
 *   These split the text into a list, one item per line.
 * LOGIC: split('\n') breaks at each new line, trim() removes
 *   extra spaces, filter(Boolean) drops empty lines.
 *   parseSpeakers also reads "Name | Topic" and treats lines
 *   that start with "Music:" as a musical number.
 * WHY WE NEED IT: The database stores lists (text[] and jsonb),
 *   but a text box gives one long string.
 * LEARNING GAP: (line): SpeakerItem => tells TypeScript each
 *   item is a SpeakerItem, so 'speaker' | 'musical-number' is
 *   checked exactly.
 * ---------------------------------------------------------- */
function splitLines(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseSpeakers(text: string): SpeakerItem[] {
  return splitLines(text).map((line): SpeakerItem => {
    const isMusic = /^music:/i.test(line);
    const rest = isMusic ? line.replace(/^music:/i, '').trim() : line;
    const [name = '', ...topicParts] = rest.split('|');
    return {
      name: name.trim(),
      topic: topicParts.join('|').trim(),
      type: isMusic ? 'musical-number' : 'speaker',
    };
  });
}

/* Checks that '2026-02-30' is a REAL calendar date. */
function isRealDate(value: string): boolean {
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

/* ----------------------------------------------------------
 * MeetingFormSchema — the Zod "form checker"
 * PLAIN ENGLISH: The rules every form must pass before it is
 *   saved, like "presiding can't be blank" and "the date must
 *   be a real date."
 * LOGIC: z.object({...}) lists each field and its rules. Each
 *   rule has a plain-English message that shows under the box.
 *   z.coerce.number() turns the typed text "169" into 169.
 * WHY WE NEED IT: The assignment requires server-side checking
 *   with Zod's safeParse before writing to the database.
 * LEARNING GAP: Checking on the SERVER matters even if the
 *   browser checks too, because anyone can skip the browser.
 *   Hymn number 0 means "no hymn number" (conference weeks),
 *   which matches formatHymn() in lib/format.ts.
 * ---------------------------------------------------------- */
const requiredText = (label: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required.` })
    .max(150, { message: `${label} must be 150 characters or less.` });

const hymnNumber = z
  .string()
  .trim()
  .min(1, { message: 'Enter a hymn number (use 0 if there is none).' })
  .transform((value) => Number(value))
  .pipe(
    z
      .number({ message: 'Hymn number must be a number.' })
      .int({ message: 'Hymn number must be a whole number.' })
      .min(0, { message: 'Hymn number cannot be negative.' })
      .max(9999, { message: 'Hymn number is too large.' })
  );

const MeetingFormSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Choose a date.' })
    .refine(isRealDate, { message: 'Choose a real calendar date.' }),
  meetingType: z.enum(['testimony', 'regular', 'stake', 'general'], {
    message: 'Choose a meeting type.',
  }),
  presiding: requiredText('Presiding'),
  conducting: requiredText('Conducting'),
  announcements: z
    .string()
    .max(3000, { message: 'Announcements are too long.' }),
  openingHymnNumber: hymnNumber,
  openingHymnTitle: requiredText('Opening hymn title'),
  openingPrayer: requiredText('Opening prayer'),
  wardBusiness: z
    .string()
    .max(3000, { message: 'Ward business is too long.' }),
  stakeBusiness: z.boolean(),
  sacramentHymnNumber: hymnNumber,
  sacramentHymnTitle: requiredText('Sacrament hymn title'),
  speakers: z
    .string()
    .max(3000, { message: 'The speakers list is too long.' })
    .refine((text) => parseSpeakers(text).every((item) => item.name), {
      message: 'Each line needs a name before the | sign.',
    }),
  closingHymnNumber: hymnNumber,
  closingHymnTitle: requiredText('Closing hymn title'),
  closingPrayer: requiredText('Closing prayer'),
});

type MeetingFormData = z.infer<typeof MeetingFormSchema>;

/* ----------------------------------------------------------
 * readForm + readValues — pull values out of the form
 * PLAIN ENGLISH: Read what the user typed in each box.
 * LOGIC: formData.get('presiding') reads one box. A checkbox
 *   sends 'on' only when it is checked. readValues keeps the
 *   raw text so the form can refill itself after an error.
 * WHY WE NEED IT: Zod needs a plain object to check, and the
 *   form needs the typed values back if something is wrong.
 * LEARNING GAP: formData.get() can return a File or null, so
 *   text() makes sure we always hand Zod a string.
 * ---------------------------------------------------------- */
const FIELD_NAMES: FieldName[] = [
  'date',
  'meetingType',
  'presiding',
  'conducting',
  'announcements',
  'openingHymnNumber',
  'openingHymnTitle',
  'openingPrayer',
  'wardBusiness',
  'stakeBusiness',
  'sacramentHymnNumber',
  'sacramentHymnTitle',
  'speakers',
  'closingHymnNumber',
  'closingHymnTitle',
  'closingPrayer',
];

function text(formData: FormData, key: FieldName): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function readValues(formData: FormData): Partial<Record<FieldName, string>> {
  return Object.fromEntries(
    FIELD_NAMES.map((key) => [key, text(formData, key)])
  );
}

function readForm(formData: FormData) {
  return {
    ...readValues(formData),
    stakeBusiness: formData.get('stakeBusiness') === 'on',
  };
}

/* ----------------------------------------------------------
 * toMeetingData — checked form → database shape
 * PLAIN ENGLISH: Turn the checked form into a SacramentMeeting
 *   (without an id) that lib/meetings-db.ts knows how to save.
 * LOGIC: Hymn number + title become one { number, title }
 *   bundle. Text boxes become lists with the helpers above.
 * WHY WE NEED IT: The form has 16 flat boxes, but the database
 *   stores bundles and lists.
 * LEARNING GAP: Omit<SacramentMeeting, 'id'> = a meeting with no
 *   id yet, because the database makes the id.
 * ---------------------------------------------------------- */
function toMeetingData(data: MeetingFormData): Omit<SacramentMeeting, 'id'> {
  return {
    date: data.date,
    meetingType: data.meetingType,
    presiding: data.presiding,
    conducting: data.conducting,
    announcements: splitLines(data.announcements),
    openingHymn: { number: data.openingHymnNumber, title: data.openingHymnTitle },
    openingPrayer: data.openingPrayer,
    wardBusiness: splitLines(data.wardBusiness).map((description) => ({
      description,
    })),
    stakeBusiness: data.stakeBusiness,
    sacramentHymn: {
      number: data.sacramentHymnNumber,
      title: data.sacramentHymnTitle,
    },
    speakers: parseSpeakers(data.speakers),
    closingHymn: { number: data.closingHymnNumber, title: data.closingHymnTitle },
    closingPrayer: data.closingPrayer,
  };
}

/* ----------------------------------------------------------
 * createMeeting — Server Action for the "Create meeting" form
 * PLAIN ENGLISH: Check the form → if something is wrong, send
 *   the errors back to the form → if it's good, save it, refresh
 *   the list, and go to /meetings.
 * LOGIC: safeParse() checks without crashing. If it fails,
 *   return a State with field errors (no throw). If the database
 *   fails, log the real error and throw a friendly one, which
 *   error.tsx catches. revalidatePath clears the old cached
 *   list; redirect sends the user to the list.
 * WHY WE NEED IT: Wired to the create form with useActionState.
 * LEARNING GAP: prevState is required by useActionState (it is
 *   the last State), even though we don't use it. redirect() is
 *   OUTSIDE try...catch on purpose: it works by "throwing," and
 *   a catch would swallow it.
 * ---------------------------------------------------------- */
export async function createMeeting(
  prevState: State,
  formData: FormData
): Promise<State> {
  const values = readValues(formData);
  const validated = MeetingFormSchema.safeParse(readForm(formData));

  if (!validated.success) {
    return {
      message: 'Some fields need attention. Please fix the errors below.',
      errors: z.flattenError(validated.error).fieldErrors,
      values,
    };
  }

  try {
    await addMeeting(toMeetingData(validated.data));
  } catch (error) {
    console.error('Database error in createMeeting:', error);
    throw new Error('We could not save the meeting. Please try again.');
  }

  revalidatePath('/meetings');
  redirect('/meetings');
}

/* ----------------------------------------------------------
 * updateMeeting — Server Action for the edit form
 * PLAIN ENGLISH: Same as create, but changes an existing
 *   meeting instead of adding a new one.
 * LOGIC: The edit page uses updateMeeting.bind(null, id), so
 *   "id" is filled in ahead of time and the form only sends
 *   prevState + formData. If the meeting was deleted meanwhile,
 *   the database returns null and we show a message.
 * WHY WE NEED IT: Wired to the edit form with useActionState.
 * LEARNING GAP: .bind(null, id) is like pre-filling the first
 *   blank on a form. The id comes from the web address
 *   (/meetings/3/edit), never from a form box someone could change.
 * ---------------------------------------------------------- */
export async function updateMeeting(
  id: number,
  prevState: State,
  formData: FormData
): Promise<State> {
  const values = readValues(formData);
  const validated = MeetingFormSchema.safeParse(readForm(formData));

  if (!validated.success) {
    return {
      message: 'Some fields need attention. Please fix the errors below.',
      errors: z.flattenError(validated.error).fieldErrors,
      values,
    };
  }

  let updated: SacramentMeeting | null = null;

  try {
    updated = await updateMeetingInDb(id, toMeetingData(validated.data));
  } catch (error) {
    console.error('Database error in updateMeeting:', error);
    throw new Error('We could not save your changes. Please try again.');
  }

  if (!updated) {
    return {
      message: 'This meeting no longer exists. It may have been deleted.',
      values,
    };
  }

  revalidatePath('/meetings');
  revalidatePath(`/meetings/${id}`);
  redirect('/meetings');
}

/* ----------------------------------------------------------
 * deleteMeeting — Server Action for the Delete button
 * PLAIN ENGLISH: Remove one meeting, then refresh the list.
 * LOGIC: The small delete form sends the meeting id in a
 *   hidden box. Check it's a real whole number → delete →
 *   revalidatePath so the card disappears right away.
 * WHY WE NEED IT: Each meeting card has a Delete button.
 * LEARNING GAP: No redirect here, because the user is already
 *   on /meetings. Hidden boxes can be changed by a tricky user,
 *   so the id is checked before it reaches the database.
 * ---------------------------------------------------------- */
export async function deleteMeeting(formData: FormData): Promise<void> {
  const id = Number(formData.get('id'));

  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw new Error('That meeting could not be found.');
  }

  try {
    await deleteMeetingInDb(id);
  } catch (error) {
    console.error('Database error in deleteMeeting:', error);
    throw new Error('We could not delete the meeting. Please try again.');
  }

  revalidatePath('/meetings');
}
