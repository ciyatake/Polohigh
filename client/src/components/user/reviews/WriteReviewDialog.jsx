import { useEffect, useMemo, useState } from "react";
import { createReview, updateReview } from "../../../api/reviews.js";
import { ApiError } from "../../../api/client.js";

const ratingOptions = [5, 4, 3, 2, 1];

const buildInitialForm = (review) => ({
  rating: review?.rating ?? 5,
  title: review?.title ?? "",
  comment: review?.comment ?? "",
  variantSize: review?.variant?.size ?? "",
  variantColor: review?.variant?.color ?? "",
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

const validateForm = (formValues) => {
  if (!ratingOptions.includes(formValues.rating)) {
    return "Please choose a rating between 1 and 5.";
  }

  if (!formValues.comment || formValues.comment.trim().length < 10) {
    return "Please share at least 10 characters about your experience.";
  }

  if (formValues.comment.length > 2000) {
    return "Your review can be up to 2000 characters.";
  }

  if (formValues.title && formValues.title.length > 200) {
    return "Review title must be 200 characters or less.";
  }

  return "";
};

const WriteReviewDialog = ({
  open,
  mode = "create",
  productId,
  productName,
  defaultOrderId,
  existingReview,
  onClose,
  onSuccess,
}) => {
  const [formValues, setFormValues] = useState(() =>
    buildInitialForm(existingReview)
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setFormValues(buildInitialForm(existingReview));
      setError("");
      setSaving(false);
      // Scroll to form when it opens
      setTimeout(() => {
        const formElement = document.getElementById('review-form-container');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [open, existingReview]);

  const dialogTitle = useMemo(
    () => (mode === "edit" ? "Update your review" : "Write a review"),
    [mode]
  );

  const actionLabel = mode === "edit" ? "Save changes" : "Submit review";

  if (!open) {
    return null;
  }

  const handleRatingChange = (value) => {
    if (saving) {
      return;
    }
    setFormValues((current) => ({
      ...current,
      rating: value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) {
      return;
    }

    const validationError = validateForm(formValues);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!productId) {
      setError("We couldn't identify this product right now.");
      return;
    }

    const payload = {
      rating: formValues.rating,
      title: formValues.title.trim(),
      comment: formValues.comment.trim(),
      images: [],
      variant: {
        size: formValues.variantSize.trim(),
        color: formValues.variantColor.trim(),
      },
    };

    if (!payload.variant.size) {
      delete payload.variant.size;
    }
    if (!payload.variant.color) {
      delete payload.variant.color;
    }
    if (!Object.keys(payload.variant).length) {
      delete payload.variant;
    }

    setSaving(true);
    setError("");

    try {
      let result;
      if (mode === "edit" && existingReview?.id) {
        result = await updateReview(existingReview.id, payload);
      } else {
        result = await createReview({
          ...payload,
          productId,
          orderId: defaultOrderId || undefined,
        });
      }

      setSaving(false);
      onSuccess?.(result);
      onClose?.();
    } catch (apiError) {
      setSaving(false);
      
      // Handle specific error for purchase requirement
      if (apiError instanceof ApiError && apiError.status === 403) {
        setError(
          apiError.payload?.message || 
          "You can only review products that you have purchased and received."
        );
      } else {
        setError(
          getApiErrorMessage(
            apiError,
            mode === "edit"
              ? "We couldn't update your review just yet."
              : "We couldn't submit your review right now."
          )
        );
      }
    }
  };

  return (
    <div
      id="review-form-container"
      className="w-full max-w-4xl mx-auto my-6 px-2 sm:px-4 animate-in fade-in slide-in-from-top-2 duration-300"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg sm:rounded-xl border border-neutralc-300 bg-white p-3 sm:p-6 shadow-md"
      >
        {/* Header with Close Button */}
        <div className="flex items-start sm:items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-neutralc-200">
          <div className="flex-1 min-w-0 pr-2 sm:pr-4">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-neutralc-900 mb-1">
              {dialogTitle}
            </h3>
            {productName && (
              <p className="text-xs sm:text-sm text-neutralc-600 truncate">{productName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onClose?.()}
            className="flex-shrink-0 p-1.5 sm:p-2 rounded-lg hover:bg-neutralc-100 text-neutralc-600 hover:text-neutralc-900 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 sm:space-y-5">
          {/* Rating */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-neutralc-900 mb-2 sm:mb-3">
              Rating *
            </label>
            <div className="flex gap-1.5 sm:gap-2">
              {ratingOptions.map((value) => {
                const active = formValues.rating >= value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingChange(value)}
                    className={`flex h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 items-center justify-center rounded-lg border-2 text-sm sm:text-base font-semibold transition-all ${
                      active
                        ? "border-primary-500 bg-primary-500 text-white"
                        : "border-neutralc-300 bg-white text-neutralc-600 hover:border-primary-300"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-neutralc-900 mb-1.5 sm:mb-2">
              Review Title
            </label>
            <input
              type="text"
              name="title"
              value={formValues.title}
              onChange={handleChange}
              maxLength={200}
              placeholder="Sum up your experience"
              className="w-full rounded-lg border border-neutralc-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-neutralc-900 placeholder:text-neutralc-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
            />
          </div>

          {/* Review Comment */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-neutralc-900 mb-1.5 sm:mb-2">
              Your Review *
            </label>
            <textarea
              name="comment"
              value={formValues.comment}
              onChange={handleChange}
              rows={4}
              minLength={10}
              maxLength={2000}
              placeholder="Share your thoughts about this product..."
              className="w-full rounded-lg border border-neutralc-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-neutralc-900 placeholder:text-neutralc-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-none"
              required
            />
            <div className="flex justify-between mt-1 text-[10px] sm:text-xs text-neutralc-500">
              <span>Minimum 10 characters</span>
              <span className={formValues.comment.length > 1900 ? 'text-orange-500 font-medium' : ''}>
                {formValues.comment.length} / 2000
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutralc-900 mb-1.5 sm:mb-2">
                Size (Optional)
              </label>
              <input
                type="text"
                name="variantSize"
                value={formValues.variantSize}
                onChange={handleChange}
                placeholder="e.g., M, L, XL"
                className="w-full rounded-lg border border-neutralc-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-neutralc-900 placeholder:text-neutralc-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-neutralc-900 mb-1.5 sm:mb-2">
                Color (Optional)
              </label>
              <input
                type="text"
                name="variantColor"
                value={formValues.variantColor}
                onChange={handleChange}
                placeholder="e.g., Navy Blue"
                className="w-full rounded-lg border border-neutralc-300 bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-neutralc-900 placeholder:text-neutralc-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 sm:mt-5 p-2.5 sm:p-3 rounded-lg bg-rose-50 border border-rose-200">
            <p className="text-xs sm:text-sm text-rose-700">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-neutralc-200">
          {defaultOrderId && (
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-green-700 bg-green-50 px-2.5 sm:px-3 py-1.5 rounded-lg border border-green-200 w-fit">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Verified Purchase</span>
            </div>
          )}
          <div className="flex gap-2 sm:gap-3 sm:ml-auto">
            <button
              type="button"
              onClick={() => onClose?.()}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-neutralc-300 bg-white text-neutralc-700 font-semibold hover:bg-neutralc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg bg-primary-500 text-white font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? "Submitting..." : actionLabel}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default WriteReviewDialog;
