/* ==========================================================
 * app/meetings/layout.tsx — Layout for the meetings section
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Wraps every /meetings page with a small
 *   section menu: "All Meetings · This Sunday".
 * LOGIC: A "nested layout": it sits INSIDE the root layout, and
 *   only for pages in the app/meetings folder.
 * WHY WE NEED IT: The assignment requires a section layout for
 *   meetings-specific navigation.
 * LEARNING GAP: Root layout = whole site. This layout = only the
 *   meetings pages. {children} = the page being visited.
 * ========================================================== */
import Link from 'next/link';

export default function MeetingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 print:max-w-none print:p-0">
      <nav aria-label="Meetings section" className="mb-6 text-sm print:hidden">
        <Link href="/meetings" className="font-semibold text-navy hover:underline">
          All Meetings
        </Link>
        <span className="mx-2 text-slate-500" aria-hidden="true">
          ·
        </span>
        <Link href="/meetings/current" className="font-semibold text-navy hover:underline">
          This Sunday
        </Link>
      </nav>
      {children}
    </div>
  );
}
