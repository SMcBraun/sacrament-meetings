/* ==========================================================
 * components/MeetingDetail.tsx — The full program for one Sunday
 * ----------------------------------------------------------
 * PLAIN ENGLISH: Shows everything on the program, in order:
 *   announcements, opening, business, sacrament, speakers and
 *   music, and closing.
 * LOGIC: Receives one meeting as a prop and shows every field
 *   from the SacramentMeeting type.
 * WHY WE NEED IT: The assignment requires a MeetingDetail view
 *   with hymns, prayers, speakers, musical numbers, and business.
 * LEARNING GAP: <dl>, <dt>, <dd> = a "description list" (a label
 *   plus its value), the right HTML for program rows.
 * ========================================================== */
import type { SacramentMeeting } from '@/lib/types';
import { formatHymn, formatMeetingDate, meetingTypeLabels } from '@/lib/format';

interface MeetingDetailProps {
  meeting: SacramentMeeting;
}

/* One labeled row on the program, like "Opening Prayer ... Sister Williams". */
function ProgramRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-dotted border-navy/20 py-2">
      <dt className="font-semibold text-navy">{label}</dt>
      <dd className="text-right text-slate-700">{value}</dd>
    </div>
  );
}

const sectionTitle = 'font-heading text-lg font-bold text-navy';

export default function MeetingDetail({ meeting }: MeetingDetailProps) {
  const announcements = meeting.announcements ?? [];
  const isSacramentMeeting =
    meeting.meetingType === 'regular' || meeting.meetingType === 'testimony';

  return (
    <article className="rounded-xl bg-white p-6 shadow-sm print:p-0 print:shadow-none">
      <header className="border-b border-navy/10 pb-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-gold-dark">
          {meetingTypeLabels[meeting.meetingType]}
        </p>
        <h1 className="font-heading text-3xl font-bold text-navy">
          {formatMeetingDate(meeting.date)}
        </h1>
        <p className="mt-2 text-slate-700">
          Presiding: {meeting.presiding} · Conducting: {meeting.conducting}
        </p>
      </header>

      <section className="mt-6">
        <h2 className={sectionTitle}>Announcements</h2>
        {announcements.length > 0 ? (
          <ul className="mt-2 list-disc pl-6 text-slate-700">
            {announcements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-slate-700">None</p>
        )}
      </section>

      <section className="mt-6">
        <h2 className={sectionTitle}>Opening</h2>
        <dl className="mt-2">
          <ProgramRow label="Opening Hymn" value={formatHymn(meeting.openingHymn)} />
          <ProgramRow label="Opening Prayer" value={meeting.openingPrayer} />
        </dl>
      </section>

      <section className="mt-6">
        <h2 className={sectionTitle}>Business</h2>
        {meeting.wardBusiness.length > 0 ? (
          <ul className="mt-2 list-disc pl-6 text-slate-700">
            {meeting.wardBusiness.map((item) => (
              <li key={item.description}>{item.description}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-slate-700">No ward business</p>
        )}
        <dl className="mt-2">
          <ProgramRow label="Stake Business" value={meeting.stakeBusiness ? 'Yes' : 'No'} />
        </dl>
      </section>

      <section className="mt-6">
        <h2 className={sectionTitle}>Sacrament</h2>
        <dl className="mt-2">
          <ProgramRow label="Sacrament Hymn" value={formatHymn(meeting.sacramentHymn)} />
        </dl>
        {isSacramentMeeting && (
          <p className="mt-2 text-center italic text-slate-600">
            Administration of the Sacrament
          </p>
        )}
      </section>

      <section className="mt-6">
        <h2 className={sectionTitle}>Speakers and Music</h2>
        {meeting.speakers.length > 0 ? (
          <ol className="mt-2 space-y-2">
            {meeting.speakers.map((item, index) => (
              <li key={`${item.name}-${index}`} className="text-slate-700">
                <span className="font-semibold text-navy">{item.name}</span>
                {item.type === 'musical-number'
                  ? ' — Musical Number'
                  : ` — ${item.topic}`}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-2 text-slate-700">
            {meeting.meetingType === 'testimony'
              ? 'Bearing of testimonies'
              : 'No ward speakers this week'}
          </p>
        )}
      </section>

      <section className="mt-6">
        <h2 className={sectionTitle}>Closing</h2>
        <dl className="mt-2">
          <ProgramRow label="Closing Hymn" value={formatHymn(meeting.closingHymn)} />
          <ProgramRow label="Closing Prayer" value={meeting.closingPrayer} />
        </dl>
      </section>
    </article>
  );
}
