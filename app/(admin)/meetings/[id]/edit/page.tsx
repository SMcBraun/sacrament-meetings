/* ==========================================================
 * app/(admin)/meetings/[id]/edit/page.tsx — Edit a meeting
 * ----------------------------------------------------------
 * PLAIN ENGLISH: A placeholder page for editing one meeting.
 * LOGIC: Reads the id from the address and shows it.
 * WHY WE NEED IT: Part of the assignment's admin folder plan.
 * LEARNING GAP: URL is /meetings/3/edit. params is a Promise
 *   in this Next.js version, so we "await" it.
 * ========================================================== */
export default async function EditMeetingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <h1 className="font-heading text-3xl font-bold text-navy">
      Edit Meeting {id} — Coming in Week 04
    </h1>
  );
}
