import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import Carousel from "../../components/common/Carousel.jsx";
import "../../styles/animations.css";

const posters = [
  {
    img: "/polohigh-hero-1.svg",
    link: "/hoodies",
    title: "Premium Hoodies Collection",
    subtitle: "Comfort meets Style"
  },
  {
    img: "/polohigh-hero-2.svg",
    link: "/",
    title: "New Arrivals",
    subtitle: "Discover Latest Fashion"
  },
  {
    img: "/polohigh-hero-3.svg",
    link: "/hoodies",
    title: "Winter Collection",
    subtitle: "Stay Warm, Look Cool"
  },
  {
    img: "/polohigh-hero-4.svg", 
    link: "/",
    title: "PoloHigh Essentials",
    subtitle: "Everyday Premium Wear"
  }
];

const HERO_HIGHLIGHTS = [
  {
    id: "delivery",
    badge: "FD",
    title: "Fast Delivery",
    description: "Delivery in 2-3 days",
  },
  {
    id: "location",
    badge: "IN",
    title: "Location",
    description: "Pan India delivery",
  },
  {
    id: "offer",
    badge: "OF",
    title: "Special Offer",
    description: "Free shipping on orders above Rs 999",
  },
];

const PRODUCT_CATEGORIES = [
  {
    id: "hoodies",
    title: "Hoodies",
    description: "Premium quality hoodies for every season",
    image: "/hoddie.jpg",
    available: true,
    route: "/hoodies",
    fallbackGradient: "from-gray-600 to-gray-800"
  },
  {
    id: "tshirts",
    title: "T-Shirts", 
    description: "Comfortable and stylish t-shirts",
    image: "/tshirt-banner.svg",
    available: false,
    route: "/tshirts",
    fallbackGradient: "from-gray-700 to-gray-900"
  },
  {
    id: "pants",
    title: "Pants",
    description: "Perfect fit pants for all occasions", 
    image: "/pants-banner.svg",
    available: false,
    route: "/pants",
    fallbackGradient: "from-gray-800 to-black"
  }
];

const HomePage = ({ isLoggedIn }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (value) => {
    setSearchTerm((value ?? "").toString());
  };

  const handleCategoryClick = (category) => {
    if (category.available) {
      navigate(category.route);
      // Scroll to top after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      navigate(`/coming-soon/${category.id}`);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-white text-neutralc-900">
      <UserNavbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        isLoggedIn={isLoggedIn}
      />

      {/* Hero Carousel Section */}
      <section className="relative mb-12 mt-8">
        <div className="h-64 sm:h-80 lg:h-96">
          <Carousel slides={posters} />
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        {/* Hero Brand Section */}
        <section className="py-8 sm:py-12">
          <div className="animate-fade-in-up">
            <img 
              src="/polohigh-hero-model.svg" 
              alt="PoloHigh - Premium Quality Meets Contemporary Style" 
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        </section>

        {/* Shop Collections Section */}
        <section className="py-16 sm:py-20">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Shop Our Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our premium collections crafted with attention to detail and quality
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {PRODUCT_CATEGORIES.map((category, index) => (
              <div
                key={category.id}
                className={`group relative overflow-hidden rounded-3xl cursor-pointer animate-fade-in-up shadow-2xl transition-all duration-500`}
                style={{ animationDelay: `${(index + 2) * 200}ms` }}
                onClick={() => handleCategoryClick(category)}
              >
                <div className="aspect-[3/4] relative">
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.fallbackGradient}`} />
                  
                  {/* Image */}
                  <img
                    src={category.image}
                    alt={category.title}
                    className="h-full w-full object-cover transition-all duration-500 scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  
                  {/* Gradient Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-black/20 opacity-100 transition-opacity duration-500" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="transform translate-y-0 transition-transform duration-300">
                      <h3 className="text-3xl font-bold mb-3">{category.title}</h3>
                      <p className="text-gray-200 mb-6 text-lg opacity-90">{category.description}</p>
                      
                      <button
                        className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                          category.available
                            ? "bg-white text-gray-900 hover:bg-gray-100 shadow-xl"
                            : "bg-gray-800/80 text-white border-2 border-gray-400 backdrop-blur-sm"
                        }`}
                      >
                        {category.available ? (
                          <>
                            Shop Collection
                            <svg className="ml-3 h-5 w-5 transition-transform duration-300 translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </>
                        ) : (
                          <>
                            Coming Soon
                            <svg className="ml-3 h-5 w-5 animate-pulse-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-20 sm:py-28">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-700 to-gray-900 px-8 py-20 sm:px-16 sm:py-24 animate-fade-in-up">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 animate-pulse-slow" />
            </div>
            
            <div className="relative text-center">
              <h2 className="text-4xl font-bold text-white sm:text-5xl mb-4 animate-fade-in-up">
                Join the PoloHigh Community
              </h2>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                Be the first to know about new collections, exclusive offers, and style updates. Join thousands of fashion enthusiasts who trust PoloHigh.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-2xl text-gray-900 placeholder-gray-500 text-lg focus:outline-none focus:ring-4 focus:ring-white/50 transition-all duration-300"
                />
                <button className="bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-xl transform hover:scale-105 hover:-translate-y-1">
                  Subscribe Now
                </button>
              </div>
              
              <div className="flex items-center justify-center gap-8 mt-12 text-gray-400 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Unsubscribe anytime</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;