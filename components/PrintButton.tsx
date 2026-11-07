/* ==========================================================
 * components/PrintButton.tsx — "Print program" button
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A button that opens the browser's print window.
 * LOGIC: onClick calls window.print().
 * WHY WE NEED IT: Members must be able to print current and past
 *   programs.
 * LEARNING GAP: 'use client' is required because onClick and
 *   window only exist in the browser. print:hidden keeps the
 *   button itself off the printed page.
 * ========================================================== */
'use client';

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-navy px-5 py-2 font-semibold text-white hover:bg-navy/90 print:hidden"
    >
      Print program
    </button>
  );
}
