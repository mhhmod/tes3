/**
 * GrindCTRL - Premium Streetwear E-commerce
 * Flagship-level vanilla JavaScript implementation
 * Features: Multi-product catalog, cart, wishlist, checkout, animations
 */

'use strict';

// ===== GLOBAL STATE MANAGEMENT ===== 
class AppState {
    constructor() {
        this.products = [];
        this.categories = [];
        this.cart = this.loadFromStorage('grindctrl_cart') || [];
        this.wishlist = this.loadFromStorage('grindctrl_wishlist') || [];
        this.currentFilter = 'all';
        this.currentProduct = null;
        this.isLoading = false;
        this.modals = {
            quickView: false,
            checkout: false,
            sizeGuide: false,
            success: false
        };
        this.checkoutStep = 1;
        this.orderData = null;
    }

    // Persistent storage methods
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.warn('Failed to load from localStorage:', error);
            return null;
        }
    }

    // Cart methods
    addToCart(productId, options = {}) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return false;

        const cartItem = {
            id: `${productId}_${options.size || 'default'}_${options.color || 'default'}`,
            productId,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: options.quantity || 1,
            size: options.size,
            color: options.color
        };

        const existingIndex = this.cart.findIndex(item => item.id === cartItem.id);
        
        if (existingIndex >= 0) {
            this.cart[existingIndex].quantity += cartItem.quantity;
        } else {
            this.cart.push(cartItem);
        }

        this.saveToStorage('grindctrl_cart', this.cart);
        this.updateCartUI();
        return true;
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveToStorage('grindctrl_cart', this.cart);
        this.updateCartUI();
    }

    updateCartQuantity(itemId, quantity) {
        if (quantity <= 0) {
            this.removeFromCart(itemId);
            return;
        }

        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            item.quantity = quantity;
            this.saveToStorage('grindctrl_cart', this.cart);
            this.updateCartUI();
        }
    }

    // Task 5: Helper method for relative quantity changes
    changeCartQuantity(itemId, delta) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            const newQuantity = item.quantity + delta;
            this.updateCartQuantity(itemId, Math.max(0, newQuantity));
        }
    }

    clearCart() {
        this.cart = [];
        this.saveToStorage('grindctrl_cart', this.cart);
        this.updateCartUI();
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Wishlist methods
    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index >= 0) {
            this.wishlist.splice(index, 1);
        } else {
            this.wishlist.push(productId);
        }
        this.saveToStorage('grindctrl_wishlist', this.wishlist);
        this.updateWishlistUI();
        return index < 0; // Return true if added, false if removed
    }

    isInWishlist(productId) {
        return this.wishlist.includes(productId);
    }

    // UI update methods
    updateCartUI() {
        const cartCount = this.getCartCount();
        const cartCountElement = document.getElementById('cartCount');
        
        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
            cartCountElement.classList.toggle('visible', cartCount > 0);
        }

        this.renderCartItems();
    }

    updateWishlistUI() {
        const wishlistCountElement = document.getElementById('wishlistCount');
        
        if (wishlistCountElement) {
            wishlistCountElement.textContent = this.wishlist.length;
            wishlistCountElement.classList.toggle('visible', this.wishlist.length > 0);
        }

        this.renderWishlistItems();
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const cartSummaryContainer = document.getElementById('cartSummary');
        
        if (!cartItemsContainer) return;

        if (this.cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <small>Add some items to get started</small>
                </div>
            `;
            cartSummaryContainer.innerHTML = '';
            return;
        }

        cartItemsContainer.innerHTML = this.cart.map(item => `
            <div class="cart-item" data-item-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" loading="lazy">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-options">
                        ${item.size ? `Size: ${item.size}` : ''}
                        ${item.size && item.color ? ', ' : ''}
                        ${item.color ? `Color: ${item.color}` : ''}
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="app.changeCartQuantity('${item.id}', -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="app.changeCartQuantity('${item.id}', 1)">+</button>
                        </div>
                        <div class="cart-item-price">${(item.price * item.quantity).toFixed(2)} EGP</div>
                    </div>
                </div>
            </div>
        `).join('');

        const subtotal = this.getCartTotal();
        const shipping = 0; // Free shipping
        const total = subtotal + shipping;

        cartSummaryContainer.innerHTML = `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)} EGP</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span class="text-green">Free</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)} EGP</span>
            </div>
            <button class="btn btn-primary checkout-btn" onclick="app.openCheckout()">
                Proceed to Checkout
            </button>
        `;
    }

    renderWishlistItems() {
        const wishlistItemsContainer = document.getElementById('wishlistItems');
        
        if (!wishlistItemsContainer) return;

        if (this.wishlist.length === 0) {
            wishlistItemsContainer.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-heart"></i>
                    <p>Your wishlist is empty</p>
                    <small>Save items you love for later</small>
                </div>
            `;
            return;
        }

        const wishlistProducts = this.wishlist.map(id => this.products.find(p => p.id === id)).filter(Boolean);

        wishlistItemsContainer.innerHTML = wishlistProducts.map(product => `
            <div class="wishlist-item" data-product-id="${product.id}">
                <img src="${product.images[0]}" alt="${product.name}" class="wishlist-item-image" loading="lazy">
                <div class="wishlist-item-details">
                    <div class="wishlist-item-name">${product.name}</div>
                    <div class="wishlist-item-price">${product.price.toFixed(2)} EGP</div>
                    <div class="wishlist-item-actions">
                        <button class="wishlist-btn primary" onclick="app.openQuickView('${product.id}')">
                            Quick View
                        </button>
                        <button class="wishlist-btn secondary" onclick="app.toggleWishlist('${product.id}')">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// ===== UTILITY FUNCTIONS =====
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = performance.now();
        
        function animate(timestamp) {
            let progress = (timestamp - start) / duration;
            if (progress > 1) progress = 1;
            
            element.style.opacity = progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        requestAnimationFrame(animate);
    }

    static fadeOut(element, duration = 300) {
        let start = performance.now();
        let startOpacity = parseFloat(getComputedStyle(element).opacity);
        
        function animate(timestamp) {
            let progress = (timestamp - start) / duration;
            if (progress > 1) progress = 1;
            
            element.style.opacity = startOpacity * (1 - progress);
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }

    static scrollToElement(element, offset = 0) {
        const elementPosition = element.offsetTop - offset;
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    static formatPrice(price, currency = 'EGP') {
        return `${price.toFixed(2)} ${currency}`;
    }

    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    static validatePhone(phone) {
        const re = /^[\+]?[\d\s\-\(\)]{8,}$/;
        return re.test(phone);
    }

    static generateOrderId() {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `GC-${timestamp}-${randomStr}`.toUpperCase();
    }

    static generateTrackingNumber() {
        const prefix = 'TRK';
        const randomNum = Math.floor(Math.random() * 1000000000);
        return `${prefix}${randomNum.toString().padStart(9, '0')}`;
    }
}

// ===== NOTIFICATION SYSTEM =====
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = document.getElementById('notificationToast');
        // Task 3: Enhanced toast system with hover pause and watchdog
        this.currentTimeout = null;
        this.watchdogTimeout = null;
        this.isHovered = false;
        this.isPaused = false;
        this.remainingTime = 0;
        this.startTime = 0;
        this.defaultDuration = 3500; // 3.5 seconds
        this.watchdogDuration = 8000; // 8 seconds maximum
        
        this.initializeHoverHandlers();
    }

    /**
     * Task 3: Initialize hover handlers for pause/resume functionality
     */
    initializeHoverHandlers() {
        if (!this.container) return;
        
        this.container.addEventListener('mouseenter', () => {
            this.pauseTimer();
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.resumeTimer();
        });

        this.container.addEventListener('focus', () => {
            this.pauseTimer();
        }, true);
        
        this.container.addEventListener('blur', () => {
            this.resumeTimer();
        }, true);
    }

    /**
     * Task 3: Pause the auto-hide timer
     */
    pauseTimer() {
        if (!this.isPaused && this.currentTimeout) {
            this.isPaused = true;
            const elapsed = Date.now() - this.startTime;
            this.remainingTime = Math.max(0, this.defaultDuration - elapsed);
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
    }

    /**
     * Task 3: Resume the auto-hide timer
     */
    resumeTimer() {
        if (this.isPaused && this.remainingTime > 0) {
            this.isPaused = false;
            this.startTime = Date.now();
            this.currentTimeout = setTimeout(() => {
                this.hide();
            }, this.remainingTime);
        }
    }

    /**
     * Task 3: Enhanced show method with hover pause and watchdog
     */
    show(message, type = 'info', duration = this.defaultDuration) {
        if (!this.container) return;

        // Clear any existing timers
        this.clearTimers();

        // Update toast content
        const iconElement = this.container.querySelector('#toastIcon');
        const messageElement = this.container.querySelector('#toastMessage');
        
        if (iconElement && messageElement) {
            // Reset classes
            iconElement.className = 'toast-icon';
            
            // Set appropriate icon and class
            let iconClass = 'fas fa-info-circle';
            switch (type) {
                case 'success':
                    iconClass = 'fas fa-check-circle';
                    iconElement.classList.add('success');
                    break;
                case 'error':
                    iconClass = 'fas fa-exclamation-circle';
                    iconElement.classList.add('error');
                    break;
                case 'warning':
                    iconClass = 'fas fa-exclamation-triangle';
                    iconElement.classList.add('warning');
                    break;
                default:
                    iconElement.classList.add('info');
            }
            
            iconElement.innerHTML = `<i class="${iconClass}"></i>`;
            messageElement.textContent = message;
        }

        // Show the toast
        this.container.classList.add('show');
        
        // Reset state
        this.isPaused = false;
        this.startTime = Date.now();
        this.remainingTime = duration;

        // Set auto-hide timer
        this.currentTimeout = setTimeout(() => {
            this.hide();
        }, duration);

        // Set watchdog timer (force close at 8 seconds)
        this.watchdogTimeout = setTimeout(() => {
            this.hide();
        }, this.watchdogDuration);

        // Store notification
        this.notifications.push({
            id: Date.now(),
            message,
            type,
            timestamp: new Date()
        });

        // Limit stored notifications
        if (this.notifications.length > 10) {
            this.notifications = this.notifications.slice(-10);
        }
    }

    /**
     * Task 3: Clear all timers
     */
    clearTimers() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        if (this.watchdogTimeout) {
            clearTimeout(this.watchdogTimeout);
            this.watchdogTimeout = null;
        }
    }

    hide() {
        if (!this.container) return;
        
        this.clearTimers();
        this.container.classList.remove('show');
        this.isPaused = false;
        this.remainingTime = 0;
    }

    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    warning(message) {
        this.show(message, 'warning');
    }

    info(message) {
        this.show(message, 'info');
    }
}

// ===== WEBHOOK DELIVERY SYSTEM =====
class WebhookManager {
    constructor() {
        this.config = window.CONFIG || {};
    }

    /**
     * Resilient webhook delivery with CORS fallback strategies
     */
    async deliverWebhook(payload, webhookType = 'order') {
        let url;
        
        switch (webhookType) {
            case 'return':
                url = this.config.RETURN_WEBHOOK_URL;
                break;
            case 'exchange':
                url = this.config.EXCHANGE_WEBHOOK_URL;
                break;
            default:
                url = this.config.WEBHOOK_URL;
        }

        // If no URL configured, simulate delay for local testing
        if (!url) {
            console.log('No webhook URL configured, simulating delivery...');
            await new Promise(resolve => setTimeout(resolve, 1500));
            return { success: true, method: 'simulated' };
        }

        // Strategy 1: Standard CORS fetch
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                return { success: true, method: 'cors-fetch' };
            }
        } catch (error) {
            console.log('CORS fetch failed, trying no-cors...');
        }

        // Strategy 2: No-CORS fetch (assume success)
        try {
            await fetch(url, {
                method: 'POST',
                mode: 'no-cors',
                body: JSON.stringify(payload)
            });
            return { success: true, method: 'no-cors-fetch' };
        } catch (error) {
            console.log('No-CORS fetch failed, trying sendBeacon...');
        }

        // Strategy 3: Navigator sendBeacon
        if (navigator.sendBeacon) {
            try {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                const success = navigator.sendBeacon(url, blob);
                if (success) {
                    return { success: true, method: 'sendBeacon' };
                }
            } catch (error) {
                console.log('SendBeacon failed, trying image fallback...');
            }
        }

        // Strategy 4: Image GET fallback
        try {
            const img = new Image();
            const queryString = '?payload=' + encodeURIComponent(JSON.stringify(payload));
            img.src = url + queryString;
            return { success: true, method: 'image-fallback' };
        } catch (error) {
            console.error('All webhook delivery methods failed:', error);
            return { success: false, error: error.message };
        }
    }
}

// ===== MAIN APPLICATION CLASS =====
class GrindCTRLApp {
    constructor() {
        this.state = new AppState();
        this.notifications = new NotificationManager();
        this.webhooks = new WebhookManager();
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            await this.loadProducts();
            this.setupEventListeners();
            this.initializeUI();
            
            // Task 2: Remove bottom faces strip
            this.removeFacesStrip();
            
            this.hideLoadingScreen();
            this.isInitialized = true;
        } catch (error) {
            console.error('App initialization failed:', error);
            this.notifications.error('Failed to load application');
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.state.products = data.products || [];
            this.state.categories = data.categories || [];
            
            this.renderCategories();
            this.renderProducts();
            
            // Task 1: Remove invalid product cards after rendering
            this.setupImageErrorHandling();
            
        } catch (error) {
            console.error('Failed to load products:', error);
            this.notifications.error('Failed to load products');
        }
    }

    /**
     * Task 1: Setup image error handling to remove cards with broken images
     */
    setupImageErrorHandling() {
        const productImages = document.querySelectorAll('.product-image-container img.product-image');
        
        productImages.forEach(img => {
            // Set up error handler for this image
            img.onerror = () => {
                const productCard = img.closest('.product-card');
                if (productCard) {
                    console.log('Removing product card due to broken image:', img.src);
                    productCard.remove();
                }
            };
            
            // Check if image is already broken (for cached failures)
            if (img.complete && img.naturalHeight === 0) {
                img.onerror();
            }
        });
    }

    /**
     * Task 2: Remove bottom faces/avatars strip
     */
    removeFacesStrip() {
        // Target specific IDs/classes first
        const targetSelectors = [
            '#faces-strip',
            '.faces-strip', 
            '.people-faces',
            '.testimonials-strip',
            '.avatar-strip',
            '.footer-faces'
        ];

        targetSelectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                console.log('Removing faces strip:', selector);
                element.remove();
            }
        });

        // If not found, look for any footer row with >=6 images
        const footerRows = document.querySelectorAll('footer *');
        footerRows.forEach(row => {
            const images = row.querySelectorAll('img');
            if (images.length >= 6) {
                // Check if it's primarily images (more than 60% of children are images)
                const totalChildren = row.children.length;
                const imageRatio = images.length / Math.max(totalChildren, 1);
                
                if (imageRatio > 0.6) {
                    console.log('Removing potential faces strip with', images.length, 'images');
                    row.remove();
                }
            }
        });
    }

    setupEventListeners() {
        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        const cartClose = document.getElementById('cartClose');
        const floatingCart = document.getElementById('floatingCart');

        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.toggleCart());
        }
        
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        // Wishlist toggle
        const wishlistToggle = document.getElementById('wishlistToggle');
        const wishlistClose = document.getElementById('wishlistClose');

        if (wishlistToggle) {
            wishlistToggle.addEventListener('click', () => this.toggleWishlist());
        }
        
        if (wishlistClose) {
            wishlistClose.addEventListener('click', () => this.closeWishlist());
        }

        // Task 4: Mobile menu functionality
        this.setupMobileMenu();

        // Toast close button
        const toastClose = document.getElementById('toastClose');
        if (toastClose) {
            toastClose.addEventListener('click', () => this.notifications.hide());
        }

        // Modal close on backdrop click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
                this.closeMobileMenu();
            }
        });

        // Newsletter form
        const newsletterForm = document.getElementById('newsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterSubmit(e);
            });
        }

        // Scroll header hide/show
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', Utils.throttle(() => {
            const header = document.getElementById('header');
            if (!header) return;

            const currentScrollY = window.scrollY;
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;
        }, 100));

        // Navigation highlighting
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                
                if (section) {
                    Utils.scrollToElement(section, 80);
                    
                    // Update active nav
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Close mobile menu
                    this.closeMobileMenu();
                }
            });
        });
    }

    /**
     * Task 4: Setup mobile menu functionality
     */
    setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const siteMenu = document.getElementById('site-menu');
        
        if (!mobileMenuToggle || !siteMenu) return;

        // Toggle menu
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = siteMenu.classList.contains('open');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (siteMenu.classList.contains('open') && 
                !siteMenu.contains(e.target) && 
                !mobileMenuToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    openMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const siteMenu = document.getElementById('site-menu');
        
        if (mobileMenuToggle && siteMenu) {
            siteMenu.classList.add('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'true');
            
            // Focus first link for accessibility
            const firstLink = siteMenu.querySelector('.nav-link');
            if (firstLink) {
                firstLink.focus();
            }
        }
    }

    closeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const siteMenu = document.getElementById('site-menu');
        
        if (mobileMenuToggle && siteMenu) {
            siteMenu.classList.remove('open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    }

    initializeUI() {
        this.state.updateCartUI();
        this.state.updateWishlistUI();
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 300);
            }, 1000);
        }
    }

    renderCategories() {
        const categoryTabs = document.getElementById('categoryTabs');
        if (!categoryTabs) return;

        categoryTabs.innerHTML = this.state.categories.map(category => `
            <button class="filter-tab ${category.id === this.state.currentFilter ? 'active' : ''}" 
                    data-filter="${category.id}"
                    onclick="app.filterProducts('${category.id}')">
                ${category.name}
            </button>
        `).join('');
    }

    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        let filteredProducts = this.state.products;
        
        if (this.state.currentFilter !== 'all') {
            filteredProducts = this.state.products.filter(product => 
                product.category === this.state.currentFilter
            );
        }

        productsGrid.innerHTML = filteredProducts.map(product => this.renderProductCard(product)).join('');
        
        // Task 1: Setup image error handling after rendering
        this.setupImageErrorHandling();
    }

    renderProductCard(product) {
        const isInWishlist = this.state.isInWishlist(product.id);
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        const discountPercentage = hasDiscount ? 
            Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.images[0]}" 
                         alt="${product.name}" 
                         class="product-image"
                         loading="lazy"
                         width="280" 
                         height="280">
                    
                    ${product.tags && product.tags.length > 0 ? 
                        `<div class="product-badge">${product.tags[0]}</div>` : ''}
                    
                    ${hasDiscount ? 
                        `<div class="product-badge" style="top: auto; bottom: var(--spacing-md); background: var(--success-color);">
                            -${discountPercentage}%
                        </div>` : ''}
                    
                    <div class="product-actions">
                        <button class="product-action ${isInWishlist ? 'active' : ''}" 
                                onclick="app.toggleWishlist('${product.id}')"
                                aria-label="Add to wishlist">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="product-action" 
                                onclick="app.openQuickView('${product.id}')"
                                aria-label="Quick view">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="product-info">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    
                    <div class="product-rating">
                        <div class="stars">
                            ${this.renderStars(product.rating)}
                        </div>
                        <span class="rating-text">(${product.reviewCount})</span>
                    </div>
                    
                    <div class="product-price">
                        <span class="current-price">${product.price.toFixed(2)} EGP</span>
                        ${hasDiscount ? 
                            `<span class="original-price">${product.originalPrice.toFixed(2)} EGP</span>` : ''}
                    </div>
                    
                    <div class="product-options">
                        ${product.colors.slice(0, 4).map(color => `
                            <div class="color-option" 
                                 style="background-color: ${color.value}"
                                 title="${color.name}"
                                 data-color="${color.name}">
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="product-footer">
                        <button class="add-to-cart" 
                                onclick="app.quickAddToCart('${product.id}')"
                                ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="quick-view" 
                                onclick="app.openQuickView('${product.id}')"
                                aria-label="Quick view">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHtml = '';
        
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<i class="fas fa-star star"></i>';
        }
        
        if (hasHalfStar) {
            starsHtml += '<i class="fas fa-star-half-alt star"></i>';
        }
        
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<i class="far fa-star star"></i>';
        }
        
        return starsHtml;
    }

    getCategoryName(categoryId) {
        const category = this.state.categories.find(cat => cat.filter === categoryId);
        return category ? category.name : categoryId;
    }

    filterProducts(filterId) {
        this.state.currentFilter = filterId;
        this.renderCategories();
        this.renderProducts();
    }

    quickAddToCart(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;

        // Use first available color and size
        const options = {};
        if (product.colors && product.colors.length > 0) {
            options.color = product.colors[0].name;
        }
        if (product.sizes && product.sizes.length > 0) {
            options.size = product.sizes[0];
        }

        const success = this.state.addToCart(productId, options);
        if (success) {
            this.notifications.success(`Added ${product.name} to cart`);
        }
    }

    toggleCart() {
        const floatingCart = document.getElementById('floatingCart');
        if (floatingCart) {
            floatingCart.classList.toggle('open');
        }
    }

    closeCart() {
        const floatingCart = document.getElementById('floatingCart');
        if (floatingCart) {
            floatingCart.classList.remove('open');
        }
    }

    toggleWishlist(productId) {
        if (productId) {
            const isAdded = this.state.toggleWishlist(productId);
            const product = this.state.products.find(p => p.id === productId);
            
            if (product) {
                if (isAdded) {
                    this.notifications.success(`Added ${product.name} to wishlist`);
                } else {
                    this.notifications.info(`Removed ${product.name} from wishlist`);
                }
            }
            
            // Update product card wishlist button
            const productCard = document.querySelector(`[data-product-id="${productId}"]`);
            if (productCard) {
                const wishlistBtn = productCard.querySelector('.product-action');
                if (wishlistBtn) {
                    wishlistBtn.classList.toggle('active', isAdded);
                }
            }
        } else {
            // Toggle wishlist panel
            const wishlistPanel = document.getElementById('wishlistPanel');
            if (wishlistPanel) {
                wishlistPanel.classList.toggle('open');
            }
        }
    }

    closeWishlist() {
        const wishlistPanel = document.getElementById('wishlistPanel');
        if (wishlistPanel) {
            wishlistPanel.classList.remove('open');
        }
    }

    // Expose method for cart quantity changes
    changeCartQuantity(itemId, delta) {
        this.state.changeCartQuantity(itemId, delta);
    }

    openQuickView(productId) {
        const product = this.state.products.find(p => p.id === productId);
        if (!product) return;

        this.state.currentProduct = product;
        
        const modal = document.getElementById('quickViewModal');
        const body = document.getElementById('quickViewBody');
        const title = document.getElementById('quickViewTitle');
        
        if (!modal || !body || !title) return;

        title.textContent = product.name;
        body.innerHTML = this.renderQuickViewContent(product);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        this.state.modals.quickView = true;
    }

    renderQuickViewContent(product) {
        const isInWishlist = this.state.isInWishlist(product.id);
        const hasDiscount = product.originalPrice && product.originalPrice > product.price;
        
        return `
            <div class="quick-view-content">
                <div class="quick-view-images">
                    <img src="${product.images[0]}" 
                         alt="${product.name}" 
                         class="quick-view-main-image"
                         id="quickViewMainImage">
                    
                    ${product.images.length > 1 ? `
                        <div class="quick-view-thumbnails">
                            ${product.images.map((image, index) => `
                                <img src="${image}" 
                                     alt="${product.name} view ${index + 1}"
                                     class="quick-view-thumbnail ${index === 0 ? 'active' : ''}"
                                     onclick="app.changeQuickViewImage('${image}', this)">
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <div class="quick-view-details">
                    <h3>${product.name}</h3>
                    
                    <div class="quick-view-price">
                        <span class="current-price">${product.price.toFixed(2)} EGP</span>
                        ${hasDiscount ? 
                            `<span class="original-price">${product.originalPrice.toFixed(2)} EGP</span>` : ''}
                    </div>
                    
                    <div class="product-rating">
                        <div class="stars">
                            ${this.renderStars(product.rating)}
                        </div>
                        <span class="rating-text">(${product.reviewCount} reviews)</span>
                    </div>
                    
                    <p class="quick-view-description">${product.description}</p>
                    
                    <div class="quick-view-options">
                        ${product.colors && product.colors.length > 0 ? `
                            <div class="option-group">
                                <label>Color:</label>
                                <div class="color-options">
                                    ${product.colors.map((color, index) => `
                                        <div class="color-option ${index === 0 ? 'active' : ''}" 
                                             style="background-color: ${color.value}"
                                             title="${color.name}"
                                             data-color="${color.name}"
                                             onclick="app.selectQuickViewColor(this, '${color.name}')">
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${product.sizes && product.sizes.length > 0 ? `
                            <div class="option-group">
                                <label>Size:</label>
                                <div class="size-options">
                                    ${product.sizes.map((size, index) => `
                                        <div class="size-option ${index === 0 ? 'active' : ''}" 
                                             data-size="${size}"
                                             onclick="app.selectQuickViewSize(this, '${size}')">
                                            ${size}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
                        
                        <div class="quantity-selector">
                            <label>Quantity:</label>
                            <div class="quantity-input">
                                <button onclick="app.changeQuickViewQuantity(-1)">-</button>
                                <input type="number" value="1" min="1" max="10" id="quickViewQuantity" readonly>
                                <button onclick="app.changeQuickViewQuantity(1)">+</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="quick-view-actions">
                        <button class="btn btn-primary" 
                                onclick="app.addToCartFromQuickView()"
                                ${!product.inStock ? 'disabled' : ''}>
                            ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button class="btn btn-secondary" 
                                onclick="app.toggleWishlist('${product.id}')">
                            <i class="fas fa-heart ${isInWishlist ? '' : 'far'}"></i>
                            ${isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    changeQuickViewImage(imageSrc, thumbnail) {
        const mainImage = document.getElementById('quickViewMainImage');
        const thumbnails = document.querySelectorAll('.quick-view-thumbnail');
        
        if (mainImage) {
            mainImage.src = imageSrc;
        }
        
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        if (thumbnail) {
            thumbnail.classList.add('active');
        }
    }

    selectQuickViewColor(element, colorName) {
        const colorOptions = document.querySelectorAll('.quick-view-content .color-option');
        colorOptions.forEach(option => option.classList.remove('active'));
        element.classList.add('active');
    }

    selectQuickViewSize(element, sizeName) {
        const sizeOptions = document.querySelectorAll('.quick-view-content .size-option');
        sizeOptions.forEach(option => option.classList.remove('active'));
        element.classList.add('active');
    }

    changeQuickViewQuantity(delta) {
        const quantityInput = document.getElementById('quickViewQuantity');
        if (!quantityInput) return;
        
        const currentValue = parseInt(quantityInput.value) || 1;
        const newValue = Math.max(1, Math.min(10, currentValue + delta));
        quantityInput.value = newValue;
    }

    addToCartFromQuickView() {
        if (!this.state.currentProduct) return;

        const selectedColor = document.querySelector('.quick-view-content .color-option.active');
        const selectedSize = document.querySelector('.quick-view-content .size-option.active');
        const quantity = parseInt(document.getElementById('quickViewQuantity')?.value) || 1;

        const options = {
            quantity,
            color: selectedColor ? selectedColor.getAttribute('data-color') : null,
            size: selectedSize ? selectedSize.getAttribute('data-size') : null
        };

        const success = this.state.addToCart(this.state.currentProduct.id, options);
        if (success) {
            this.notifications.success(`Added ${this.state.currentProduct.name} to cart`);
            this.closeQuickView();
        }
    }

    closeQuickView() {
        const modal = document.getElementById('quickViewModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.state.modals.quickView = false;
        this.state.currentProduct = null;
    }

    openCheckout() {
        if (this.state.cart.length === 0) {
            this.notifications.warning('Your cart is empty');
            return;
        }

        const modal = document.getElementById('checkoutModal');
        const body = document.getElementById('checkoutBody');
        
        if (!modal || !body) return;

        this.state.checkoutStep = 1;
        this.updateCheckoutProgress();
        this.renderCheckoutStep();
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.state.modals.checkout = true;
    }

    updateCheckoutProgress() {
        const steps = document.querySelectorAll('.progress-step');
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            if (stepNumber <= this.state.checkoutStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    renderCheckoutStep() {
        const body = document.getElementById('checkoutBody');
        if (!body) return;

        switch (this.state.checkoutStep) {
            case 1:
                body.innerHTML = this.renderShippingStep();
                break;
            case 2:
                body.innerHTML = this.renderPaymentStep();
                break;
            case 3:
                body.innerHTML = this.renderReviewStep();
                break;
        }
    }

    /**
     * Task 5: Enhanced shipping step with Note field and email validation
     */
    renderShippingStep() {
        return `
            <form id="shippingForm" class="checkout-form">
                <h4>Shipping Information</h4>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">First Name *</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Last Name *</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Address *</label>
                    <input type="email" id="email" name="email" required>
                    <small>We'll send your order confirmation to this email</small>
                </div>
                
                <div class="form-group">
                    <label for="phone">Phone Number *</label>
                    <input type="tel" id="phone" name="phone" required placeholder="+20 123 456 7890">
                </div>
                
                <div class="form-group">
                    <label for="address">Address *</label>
                    <textarea id="address" name="address" required rows="3" 
                              placeholder="Street address, building number, floor, apartment"></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="city">City *</label>
                        <input type="text" id="city" name="city" required>
                    </div>
                    <div class="form-group">
                        <label for="governorate">Governorate *</label>
                        <select id="governorate" name="governorate" required>
                            <option value="">Select governorate</option>
                            <option value="Cairo">Cairo</option>
                            <option value="Giza">Giza</option>
                            <option value="Alexandria">Alexandria</option>
                            <option value="Luxor">Luxor</option>
                            <option value="Aswan">Aswan</option>
                            <option value="Sharm El Sheikh">Sharm El Sheikh</option>
                            <option value="Hurghada">Hurghada</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="note">Note (optional)</label>
                    <textarea id="note" name="note" maxlength="500" rows="3" 
                              placeholder="Special delivery instructions, preferred delivery time, etc."></textarea>
                    <div class="character-counter">
                        <span id="noteCounter">0</span>/500 characters
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.closeCheckout()">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Continue to Payment
                    </button>
                </div>
            </form>
        `;
    }

    renderPaymentStep() {
        return `
            <form id="paymentForm" class="checkout-form">
                <h4>Payment Method</h4>
                
                <div class="payment-methods">
                    <div class="payment-option">
                        <input type="radio" id="cod" name="paymentMethod" value="cod" checked>
                        <label for="cod">
                            <div class="payment-info">
                                <strong>Cash on Delivery</strong>
                                <p>Pay when your order arrives</p>
                            </div>
                            <i class="fas fa-money-bill-wave"></i>
                        </label>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.previousCheckoutStep()">
                        Back
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Review Order
                    </button>
                </div>
            </form>
        `;
    }

    renderReviewStep() {
        const subtotal = this.state.getCartTotal();
        const shipping = 0;
        const total = subtotal + shipping;

        return `
            <div class="checkout-review">
                <h4>Order Review</h4>
                
                <div class="review-section">
                    <h5>Items</h5>
                    <div class="review-items">
                        ${this.state.cart.map(item => `
                            <div class="review-item">
                                <img src="${item.image}" alt="${item.name}" class="review-item-image">
                                <div class="review-item-details">
                                    <div class="review-item-name">${item.name}</div>
                                    <div class="review-item-options">
                                        ${item.size ? `Size: ${item.size}` : ''}
                                        ${item.size && item.color ? ', ' : ''}
                                        ${item.color ? `Color: ${item.color}` : ''}
                                    </div>
                                    <div class="review-item-quantity">Qty: ${item.quantity}</div>
                                </div>
                                <div class="review-item-price">${(item.price * item.quantity).toFixed(2)} EGP</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="review-summary">
                    <div class="summary-row">
                        <span>Subtotal:</span>
                        <span>${subtotal.toFixed(2)} EGP</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping:</span>
                        <span class="text-green">Free</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total:</span>
                        <span>${total.toFixed(2)} EGP</span>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="app.previousCheckoutStep()">
                        Back
                    </button>
                    <button type="button" class="btn btn-primary" onclick="app.submitOrder()">
                        Place Order
                    </button>
                </div>
            </div>
        `;
    }

    nextCheckoutStep() {
        if (this.state.checkoutStep < 3) {
            this.state.checkoutStep++;
            this.updateCheckoutProgress();
            this.renderCheckoutStep();
            
            // Setup form handlers for new step
            this.setupCheckoutHandlers();
        }
    }

    previousCheckoutStep() {
        if (this.state.checkoutStep > 1) {
            this.state.checkoutStep--;
            this.updateCheckoutProgress();
            this.renderCheckoutStep();
            
            // Setup form handlers for new step
            this.setupCheckoutHandlers();
        }
    }

    setupCheckoutHandlers() {
        // Shipping form handler
        const shippingForm = document.getElementById('shippingForm');
        if (shippingForm) {
            shippingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleShippingSubmit(e);
            });
            
            // Task 5: Setup note character counter
            const noteTextarea = document.getElementById('note');
            const noteCounter = document.getElementById('noteCounter');
            
            if (noteTextarea && noteCounter) {
                noteTextarea.addEventListener('input', () => {
                    const length = noteTextarea.value.length;
                    noteCounter.textContent = length;
                    
                    // Visual feedback for character limit
                    if (length > 450) {
                        noteCounter.style.color = 'var(--warning-color)';
                    } else {
                        noteCounter.style.color = 'var(--text-muted)';
                    }
                });
            }
        }

        // Payment form handler
        const paymentForm = document.getElementById('paymentForm');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handlePaymentSubmit(e);
            });
        }
    }

    /**
     * Task 5: Enhanced shipping form validation with email check
     */
    handleShippingSubmit(e) {
        const formData = new FormData(e.target);
        const shippingData = Object.fromEntries(formData);
        
        // Enhanced email validation
        if (!Utils.validateEmail(shippingData.email)) {
            this.notifications.error('Please enter a valid email address');
            document.getElementById('email').focus();
            return;
        }
        
        // Phone validation
        if (!Utils.validatePhone(shippingData.phone)) {
            this.notifications.error('Please enter a valid phone number');
            document.getElementById('phone').focus();
            return;
        }
        
        // Store shipping data including note
        this.state.orderData = {
            ...this.state.orderData,
            shipping: shippingData
        };
        
        this.nextCheckoutStep();
    }

    handlePaymentSubmit(e) {
        const formData = new FormData(e.target);
        const paymentData = Object.fromEntries(formData);
        
        this.state.orderData = {
            ...this.state.orderData,
            payment: paymentData
        };
        
        this.nextCheckoutStep();
    }

    /**
     * Task 5: Enhanced order submission with email and note
     */
    async submitOrder() {
        if (!this.state.orderData || !this.state.orderData.shipping) {
            this.notifications.error('Missing shipping information');
            return;
        }

        const orderBtn = document.querySelector('.checkout-review .btn-primary');
        if (orderBtn) {
            orderBtn.disabled = true;
            orderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }

        try {
            // Prepare order data
            const orderData = this.prepareOrderData();
            
            // Submit order via webhook
            const result = await this.webhooks.deliverWebhook(orderData, 'order');
            
            if (result.success) {
                this.showOrderSuccess(orderData);
                this.state.clearCart();
                this.closeCheckout();
            } else {
                throw new Error('Failed to submit order');
            }
        } catch (error) {
            console.error('Order submission failed:', error);
            this.notifications.error('Failed to submit order. Please try again.');
        } finally {
            if (orderBtn) {
                orderBtn.disabled = false;
                orderBtn.innerHTML = 'Place Order';
            }
        }
    }

    /**
     * Task 5: Enhanced order data preparation with email and note
     */
    prepareOrderData() {
        const shipping = this.state.orderData.shipping;
        const payment = this.state.orderData.payment;
        const orderId = Utils.generateOrderId();
        const trackingNumber = Utils.generateTrackingNumber();
        
        // Prepare product string
        const productDetails = this.state.cart.map(item => {
            let details = item.name;
            if (item.size) details += ` - ${item.size}`;
            if (item.color) details += ` (${item.color})`;
            if (item.quantity > 1) details += ` (${item.quantity}x)`;
            return details;
        }).join(', ');

        const totalQuantity = this.state.getCartCount();
        const total = this.state.getCartTotal();

        return {
            "Order ID": orderId,
            "Customer Name": `${shipping.firstName} ${shipping.lastName}`,
            "Customer Email": shipping.email, // Task 5: Include email
            "Phone": shipping.phone,
            "City": shipping.city,
            "Address": shipping.address,
            "COD Amount": total.toFixed(2),
            "Tracking Number": trackingNumber,
            "Courier": "BOSTA",
            "Total": total.toFixed(2),
            "Date": new Date().toISOString(),
            "Status": "New",
            "Payment Method": payment.paymentMethod === 'cod' ? 'Cash on Delivery' : payment.paymentMethod,
            "Product": productDetails,
            "Quantity": totalQuantity.toString(),
            "Note": shipping.note || "" // Task 5: Include note (empty string if blank)
        };
    }

    /**
     * Task 8: Enhanced success display without Return/Exchange buttons
     */
    showOrderSuccess(orderData) {
        const modal = document.getElementById('successModal');
        const messageElement = document.getElementById('successMessage');
        const detailsElement = document.getElementById('orderDetails');
        
        if (!modal || !messageElement || !detailsElement) return;

        messageElement.innerHTML = `
            <h4>Thank you for your order!</h4>
            <p>Your order has been successfully placed and will be processed shortly.</p>
        `;

        // Task 8: Order details without Return/Exchange buttons
        detailsElement.innerHTML = `
            <h5>Order Details</h5>
            <div class="order-info">
                <div class="order-info-row">
                    <span>Order ID:</span>
                    <span>${orderData["Order ID"]}</span>
                </div>
                <div class="order-info-row">
                    <span>Tracking Number:</span>
                    <span>${orderData["Tracking Number"]}</span>
                </div>
                <div class="order-info-row">
                    <span>Customer:</span>
                    <span>${orderData["Customer Name"]}</span>
                </div>
                <div class="order-info-row">
                    <span>Email:</span>
                    <span>${orderData["Customer Email"]}</span>
                </div>
                <div class="order-info-row">
                    <span>Phone:</span>
                    <span>${orderData["Phone"]}</span>
                </div>
                <div class="order-info-row">
                    <span>Delivery Address:</span>
                    <span>${orderData["Address"]}, ${orderData["City"]}</span>
                </div>
                <div class="order-info-row">
                    <span>Items:</span>
                    <span>${orderData["Product"]}</span>
                </div>
                ${orderData["Note"] ? `
                <div class="order-info-row">
                    <span>Note:</span>
                    <span>${orderData["Note"]}</span>
                </div>
                ` : ''}
                <div class="order-info-row">
                    <span>Total Amount:</span>
                    <span>${orderData["Total"]} EGP</span>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.state.modals.success = true;
    }

    closeCheckout() {
        const modal = document.getElementById('checkoutModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.state.modals.checkout = false;
        this.state.checkoutStep = 1;
        this.state.orderData = null;
    }

    closeSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
        this.state.modals.success = false;
    }

    /**
     * Task 6: Enhanced return modal functionality
     */
    openReturnModal() {
        const modal = document.getElementById('returnModal');
        if (!modal) return;

        // Reset form
        const form = document.getElementById('returnForm');
        if (form) {
            form.reset();
            
            // Hide sections initially
            document.getElementById('returnOrderSection').style.display = 'none';
            document.getElementById('returnReasonSection').style.display = 'none';
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        this.setupReturnHandlers();
    }

    setupReturnHandlers() {
        const form = document.getElementById('returnForm');
        const phoneInput = document.getElementById('returnPhone');
        
        if (!form || !phoneInput) return;

        // Phone input handler for order lookup
        phoneInput.addEventListener('input', Utils.debounce(() => {
            const phone = phoneInput.value.trim();
            if (phone.length >= 8) {
                this.lookupReturnOrders(phone);
            }
        }, 500));

        // Form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleReturnSubmit(e);
        });
    }

    async lookupReturnOrders(phone) {
        const orderSection = document.getElementById('returnOrderSection');
        const orderList = document.getElementById('returnOrderList');
        
        if (!orderSection || !orderList) return;

        // Simulate order lookup (in real app, this would be an API call)
        // For demo, create some sample orders based on phone
        const sampleOrders = [
            { id: 'GC-2024-001', total: '1250.00', date: '2024-01-15', items: 'Luxury T-Shirt, Cap' },
            { id: 'GC-2024-002', total: '800.00', date: '2024-01-10', items: 'Vintage Jeans' }
        ];

        orderList.innerHTML = '<option value="">Choose an order...</option>';
        
        sampleOrders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `${order.id} - ${order.items} (${order.total} EGP)`;
            option.dataset.orderData = JSON.stringify(order);
            orderList.appendChild(option);
        });

        orderSection.style.display = 'block';
        
        // Setup order selection handler
        orderList.addEventListener('change', () => {
            const reasonSection = document.getElementById('returnReasonSection');
            if (orderList.value && reasonSection) {
                reasonSection.style.display = 'block';
            }
        });
    }

    /**
     * Task 6: Enhanced return submission with required reason
     */
    async handleReturnSubmit(e) {
        const formData = new FormData(e.target);
        const returnData = Object.fromEntries(formData);
        
        // Task 6: Validate required reason
        if (!returnData.reason || returnData.reason.trim().length === 0) {
            const errorElement = document.getElementById('returnReasonError');
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.textContent = 'Please provide a reason for the return.';
            }
            document.getElementById('returnReason').focus();
            return;
        }

        // Hide error if validation passes
        const errorElement = document.getElementById('returnReasonError');
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        const submitBtn = document.getElementById('returnSubmit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        try {
            // Get order data
            const orderSelect = document.getElementById('returnOrderList');
            const selectedOption = orderSelect.options[orderSelect.selectedIndex];
            const orderData = selectedOption ? JSON.parse(selectedOption.dataset.orderData) : null;

            // Task 6: Prepare return payload with human-readable note
            const returnPayload = {
                requestType: "return",
                orderId: returnData.orderId,
                phone: returnData.phone,
                note: `Reason: ${returnData.reason.trim()}`, // Task 6: Human-readable note
                order: orderData,
                timestamp: new Date().toISOString()
            };

            // Submit return request
            const result = await this.webhooks.deliverWebhook(returnPayload, 'return');

            if (result.success) {
                this.notifications.success('Return request submitted successfully');
                this.closeReturnModal();
            } else {
                throw new Error('Failed to submit return request');
            }
        } catch (error) {
            console.error('Return submission failed:', error);
            this.notifications.error('Failed to submit return request. Please try again.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Return Request';
            }
        }
    }

    closeReturnModal() {
        const modal = document.getElementById('returnModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    /**
     * Task 7: Enhanced exchange modal functionality
     */
    openExchangeModal() {
        const modal = document.getElementById('exchangeModal');
        if (!modal) return;

        // Reset form
        const form = document.getElementById('exchangeForm');
        if (form) {
            form.reset();
            
            // Hide sections initially
            document.getElementById('exchangeOrderSection').style.display = 'none';
            document.getElementById('exchangeOldItemSection').style.display = 'none';
            document.getElementById('exchangeNewItemSection').style.display = 'none';
            document.getElementById('exchangeDelta').style.display = 'none';
            document.getElementById('exchangeCommentSection').style.display = 'none';
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        this.setupExchangeHandlers();
    }

    setupExchangeHandlers() {
        const form = document.getElementById('exchangeForm');
        const phoneInput = document.getElementById('exchangePhone');
        
        if (!form || !phoneInput) return;

        // Phone input handler for order lookup
        phoneInput.addEventListener('input', Utils.debounce(() => {
            const phone = phoneInput.value.trim();
            if (phone.length >= 8) {
                this.lookupExchangeOrders(phone);
            }
        }, 500));

        // Form submission handler
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleExchangeSubmit(e);
        });
    }

    async lookupExchangeOrders(phone) {
        const orderSection = document.getElementById('exchangeOrderSection');
        const orderList = document.getElementById('exchangeOrderList');
        
        if (!orderSection || !orderList) return;

        // Simulate order lookup with items
        const sampleOrders = [
            { 
                id: 'GC-2024-001', 
                total: '1250.00', 
                date: '2024-01-15',
                items: [
                    { sku: 'LUX-TEE-BLK-L', name: 'Luxury Black T-Shirt', size: 'L', price: 300.00 },
                    { sku: 'MIN-CAP-BLK', name: 'Minimal Logo Cap', size: 'One Size', price: 250.00 }
                ]
            },
            { 
                id: 'GC-2024-002', 
                total: '800.00', 
                date: '2024-01-10',
                items: [
                    { sku: 'VIN-JEAN-BLU-32', name: 'Vintage Distressed Jeans', size: '32', price: 800.00 }
                ]
            }
        ];

        orderList.innerHTML = '<option value="">Choose an order...</option>';
        
        sampleOrders.forEach(order => {
            const option = document.createElement('option');
            option.value = order.id;
            option.textContent = `${order.id} - ${order.items.length} item(s) (${order.total} EGP)`;
            option.dataset.orderData = JSON.stringify(order);
            orderList.appendChild(option);
        });

        orderSection.style.display = 'block';
        
        // Setup order selection handler
        orderList.addEventListener('change', () => {
            if (orderList.value) {
                this.setupExchangeOrderSelection();
            }
        });
    }

    setupExchangeOrderSelection() {
        const orderList = document.getElementById('exchangeOrderList');
        const oldItemSection = document.getElementById('exchangeOldItemSection');
        const oldItemSelect = document.getElementById('exchangeOldItem');
        
        if (!orderList.value || !oldItemSection || !oldItemSelect) return;

        const selectedOption = orderList.options[orderList.selectedIndex];
        const orderData = JSON.parse(selectedOption.dataset.orderData);

        // Populate old items
        oldItemSelect.innerHTML = '<option value="">Select item to exchange...</option>';
        
        orderData.items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.sku;
            option.textContent = `${item.name} - ${item.size} (${item.price.toFixed(2)} EGP)`;
            option.dataset.itemData = JSON.stringify(item);
            oldItemSelect.appendChild(option);
        });

        oldItemSection.style.display = 'block';
        
        // Setup old item selection handler
        oldItemSelect.addEventListener('change', () => {
            if (oldItemSelect.value) {
                this.setupExchangeNewItemSelection();
            }
        });
    }

    setupExchangeNewItemSelection() {
        const newItemSection = document.getElementById('exchangeNewItemSection');
        const newItemSelect = document.getElementById('exchangeNewItem');
        
        if (!newItemSection || !newItemSelect) return;

        // Populate with available products
        newItemSelect.innerHTML = '<option value="">Select new item...</option>';
        
        this.state.products.forEach(product => {
            product.sizes.forEach(size => {
                const option = document.createElement('option');
                const sku = `${product.id.toUpperCase()}-${size}`;
                option.value = sku;
                option.textContent = `${product.name} - ${size} (${product.price.toFixed(2)} EGP)`;
                option.dataset.itemData = JSON.stringify({
                    sku: sku,
                    name: product.name,
                    size: size,
                    price: product.price
                });
                newItemSelect.appendChild(option);
            });
        });

        newItemSection.style.display = 'block';
        
        // Setup new item selection handler
        newItemSelect.addEventListener('change', () => {
            if (newItemSelect.value) {
                this.calculateExchangeDelta();
                document.getElementById('exchangeCommentSection').style.display = 'block';
            }
        });
    }

    /**
     * Task 7: Calculate and display price delta
     */
    calculateExchangeDelta() {
        const oldItemSelect = document.getElementById('exchangeOldItem');
        const newItemSelect = document.getElementById('exchangeNewItem');
        const deltaSection = document.getElementById('exchangeDelta');
        const deltaAmount = document.getElementById('deltaAmount');
        
        if (!oldItemSelect.value || !newItemSelect.value || !deltaSection || !deltaAmount) return;

        const oldItemOption = oldItemSelect.options[oldItemSelect.selectedIndex];
        const newItemOption = newItemSelect.options[newItemSelect.selectedIndex];
        
        const oldItem = JSON.parse(oldItemOption.dataset.itemData);
        const newItem = JSON.parse(newItemOption.dataset.itemData);
        
        const delta = newItem.price - oldItem.price;
        
        deltaAmount.textContent = delta >= 0 ? 
            `+${delta.toFixed(2)} EGP` : 
            `${delta.toFixed(2)} EGP`;
        
        deltaAmount.className = delta >= 0 ? 'delta-amount positive' : 'delta-amount negative';
        
        deltaSection.style.display = 'block';
    }

    /**
     * Task 7: Enhanced exchange submission with note-only payload
     */
    async handleExchangeSubmit(e) {
        const formData = new FormData(e.target);
        const exchangeData = Object.fromEntries(formData);
        
        const submitBtn = document.getElementById('exchangeSubmit');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        }

        try {
            // Get selected items data
            const oldItemSelect = document.getElementById('exchangeOldItem');
            const newItemSelect = document.getElementById('exchangeNewItem');
            
            const oldItemOption = oldItemSelect.options[oldItemSelect.selectedIndex];
            const newItemOption = newItemSelect.options[newItemSelect.selectedIndex];
            
            const oldItem = JSON.parse(oldItemOption.dataset.itemData);
            const newItem = JSON.parse(newItemOption.dataset.itemData);
            
            const delta = newItem.price - oldItem.price;
            const deltaText = delta >= 0 ? `+${delta.toFixed(2)}` : `${delta.toFixed(2)}`;
            
            // Get order data
            const orderSelect = document.getElementById('exchangeOrderList');
            const orderOption = orderSelect.options[orderSelect.selectedIndex];
            const orderData = JSON.parse(orderOption.dataset.orderData);

            // Task 7: Prepare exchange payload with note-only format
            const exchangeNote = `Exchange | Old: [${oldItem.sku} – ${oldItem.name} – ${oldItem.price.toFixed(2)} EGP] | New: [${newItem.sku} – ${newItem.name} – ${newItem.price.toFixed(2)} EGP] | Delta: ${deltaText} EGP | Comment: ${exchangeData.comment || 'None'}`;

            const exchangePayload = {
                requestType: "exchange",
                orderId: exchangeData.orderId,
                phone: exchangeData.phone,
                note: exchangeNote, // Task 7: Single human-readable note
                order: orderData,
                timestamp: new Date().toISOString()
                // Task 7: NO structured exchange object
            };

            // Submit exchange request
            const result = await this.webhooks.deliverWebhook(exchangePayload, 'exchange');

            if (result.success) {
                this.notifications.success('Exchange request submitted successfully');
                this.closeExchangeModal();
            } else {
                throw new Error('Failed to submit exchange request');
            }
        } catch (error) {
            console.error('Exchange submission failed:', error);
            this.notifications.error('Failed to submit exchange request. Please try again.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Exchange Request';
            }
        }
    }

    closeExchangeModal() {
        const modal = document.getElementById('exchangeModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    closeAllModals() {
        this.closeQuickView();
        this.closeCheckout();
        this.closeSuccessModal();
        this.closeReturnModal();
        this.closeExchangeModal();
    }

    handleNewsletterSubmit(e) {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        
        if (!Utils.validateEmail(email)) {
            this.notifications.error('Please enter a valid email address');
            return;
        }
        
        // Simulate newsletter signup
        this.notifications.success('Thank you for subscribing to our newsletter!');
        e.target.reset();
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Setup checkout handlers when DOM is ready
    setTimeout(() => {
        if (window.app && window.app.setupCheckoutHandlers) {
            window.app.setupCheckoutHandlers();
        }
    }, 100);
});
