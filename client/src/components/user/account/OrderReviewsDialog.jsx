import { useEffect, useState } from "react";
import { fetchOrderById } from "../../../api/orders.js";
import { checkReviewEligibility } from "../../../api/reviews.js";
import Loader from "../../common/Loader.jsx";

const OrderReviewsDialog = ({ open, order, onClose, onSelectProduct }) => {
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [reviewEligibility, setReviewEligibility] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !order?.id) {
      setOrderDetails(null);
      setReviewEligibility({});
      setError("");
      return;
    }

    const loadOrderDetails = async () => {
      setLoading(true);
      setError("");

      try {
        const details = await fetchOrderById(order.id);
        setOrderDetails(details);

        // Check review eligibility for each product
        if (details?.items && Array.isArray(details.items)) {
          const eligibilityPromises = details.items.map(async (item) => {
            try {
              const productId = item.productId?._id || item.productId;
              if (!productId) return null;
              
              const result = await checkReviewEligibility(productId);
              return {
                productId,
                ...result,
              };
            } catch (err) {
              return null;
            }
          });

          const eligibilityResults = await Promise.all(eligibilityPromises);
          const eligibilityMap = {};
          eligibilityResults.forEach((result) => {
            if (result && result.productId) {
              eligibilityMap[result.productId] = result;
            }
          });
          setReviewEligibility(eligibilityMap);
        }
      } catch (err) {
        setError("Unable to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrderDetails();
  }, [open, order?.id]);

  if (!open) {
    return null;
  }

  const handleProductSelect = (item) => {
    const productId = item.productId?._id || item.productId;
    const eligibility = reviewEligibility[productId];
    
    onSelectProduct?.({
      productId,
      productName: item.title || item.productId?.title,
      orderId: order.id,
      existingReview: eligibility?.existingReview,
      canReview: eligibility?.canReview,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutralc-200 pb-4">
          <div>
            <h3 className="text-lg font-bold text-neutralc-900">
              Select Product to Review
            </h3>
            <p className="text-sm text-neutralc-600">
              Order {order?.orderNumber || order?.id}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-neutralc-600 hover:bg-neutralc-100 hover:text-neutralc-900"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader label="Loading order products..." />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          ) : orderDetails?.items && orderDetails.items.length > 0 ? (
            <div className="space-y-3">
              {orderDetails.items.map((item, index) => {
                const productId = item.productId?._id || item.productId;
                const eligibility = reviewEligibility[productId] || {};
                const hasReview = Boolean(eligibility.existingReview);
                const canReview = eligibility.canReview !== false;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 rounded-xl border border-neutralc-200 bg-white p-4 transition hover:border-primary-500/50"
                  >
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutralc-900 truncate">
                        {item.title || item.productId?.title || "Product"}
                      </p>
                      <p className="text-xs text-neutralc-600">
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && " • "}
                        {item.color && `Color: ${item.color}`}
                      </p>
                      {hasReview && (
                        <span className="mt-1 inline-flex items-center gap-1 text-xs text-green-600">
                          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Reviewed
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleProductSelect(item)}
                      disabled={!canReview}
                      className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                        hasReview
                          ? "border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white"
                          : canReview
                          ? "bg-primary-500 text-white hover:bg-primary-600"
                          : "bg-neutralc-200 text-neutralc-400 cursor-not-allowed"
                      }`}
                    >
                      {hasReview ? "Edit" : "Write Review"}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-neutralc-600">
              No products found in this order
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderReviewsDialog;
