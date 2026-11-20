'use client';

/* ==========================================================
 * app/(admin)/meetings/error.tsx — "Something went wrong" page
 * ----------------------------------------------------------
 * PLAIN ENGLISH: The same friendly error page, for the admin
 *   pages (/meetings/new and /meetings/[id]/edit). If saving a
 *   meeting fails, this shows instead of a crash.
 * LOGIC: Same as the (public) error.tsx: Next.js passes in
 *   error and reset. Try again calls reset().
 * WHY WE NEED IT: createMeeting and updateMeeting throw a
 *   friendly Error if the database fails. Without an error.tsx
 *   in this route group, those errors would not be caught here.
 * LEARNING GAP: Each route group needs its own error.tsx,
 *   because an error boundary only covers its own folder.
 * ========================================================== */
import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminMeetingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
      <h1 className="font-heading text-3xl font-bold text-navy">Something went wrong</h1>
      <p className="mt-3 text-slate-700">
        We couldn&apos;t save that meeting. Please try again. If it keeps happening, go
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
