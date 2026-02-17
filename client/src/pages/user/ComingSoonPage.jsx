import { useParams } from "react-router-dom";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";

const ComingSoonPage = ({ isLoggedIn, productType: propProductType }) => {
  const { productType: routeProductType } = useParams();
  
  const getProductTypeName = (type) => {
    const types = {
      tshirts: "T-Shirts",
      pants: "Pants",
      "t-shirt": "T-Shirts",
      "t-shirts": "T-Shirts"
    };
    return types[type] || type;
  };
  
  const productType = propProductType || getProductTypeName(routeProductType) || "Product";
  return (
    <div className="min-h-screen bg-white pb-16 text-neutralc-900 sm:pb-0">
      <UserNavbar 
        isLoggedIn={isLoggedIn}
        searchTerm=""
        onSearchChange={() => {}}
        onSearchSubmit={() => {}}
      />

      <main className="mx-auto max-w-7xl px-2 py-4 sm:px-6 sm:py-10 lg:px-8">
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="rounded-2xl border border-neutralc-200 bg-gradient-to-br from-primary-50 to-primary-100 p-8 shadow-lg sm:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-6">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-500 text-white">
                  <svg 
                    className="h-10 w-10" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
              </div>
              
              <h1 className="mb-4 text-3xl font-bold text-primary-500 sm:text-4xl">
                Coming Soon!
              </h1>
              
              <p className="mb-2 text-lg text-neutralc-700 sm:text-xl">
                {productType} Collection
              </p>
              
              <p className="mb-6 text-sm text-neutralc-600 sm:text-base">
                We're working hard to bring you an amazing {productType.toLowerCase()} collection. 
                Stay tuned for exciting updates!
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2 text-sm text-neutralc-500">
                  <span>🚀</span>
                  <span>Launching soon</span>
                </div>
                
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center rounded-lg bg-primary-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComingSoonPage;