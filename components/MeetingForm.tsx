'use client';

/* ==========================================================
 * components/MeetingForm.tsx — Create / edit meeting form
 * ----------------------------------------------------------
 * PLAIN ENGLISH: The form a bishopric member fills in to add a
 *   new Sunday program or fix an existing one. If something is
 *   wrong, a message shows right under the box that needs fixing.
 * LOGIC: useActionState(action, initialState) runs the Server
 *   Action on submit and gives back three things: state (the
 *   server's "report card"), formAction (what the form calls),
 *   and isPending (true while saving).
 * WHY WE NEED IT: The assignment asks for the create and edit
 *   forms to be Client Components using useActionState, with
 *   field-level errors, aria-describedby, and aria-live.
 * LEARNING GAP: One form file is shared by BOTH pages. The new
 *   page passes createMeeting; the edit page passes
 *   updateMeeting.bind(null, id) plus the current meeting, so
 *   the boxes start filled in. 'use client' is needed because
 *   useActionState is a React hook, and hooks only run in the
 *   browser.
 * WHERE THE DATA COMES FROM: Edit mode gets the meeting from the
 *   edit page (getMeetingById). After a failed submit, the boxes
 *   refill from state.values sent back by the Server Action.
 * ========================================================== */

/* ----------------------------------------------------------
 * Imports
 * PLAIN ENGLISH: React's form hook, the Link tool, my types,
 *   and the friendly meeting type names.
 * LOGIC: "import type" only brings in shapes, so no server code
 *   is sent to the browser.
 * WHY WE NEED IT: The form needs State/FieldName to read errors.
 * LEARNING GAP: Importing a TYPE from lib/actions.ts is fine in a
 *   Client Component, because types disappear when the code runs.
 * ---------------------------------------------------------- */
import { useActionState } from 'react';
import Link from 'next/link';
import type { FieldName, State } from '@/lib/actions';
import type { MeetingType, SacramentMeeting } from '@/lib/types';
import { meetingTypeLabels } from '@/lib/format';

/* ----------------------------------------------------------
 * Props
 * PLAIN ENGLISH: What each page hands to the form.
 * LOGIC: action = which Server Action to run; meeting = the
 *   current meeting (edit only); submitLabel = button words.
 * WHY WE NEED IT: Lets one form work for both create and edit.
 * LEARNING GAP: "meeting?" has a ? because the create page has
 *   no meeting yet.
 * ---------------------------------------------------------- */
interface MeetingFormProps {
  action: (prevState: State, formData: FormData) => Promise<State>;
  meeting?: SacramentMeeting;
  submitLabel: string;
}

/* The starting "report card": no message, no errors yet. */
const initialState: State = { message: null, errors: {} };

/* ----------------------------------------------------------
 * toFormValues — meeting → text for each box
 * PLAIN ENGLISH: Turn a saved meeting back into the text the
 *   boxes show, like a speakers list → one line per speaker.
 * LOGIC: The reverse of toMeetingData() in lib/actions.ts.
 *   Musical numbers start with "Music:". The checkbox uses 'on'.
 * WHY WE NEED IT: So the edit form starts filled in.
 * LEARNING GAP: Numbers become text with String(), because every
 *   box holds text, even a number box.
 * ---------------------------------------------------------- */
function toFormValues(meeting?: SacramentMeeting): Record<FieldName, string> {
  const speakerLines = (meeting?.speakers ?? []).map((item) => {
    const line = item.topic ? `${item.name} | ${item.topic}` : item.name;
    return item.type === 'musical-number' ? `Music: ${line}` : line;
  });

  return {
    date: meeting?.date ?? '',
    meetingType: meeting?.meetingType ?? '',
    presiding: meeting?.presiding ?? '',
    conducting: meeting?.conducting ?? '',
    announcements: (meeting?.announcements ?? []).join('\n'),
    openingHymnNumber: meeting ? String(meeting.openingHymn.number) : '',
    openingHymnTitle: meeting?.openingHymn.title ?? '',
    openingPrayer: meeting?.openingPrayer ?? '',
    wardBusiness: (meeting?.wardBusiness ?? [])
      .map((item) => item.description)
      .join('\n'),
    stakeBusiness: meeting?.stakeBusiness ? 'on' : '',
    sacramentHymnNumber: meeting ? String(meeting.sacramentHymn.number) : '',
    sacramentHymnTitle: meeting?.sacramentHymn.title ?? '',
    speakers: speakerLines.join('\n'),
    closingHymnNumber: meeting ? String(meeting.closingHymn.number) : '',
    closingHymnTitle: meeting?.closingHymn.title ?? '',
    closingPrayer: meeting?.closingPrayer ?? '',
  };
}

