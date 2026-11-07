/* ==========================================================
 * components/Header.tsx — Top bar: ward name, date, and menu
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Shows the ward name, today's date, and the menu.
 * LOGIC: new Date() gets today; toLocaleDateString formats it in
 *   Hawaii time. NavLinks is placed inside.
 * WHY WE NEED IT: The assignment requires the header to show the
 *   ward name and the current date.
 * LEARNING GAP: This is a Server Component (no 'use client').
 *   It can still hold a Client Component (NavLinks) inside it.
 *   print:hidden hides the header when the program is printed.
 * ========================================================== */
import Link from 'next/link';
import NavLinks from './NavLinks';

const WARD_NAME = 'Waianae Ward';

export default function Header() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Pacific/Honolulu',
  });

  return (
    <header className="bg-navy text-white print:hidden">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="font-heading text-2xl font-bold">
            {WARD_NAME}
          </Link>
          <p className="text-sm text-white/80">{today}</p>
        </div>
        <NavLinks />
      </div>
    </header>
  );
}
