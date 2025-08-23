import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">G</span>
              </div>
              <span>GrindCTRL</span>
            </div>
            <p className="text-gray-400 text-sm">
              Premium streetwear for the modern urban lifestyle. Minimal design, maximum impact.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.23 18.148c-2.606-.274-4.637-2.303-4.912-4.909H6.61c.278 1.262 1.016 2.307 2.042 2.738-.076-.618-.17-1.612.036-2.309l.75-2.846s-.191-.383-.191-.954c0-.896.521-1.565 1.168-1.565.551 0 .817.414.817.91 0 .554-.353 1.38-.535 2.147-.152.643.323 1.167.959 1.167 1.152 0 2.037-1.215 2.037-2.967 0-1.553-1.117-2.64-2.712-2.64-1.849 0-2.936 1.386-2.936 2.82 0 .559.214.958.481 1.227.052.063.06.118.045.181-.05.197-.159.634-.18.723-.028.118-.091.142-.209.087-.81-.378-1.315-1.568-1.315-2.523 0-2.045 1.486-3.923 4.283-3.923 2.248 0 3.996 1.601 3.996 3.735 0 2.232-1.409 4.025-3.364 4.025-.657 0-1.275-.342-1.487-.749l-.351 1.35c-.126.495-.467.894-.803 1.234z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6C21.69 6.35 20.86 6.58 20 6.69C20.88 6.16 21.56 5.32 21.88 4.31C21.05 4.81 20.13 5.16 19.16 5.36C18.37 4.5 17.26 4 16 4C13.65 4 11.73 5.92 11.73 8.29C11.73 8.63 11.77 8.96 11.84 9.27C8.28 9.09 5.11 7.38 3 4.79C2.63 5.42 2.42 6.16 2.42 6.94C2.42 8.43 3.17 9.75 4.33 10.5C3.62 10.5 2.96 10.3 2.38 10C2.38 10 2.38 10 2.38 10.03C2.38 12.11 3.86 13.85 5.82 14.24C5.46 14.34 5.08 14.39 4.69 14.39C4.42 14.39 4.15 14.36 3.89 14.31C4.43 16 6 17.26 7.89 17.29C6.43 18.45 4.58 19.13 2.56 19.13C2.22 19.13 1.88 19.11 1.54 19.07C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79C20.33 8.6 20.33 8.42 20.32 8.23C21.16 7.63 21.88 6.87 22.46 6Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Home
              </Link>
              <Link href="/products" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Products
              </Link>
              <Link href="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">
                About
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-semibold mb-4">Customer Care</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Size Guide
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Shipping Info
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Returns
              </a>
              <a href="#" className="block text-gray-400 hover:text-white transition-colors text-sm">
                FAQ
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive offers and updates
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm focus:outline-none focus:border-white"
              />
              <button className="px-4 py-2 bg-white text-black rounded text-sm font-medium hover:bg-gray-200 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 GrindCTRL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}