/* ----------------------------------------------------------
 * Shared styles
 * PLAIN ENGLISH: The look for labels, boxes, hints, and errors,
 *   written once and reused.
 * LOGIC: Tailwind class strings. focus:ring shows a clear blue
 *   outline for keyboard users.
 * WHY WE NEED IT: Same look everywhere, less copy-paste.
 * LEARNING GAP: text-red-700 on white passes color contrast, so
 *   error messages are readable (a Lighthouse check).
 * ---------------------------------------------------------- */
const labelClass = 'block font-semibold text-navy';
const hintClass = 'mt-1 text-sm text-slate-600';
const inputClass =
  'mt-1 w-full rounded-md border border-slate-400 bg-white px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy';

/* ----------------------------------------------------------
 * FieldError — the error message area under one box
 * PLAIN ENGLISH: An area under each box where error messages
 *   appear. Screen readers read them out loud when they change.
 * LOGIC: id="presiding-error" matches the box's
 *   aria-describedby. aria-live="polite" means "announce changes
 *   when the user pauses." The area is ALWAYS on the page (even
 *   when empty), so screen readers notice when text appears.
 * WHY WE NEED IT: The assignment's accessibility requirement.
 * LEARNING GAP: aria-describedby links the box to its message,
 *   like a sticky note attached to the box. aria-atomic="true"
 *   reads the whole message, not just the changed part.
 * ---------------------------------------------------------- */
