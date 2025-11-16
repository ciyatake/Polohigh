const stepStyles = {
  complete:
    "border-primary-500 bg-primary-500 text-white shadow-[0_14px_28px_rgba(184,152,91,0.3)]",
  current:
    "border-primary-500 bg-white text-primary-500 shadow-[0_18px_36px_rgba(15,23,42,0.12)]",
  upcoming: "border-neutralc-200 bg-primary-100 text-neutralc-400",
};

const CheckoutProgress = ({ steps }) => {
  return (
    <nav
      aria-label="Checkout progress"
      className="rounded-2xl sm:rounded-3xl border border-neutralc-200 bg-white p-3 sm:p-4 shadow-[0_28px_60px_rgba(15,23,42,0.1)]"
    >
      <ol className="grid gap-3 sm:gap-4 md:grid-cols-3">
        {steps.map((step, index) => {
          const variant = statusStyles[step.status] ?? statusStyles.upcoming;
          const isComplete = step.status === "complete";
          const isCurrent = step.status === "current";

          const labelClass =
            isCurrent || isComplete ? "text-neutralc-900" : "text-neutralc-600";

          return (
            <li
              key={step.label}
              className={`flex items-center gap-2.5 sm:gap-4 rounded-xl sm:rounded-2xl border px-3 sm:px-4 py-2.5 sm:py-3 transition ${variant}`}
            >
              <span className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl border border-transparent bg-white/70 text-sm sm:text-base font-semibold text-neutralc-600 shrink-0">
                {isComplete ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    aria-hidden
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <div className="space-y-0.5 sm:space-y-1 min-w-0">
                <p className="text-[0.65rem] sm:text-xs font-medium uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neutralc-400">
                  Step {index + 1}
                </p>
                <p className={`text-xs sm:text-sm font-semibold ${labelClass} truncate`}>
                  {step.label}
                </p>
                {isCurrent ? (
                  <p className="text-[0.65rem] sm:text-xs text-neutralc-400 hidden sm:block">Currently selected</p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default CheckoutProgress;
