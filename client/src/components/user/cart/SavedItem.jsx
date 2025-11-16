import { Link } from "react-router-dom";
import { formatINR } from "../../../utils/currency.js";
import bagIcon from "../../../assets/icons/bag.svg";
import trashIcon from "../../../assets/icons/trash.svg";

const SavedItem = ({ item, onMoveToCart, onRemove }) => {
  if (!item) return null;

  return (
    <article className="flex flex-col gap-4 rounded-3xl border border-neutralc-200 bg-white p-5 shadow-[0_24px_50px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <Link
          to={`/products/${item.productId ?? item.id}`}
          className="block h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-neutralc-200 bg-primary-100"
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : null}
        </Link>
        <div className="space-y-2">
          <div>
            <h3 className="text-base font-semibold text-neutralc-900">
              {item.title}
            </h3>
            {item.size ? (
              <p className="text-xs uppercase tracking-[0.2em] text-neutralc-400">
                Size {item.size}
              </p>
            ) : null}
          </div>
          <p className="text-sm font-semibold text-primary-500">
            {formatINR(item.price)}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 text-sm font-medium text-neutralc-600 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => onMoveToCart?.(item.id)}
          className="inline-flex items-center gap-2 rounded-full border border-primary-500 px-4 py-2 text-primary-500 transition hover:bg-primary-100"
        >
          <img src={bagIcon} alt="" aria-hidden className="h-4 w-4" />
          Move to cart
        </button>
        <button
          type="button"
          onClick={() => onRemove?.(item.id)}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-neutralc-400 transition hover:text-primary-500"
        >
          <img src={trashIcon} alt="" aria-hidden className="h-4 w-4" />
          Remove
        </button>
      </div>
    </article>
  );
};

export default SavedItem;
