import {
  Mail,
  Phone,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-neutralc-900 text-white border-t border-neutralc-800">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={()=>navigate("/")}>
              <img
                src="/polohighLogo.png"
                alt="POLOHIGH"
                className="h-8 w-auto filter brightness-0 invert bg-yellow-100 rounded p-1"
                style={{ filter: 'invert(0)' }}
              />
              <h3 className="text-2xl font-semibold text-white">
                Polohigh
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-neutralc-300">
              Thoughtfully curated fashion and lifestyle essentials to help you
              celebrate everyday moments in style.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:care@polohigh.com"
                className="flex items-center text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                care@polohigh.com
              </a>
              <a
                href="tel:+917054290808"
                className="flex items-center text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                +917054290808
              </a>
              <div className="flex items-center text-sm text-neutralc-300">
                <Clock className="w-4 h-4 mr-2" />
                Monday to Saturday, 9:00 AM – 6:00 PM IST
              </div>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">SHOP</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  onClick={scrollToTop}
                  className="text-sm text-neutralc-300 hover:text-white transition-colors"
                >
                  Men
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/"
                  className="text-sm text-neutralc-300 hover:text-white transition-colors"
                >
                  Kids
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-neutralc-300 hover:text-white transition-colors"
                >
                  Accessories
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-sm text-neutralc-300 hover:text-white transition-colors"
                >
                  Home & Living
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Help & Support Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              HELP & SUPPORT
            </h4>
            <ul className="flex flex-col space-y-2">
              <Link
                to="/track-order"
                onClick={scrollToTop}
                className="text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                Track Order
              </Link>
              <Link
                to="/refund-policy"
                onClick={scrollToTop}
                className="text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                Refund Policy
              </Link>
              <Link
                to="/return-policy"
                onClick={scrollToTop}
                className="text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                Return Policy
              </Link>
              <Link
                to="/shipping-policy"
                onClick={scrollToTop}
                className="text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                Shipping Policy
              </Link>
              <Link
                to="/FAQs"
                onClick={scrollToTop}
                className="text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                FAQs
              </Link>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">
              COMPANY
            </h4>
            <ul className="flex flex-col space-y-2">
              <Link
                to="our-story"
                onClick={scrollToTop}
                className="text-sm text-neutralc-300 hover:text-white transition-colors"
              ></Link>
              <Link
                to="/career-page"
                onClick={scrollToTop}
                className="text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                Careers
              </Link>
              <Link
                to="/press"
                onClick={scrollToTop}
                className="text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                Press
              </Link>
              <Link
                to="contact-us"
                onClick={scrollToTop}
                className="text-sm text-neutralc-300 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </ul>
          </div>
        </div>

        {/* Social Media & Bottom Bar */}
        <div className="pt-8 mt-12 border-t border-neutralc-800">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a
                href=" https://www.instagram.com/polohighofficial?igsh=MjlzYXhiMHcza2M1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutralc-800 flex items-center justify-center text-neutralc-300 hover:bg-primary-300 hover:text-neutralc-900 transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutralc-800 flex items-center justify-center text-neutralc-300 hover:bg-primary-300 hover:text-neutralc-900 transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutralc-800 flex items-center justify-center text-neutralc-300 hover:bg-primary-300 hover:text-neutralc-900 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-neutralc-800 flex items-center justify-center text-neutralc-300 hover:bg-primary-300 hover:text-neutralc-900 transition-all"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 text-sm text-neutralc-300 md:justify-end">
              <Link
                to='/privacy-policy'
                onClick={scrollToTop}
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link
                to="/terms-of-service"
                onClick={scrollToTop}
                className="hover:text-white transition-colors"
              >
                Terms of Service
              </Link>
              <span className="hidden sm:inline">•</span>
              <Link
                to="/cookie-policy"
                onClick={scrollToTop}
                className="hover:text-white transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 text-sm text-center text-neutralc-300">
            © {new Date().getFullYear()} Polohigh. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