function FieldError({ id, errors }: { id: string; errors?: string[] }) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((message) => (
        <p key={message} className="mt-1 text-sm font-semibold text-red-700">
          {message}
        </p>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------
 * TextField — one labeled box (input or text area)
 * PLAIN ENGLISH: A label, an optional hint, the box itself, and
 *   its error area, all wired together.
 * LOGIC: <label htmlFor="presiding"> matches <input id="presiding">,
 *   so clicking the label puts the cursor in the box and screen
 *   readers say the label. aria-describedby lists the hint id and
 *   the error id. aria-invalid tells screen readers "this box has
 *   a problem."
 * WHY WE NEED IT: 14 boxes share the same wiring, so it's
 *   written once here.
 * LEARNING GAP: defaultValue (not value) lets the user type
 *   freely; React only uses it as the starting text.
 * ---------------------------------------------------------- */
interface TextFieldProps {
  name: FieldName;
  label: string;
  defaultValue: string;
  errors?: string[];
  hint?: string;
  required?: boolean;
  type?: 'text' | 'date' | 'number';
  multiline?: boolean;
}

function TextField({
  name,
  label,
  defaultValue,
  errors,
  hint,
  required = false,
  type = 'text',
  multiline = false,
}: TextFieldProps) {
  const errorId = `${name}-error`;
  const hintId = `${name}-hint`;
  const describedBy = hint ? `${hintId} ${errorId}` : errorId;
  const hasError = Boolean(errors?.length);

  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}
        {required && <span className="font-normal text-slate-600"> (required)</span>}
      </label>
      {hint && (
        <p id={hintId} className={hintClass}>
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea
          id={name}
          name={name}
          rows={4}
          defaultValue={defaultValue}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          className={inputClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          min={type === 'number' ? 0 : undefined}
          defaultValue={defaultValue}
          aria-describedby={describedBy}
          aria-invalid={hasError || undefined}
          aria-required={required || undefined}
          className={inputClass}
        />
      )}
      <FieldError id={errorId} errors={errors} />
    </div>
  );
}

/* ----------------------------------------------------------
 * HymnFields — number + title for one hymn
 * PLAIN ENGLISH: A small group for one hymn (opening,
 *   sacrament, or closing), with its own heading.
 * LOGIC: <fieldset> groups related boxes; <legend> is the group
 *   name screen readers say first ("Opening hymn, Number").
 * WHY WE NEED IT: Each meeting has 3 hymns with the same 2 boxes.
 * LEARNING GAP: fieldset + legend is the accessible way to
 *   group boxes, instead of just a bold heading.
 * ---------------------------------------------------------- */
function HymnFields({
  legend,
  numberName,
  titleName,
  values,
  errors,
}: {
  legend: string;
  numberName: FieldName;
  titleName: FieldName;
  values: Partial<Record<FieldName, string>>;
  errors?: Partial<Record<FieldName, string[]>>;
}) {
  return (
    <fieldset className="rounded-lg border border-navy/15 p-4">
      <legend className="px-1 font-heading text-lg font-bold text-navy">{legend}</legend>
      <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
        <TextField
          name={numberName}
          label="Number"
          type="number"
          required
          defaultValue={values[numberName] ?? ''}
          errors={errors?.[numberName]}
        />
        <TextField
          name={titleName}
          label="Title"
          required
          defaultValue={values[titleName] ?? ''}
          errors={errors?.[titleName]}
        />
      </div>
    </fieldset>
  );
}

/* ----------------------------------------------------------
 * MeetingForm — the whole form
 * PLAIN ENGLISH: All the boxes for one Sunday program, a form
 *   message at the top, and Save / Cancel buttons.
 * LOGIC: values = what the user typed last time (after an error)
 *   OR the saved meeting OR blanks. noValidate turns off the
 *   browser's own pop-up checks, so the SERVER (Zod) messages
 *   show instead, which is what the assignment tests.
 * WHY WE NEED IT: The main create/edit experience.
 * LEARNING GAP: isPending disables the button while saving, so a
 *   double-click can't create two copies of the same meeting.
 * ---------------------------------------------------------- */
export default function MeetingForm({ action, meeting, submitLabel }: MeetingFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const values = state.values ?? toFormValues(meeting);
  const errors = state.errors;

  return (
    <form action={formAction} noValidate className="mt-6 space-y-6">
      <div id="form-message" aria-live="polite" aria-atomic="true">
        {state.message && (
          <p className="rounded-md border border-red-300 bg-red-50 px-4 py-3 font-semibold text-red-800">
            {state.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          name="date"
          label="Date"
          type="date"
          required
          defaultValue={values.date ?? ''}
          errors={errors?.date}
        />

        <div>
          <label htmlFor="meetingType" className={labelClass}>
            Meeting type<span className="font-normal text-slate-600"> (required)</span>
          </label>
          <select
            id="meetingType"
            name="meetingType"
            defaultValue={values.meetingType ?? ''}
            aria-describedby="meetingType-error"
            aria-invalid={Boolean(errors?.meetingType?.length) || undefined}
            aria-required
            className={inputClass}
          >
            <option value="">Choose a meeting type</option>
            {(Object.keys(meetingTypeLabels) as MeetingType[]).map((type) => (
              <option key={type} value={type}>
                {meetingTypeLabels[type]}
              </option>
            ))}
          </select>
          <FieldError id="meetingType-error" errors={errors?.meetingType} />
        </div>

        <TextField
          name="presiding"
          label="Presiding"
          required
          defaultValue={values.presiding ?? ''}
          errors={errors?.presiding}
        />
        <TextField
          name="conducting"
          label="Conducting"
          required
          defaultValue={values.conducting ?? ''}
          errors={errors?.conducting}
        />
      </div>

      <TextField
        name="announcements"
        label="Announcements"
        multiline
        hint="Optional. One announcement per line."
        defaultValue={values.announcements ?? ''}
        errors={errors?.announcements}
      />

      <HymnFields
        legend="Opening hymn"
        numberName="openingHymnNumber"
        titleName="openingHymnTitle"
        values={values}
        errors={errors}
      />

      <TextField
        name="openingPrayer"
        label="Opening prayer"
        required
        defaultValue={values.openingPrayer ?? ''}
        errors={errors?.openingPrayer}
      />

      <TextField
        name="wardBusiness"
        label="Ward business"
        multiline
        hint="Optional. One item per line, for example a release or sustaining."
        defaultValue={values.wardBusiness ?? ''}
        errors={errors?.wardBusiness}
      />

      <div className="flex items-center gap-3">
        <input
          id="stakeBusiness"
          name="stakeBusiness"
          type="checkbox"
          defaultChecked={values.stakeBusiness === 'on'}
          className="h-5 w-5 rounded border-slate-400 text-navy focus:ring-2 focus:ring-navy"
        />
        <label htmlFor="stakeBusiness" className="font-semibold text-navy">
          Stake business this week
        </label>
      </div>

      <HymnFields
        legend="Sacrament hymn"
        numberName="sacramentHymnNumber"
        titleName="sacramentHymnTitle"
        values={values}
        errors={errors}
      />

      <TextField
        name="speakers"
        label="Speakers and musical numbers"
        multiline
        hint='One per line, in program order: Name | Topic. Start a musical number with "Music:", for example Music: Primary Children | I Am a Child of God. Leave blank for testimony meetings.'
        defaultValue={values.speakers ?? ''}
        errors={errors?.speakers}
      />

      <HymnFields
        legend="Closing hymn"
        numberName="closingHymnNumber"
        titleName="closingHymnTitle"
        values={values}
        errors={errors}
      />

      <TextField
        name="closingPrayer"
        label="Closing prayer"
        required
        defaultValue={values.closingPrayer ?? ''}
        errors={errors?.closingPrayer}
      />

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-navy px-6 py-2 font-semibold text-white hover:bg-navy/90 disabled:opacity-60"
        >
          {isPending ? 'Saving…' : submitLabel}
        </button>
        <Link href="/meetings" className="font-semibold text-navy hover:underline">
          Cancel
        </Link>
      </div>
    </form>
  );
}
