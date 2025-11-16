import formatINR from "../../../utils/currency.js";

const PaymentCard = ({ payment }) => {
  if (!payment) {
    return null;
  }

  const details = [
    payment.type === "Credit Card" && payment.last4
      ? `${payment.brand} ending •••• ${payment.last4}`
      : null,
    payment.handle,
    payment.holderName,
    payment.expiry ? `Expires ${payment.expiry}` : null,
  ].filter(Boolean);

  return (
    <div className="rounded-2xl border border-[neutralc-200] bg-white p-4 shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-neutralc-900">
            {payment.brand}
          </p>
          <p className="text-xs text-neutralc-400">{payment.type}</p>
        </div>
        {payment.isDefault ? (
          <span className="rounded-full border border-[primary-500]/40 bg-[primary-500]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[primary-500]">
            Primary
          </span>
        ) : null}
      </div>

      {payment.type === "Wallet" ? (
        <p className="mt-3 text-lg font-semibold text-[primary-500]">
          Balance: {formatINR(payment.balance)}
        </p>
      ) : null}

      {details.length ? (
        <ul className="mt-3 space-y-1 text-sm text-neutralc-600">
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutralc-400">
        <button
          type="button"
          className="rounded-full border border-[primary-500] px-3 py-1 transition hover:bg-[primary-500] hover:text-white"
        >
          Manage
        </button>
        <button
          type="button"
          className="rounded-full border border-neutralc-200 px-3 py-1 transition hover:border-[primary-500] hover:text-[primary-500]"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default PaymentCard;
