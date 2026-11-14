/* ==========================================================
 * components/MeetingSearch.tsx — Search box
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A search box that filters meetings by speaker,
 *   leader, or meeting type as you type.
 * LOGIC: Typing updates ?query= in the web address. The page
 *   reads the address and asks the database for matches.
 * WHY WE NEED IT: The assignment's URL-based search.
 * LEARNING GAP: 'use client' = runs in the browser (it reacts to
 *   typing). Debounce waits 300 ms after the last key, so it
 *   doesn't search on every letter. defaultValue (not value)
 *   keeps the web address as the "source of truth."
 * WHERE THE DATA COMES FROM: Only the address bar. The page
 *   does the database search.
 * ========================================================== */
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function MeetingSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (term.trim()) {
      params.set('query', term.trim());
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="mt-6">
      <input
        type="search"
        placeholder="Search by speaker, leader, or meeting type"
        defaultValue={searchParams.get('query')?.toString()}
        onChange={(e) => handleSearch(e.target.value)}
        aria-label="Search meetings"
        className="w-full rounded-md border border-slate-400 bg-white px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-navy"
      />
    </div>
  );
}
