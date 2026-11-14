/* ==========================================================
 * app/(admin)/layout.tsx — Admin section layout
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A wrapper for the pages that will create and
 *   edit meetings. Shows a note that sign-in is coming later.
 * LOGIC: (admin) is a "route group." The parentheses keep the
 *   word "admin" OUT of the web address.
 * WHY WE NEED IT: Keeps admin pages separate from member pages,
 *   so Week 05 can add sign-in to this whole section at once.
 * LEARNING GAP: /meetings/new lives here, but the address is
 *   still /meetings/new (no "/admin").
 * ========================================================== */
import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section>
      <p className="mb-4 rounded-md bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900">
        Admin area: sign-in is coming in Week 05.
      </p>
      {children}
    </section>
  );
}
