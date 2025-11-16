const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-1 rounded-2xl border border-neutralc-200 bg-primary-100 p-4 text-sm text-neutralc-600">
    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-neutralc-400">
      {label}
    </span>
    <span className="text-neutralc-900">{value}</span>
  </div>
);

const ProductInformation = ({ details = {}, specifications = [] }) => (
  <section className="space-y-6 rounded-3xl border border-neutralc-200 bg-white p-6 shadow-[0_24px_56px_rgba(15,23,42,0.08)]">
    <div className="space-y-2">
      <h2 className="text-lg font-semibold text-neutralc-900">Product details</h2>
      <div
        className="text-sm leading-relaxed text-neutralc-600"
        dangerouslySetInnerHTML={{ __html: details.description }}
      />
    </div>

    {details.features?.length ? (
      <ul className="grid gap-3 text-sm text-neutralc-600">
        {details.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span aria-hidden className="mt-1 text-primary-500">
              •
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    ) : null}

    {specifications.length ? (
      <div className="grid gap-3 sm:grid-cols-2">
        {specifications.map((spec) => (
          <InfoRow key={spec.label} label={spec.label} value={spec.value} />
        ))}
      </div>
    ) : null}
  </section>
);

export default ProductInformation;
