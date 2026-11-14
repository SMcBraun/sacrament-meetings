/* ==========================================================
 * components/Pagination.tsx — Previous / Next page links
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Shows "Page X of Y" with Previous and Next
 *   links, 5 meetings per page.
 * LOGIC: Reads ?page= from the address. createPageURL() copies
 *   the current address (including ?query=) and changes only
 *   the page number.
 * WHY WE NEED IT: The assignment's pagination requirement.
 * LEARNING GAP: Keeping ?query= means page 2 of a search stays
 *   inside that search. Previous hides on page 1; Next hides on
 *   the last page.
 * WHERE THE DATA COMES FROM: totalPages comes from the page,
 *   which got it from getMeetingsTotalPages() (the database).
 * ========================================================== */
'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (totalPages < 1) return null;

  const linkStyle =
    'rounded-md bg-navy px-4 py-2 font-semibold text-white underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-navy focus:ring-offset-2';

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-4">
      {currentPage > 1 && (
        <Link href={createPageURL(currentPage - 1)} className={linkStyle}>
          ← Previous
        </Link>
      )}
      <span className="font-semibold text-slate-800">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link href={createPageURL(currentPage + 1)} className={linkStyle}>
          Next →
        </Link>
      )}
    </nav>
  );
}
