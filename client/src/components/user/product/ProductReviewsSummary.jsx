import { useCallback, useEffect, useMemo, useState } from "react";
import RatingDisplay from "../../common/RatingDisplay.jsx";
import {
  fetchProductReviews,
  markReviewHelpful,
  removeReviewHelpful,
} from "../../../api/reviews.js";
import { ApiError } from "../../../api/client.js";

const formatDate = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const matches = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return matches || "★";
};

const buildInitialSummary = () => ({
  averageRating: 0,
  totalReviews: 0,
  ratingDistribution: {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  },
});

const getApiErrorMessage = (error, fallbackMessage) => {
  if (error instanceof ApiError) {
    return (
      error.payload?.message ||
      error.payload?.error ||
      (Array.isArray(error.payload?.errors)
        ? error.payload.errors[0]?.message
        : null) ||
      fallbackMessage ||
      "Something went wrong"
    );
  }

  return error?.message || fallbackMessage || "Something went wrong";
};

const distributionKeys = [5, 4, 3, 2, 1];

const ProductReviewsSummary = ({
  productId,
  isLoggedIn = false,
  onRequestReview,
  eligibility,
  onSummaryChange,
  refreshToken = 0,
  pendingReviews = [],
  onVisibleReviewsChange,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allReviews, setAllReviews] = useState([]);
  const [summary, setSummary] = useState(buildInitialSummary);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false,
  });
  const [ratingFilter, setRatingFilter] = useState(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [helpfulBusy, setHelpfulBusy] = useState({});
  const [helpfulState, setHelpfulState] = useState({});

  const averageRatingLabel = useMemo(
    () => summary.averageRating.toFixed(1),
    [summary.averageRating]
  );
  const totalReviewsLabel = useMemo(
    () => summary.totalReviews.toLocaleString(),
    [summary.totalReviews]
  );

  const loadReviews = useCallback(
    async ({ page = 1, append = false } = {}) => {
      if (!productId) {
        setAllReviews([]);
        setSummary(buildInitialSummary());
        setPagination({ currentPage: 1, totalPages: 1, hasMore: false });
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await fetchProductReviews(
          productId,
          {
            page,
            limit: 10,
          },
          {}
        );

        setSummary(response.summary);
        setPagination(response.pagination);
        setAllReviews((current) =>
          append ? [...current, ...response.reviews] : response.reviews
        );
      } catch (apiError) {
        setError(
          getApiErrorMessage(
            apiError,
            "We couldn't load reviews for this product just yet."
          )
        );
        setAllReviews((current) => (append ? current : []));
      } finally {
        setLoading(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    loadReviews({ page: 1, append: false });
  }, [loadReviews, refreshToken]);

  useEffect(() => {
    if (typeof onSummaryChange === "function") {
      onSummaryChange(summary);
    }
  }, [summary, onSummaryChange]);

  useEffect(() => {
    if (typeof onVisibleReviewsChange === "function") {
      onVisibleReviewsChange(allReviews);
    }
  }, [allReviews, onVisibleReviewsChange]);

  const combinedReviews = useMemo(() => {
    if (!pendingReviews.length) {
      return allReviews;
    }

    const merged = new Map();
    allReviews.forEach((review) => {
      if (review?.id) {
        merged.set(review.id, review);
      }
    });

    pendingReviews.forEach((review) => {
      if (!review?.id) {
        return;
      }
      const existing = merged.get(review.id) || {};
      merged.set(review.id, { ...existing, ...review });
    });

    return Array.from(merged.values()).sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    });
  }, [allReviews, pendingReviews]);

  useEffect(() => {
    setHelpfulState((current) => {
      const next = {};
      combinedReviews.forEach((review) => {
        if (current[review.id]) {
          next[review.id] = true;
        }
      });
      return next;
    });
  }, [combinedReviews]);

  const filteredReviews = useMemo(() => {
    let result = combinedReviews;

    if (ratingFilter) {
      result = result.filter(
        (review) => Number.parseInt(review.rating, 10) === ratingFilter
      );
    }

    if (verifiedOnly) {
      result = result.filter((review) => review.isVerifiedPurchase);
    }

    return result;
  }, [combinedReviews, ratingFilter, verifiedOnly]);

  const hasAnyReviews = combinedReviews.length > 0;
  const hasFilteredReviews = filteredReviews.length > 0;

  const handleLoadMore = () => {
    if (loading || !pagination.hasMore) {
      return;
    }

    const nextPage = pagination.currentPage + 1;
    setPagination((current) => ({ ...current, currentPage: nextPage }));
    void loadReviews({ page: nextPage, append: true });
  };

  const toggleRatingFilter = (value) => {
    setRatingFilter((current) => (current === value ? null : value));
  };

  const toggleVerifiedFilter = () => {
    setVerifiedOnly((current) => !current);
  };

  const handleHelpfulToggle = async (reviewId) => {
    if (!reviewId || helpfulBusy[reviewId]) {
      return;
    }

    const targetReview = combinedReviews.find((item) => item.id === reviewId);
    if (targetReview?.status && targetReview.status !== "approved") {
      return;
    }

    if (!isLoggedIn) {
      onRequestReview?.("auth");
      return;
    }

    setHelpfulBusy((current) => ({ ...current, [reviewId]: true }));

    const hasMarked = Boolean(helpfulState[reviewId]);

    try {
      const result = hasMarked
        ? await removeReviewHelpful(reviewId)
        : await markReviewHelpful(reviewId);

      setAllReviews((current) =>
        current.map((review) =>
          review.id === reviewId
            ? { ...review, helpfulVotes: result.helpfulVotes }
            : review
        )
      );
      setHelpfulState((current) => ({
        ...current,
        [reviewId]: !hasMarked,
      }));
    } catch (apiError) {
      setError(
        getApiErrorMessage(
          apiError,
          hasMarked
            ? "We couldn't remove your helpful vote right now."
            : "We couldn't record your helpful vote right now."
        )
      );
    } finally {
      setHelpfulBusy((current) => {
        const next = { ...current };
        delete next[reviewId];
        return next;
      });
    }
  };

  const renderRatingBar = (value) => {
    const count = summary.ratingDistribution[value] ?? 0;
    const percentage = summary.totalReviews
      ? Math.round((count / summary.totalReviews) * 100)
      : 0;
    const isActive = ratingFilter === value;

    return (
      <button
        key={value}
        type="button"
        onClick={() => toggleRatingFilter(value)}
        className={`group flex items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
          isActive
            ? "border-primary-500 bg-primary-500/15"
            : "border-neutralc-200 bg-white hover:border-primary-500/40"
        }`}
      >
        <span className="w-8 text-sm font-semibold text-neutralc-600">
          {value}★
        </span>
        <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-neutralc-200">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-primary-500/70 transition-all group-hover:bg-primary-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="w-12 text-right text-xs text-neutralc-400">{count}</span>
      </button>
    );
  };

  return (
    <section className="rounded-3xl border border-neutralc-200 bg-white p-6 shadow-[0_32px_70px_rgba(15,23,42,0.12)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neutralc-400">
              Customer Reviews
            </p>
            <h2 className="text-xl font-semibold text-neutralc-900 md:text-2xl">
              Hear it from the community
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-neutralc-600">
            <RatingDisplay
              rating={summary.averageRating}
              size="lg"
              showCount={false}
            />
            <span>
              {averageRatingLabel} out of 5 stars ({totalReviewsLabel} reviews)
            </span>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:justify-end">
          {/* Review button removed - users can write reviews from their order history in account dashboard */}
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,0.45fr)_minmax(0,1fr)]">
        <div className="space-y-3 rounded-3xl border border-neutralc-200 bg-primary-100 p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-neutralc-900">
                Rating breakdown
              </p>
              <p className="text-xs text-neutralc-600">Tap to filter by rating</p>
            </div>
            <button
              type="button"
              onClick={toggleVerifiedFilter}
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                verifiedOnly
                  ? "border-primary-500 text-primary-500"
                  : "border-neutralc-200 text-neutralc-400 hover:border-primary-500/50 hover:text-primary-500"
              }`}
            >
              {verifiedOnly ? "Verified only" : "All reviews"}
            </button>
          </div>
          <div className="space-y-2">
            {distributionKeys.map((value) => renderRatingBar(value))}
          </div>
        </div>

        <div className="space-y-4">
          {loading && !hasAnyReviews ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl border border-neutralc-200 bg-primary-100/80 p-5"
                >
                  <div className="mb-4 h-4 w-1/3 rounded bg-white/60" />
                  <div className="mb-2 h-4 rounded bg-white/60" />
                  <div className="h-16 rounded bg-white/60" />
                </div>
              ))}
            </div>
          ) : null}

          {!loading && error ? (
            <div className="space-y-3 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-600">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => loadReviews({ page: 1, append: false })}
                className="rounded-full border border-rose-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-500 transition hover:bg-rose-100"
              >
                Retry
              </button>
            </div>
          ) : null}

          {!loading && !error && !hasFilteredReviews ? (
            <div className="rounded-3xl border border-dashed border-[var(--color-primary-200)] bg-primary-100 p-6 text-center text-sm text-neutralc-600">
              {hasAnyReviews
                ? "No reviews match those filters right now."
                : "No reviews yet. Be the first to share your thoughts."}
            </div>
          ) : null}

          {filteredReviews.map((review) => {
            const busy = Boolean(helpfulBusy[review.id]);
            const reviewStatus = review.status ?? "approved";
            const isPending = reviewStatus !== "approved";
            return (
              <article
                key={review.id}
                className="rounded-3xl border border-neutralc-200 bg-white p-5 shadow-[0_20px_42px_rgba(15,23,42,0.08)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary-200)] text-sm font-semibold text-[var(--color-primary-800)]">
                      {getInitials(review.user?.name || "")}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-semibold text-neutralc-900">
                          {review.user?.name || "Verified customer"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutralc-400">
                          <span>
                            {formatDate(review.createdAt) || "Recently"}
                          </span>
                          {review.isVerifiedPurchase ? (
                            <span className="rounded-full border border-primary-500/40 px-2 py-0.5 text-[0.65rem] text-primary-500">
                              Verified purchase
                            </span>
                          ) : null}
                          {isPending ? (
                            <span className="rounded-full border border-[var(--color-primary-300)] px-2 py-0.5 text-[0.65rem] text-[var(--color-primary-700)]">
                              Awaiting approval
                            </span>
                          ) : null}
                          {review.variant?.size ? (
                            <span>Size {review.variant.size}</span>
                          ) : null}
                          {review.variant?.color ? (
                            <span>Colour {review.variant.color}</span>
                          ) : null}
                        </div>
                      </div>

                      {review.title ? (
                        <p className="text-sm font-semibold text-neutralc-900">
                          {review.title}
                        </p>
                      ) : null}
                      <p className="text-sm leading-relaxed text-neutralc-600">
                        {review.comment}
                      </p>

                      {review.adminResponse?.message ? (
                        <div className="rounded-2xl border border-neutralc-200 bg-primary-100 p-3 text-xs text-neutralc-600">
                          <p className="font-semibold text-neutralc-900">
                            Ciyatake team
                          </p>
                          <p className="mt-1 leading-relaxed">
                            {review.adminResponse.message}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 md:ml-6">
                    <div className="flex items-center gap-2">
                      <RatingDisplay
                        rating={review.rating}
                        size="sm"
                        showCount={false}
                      />
                      <span className="text-xs text-neutralc-400">
                        {review.rating.toFixed(1)} / 5
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleHelpfulToggle(review.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-primary-500 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-primary-500 transition hover:bg-primary-500 hover:text-white"
                      disabled={busy || isPending}
                    >
                      {busy
                        ? "Saving..."
                        : isPending
                        ? "Pending"
                        : helpfulState[review.id]
                        ? "Undo helpful"
                        : "Helpful"}
                      <span className="text-neutralc-400">
                        {review.helpfulVotes}
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}

          {pagination.hasMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full border border-primary-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-500 transition hover:bg-primary-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Loading..." : "Load more"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default ProductReviewsSummary;
