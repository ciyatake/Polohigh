const baseButtonStyles =
  "rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary-500";

const CategoryTabs = ({ items = [], value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((item) => {
      const isActive = item.value === value;
      return (
        <button
          key={item.value ?? item.label}
          type="button"
          onClick={() => onChange?.(item.value, item)}
          className={`${baseButtonStyles} ${
            isActive
              ? "border-primary-500 bg-primary-500 text-white shadow-[0_12px_24px_rgba(184,152,91,0.25)]"
              : "border-neutralc-200 bg-white text-neutralc-600 hover:border-primary-500/60 hover:text-primary-500"
          }`}
        >
          {item.label}
        </button>
      );
    })}
  </div>
);

export default CategoryTabs;
