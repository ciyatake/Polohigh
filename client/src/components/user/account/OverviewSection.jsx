import SectionCard from "./SectionCard.jsx";
import StatCard from "./StatCard.jsx";
import OrderCard from "./OrderCard.jsx";
import PaymentCard from "./PaymentCard.jsx";
import { formatDate } from "./accountUtils.js";
import formatINR from "../../../utils/currency.js";

const OverviewSection = ({
  profile,
  stats,
  recentOrders,
  paymentMethods,
  onShowOrders,
  onEditProfile,
}) => {
  const nextTier = profile?.nextTier ?? {};
  const latestOrder = recentOrders?.[0];
  const defaultPayment = paymentMethods?.find((method) => method.isDefault);

  const statCards = Array.isArray(stats)
    ? stats.map((stat) => {
        if (stat.id === "credits") {
          return {
            ...stat,
            valueLabel: formatINR(stat.value),
          };
        }

        return {
          ...stat,
          valueLabel: stat.value,
        };
      })
    : [];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="rounded-3xl border border-[neutralc-200] bg-gradient-to-br from-[primary-100] via-white to-[neutralc-200]/40 p-6 text-neutralc-600 shadow-[0_28px_60px_rgba(15,23,42,0.1)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-neutralc-400">
                Profile overview
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-neutralc-900">
                {profile?.name ?? "Guest"}
              </h2>
              <p className="mt-1 text-sm text-neutralc-600">{profile?.email}</p>
              <p className="text-sm text-neutralc-400">{profile?.phone}</p>
            </div>
            {typeof onEditProfile === "function" ? (
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex items-center justify-center rounded-full border border-[primary-500] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[primary-500] transition hover:bg-[primary-500] hover:text-white"
              >
                Edit profile
              </button>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-neutralc-400">
            <span className="rounded-full border border-[#c3dedd] px-3 py-1">
              {profile?.membershipTier ?? "Member"} tier
            </span>
            <span className="rounded-full border border-[#c3dedd] px-3 py-1">
              Since {formatDate(profile?.memberSince)}
            </span>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <p className="text-neutralc-600">Reward points</p>
              <p className="text-lg font-semibold text-[primary-500]">
                {profile?.rewardPoints ?? 0}
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-[neutralc-200]">
              <div
                className="h-full rounded-full bg-[primary-500]"
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(0, nextTier.progressPercent ?? 0)
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-neutralc-400">
              {nextTier.pointsNeeded
                ? `${nextTier.pointsNeeded} points to reach ${nextTier.name}`
                : "Keep shopping to unlock the next tier"}
            </p>
          </div>
        </div>

        <SectionCard
          title="Quick stats"
          description="A snapshot of your activity on Ciyatake."
          className="h-full"
        >
          <div className="grid gap-4 md:grid-cols-2">
            {statCards.length ? (
              statCards.map((stat) => (
                <StatCard
                  key={stat.id}
                  label={stat.label}
                  value={stat.valueLabel}
                  trend={stat.trend}
                />
              ))
            ) : (
              <p className="text-sm text-neutralc-400">
                We&apos;ll show your stats once you have some activity.
              </p>
            )}
          </div>
        </SectionCard>
      </div>

      {latestOrder ? (
        <SectionCard
          title="Track your latest order"
          description="We keep this section updated so you always know what's next."
          action={
            <button
              type="button"
              onClick={onShowOrders}
              className="inline-flex items-center justify-center rounded-full border border-[primary-500] px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-[primary-500] transition hover:bg-[primary-500] hover:text-white"
            >
              View all orders
            </button>
          }
        >
          <OrderCard order={latestOrder} />
        </SectionCard>
      ) : null}

      {defaultPayment ? (
        <SectionCard
          title="Preferred payment"
          description="This method will be used for faster checkout."
        >
          <PaymentCard payment={defaultPayment} />
        </SectionCard>
      ) : null}
    </div>
  );
};

export default OverviewSection;
