const baseFieldClasses =
  "w-full rounded-xl sm:rounded-2xl border border-neutralc-200 bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-neutralc-600 placeholder:text-neutralc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25 transition";

const CheckoutField = ({
  label,
  optional = false,
  type = "text",
  placeholder,
  autoComplete,
  options,
  ...rest
}) => (
  <label className="flex flex-col gap-1 sm:gap-2">
    <span className="text-[0.65rem] sm:text-xs font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neutralc-400">
      {label}
      {optional ? (
        <span className="ml-1 sm:ml-2 text-[0.6rem] sm:text-[0.7rem] font-medium lowercase text-neutralc-400">
          optional
        </span>
      ) : null}
    </span>

    {Array.isArray(options) && options.length ? (
      <select className={baseFieldClasses} {...rest}>
        {options.map((option) => (
          <option
            key={option.value ?? option}
            value={option.value ?? option}
            disabled={option.disabled ?? false}
            hidden={option.hidden ?? false}
            className="bg-white text-xs sm:text-sm text-neutralc-600"
          >
            {option.label ?? option}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={baseFieldClasses}
        {...rest}
      />
    )}
  </label>
);

export default CheckoutField;
