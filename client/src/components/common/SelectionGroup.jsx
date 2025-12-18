const SelectionGroup = ({ items = [], value, onChange, multiple = false }) => {
  const handleSelect = (itemValue, isDisabled) => {
    if (isDisabled) return;
    
    if (multiple) {
      const nextValues = new Set(Array.isArray(value) ? value : []);
      if (nextValues.has(itemValue)) {
        nextValues.delete(itemValue);
      } else {
        nextValues.add(itemValue);
      }
      onChange?.(Array.from(nextValues));
    } else {
      onChange?.(itemValue);
    }
  };

  const isSelected = (itemValue) =>
    multiple ? value?.includes(itemValue) : value === itemValue;

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active = isSelected(item.value);
        const outOfStock = item.isOutOfStock || false;
        const disabled = outOfStock;
        
        return (
          <button
            key={item.value ?? item.label}
            type="button"
            onClick={() => handleSelect(item.value, disabled)}
            aria-pressed={active}
            disabled={disabled}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-primary-500 focus-visible:outline-offset-2 relative ${
              disabled
                ? "border-neutralc-200 bg-neutralc-100 text-neutralc-400 cursor-not-allowed opacity-50"
                : active
                ? "border-primary-500 bg-primary-500/15 text-primary-500"
                : "border-neutralc-200 bg-white text-neutralc-600 hover:border-primary-500/50 hover:bg-neutralc-200/60"
            }`}
          >
            {item.label}
            {outOfStock && (
              <span className="ml-1 text-xs text-neutralc-400">(Out of stock)</span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SelectionGroup;
