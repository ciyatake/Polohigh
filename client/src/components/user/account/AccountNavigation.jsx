import { formatDate } from "./accountUtils.js";

const AccountNavigation = ({
  sections,
  selectedSection,
  onSelect,
  support,
}) => (
  <aside className="space-y-6">
    <div className="rounded-3xl border border-neutralc-200 bg-white p-6">
      <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-primary-500">
        Account menu
      </h2>
      <div className="mt-4 flex flex-wrap gap-2 lg:flex-col">
        {sections.map((section) => {
          const isActive = section.id === selectedSection;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-primary-500 bg-primary-500/15 text-primary-500"
                  : "border-neutralc-200 bg-white text-neutralc-600 hover:border-primary-500/50 hover:bg-primary-100 hover:text-primary-500"
              }`}
            >
              {section.label}
            </button>
          );
        })}
      </div>
    </div>

    {support ? (
      <div className="rounded-3xl border border-primary-500/40 bg-primary-100 p-6 text-sm text-neutralc-600">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary-500">
          Need help?
        </p>
        <p className="mt-2 text-base font-semibold text-primary-500">
          {support.concierge?.name}
        </p>
        <p className="text-xs text-neutralc-400">{support.concierge?.hours}</p>
        <div className="mt-4 space-y-2 text-sm">
          <p>Email: {support.concierge?.email}</p>
          <p>Phone: {support.concierge?.phone}</p>
        </div>
        {support.lastTicket ? (
          <div className="mt-4 rounded-2xl border border-neutralc-200 bg-white p-3 text-xs text-neutralc-400">
            <p className="font-semibold text-primary-500">
              Last ticket · {support.lastTicket.status}
            </p>
            <p>{support.lastTicket.subject}</p>
            <p className="text-[0.7rem] uppercase tracking-[0.3em] text-neutralc-400">
              Updated {formatDate(support.lastTicket.updatedOn)}
            </p>
          </div>
        ) : null}
      </div>
    ) : null}
  </aside>
);

export default AccountNavigation;
