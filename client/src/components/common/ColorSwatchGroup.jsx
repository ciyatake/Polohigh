const ColorSwatchGroup = ({ colors = [], value, onChange }) => (
  <div className="flex flex-wrap gap-3">
    {colors.map((color) => {
      const isActive = color.value === value;
      return (
        <button
          key={color.value ?? color.hex}
          type="button"
          onClick={() => onChange?.(color.value, color)}
          aria-label={color.label ?? color.value}
          title={color.label ?? color.value}
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-500 ${
            isActive ? "border-primary-500" : "border-transparent"
          }`}
        >
          <span
            className={`h-6 w-6 rounded-full border border-white/50 ${
              color.value === "all"
                ? "bg-gradient-to-r from-[var(--color-primary-200)] via-[var(--color-primary-300)] to-primary-500"
                : ""
            }`}
            style={
              color.value === "all"
                ? undefined
                : { backgroundColor: color.hex ?? color.value }
            }
          />
        </button>
      );
    })}
  </div>
);

export default ColorSwatchGroup;
