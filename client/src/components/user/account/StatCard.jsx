const StatCard = ({ label, value, trend }) => (
  <div className="rounded-2xl border border-[neutralc-200] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.08)]">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutralc-400">
      {label}
    </p>
    <p className="mt-2 text-2xl font-semibold text-neutralc-900">{value}</p>
    {trend ? <p className="mt-1 text-xs text-neutralc-400">{trend}</p> : null}
  </div>
);

export default StatCard;
