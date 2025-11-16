const baseClasses =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed active:scale-[0.98]";

const variantClasses = {
  primary: "bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-lg shadow-primary-500/30",
  outline:
    "border-2 border-primary-500 bg-white text-primary-500 hover:border-primary-700 hover:bg-primary-500/5",
  ghost: "bg-transparent text-primary-500 hover:bg-primary-500/10",
};

const hoverClasses = {
  primary: "hover:from-primary-700 hover:to-primary-700 hover:shadow-xl hover:shadow-primary-500/40",
  outline: "hover:text-primary-700",
  ghost: "hover:text-primary-700",
};

const Button = ({
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
  variant = "primary",
  ...props
}) => {
  const resolvedVariant = variantClasses[variant] ? variant : "primary";

  const interactive = disabled
    ? "opacity-60"
    : hoverClasses[resolvedVariant] ?? "";

  const classes = [
    baseClasses,
    variantClasses[resolvedVariant],
    interactive,
    className,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
