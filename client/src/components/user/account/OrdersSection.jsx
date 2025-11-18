import SectionCard from "./SectionCard.jsx";
import OrderCard from "./OrderCard.jsx";

const OrdersSection = ({ orders, onRequestReview }) => {
  const hasOrders = Array.isArray(orders) && orders.length > 0;

  return (
    <SectionCard
      title="Orders & returns"
      description="Track deliveries, download invoices, and start a return if needed."
    >
      {hasOrders ? (
        <>
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onRequestReview={onRequestReview} />
          ))}
          <p className="text-xs text-neutralc-400">
            Return requests stay open for {orders?.[0]?.returnWindowDays ?? 7}{" "}
            days after delivery. Use the request button inside each order if you
            need a pickup.
          </p>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--color-primary-200)] bg-primary-100 p-6 text-sm text-neutralc-600">
          You haven&apos;t placed any orders yet. Once you do, they&apos;ll show
          up here for quick access.
        </div>
      )}
    </SectionCard>
  );
};

export default OrdersSection;
