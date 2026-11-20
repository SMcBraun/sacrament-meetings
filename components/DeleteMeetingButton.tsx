'use client';

/* ==========================================================
 * components/DeleteMeetingButton.tsx — Delete one meeting
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A small form with a Delete button. It asks
 *   "Are you sure?" first, then sends the meeting id to the
 *   deleteMeeting Server Action.
 * LOGIC: <form action={deleteMeeting}> + a hidden box with the
 *   id. onSubmit shows a confirm box; if the user clicks Cancel,
 *   preventDefault() stops the form, so nothing is deleted.
 * WHY WE NEED IT: The assignment asks for a delete button on
 *   each meeting card, connected to a small form that submits to
 *   deleteMeeting with the meeting id.
 * LEARNING GAP: 'use client' is needed only for the "Are you
 *   sure?" pop-up (window.confirm runs in the browser). The
 *   delete itself still runs on the server. The sr-only text
 *   gives each button a unique name for screen readers, like
 *   "Delete: Sunday, January 4, 2026".
 * ========================================================== */
import { deleteMeeting } from '@/lib/actions';

interface DeleteMeetingButtonProps {
  id: number;
  label: string;
}

export default function DeleteMeetingButton({ id, label }: DeleteMeetingButtonProps) {
  return (
    <form
      action={deleteMeeting}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the meeting for ${label}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-red-700 px-4 py-2 font-semibold text-red-700 hover:bg-red-50"
      >
        Delete<span className="sr-only">: {label}</span>
      </button>
    </form>
  );
}
