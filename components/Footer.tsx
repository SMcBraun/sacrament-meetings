/* ==========================================================
 * components/Footer.tsx — Bottom bar on every page
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A simple footer with the ward name and year.
 * LOGIC: new Date().getFullYear() gets this year automatically.
 * WHY WE NEED IT: A consistent page ending, built once and used
 *   on every page through app/layout.tsx.
 * LEARNING GAP: print:hidden keeps it off printed programs.
 * ========================================================== */
export default function Footer() {
  return (
    <footer className="mt-12 bg-navy py-6 text-center text-sm text-white/80 print:hidden">
      <p>&copy; {new Date().getFullYear()} Waianae Ward | Sacrament Meeting Planner</p>
    </footer>
  );
}
