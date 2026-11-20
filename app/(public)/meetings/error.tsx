'use client';

/* ==========================================================
 * app/(public)/meetings/error.tsx — "Something went wrong" page
 * ----------------------------------------------------------
 * PLAIN ENGLISH: If something unexpected breaks on a meetings
 *   page (like the database being down, or a delete failing),
 *   this friendly page shows instead of a crash, with a
 *   "Try again" button and a link back to all meetings.
 * LOGIC: Next.js wraps the meetings pages in this "error
 *   boundary." When an error is thrown, it shows this file and
 *   passes in two props: error (what broke) and reset (a
 *   function that tries to show the page again).
 * WHY WE NEED IT: The assignment asks for an error.tsx Client
 *   Component with a Try Again button that calls reset() and a
 *   link back to /meetings.
 * LEARNING GAP: The assignment says app/meetings/error.tsx, but
 *   my meetings pages live in TWO route groups, (public) and
 *   (admin). An error.tsx only covers the folder it's in, so
 *   there is one here (list, detail) and one in (admin) (new,
 *   edit). error.tsx MUST be a Client Component ('use client')
 *   because the Try again button needs a click handler.
 * ========================================================== */
import { useEffect } from 'react';
import Link from 'next/link';

export default function MeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /* Log the real error for the developer (shows in the browser
     console). Users only see the friendly message below. */
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
      <h1 className="font-heading text-3xl font-bold text-navy">Something went wrong</h1>
      <p className="mt-3 text-slate-700">
        We couldn&apos;t finish that request. Please try again. If it keeps happening, go
        back to all meetings and try once more.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-navy px-5 py-2 font-semibold text-white hover:bg-navy/90"
        >
          Try again
        </button>
        <Link
          href="/meetings"
          className="rounded-full border border-navy px-5 py-2 font-semibold text-navy hover:bg-navy/5"
        >
          Back to all meetings
        </Link>
      </div>
    </div>
  );
}
