import { useEffect, useState } from "react";
import { fetchReports } from "../../api/admin.js";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadReports = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchReports();
        if (isMounted) {
          setReports(
            Array.isArray(response) ? response : response?.items ?? []
          );
        }
      } catch (apiError) {
        if (isMounted) {
          setError(apiError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-7 text-neutralc-900">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-neutralc-900">Reports</h2>
        <p className="text-base text-neutralc-400">
          Review performance metrics and actionable insights.
        </p>
      </header>
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
          Unable to load reports.
        </div>
      ) : (
        <ul className="grid gap-6 md:grid-cols-2">
          {(loading ? Array.from({ length: 3 }) : reports).map(
            (report, index) => (
              <li
                key={report?.id ?? index}
                className="rounded-2xl border border-[var(--color-primary-200)] bg-white/95 p-6 shadow-2xl ring-1 ring-primary-100 transition hover:-translate-y-1 hover:shadow-[var(--color-primary-200)]"
              >
                <h3 className="text-xl font-semibold text-neutralc-900">
                  {loading ? "Loading..." : report.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutralc-600">
                  {loading ? "--" : report.summary}
                </p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 transition hover:text-[var(--color-primary-800)]">
                  View full report
                  <span aria-hidden>→</span>
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
};

export default Reports;
