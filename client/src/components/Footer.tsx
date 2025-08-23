export default function Footer() {
  return (
    <footer className="bg-grind-surface border-t border-gray-700 py-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4" data-testid="footer-logo">
              <i className="fas fa-fire text-grind-primary text-xl"></i>
              <span className="font-poppins font-bold text-xl">GrindCTRL</span>
            </div>
            <p className="text-gray-400 mb-4" data-testid="footer-description">
              Premium streetwear for the modern urban lifestyle. Minimal design,
              maximum impact.
            </p>
            <div className="flex space-x-4" data-testid="social-links">
              <a
                href="#"
                className="text-gray-400 hover:text-grind-primary transition-colors"
                data-testid="link-instagram"
              >
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-grind-primary transition-colors"
                data-testid="link-twitter"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-grind-primary transition-colors"
                data-testid="link-facebook"
              >
                <i className="fab fa-facebook text-xl"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-poppins font-semibold mb-4" data-testid="footer-quick-links-title">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-about"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-size-guide"
                >
                  Size Guide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-shipping"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-returns"
                >
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-poppins font-semibold mb-4" data-testid="footer-customer-care-title">
              Customer Care
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-contact"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-faq"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-track-order"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  data-testid="link-support"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-poppins font-semibold mb-4" data-testid="footer-newsletter-title">
              Newsletter
            </h3>
            <p className="text-gray-400 mb-4" data-testid="newsletter-description">
              Subscribe for updates and exclusive offers
            </p>
            <div className="flex space-x-2" data-testid="newsletter-form">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-grind-dark border border-gray-600 rounded-lg p-3 focus:border-grind-primary focus:outline-none"
                data-testid="input-newsletter-email"
              />
              <button
                className="bg-grind-primary hover:bg-red-600 px-4 rounded-lg transition-all"
                data-testid="button-newsletter-subscribe"
              >
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm" data-testid="copyright">
            © 2025 GrindCTRL. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
              data-testid="link-privacy"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white text-sm transition-colors"
              data-testid="link-terms"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
