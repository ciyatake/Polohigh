const AddressCard = ({
  address,
  onEdit,
  onSetDefault,
  onDelete,
  actionState,
}) => {
  if (!address) {
    return null;
  }

  const pendingType = actionState?.type ?? "";
  const pendingId = actionState?.id ?? "";
  const isPending = pendingId === address.id ? pendingType : "";

  const handleEdit = () => onEdit?.(address);
  const handleDelete = () => onDelete?.(address);
  const handleSetDefault = () => onSetDefault?.(address);

  const showSetDefault = Boolean(!address.isDefault && onSetDefault);
  const showDelete = typeof onDelete === "function";
  const showEdit = typeof onEdit === "function";

  return (
    <div className="rounded-2xl border border-[neutralc-200] bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-primary-500">
            {address.label}
          </p>
          <p className="text-xs text-neutralc-400">{address.recipient}</p>
        </div>
        {address.isDefault ? (
          <span className="rounded-full border border-primary-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">
            Default
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-sm text-neutralc-600">
        {address.addressLine1}
        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
      </p>
      <p className="text-sm text-neutralc-600">
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p className="text-xs text-neutralc-400">{address.country}</p>
      <p className="mt-2 text-xs text-neutralc-400">Phone: {address.phone}</p>
      {address.type ? (
        <p className="mt-1 text-xs uppercase tracking-[0.25em] text-neutralc-400">
          {address.type}
        </p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutralc-400">
        {showEdit ? (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-full border border-neutralc-200 px-3 py-1 transition hover:border-primary-500 hover:text-primary-500"
            disabled={isPending === "delete"}
          >
            Edit
          </button>
        ) : null}
        {showSetDefault ? (
          <button
            type="button"
            onClick={handleSetDefault}
            disabled={isPending === "set-default" || isPending === "delete"}
            className="rounded-full border border-neutralc-200 px-3 py-1 transition hover:border-primary-500 hover:text-primary-500 disabled:cursor-not-allowed disabled:border-neutralc-200 disabled:text-neutralc-200"
          >
            {isPending === "set-default" ? "Setting..." : "Set default"}
          </button>
        ) : null}
        {showDelete ? (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending === "delete"}
            className="rounded-full border border-rose-300 px-3 py-1 text-rose-600 transition hover:border-rose-400 hover:text-rose-500 disabled:cursor-not-allowed disabled:border-rose-200 disabled:text-rose-300"
          >
            {isPending === "delete" ? "Deleting..." : "Delete"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default AddressCard;
