import { useCallback, useEffect, useMemo, useState } from "react";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import AdvancedFilters, {
  SORT_OPTIONS,
} from "../../components/common/AdvancedFilters.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
import Loader from "../../components/common/Loader.jsx";
import Skeleton from "../../components/common/Skeleton.jsx";
import { fetchProducts } from "../../api/catalog.js";
import { fetchCategories } from "../../api/categories.js";
import { COMMON_COLORS } from "../../constants/colors.js";

const DEFAULT_FILTERS = {
  category: "hoodies", // Filter only hoodies
  subcategory: "all",
  gender: "all",
  colors: [],
  sizes: [],
  priceRanges: [],
  minRating: null,
};

const HoodiesPage = ({ isLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([
    { label: "All Hoodies", value: "hoodies" }
  ]);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [productsLimit, setProductsLimit] = useState(48);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState("relevance");
  const [hasApiCategories, setHasApiCategories] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Prevent background scroll when mobile filter modal is open
  useEffect(() => {
    if (showMobileFilters) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showMobileFilters]);

  const [mobileFilterTab, setMobileFilterTab] = useState("Category");
  const [mobileFilterDraft, setMobileFilterDraft] = useState(filters);
  const [mobileFilterSearch, setMobileFilterSearch] = useState("");

  const loadCategories = useCallback(async ({ signal } = {}) => {
    setCategoryLoading(true);
    setCategoryError(null);

    try {
      const response = await fetchCategories({ signal });
      const categories = Array.isArray(response.data) ? response.data : [];

      if (!signal?.aborted) {
        const hoodiesCategories = categories.filter(cat => 
          cat.name?.toLowerCase().includes('hoodie')
        );

        const categoryMap = new Map();
        categoryMap.set("hoodies", { label: "All Hoodies", value: "hoodies" });

        hoodiesCategories.forEach((category) => {
          if (category.name && !categoryMap.has(category.name)) {
            categoryMap.set(category.name, {
              label: category.name,
              value: category.name,
            });
          }
        });

        const newOptions = Array.from(categoryMap.values());
        setCategoryOptions(newOptions);
        setHasApiCategories(true);
      }
    } catch (apiError) {
      if (!signal?.aborted) {
        setCategoryError("Failed to load categories");
      }
    } finally {
      if (!signal?.aborted) {
        setCategoryLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadCategories({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [loadCategories]);

  const loadProducts = useCallback(
    async ({ signal } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const query = { limit: productsLimit };

        // Force hoodies category filter
        query.category = "hoodies";

        // Apply other filters
        if (filters.subcategory && filters.subcategory !== "all") {
          query.subcategory = filters.subcategory;
        }
        if (filters.gender && filters.gender !== "all") {
          query.targetGender = filters.gender;
        }
        if (filters.colors && filters.colors.length > 0) {
          query.colors = filters.colors.join(",");
        }
        if (filters.sizes && filters.sizes.length > 0) {
          query.sizes = filters.sizes.join(",");
        }
        if (filters.minRating) {
          query.minRating = filters.minRating;
        }
        if (filters.priceRanges && filters.priceRanges.length > 0) {
          const minPrice = Math.min(...filters.priceRanges.map((r) => r.min));
          const maxPrice = Math.max(...filters.priceRanges.map((r) => r.max));
          query.minPrice = minPrice;
          query.maxPrice = maxPrice;
        }
        if (sortOption && sortOption !== "relevance") {
          query.sort = sortOption;
        }

        const { items, total } = await fetchProducts(query, { signal });

        if (signal?.aborted) {
          return;
        }

        const nextProducts = Array.isArray(items) ? items : [];
        setProducts(nextProducts);
        const totalNumber = Number(total);
        setTotalProducts(
          Number.isFinite(totalNumber) ? totalNumber : nextProducts.length
        );
      } catch (apiError) {
        if (!signal?.aborted) {
          setError("Failed to load hoodies");
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [filters, sortOption, productsLimit]
  );

  useEffect(() => {
    const controller = new AbortController();
    loadProducts({ signal: controller.signal });

    return () => {
      controller.abort();
    };
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const matches = products.filter((product) => {
      if (!normalizedSearch) {
        return true;
      }

      const haystack = [product.title, product.brand, product.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });

    return matches;
  }, [products, searchTerm]);

  const handleRetryCategories = () => {
    if (!categoryLoading) {
      loadCategories();
    }
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm("");
    setProductsLimit(48);
  };

  const handleFiltersChange = (newFilters) => {
    // Ensure hoodies category is always maintained
    setFilters({
      ...newFilters,
      category: "hoodies"
    });
  };

  const handleLoadMoreItems = () => {
    setProductsLimit((previous) => previous + 24);
  };

  const handleSearchSubmit = (value) => {
    setSearchTerm((value ?? "").toString());
  };

  const displayedCount = filteredProducts.length;
  const totalCount = totalProducts || displayedCount;
  const hasProducts = products.length > 0;
  const isInitialProductLoad = loading && !hasProducts;
  const isRefreshingProducts = loading && hasProducts;

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === "category") return false; // Don't count hoodies filter as active
    if (key === "subcategory") return value !== "all";
    if (key === "gender") return value !== "all";
    if (Array.isArray(value)) return value.length > 0;
    return value !== null && value !== "";
  });

  const isDefaultView = !hasActiveFilters && searchTerm.trim() === "";

  return (
    <div className="min-h-screen bg-white pb-16 text-neutralc-900 sm:pb-0">
      <UserNavbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        isLoggedIn={isLoggedIn}
      />

      <main className="mx-auto max-w-7xl px-2 py-4 sm:px-6 sm:py-10 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 text-center sm:mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-primary-500 sm:text-4xl">
            Hoodies Collection
          </h1>
          <p className="mt-2 text-sm text-neutralc-600 sm:mt-3 sm:text-base">
            Discover our complete hoodies collection with advanced filters
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
          {/* Filters Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <AdvancedFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              productCount={totalCount}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-4 rounded-lg border border-neutralc-200 bg-primary-100 p-3 shadow-sm sm:space-y-6 sm:rounded-2xl sm:p-6 sm:shadow-[0_20px_45px_rgba(0,0,0,0.08)]">
            {/* Mobile Filter and Sort Bar */}
            <div className="flex items-center justify-between gap-3 lg:hidden">
              <div className="flex flex-1 gap-2">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 sm:text-sm"
                  onClick={() => {
                    setMobileFilterDraft(filters);
                    setShowMobileFilters(true);
                    setMobileFilterTab("Category");
                    setMobileFilterSearch("");
                  }}
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                    />
                  </svg>
                  Filters
                </button>
                <select
                  value={sortOption}
                  onChange={(event) => setSortOption(event.target.value)}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 sm:text-sm"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mobile Filters Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-[999] flex h-full w-full items-stretch bg-neutralc-900/40 lg:hidden">
                <div
                  className="absolute left-0 right-0 mx-auto w-full"
                  style={{ top: "20vh", height: "80vh" }}
                >
                  <div className="relative flex h-full w-full bg-white">
                    {/* Sidebar Tabs */}
                    <div className="flex flex-col w-28 bg-neutralc-100 border-r h-full">
                      {[
                        "Category",
                        "Gender",
                        "Color",
                        "Price",
                        "Rating",
                      ].map((tab) => (
                        <button
                          key={tab}
                          className={`py-3 px-2 text-left text-xs sm:text-sm font-medium border-l-4 transition-colors ${
                            mobileFilterTab === tab
                              ? "border-primary-500 bg-white text-primary-500"
                              : "border-transparent text-gray-700 hover:bg-neutralc-100"
                          }`}
                          onClick={() => {
                            setMobileFilterTab(tab);
                            setMobileFilterSearch("");
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    {/* Filter Options Panel */}
                    <div className="flex-1 flex flex-col min-w-0 h-full">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b px-4 py-3">
                        <span className="font-semibold text-base">Filters</span>
                        <button
                          onClick={() => setShowMobileFilters(false)}
                          className="text-neutralc-400 hover:text-gray-700 text-2xl"
                        >
                          &times;
                        </button>
                      </div>

                      {/* Search box for options */}
                      <div className="px-4 py-2 border-b">
                        <input
                          type="text"
                          placeholder="Search"
                          value={mobileFilterSearch}
                          onChange={(e) => setMobileFilterSearch(e.target.value)}
                          className="w-full rounded border border-neutralc-200 px-3 py-2 text-xs sm:text-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>

                      {/* Options List */}
                      <div className="flex-1 overflow-y-auto px-4 py-2 pb-20">
                        {mobileFilterTab === "Category" && (
                          <div className="space-y-2">
                            <p className="text-sm text-gray-500 mb-3">Currently showing: Hoodies</p>
                            <label className="flex items-center py-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={true}
                                readOnly
                                className="mr-3 h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                              />
                              <span className="text-sm">All Hoodies</span>
                            </label>
                          </div>
                        )}

                        {mobileFilterTab === "Gender" && (
                          <>
                            {[
                              { value: "all", label: "All" },
                              { value: "Men", label: "Men" },
                            ]
                              .filter(
                                (opt) =>
                                  !mobileFilterSearch ||
                                  opt.label
                                    .toLowerCase()
                                    .includes(mobileFilterSearch.toLowerCase())
                              )
                              .map((opt) => (
                                <label
                                  key={opt.value}
                                  className="flex items-center py-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      mobileFilterDraft.gender === opt.value
                                    }
                                    onChange={() =>
                                      setMobileFilterDraft((draft) => ({
                                        ...draft,
                                        gender: opt.value,
                                      }))
                                    }
                                    className="mr-3 h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                                  />
                                  <span className="text-sm">{opt.label}</span>
                                </label>
                              ))}
                          </>
                        )}

                        {mobileFilterTab === "Color" && (
                          <div className="grid grid-cols-2 gap-3 py-2">
                            {COMMON_COLORS
                              .filter(
                                (opt) =>
                                  !mobileFilterSearch ||
                                  opt.name
                                    .toLowerCase()
                                    .includes(mobileFilterSearch.toLowerCase())
                              )
                              .map((opt) => (
                                <button
                                  key={opt.name}
                                  onClick={() =>
                                    setMobileFilterDraft((draft) => ({
                                      ...draft,
                                      colors: draft.colors?.includes(opt.name)
                                        ? draft.colors.filter((c) => c !== opt.name)
                                        : [...(draft.colors || []), opt.name],
                                    }))
                                  }
                                  className={`group relative flex flex-col items-center justify-center rounded-lg border-2 p-3 transition-all hover:scale-105 ${
                                    mobileFilterDraft.colors?.includes(opt.name)
                                      ? "border-primary-500 ring-2 ring-primary-500/30"
                                      : "border-neutralc-200 hover:border-primary-500/60"
                                  }`}
                                >
                                  <div
                                    className={`h-12 w-12 rounded-md ${
                                      opt.name === "white"
                                        ? "border-2 border-neutralc-200"
                                        : "border border-neutralc-200"
                                    }`}
                                    style={{ backgroundColor: opt.hex }}
                                  />
                                  {mobileFilterDraft.colors?.includes(opt.name) && (
                                    <svg
                                      className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-5 w-5 ${
                                        opt.name === "white" || opt.name === "yellow"
                                          ? "text-neutralc-600"
                                          : "text-white"
                                      } drop-shadow-lg`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  )}
                                  <span className="mt-2 text-xs font-medium text-neutralc-600 capitalize">
                                    {opt.name}
                                  </span>
                                </button>
                              ))}
                          </div>
                        )}

                        {mobileFilterTab === "Price" && (
                          <>
                            {[
                              { label: "Under ₹500", min: 0, max: 500 },
                              { label: "₹500 - ₹1000", min: 500, max: 1000 },
                              { label: "₹1000 - ₹2000", min: 1000, max: 2000 },
                              { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
                              { label: "₹5000 - ₹10000", min: 5000, max: 10000 },
                              { label: "Above ₹10000", min: 10000, max: 999999 },
                            ]
                              .filter(
                                (opt) =>
                                  !mobileFilterSearch ||
                                  opt.label
                                    .toLowerCase()
                                    .includes(mobileFilterSearch.toLowerCase())
                              )
                              .map((opt) => (
                                <label
                                  key={opt.label}
                                  className="flex items-center py-2 cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={mobileFilterDraft.priceRanges?.some(
                                      (r) => r.min === opt.min && r.max === opt.max
                                    )}
                                    onChange={() => {
                                      const isSelected = mobileFilterDraft.priceRanges?.some(
                                        (r) => r.min === opt.min && r.max === opt.max
                                      );
                                      setMobileFilterDraft((draft) => ({
                                        ...draft,
                                        priceRanges: isSelected
                                          ? draft.priceRanges.filter(
                                              (r) => !(r.min === opt.min && r.max === opt.max)
                                            )
                                          : [...(draft.priceRanges || []), opt],
                                      }));
                                    }}
                                    className="mr-3 h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                                  />
                                  <span className="text-sm">{opt.label}</span>
                                </label>
                              ))}
                          </>
                        )}

                        {mobileFilterTab === "Rating" && (
                          <>
                            {[5, 4, 3, 2, 1].map((rating) => (
                              <label
                                key={rating}
                                className="flex items-center py-2 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={mobileFilterDraft.minRating === rating}
                                  onChange={() =>
                                    setMobileFilterDraft((draft) => ({
                                      ...draft,
                                      minRating:
                                        draft.minRating === rating ? null : rating,
                                    }))
                                  }
                                  className="mr-3 h-4 w-4 border-gray-300 text-primary-500 focus:ring-primary-500"
                                />
                                <div className="flex items-center">
                                  <div className="flex">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <svg
                                        key={i}
                                        className={`h-4 w-4 ${
                                          i < rating
                                            ? "text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path d="M9.049 2.927C9.3 2.175 10.7 2.175 10.951 2.927L12.09 6.31a1 1 0 00.95.69h3.565c.969 0 1.371 1.24.588 1.81l-2.882 2.093a1 1 0 00-.364 1.118l1.1 3.383c.3.752-.755 1.378-1.539.913L10 13.347l-2.508 1.965c-.784.465-1.84-.161-1.539-.913l1.1-3.383a1 1 0 00-.364-1.118L4.207 8.81c-.783-.57-.381-1.81.588-1.81h3.565a1 1 0 00.95-.69l1.139-3.383z" />
                                      </svg>
                                    ))}
                                  </div>
                                  <span className="ml-2 text-sm">
                                    {rating} star{rating > 1 ? "s" : ""} & up
                                  </span>
                                </div>
                              </label>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Apply/Reset buttons */}
                      <div className="border-t bg-white p-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setMobileFilterDraft(DEFAULT_FILTERS);
                            }}
                            className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                          >
                            Reset
                          </button>
                          <button
                            onClick={() => {
                              setFilters({
                                ...mobileFilterDraft,
                                category: "hoodies" // Always maintain hoodies filter
                              });
                              setShowMobileFilters(false);
                            }}
                            className="flex-1 rounded-md border border-transparent bg-primary-500 px-3 py-2 text-sm font-medium text-white hover:bg-primary-600"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Summary */}
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-neutralc-600 sm:text-base">
                  {displayedCount === 1
                    ? "1 hoodie"
                    : `${displayedCount} hoodies`}
                  {!isDefaultView && (
                    <span className="ml-2 text-xs text-neutralc-500">
                      (filtered)
                    </span>
                  )}
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-4">
                {!isDefaultView && (
                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="text-sm font-semibold text-primary-500 transition-colors hover:text-primary-700"
                  >
                    Clear all filters
                  </button>
                )}

                <div className="w-48">
                  <label className="sr-only" htmlFor="hoodies-sort">
                    Sort hoodies
                  </label>
                  <select
                    id="hoodies-sort"
                    value={sortOption}
                    onChange={(event) => setSortOption(event.target.value)}
                    className="w-full rounded-lg border border-neutralc-200 bg-white px-3 py-2 text-sm text-neutralc-600 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        Sort by: {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Loading States */}
            {categoryLoading ? (
              <div className="flex flex-wrap items-center gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={`hoodies-category-skeleton-${index}`}
                    className="h-6 w-24"
                  />
                ))}
              </div>
            ) : null}

            {categoryError && (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                <span className="font-medium">
                  Unable to load categories right now.
                </span>
                <button
                  type="button"
                  onClick={handleRetryCategories}
                  className="rounded border border-rose-400 px-3 py-1 font-semibold text-rose-100 transition-colors hover:bg-rose-500/20"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Products Grid */}
            {isInitialProductLoad ? (
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div
                    key={`hoodies-product-skeleton-${index}`}
                    className="space-y-3 rounded-3xl border border-neutralc-200 bg-white p-3 shadow-sm"
                  >
                    <Skeleton className="h-44 w-full rounded-2xl" rounded={false} />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-12 text-center">
                <p className="text-rose-100">
                  We couldn&apos;t load hoodies right now.
                </p>
                <button
                  type="button"
                  onClick={() => loadProducts()}
                  className="rounded-lg border border-rose-400 px-4 py-2 font-semibold text-rose-100 transition-colors hover:bg-rose-500/20"
                >
                  Retry loading hoodies
                </button>
              </div>
            ) : filteredProducts.length ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutralc-200 bg-white p-12 text-center">
                <p className="text-neutralc-600">
                  No hoodies match your current filters.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-lg bg-primary-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-primary-700"
                >
                  Clear filters
                </button>
              </div>
            )}

            {isRefreshingProducts ? (
              <div className="flex justify-center pt-6">
                <Loader label="Refreshing hoodies" />
              </div>
            ) : null}

            {!loading &&
              !error &&
              filteredProducts.length > 0 &&
              filteredProducts.length < totalCount && (
                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={handleLoadMoreItems}
                    className="inline-flex items-center justify-center rounded-lg bg-primary-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-100"
                  >
                    More Hoodies
                  </button>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HoodiesPage;