const SectionCard = ({
  title,
  description,
  action,
  children,
  className = "",
}) => (
  <section
    className={`rounded-3xl border border-[neutralc-200] bg-white p-6 shadow-[0_20px_45px_rgba(0,0,0,0.08)] backdrop-blur ${className}`.trim()}
  >
    {(title || description || action) && (
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          {title ? (
            <h2 className="text-lg font-semibold text-[primary-500] md:text-xl">
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="text-sm text-neutralc-600">{description}</p>
          ) : null}
        </div>
        {action ? <div className="text-sm text-[primary-500]">{action}</div> : null}
      </header>
    )}

    {children ? <div className="mt-4 space-y-4">{children}</div> : null}
  </section>
);

export default SectionCard;
