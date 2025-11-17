import { formatINR } from "../../utils/currency.js";

const OrderItemCard = ({ item, className = "", showSize = true }) => {
  if (!item) {
    return null;
  }

  const { title, size, price, quantity = 1, imageUrl } = item;

  return (
    <article
      className={`flex gap-4 rounded-2xl border border-neutralc-200 bg-white p-4 ${className}`.trim()}
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title ?? "Product image"}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-neutralc-200 text-xs text-neutralc-400">
            No image
          </div>
        )}
        <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 text-xs font-semibold text-white shadow-lg">
          {quantity}
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-neutralc-900">{title}</h3>
          {showSize && size ? (
            <p className="text-xs text-neutralc-400">Size {size}</p>
          ) : null}
        </div>
        <p className="text-sm font-semibold text-primary-500">
          {formatINR(price)}
        </p>
      </div>
    </article>
  );
};

export default OrderItemCard;
