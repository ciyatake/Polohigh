import { useEffect, useMemo, useState } from "react";
import { formatINR } from "../../../utils/currency.js";

const statusColors = {
  active: "text-[#2f4a55] bg-[#c3dedd]",
  expired: "text-[#8a4b3c] bg-[#F6C7B3]",
  inactive: "text-neutralc-600 bg-primary-100",
};

const CouponPanel = ({
  appliedCoupon,
  isApplying,
  applyError,
  onApply,
  onAutoApply,
  onRemove,
  availableCoupons,
  availableLoading,
  availableError,
  onRefresh,
  isLoggedIn,
}) => {
  const [codeInput, setCodeInput] = useState("");

  useEffect(() => {
    if (!appliedCoupon?.code) {
      return;
    }

    setCodeInput(appliedCoupon.code);
  }, [appliedCoupon?.code]);

  const statusLabel = useMemo(() => {
    if (!appliedCoupon) {
      return "No coupon applied";
    }

    if (appliedCoupon.discountApplied > 0) {
      return `Saving ${formatINR(appliedCoupon.discountApplied)}`;
    }

    if (appliedCoupon.freeShipping) {
      return "Free shipping applied";
    }

    return "Coupon applied";
  }, [appliedCoupon]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!codeInput.trim() || isApplying) {
      return;
    }

    onApply?.(codeInput.trim());
  };

  const handleAutoApply = () => {
    if (isApplying) {
      return;
    }

    onAutoApply?.();
  };

  const handleRemove = () => {
    if (isApplying) {
      return;
    }

    onRemove?.();
    setCodeInput("");
  };

  return (
    <div className="rounded-2xl border border-neutralc-200 bg-white p-5 text-sm text-neutralc-600 shadow-[0_20px_50px_rgba(15,23,42,0.1)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutralc-400">
            Coupons
          </p>
          <p className="text-sm text-neutralc-600">Apply a coupon to save more.</p>
        </div>
        {appliedCoupon ? (
          <span className="rounded-full border border-[#c3dedd] bg-[#c3dedd]/30 px-3 py-1 text-xs font-medium uppercase tracking-[0.25em] text-[#2f4a55]">
            {statusLabel}
          </span>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            name="couponCode"
            value={codeInput}
            onChange={(event) => setCodeInput(event.target.value.toUpperCase())}
            spellCheck={false}
            autoComplete="off"
            placeholder="Enter coupon code"
            className="flex-1 rounded-2xl border border-neutralc-200 bg-white px-4 py-2 text-sm uppercase tracking-[0.2em] text-neutralc-600 placeholder:text-neutralc-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/25"
            disabled={isApplying}
          />
          <button
            type="submit"
            className="flex items-center justify-center rounded-xl bg-primary-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-500/60"
            disabled={isApplying || !codeInput.trim()}
          >
            {isApplying ? "Applying" : "Apply"}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutralc-400 sm:gap-3">
          <button
            type="button"
            onClick={handleAutoApply}
            disabled={isApplying}
            className="font-semibold uppercase tracking-[0.3em] text-primary-500 transition hover:text-primary-700 disabled:cursor-not-allowed disabled:text-neutralc-400"
          >
            Auto apply best
          </button>
        </div>
        {applyError ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
            {applyError}
          </div>
        ) : null}
        {appliedCoupon ? (
          <div className="rounded-xl border border-[#c3dedd] bg-[#c3dedd]/20 px-4 py-3 text-xs text-[#2f4a55]">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#2f4a55]">
                  Coupon applied
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.25em] text-neutralc-600">
                  <span>{appliedCoupon.code}</span>
                  {appliedCoupon.discountApplied ? (
                    <span>
                      Savings {formatINR(appliedCoupon.discountApplied)}
                    </span>
                  ) : null}
                  {appliedCoupon.freeShipping ? (
                    <span>Free shipping</span>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="rounded-full border border-primary-500 px-3 py-1 font-semibold uppercase tracking-[0.3em] text-primary-500 transition hover:bg-primary-500 hover:text-white"
              >
                Remove
              </button>
            </div>
          </div>
        ) : null}
      </form>

      <div className="mt-5 space-y-3">
        {availableLoading ? (
          <div className="rounded-xl border border-neutralc-200 bg-primary-100 px-4 py-3 text-xs text-neutralc-600">
            Loading available coupons...
          </div>
        ) : availableError ? (
          <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-600">
            <p>{availableError}</p>
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex items-center justify-center rounded-full border border-rose-300 px-3 py-1 font-semibold uppercase tracking-[0.3em] text-rose-600 transition hover:bg-rose-100"
            >
              Retry
            </button>
          </div>
        ) : isLoggedIn && availableCoupons.length ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 text-xs text-neutralc-600">
              <span>Available coupons for you</span>
              <button
                type="button"
                onClick={onRefresh}
                className="rounded-full border border-primary-500 px-3 py-1 font-semibold uppercase tracking-[0.3em] text-primary-500 transition hover:bg-primary-500 hover:text-white"
              >
                Refresh
              </button>
            </div>
            <ul className="space-y-3">
              {availableCoupons.map((coupon) => {
                const isActive = coupon.isActive && !coupon.isExpired;
                const statusKey = isActive
                  ? "active"
                  : coupon.isExpired
                  ? "expired"
                  : "inactive";
                const statusClass =
                  statusColors[statusKey] ?? statusColors.active;

                return (
                  <li
                    key={coupon.id ?? coupon.code}
                    className="rounded-2xl border border-neutralc-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-semibold tracking-[0.3em] text-neutralc-900">
                            {coupon.code}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.25em] ${statusClass}`}
                          >
                            {isActive
                              ? "Active"
                              : coupon.isExpired
                              ? "Expired"
                              : "Inactive"}
                          </span>
                        </div>
                        {coupon.description ? (
                          <p className="text-xs text-neutralc-600">
                            {coupon.description}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.25em] text-neutralc-400">
                          <span>
                            {coupon.discountType === "percentage"
                              ? `${coupon.discountValue}% off`
                              : coupon.discountType === "fixed"
                              ? `${formatINR(coupon.discountValue)} off`
                              : "Free shipping"}
                          </span>
                          {coupon.minOrderAmount ? (
                            <span>
                              Min order {formatINR(coupon.minOrderAmount)}
                            </span>
                          ) : null}
                          {coupon.validity?.end ? (
                            <span>
                              Valid till{" "}
                              {new Date(
                                coupon.validity.end
                              ).toLocaleDateString()}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onApply?.(coupon.code)}
                        disabled={isApplying}
                        className="rounded-full border border-primary-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500 transition hover:bg-primary-500 hover:text-white disabled:cursor-not-allowed disabled:border-neutralc-200 disabled:text-neutralc-400"
                      >
                        Apply
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="rounded-xl border border-neutralc-200 bg-primary-100 px-4 py-3 text-xs text-neutralc-600">
            {isLoggedIn
              ? "No personal coupons available right now."
              : "Sign in to see coupons curated for you."}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponPanel;
