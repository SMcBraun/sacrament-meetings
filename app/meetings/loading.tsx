/* ==========================================================
 * app/meetings/loading.tsx — Loading message for meetings pages
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Shows "Loading meetings..." while a meetings
 *   page is getting its data.
 * LOGIC: Next.js shows this file automatically while a page in
 *   this folder is loading.
 * WHY WE NEED IT: The assignment requires a route-level loading
 *   state.
 * LEARNING GAP: With in-memory data it may flash too fast to
 *   see. That's expected. It matters once a real database adds
 *   wait time. role="status" lets screen readers announce it.
 * ========================================================== */
export default function Loading() {
  return (
    <p role="status" className="py-12 text-center text-lg text-slate-600">
      Loading meetings...
    </p>
  );
}
