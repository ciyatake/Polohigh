import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* -----------------------------------
    IMAGE COMPONENT (Re-used from your code)
    - Lazy loading
    - Skeleton loader
    - Optional CTA button
----------------------------------- */
function ImageWithSkeleton({ slide, navigate }) {
  const [loaded, setLoaded] = useState(false);

  const handleClick = () => {
    if (slide.link) navigate(slide.link);
  };

  return (
    <div
      className="relative w-full h-full cursor-pointer overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-white"
      onClick={handleClick}
    >
      {/* Skeleton Loader - Enhanced */}
      {!loaded && (
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
      )}

      {/* Lazy Loaded Image */}
      <img
        src={slide.img}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-fit md:object-contain transition-all duration-700 ${
          loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        alt="Carousel Slide"
      />

      {/* Optional CTA Button - Enhanced Design */}
      {slide.cta && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // Don't trigger the div's click
            handleClick();
          }}
          className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-gradient-to-r from-primary-500 to-primary-700 text-white font-bold px-4 py-2 md:px-8 md:py-3.5 rounded-full shadow-2xl hover:scale-105 hover:shadow-primary-500/50 transition-all duration-300 flex items-center gap-2 group text-sm md:text-base"
        >
          <span>{slide.cta}</span>
          <svg 
            className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* -----------------------------------
    NEW CAROUSEL COMPONENT
    - No Swiper.js
    - Uses React Hooks + Tailwind
    - Replicates all features:
      - Autoplay
      - Looping
      - Custom arrows
      - Clickable pagination
----------------------------------- */
export default function Carousel({ slides, autoplayDelay = 5000 }) {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Navigation functions
  const prev = () =>
    setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));

  const next = () =>
    setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  // Autoplay functionality
  useEffect(() => {
    if (autoplayDelay) {
      const timer = setTimeout(next, autoplayDelay);
      return () => clearTimeout(timer);
    }
  }, [current, autoplayDelay, slides.length]); // Reset timer on slide change

  return (
    <div className="w-full relative group">
      {/* Main Carousel Container with elegant styling */}
      <div className="relative rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-gray-50 to-gray-100">
        {/* This is the "track" that moves. 
          We use CSS transform to slide it left or right.
        */}
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {/* All slides are rendered, but only the current one is visible */}
          {slides.map((slide, i) => (
            <div
              key={i}
              className="min-w-full h-[250px] sm:h-[350px] md:h-[420px] lg:h-[500px] flex-shrink-0"
            >
              <ImageWithSkeleton slide={slide} navigate={navigate} />
            </div>
          ))}
        </div>

        {/* ELEGANT NAVIGATION ARROWS - Hidden on mobile, shown on hover for desktop */}
        <button
          onClick={prev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-20 opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
          aria-label="Previous slide"
        >
          <svg 
            className="w-6 h-6 text-gray-800" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={next}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-20 opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-white"
          aria-label="Next slide"
        >
          <svg 
            className="w-6 h-6 text-gray-800" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* MODERN PAGINATION DOTS */}
        <div className="absolute bottom-3 md:bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current 
                  ? "bg-white w-6 md:w-8 h-2 md:h-2.5 shadow-lg" 
                  : "bg-white/60 hover:bg-white/80 w-2 md:w-2.5 h-2 md:h-2.5"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </div>
  );
}