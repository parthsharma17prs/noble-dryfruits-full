// ===================================
// Loading Screen - DISABLED for instant page load
// ===================================
// Loading screen removed for immediate access to landing page

// ===================================
// Global Variables
// ===================================
let currentTestimonialIndex = 0;
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
let wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];

function saveCart() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function saveWishlist() {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
}


// ===================================
// DOM Elements
// ===================================
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');
const overlay = document.getElementById('overlay');

// Constants
const API_BASE_URL = 'http://localhost:5195';

// Auth Elements
let loginForm, registerForm, logoutBtn, showRegisterLink, showLoginLink;

// Cart Elements
let cartItemsContainer, cartCheckout, cartTotalDisplay, checkoutForm, cartCountBadges;
let searchOffcanvas, cartOffcanvas, wishlistOffcanvas, accountOffcanvas;

function initCartElements() {
    cartItemsContainer = document.getElementById('cart-items-container');
    cartCheckout = document.getElementById('cart-checkout');
    cartTotalDisplay = document.getElementById('cart-total');
    checkoutForm = document.getElementById('checkout-form');
    cartCountBadges = document.querySelectorAll('.badge, #cart-count');
    
    // Off-canvas elements
    searchOffcanvas = document.getElementById('search-offcanvas');
    cartOffcanvas = document.getElementById('cart-offcanvas');
    wishlistOffcanvas = document.getElementById('wishlist-offcanvas');
    // Auth elements
    loginForm = document.getElementById('login-form');
    registerForm = document.getElementById('register-form');
    logoutBtn = document.getElementById('logout-btn');
    showRegisterLink = document.getElementById('show-register');
    showLoginLink = document.getElementById('show-login');
}

// Tab elements
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// FAQ elements
const faqQuestions = document.querySelectorAll('.faq-question');

// Testimonial elements
const testimonialTrack = document.querySelector('.testimonial-track');
const prevTestimonialBtn = document.getElementById('prev-testimonial');
const nextTestimonialBtn = document.getElementById('next-testimonial');

// ===================================
// Header Scroll Effect
// ===================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===================================
// Mobile Menu Toggle
// ===================================
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
    });
}

// ===================================
// Off-canvas Functions
// ===================================
function openOffcanvas(offcanvasElement) {
    offcanvasElement.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOffcanvas(offcanvasElement) {
    offcanvasElement.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function closeAllOffcanvas() {
    document.querySelectorAll('.offcanvas').forEach(offcanvas => {
        offcanvas.classList.remove('active');
    });
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Global click listener for fail-safe navigation
document.addEventListener('click', (e) => {
    const cartTarget = e.target.closest('#cart-btn');
    if (cartTarget) {
        openOffcanvas(cartOffcanvas);
        return;
    }

    const accountTarget = e.target.closest('#account-btn');
    if (accountTarget) {
        openOffcanvas(accountOffcanvas);
        return;
    }

    const wishlistTarget = e.target.closest('#wishlist-btn');
    if (wishlistTarget) {
        openOffcanvas(wishlistOffcanvas);
        return;
    }

    const searchTarget = e.target.closest('#search-btn');
    if (searchTarget) {
        openOffcanvas(searchOffcanvas);
        return;
    }
});

// Toggle Login/Register
showRegisterLink?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form-container').style.display = 'none';
    document.getElementById('register-form-container').style.display = 'block';
});

showLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-form-container').style.display = 'none';
    document.getElementById('login-form-container').style.display = 'block';
});

// Close on overlay click
if (overlay) {
    overlay.addEventListener('click', () => {
        closeAllOffcanvas();
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    });
}

// ===================================
// Product Tabs
// ===================================
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Remove active class from all tabs and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ===================================
// FAQ Accordion
// ===================================
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');

        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });

        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// ===================================
// Testimonial Slider
// ===================================
function updateTestimonialSlider() {
    if (!testimonialTrack) return;

    const cards = document.querySelectorAll('.testimonial-card');
    const cardWidth = cards[0].offsetWidth;
    const gap = 30;
    const offset = -(currentTestimonialIndex * (cardWidth + gap));

    testimonialTrack.style.transform = `translateX(${offset}px)`;
}

if (prevTestimonialBtn) {
    prevTestimonialBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.testimonial-card');
        if (currentTestimonialIndex > 0) {
            currentTestimonialIndex--;
            updateTestimonialSlider();
        }
    });
}

if (nextTestimonialBtn) {
    nextTestimonialBtn.addEventListener('click', () => {
        const cards = document.querySelectorAll('.testimonial-card');
        const maxIndex = cards.length - 3; // Show 3 cards at a time
        if (currentTestimonialIndex < maxIndex) {
            currentTestimonialIndex++;
            updateTestimonialSlider();
        }
    });
}

// Auto-slide testimonials
let testimonialInterval;

function startTestimonialAutoSlide() {
    testimonialInterval = setInterval(() => {
        const cards = document.querySelectorAll('.testimonial-card');
        const maxIndex = cards.length - 3;

        if (currentTestimonialIndex < maxIndex) {
            currentTestimonialIndex++;
        } else {
            currentTestimonialIndex = 0;
        }

        updateTestimonialSlider();
    }, 5000); // Change every 5 seconds
}

function stopTestimonialAutoSlide() {
    clearInterval(testimonialInterval);
}

// Start auto-slide on page load
if (testimonialTrack) {
    startTestimonialAutoSlide();

    // Pause on hover
    testimonialTrack.addEventListener('mouseenter', stopTestimonialAutoSlide);
    testimonialTrack.addEventListener('mouseleave', startTestimonialAutoSlide);
}

// ===================================
// Event Delegation for Dynamic Elements
// ===================================
document.addEventListener('click', (e) => {
    // Add to Cart
    const addCartBtn = e.target.closest('.btn-add-cart');
    if (addCartBtn) {
        e.preventDefault();
        const productCard = addCartBtn.closest('.product-card, .product-layout');
        if (!productCard) return;

        const productTitle = productCard.querySelector('.product-title, .product-name')?.textContent.trim() || 'Premium Product';
        const productPrice = productCard.querySelector('.price-current, .current-price')?.textContent.trim() || '₹0';
        const activeVariant = productCard.querySelector('.variant-btn.active, .variant-btn-large.active')?.textContent.trim() || 'Default';
        const qtyInput = productCard.querySelector('#qty-input') || document.getElementById('qty-input');
        const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

        // Add to cart array (multiple times if quantity > 1)
        for (let i = 0; i < quantity; i++) {
            cartItems.push({
                title: productTitle,
                price: productPrice,
                variant: activeVariant
            });
        }

        saveCart();
        renderCart();
        showNotification(`${productTitle} added to cart!`);

        // Animation
        const originalText = addCartBtn.innerHTML;
        addCartBtn.innerHTML = '<i class="fas fa-check"></i> Added';
        addCartBtn.style.background = '#28a745';
        setTimeout(() => {
            addCartBtn.innerHTML = originalText;
            addCartBtn.style.background = '';
        }, 2000);
    }

    // Variant Selection
    const variantBtn = e.target.closest('.variant-btn, .variant-btn-large');
    if (variantBtn) {
        const group = variantBtn.parentElement;
        group.querySelectorAll('.variant-btn, .variant-btn-large').forEach(b => b.classList.remove('active'));
        variantBtn.classList.add('active');
    }
});

// ===================================
// Update Cart Badge
// ===================================
// Event Delegation for Forms
document.addEventListener('submit', async (e) => {
    // ... logic for login, register, checkout ...
    // (I will write the full logic below to be sure)
    if (e.target.id === 'login-form') {
        e.preventDefault();
        const email = e.target.querySelector('#login-email').value;
        const password = e.target.querySelector('#login-password').value;
        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('user', JSON.stringify(data.session.user));
                updateAuthState();
                showNotification('Login successful!');
                closeOffcanvas(accountOffcanvas);
            } else {
                showNotification('Login failed. Check credentials.');
            }
        } catch (err) { showNotification('Error connecting to backend.'); }
    }

    if (e.target.id === 'register-form') {
        e.preventDefault();
        const email = e.target.querySelector('#register-email').value;
        const password = e.target.querySelector('#register-password').value;
        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            if (res.ok) {
                showNotification('Registration successful! Please login.');
                if (showLoginLink) showLoginLink.click();
            } else {
                const data = await res.json();
                showNotification(data.error || 'Registration failed.');
            }
        } catch (err) { showNotification('Error connecting to backend.'); }
    }

    if (e.target.id === 'checkout-form') {
        e.preventDefault();
        const orderData = {
            customerName: e.target.querySelector('#checkout-name').value,
            customerEmail: e.target.querySelector('#checkout-email').value,
            shippingAddress: e.target.querySelector('#checkout-address').value,
            items: cartItems.map(item => ({
                productName: item.title,
                price: parseInt(item.price.replace('₹', '')),
                quantity: 1
            })),
            tax: window.currentOrderTotals ? window.currentOrderTotals.tax : 0,
            deliveryFee: window.currentOrderTotals ? window.currentOrderTotals.deliveryFee : 0,
            finalTotal: window.currentOrderTotals ? window.currentOrderTotals.finalTotal : 0
        };
        try {
            const res = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });
            if (res.ok) {
                const data = await res.json();
                showNotification(`Order placed! ID: ${data.orderId}. Receipt sent.`);
                cartItems = [];
                saveCart();
                renderCart();
                closeOffcanvas(cartOffcanvas);
            } else { showNotification('Failed to place order.'); }
        } catch (err) { showNotification('Error connecting to backend.'); }
    }
});

function updateAuthState() {
    const user = JSON.parse(localStorage.getItem('user'));
    const authForms = document.getElementById('auth-forms');
    const userProfile = document.getElementById('user-profile');
    const emailDisplay = document.getElementById('user-email-display');
    
    if (user) {
        if (authForms) authForms.style.display = 'none';
        if (userProfile) userProfile.style.display = 'block';
        if (emailDisplay) emailDisplay.textContent = user.email;
    } else {
        if (authForms) authForms.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
    }
}

function renderCart() {
    if (!cartItemsContainer) return;

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="collection.html" class="btn btn-primary">Continue Shopping</a>
            </div>`;
        if (cartCheckout) cartCheckout.style.display = 'none';
    } else {
        let itemsHtml = '<ul style="list-style: none; padding: 0;">';
        let total = 0;
        cartItems.forEach((item, index) => {
            const price = parseInt(item.price.replace('₹', ''));
            total += price;
            itemsHtml += `
                <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee;">
                    <div>
                        <div style="font-weight: 600;">${item.title}</div>
                        <div style="font-size: 0.8rem; color: #666;">${item.variant}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <span style="font-weight: 600;">${item.price}</span>
                        <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #ff4d4d; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                </li>`;
        });
        itemsHtml += '</ul>';
        cartItemsContainer.innerHTML = itemsHtml;
        
        // Calculate tax and delivery
        const tax = Math.round(total * 0.05); // 5% tax
        const deliveryFee = total > 999 ? 0 : 50; // Free over 999
        const finalTotal = total + tax + deliveryFee;

        // Store these for the checkout form
        window.currentOrderTotals = {
            subtotal: total,
            tax: tax,
            deliveryFee: deliveryFee,
            finalTotal: finalTotal
        };

        if (cartTotalDisplay) {
            cartTotalDisplay.innerHTML = `
                <div style="font-size: 0.9rem; font-weight: normal; margin-bottom: 5px; display: flex; justify-content: space-between;">
                    <span>Subtotal:</span>
                    <span>₹${total}</span>
                </div>
                <div style="font-size: 0.9rem; font-weight: normal; margin-bottom: 5px; display: flex; justify-content: space-between;">
                    <span>Tax (5%):</span>
                    <span>₹${tax}</span>
                </div>
                <div style="font-size: 0.9rem; font-weight: normal; margin-bottom: 15px; display: flex; justify-content: space-between; border-bottom: 1px solid #ddd; padding-bottom: 10px;">
                    <span>Delivery:</span>
                    <span>${deliveryFee === 0 ? 'Free' : '₹' + deliveryFee}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.2rem; color: #2d5f3f;">
                    <span>Total Bill:</span>
                    <span>₹${finalTotal}</span>
                </div>
            `;
            // Remove the 'Total:' label that's hardcoded in HTML by finding its previous sibling span
            const parentDiv = cartTotalDisplay.parentElement;
            if (parentDiv && parentDiv.children[0] && parentDiv.children[0].textContent === 'Total:') {
                parentDiv.children[0].style.display = 'none';
                cartTotalDisplay.style.width = '100%';
            }
        }
        if (cartCheckout) cartCheckout.style.display = 'block';
    }
    
    // Update all badges across the entire page
    document.querySelectorAll('.badge, #cart-count').forEach(badge => {
        badge.textContent = cartItems.length;
        badge.style.display = 'flex'; // Ensure visible even if 0
    });
}

logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('user');
    updateAuthState();
    showNotification('Logged out successfully.');
});

let allProducts = [];

async function loadProducts() {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/products`);
        if (res.ok) {
            allProducts = await res.json();
            renderProductsToGrid(allProducts);
        }
    } catch (err) {
        console.error('Failed to load products from backend:', err);
    }
}

function renderProductsToGrid(products) {
    const productGrid = document.querySelector('.product-grid');
    if (!productGrid) return;

    if (products && products.length > 0) {
        let productsHtml = '';
        products.forEach(p => {
            productsHtml += `
                <div class="product-card">
                    <div class="product-image">
                        <img src="${p.imageUrl}" alt="${p.name}">
                        <div class="product-overlay">
                            <button class="quick-view-btn" onclick="window.location.href='product.html'">Quick View</button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${p.name}</h3>
                        <div class="product-price">
                            <span class="price-current">₹${p.price}</span>
                        </div>
                        <div class="product-variants">
                            <button class="variant-btn">250g</button>
                            <button class="variant-btn active">500g</button>
                        </div>
                        <button class="btn btn-add-cart">Add to Cart</button>
                    </div>
                </div>`;
        });
        productGrid.innerHTML = productsHtml;
        
        const countDisplay = document.querySelector('.product-count');
        if (countDisplay) countDisplay.textContent = `Showing ${products.length} products`;
    } else {
        productGrid.innerHTML = '<p>No products found.</p>';
    }
}

const sortSelect = document.getElementById('sort-select');
if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
        let sorted = [...allProducts];
        const val = e.target.value;
        if (val === 'Price: Low to High') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (val === 'Price: High to Low') {
            sorted.sort((a, b) => b.price - a.price);
        } else if (val === 'Alphabetically: A-Z') {
            sorted.sort((a, b) => a.name.localeCompare(b.name));
        } else if (val === 'Alphabetically: Z-A') {
            sorted.sort((a, b) => b.name.localeCompare(a.name));
        }
        renderProductsToGrid(sorted);
    });
}


function updateAuthState() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        document.getElementById('auth-forms').style.display = 'none';
        document.getElementById('user-profile').style.display = 'block';
        document.getElementById('user-email-display').textContent = user.email;
    } else {
        document.getElementById('auth-forms').style.display = 'block';
        document.getElementById('user-profile').style.display = 'none';
    }
}

// --- CART & ORDER BACKEND ---



window.removeFromCart = (index) => {
    cartItems.splice(index, 1);
    saveCart();
    renderCart();
};

// ===================================
// Newsletter Form
// ===================================
const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value;

        if (email) {
            showNotification('Thank you for subscribing!');
            emailInput.value = '';
        }
    });
}

// ===================================
// Search Form
// ===================================
const searchForm = document.querySelector('.search-form');

if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = searchForm.querySelector('.search-input');
        const query = searchInput.value;

        if (query) {
            // Redirect to collection page with search query
            window.location.href = `collection.html?search=${encodeURIComponent(query)}`;
        }
    });
}

// ===================================
// Notification System
// ===================================
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#offcanvas-cart' && href !== '#offcanvas-wishlist') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===================================
// Lazy Loading Images
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// Responsive Testimonial Slider
// ===================================
function adjustTestimonialSlider() {
    const width = window.innerWidth;

    if (width <= 768) {
        // Show 1 card on mobile
        document.querySelectorAll('.testimonial-card').forEach(card => {
            card.style.minWidth = '100%';
        });
    } else if (width <= 1024) {
        // Show 2 cards on tablet
        document.querySelectorAll('.testimonial-card').forEach(card => {
            card.style.minWidth = 'calc(50% - 15px)';
        });
    } else {
        // Show 3 cards on desktop
        document.querySelectorAll('.testimonial-card').forEach(card => {
            card.style.minWidth = 'calc(33.333% - 20px)';
        });
    }

    updateTestimonialSlider();
}

window.addEventListener('resize', adjustTestimonialSlider);
window.addEventListener('load', adjustTestimonialSlider);

// ===================================
// Page Load Animation
// ===================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-out';
        document.body.style.opacity = '1';
    }, 100);
});

// ===================================
// Prevent Dropdown Close on Click Inside
// ===================================
document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// ===================================
// Initialize on DOM Load
// ===================================
function init() {
    console.log('Noble Dryfruits initializing...');
    initCartElements();
    renderCart();
    updateAuthState();
    adjustTestimonialSlider();
    loadProducts();

    // Add entrance animations to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';
                entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                fadeInObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for fade-in animation
    document.querySelectorAll('.product-card, .value-item, .category-item, .faq-item, .testimonial-card').forEach(el => {
        fadeInObserver.observe(el);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Animations initialized

// ===================================
// Velocity Scroll Effect
// ===================================
(function () {
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let ticking = false;

    const track1 = document.getElementById('velocityScroll1');
    const track2 = document.getElementById('velocityScroll2');

    if (!track1 || !track2) return;

    function updateScrollVelocity() {
        const currentScrollY = window.scrollY;
        scrollVelocity = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        // Calculate speed multiplier based on scroll velocity
        const speedMultiplier = 1 + (scrollVelocity * 0.05);
        const clampedSpeed = Math.min(speedMultiplier, 3); // Max 3x speed

        // Apply speed to animations
        track1.style.animationDuration = `${30 / clampedSpeed}s`;
        track2.style.animationDuration = `${35 / clampedSpeed}s`;

        // Reset velocity after a short delay
        setTimeout(() => {
            scrollVelocity *= 0.95; // Decay
            if (scrollVelocity > 0.1) {
                updateScrollVelocity();
            } else {
                track1.style.animationDuration = '30s';
                track2.style.animationDuration = '35s';
            }
        }, 50);

        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollVelocity);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
})();



// ===================================
// Enhanced Card Hover Effects
// ===================================
document.querySelectorAll('.hero-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-15px) scale(1.03)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

document.querySelectorAll('.category-item').forEach(item => {
    item.addEventListener('mouseenter', function () {
        const icon = this.querySelector('.category-icon i');
        if (icon) {
            icon.style.animation = 'bounce 0.6s ease';
        }
    });
});

// Bounce animation for icons
const bounceStyle = document.createElement('style');
bounceStyle.textContent = `
    @keyframes bounce {
        0%, 100% { transform: translateY(0) scale(1) rotate(0deg); }
        25% { transform: translateY(-10px) scale(1.1) rotate(5deg); }
        50% { transform: translateY(0) scale(1.15) rotate(0deg); }
        75% { transform: translateY(-5px) scale(1.1) rotate(-5deg); }
    }
`;
document.head.appendChild(bounceStyle);

// ===================================
// Curved Loop Marquee
// ===================================
(function () {
    const marqueeText = "Premium Dry Fruits ✦ Authentic Spices ✦ Pure Quality ✦ ";
    const speed = 2;
    const curveAmount = 400;
    const interactive = true;

    const jacket = document.getElementById('curvedLoopJacket');
    const measureText = document.getElementById('measureText');
    const textPath = document.getElementById('curvedTextPath');
    const curvePath = document.getElementById('curvePath');

    if (!jacket || !measureText || !textPath || !curvePath) return;

    // Process text to ensure trailing space
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    const text = (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';

    // Update path with curve amount
    const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;
    curvePath.setAttribute('d', pathD);

    // Measure text
    measureText.textContent = text;
    let spacing = 0;
    let offset = 0;
    let direction = 'left';
    let isDragging = false;
    let lastX = 0;
    let velocity = 0;
    let animationFrame = null;

    // Wait for fonts to load
    setTimeout(() => {
        spacing = measureText.getComputedTextLength();

        if (spacing > 0) {
            // Create repeated text
            const totalText = Array(Math.ceil(1800 / spacing) + 2).fill(text).join('');
            textPath.textContent = totalText;

            // Set initial offset
            offset = -spacing;
            textPath.setAttribute('startOffset', offset + 'px');

            // Start animation
            startAnimation();
        }
    }, 100);

    function startAnimation() {
        if (animationFrame) cancelAnimationFrame(animationFrame);

        function animate() {
            if (!isDragging && spacing > 0) {
                const delta = direction === 'right' ? speed : -speed;
                offset += delta;

                // Wrap around
                const wrapPoint = spacing;
                if (offset <= -wrapPoint) offset += wrapPoint;
                if (offset > 0) offset -= wrapPoint;

                textPath.setAttribute('startOffset', offset + 'px');
            }

            animationFrame = requestAnimationFrame(animate);
        }

        animate();
    }

    // Interactive drag functionality
    if (interactive) {
        jacket.addEventListener('pointerdown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            velocity = 0;
            jacket.classList.add('dragging');
            jacket.setPointerCapture(e.pointerId);
        });

        jacket.addEventListener('pointermove', (e) => {
            if (!isDragging || spacing === 0) return;

            const dx = e.clientX - lastX;
            lastX = e.clientX;
            velocity = dx;

            offset += dx;

            // Wrap around
            const wrapPoint = spacing;
            if (offset <= -wrapPoint) offset += wrapPoint;
            if (offset > 0) offset -= wrapPoint;

            textPath.setAttribute('startOffset', offset + 'px');
        });

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            jacket.classList.remove('dragging');
            direction = velocity > 0 ? 'right' : 'left';
        };

        jacket.addEventListener('pointerup', endDrag);
        jacket.addEventListener('pointerleave', endDrag);
        jacket.addEventListener('pointercancel', endDrag);
    }
})();

// ===================================
// Curved Loop Marquee
// ===================================
(function () {
    const marqueeText = "Premium Dry Fruits ✦ Authentic Spices ✦ 100% Organic ✦ Farm Fresh ✦ ";
    const speed = 2;
    const curveAmount = 400;
    const direction = 'left';
    const interactive = true;

    const measureRef = document.getElementById('measureText');
    const textPathRef = document.getElementById('curvedTextPath');
    const pathRef = document.getElementById('curvePath');
    const jacket = document.getElementById('curvedLoopJacket');

    if (!measureRef || !textPathRef || !pathRef || !jacket) return;

    // Process text (add non-breaking space if needed)
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    const text = (hasTrailing ? marqueeText.replace(/\s+$/, '') : marqueeText) + '\u00A0';

    let spacing = 0;
    let offset = 0;
    let isDragging = false;
    let lastX = 0;
    let currentDirection = direction;
    let velocity = 0;
    let animationFrame = null;

    // Update path with curve amount
    const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;
    pathRef.setAttribute('d', pathD);

    // Measure text length
    measureRef.textContent = text;
    setTimeout(() => {
        spacing = measureRef.getComputedTextLength();

        if (spacing > 0) {
            // Create repeated text
            const totalText = Array(Math.ceil(1800 / spacing) + 2).fill(text).join('');
            textPathRef.textContent = totalText;

            // Set initial offset
            const initial = -spacing;
            textPathRef.setAttribute('startOffset', initial + 'px');
            offset = initial;

            // Show the element
            jacket.style.visibility = 'visible';

            // Start animation
            startAnimation();
        }
    }, 100);

    function startAnimation() {
        if (animationFrame) cancelAnimationFrame(animationFrame);

        function step() {
            if (!isDragging && spacing > 0) {
                const delta = currentDirection === 'right' ? speed : -speed;
                offset += delta;

                // Wrap around
                const wrapPoint = spacing;
                if (offset <= -wrapPoint) offset += wrapPoint;
                if (offset > 0) offset -= wrapPoint;

                textPathRef.setAttribute('startOffset', offset + 'px');
            }
            animationFrame = requestAnimationFrame(step);
        }

        animationFrame = requestAnimationFrame(step);
    }

    // Interactive drag functionality
    if (interactive) {
        jacket.addEventListener('pointerdown', (e) => {
            isDragging = true;
            lastX = e.clientX;
            velocity = 0;
            jacket.setPointerCapture(e.pointerId);
        });

        jacket.addEventListener('pointermove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - lastX;
            lastX = e.clientX;
            velocity = dx;

            offset += dx;

            // Wrap around
            const wrapPoint = spacing;
            if (offset <= -wrapPoint) offset += wrapPoint;
            if (offset > 0) offset -= wrapPoint;

            textPathRef.setAttribute('startOffset', offset + 'px');
        });

        const endDrag = () => {
            if (!isDragging) return;
            isDragging = false;
            currentDirection = velocity > 0 ? 'right' : 'left';
        };

        jacket.addEventListener('pointerup', endDrag);
        jacket.addEventListener('pointerleave', endDrag);
    }

    // Hide initially
    jacket.style.visibility = 'hidden';
})();

// ===================================
// 360 Degree Carousel - Scroll Based
// ===================================
(function () {
    const carousel = document.getElementById('carousel3d');
    const carouselContainer = document.getElementById('carouselContainer');

    if (!carousel || !carouselContainer) return;

    let lastScrollY = window.scrollY;
    let carouselRotation = 0;

    function updateCarouselOnScroll() {
        const rect = carouselContainer.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            const currentScrollY = window.scrollY;
            const scrollDelta = currentScrollY - lastScrollY;

            // Rotate based on scroll direction and speed
            carouselRotation += scrollDelta * 0.2;
            carousel.style.transform = `rotateY(${carouselRotation}deg)`;

            lastScrollY = currentScrollY;
        }
    }

    window.addEventListener('scroll', updateCarouselOnScroll, { passive: true });

    // Pause rotation on hover
    carouselContainer.addEventListener('mouseenter', () => {
        carousel.classList.add('paused');
    });

    carouselContainer.addEventListener('mouseleave', () => {
        carousel.classList.remove('paused');
    });
})();

// ===================================
// Update Falling Fruits to Use Images
// ===================================
(function () {
    // Find and remove old falling fruits code
    const fallingFruitsContainer = document.getElementById('fallingFruits');

    if (!fallingFruitsContainer) return;

    // Clear any existing fruits
    fallingFruitsContainer.innerHTML = '';

    // Use actual product images
    const fruitImages = [
        'images/premium almonds.jpeg',
        'images/organic pumpkin seeds.png',
        'images/premium walnut kernels.png'
    ];

    let clickedFruits = [];

    // Create falling fruit elements with images
    function createFallingFruit() {
        const fruit = document.createElement('div');
        fruit.className = 'fruit-item-image';

        const img = document.createElement('img');
        img.src = fruitImages[Math.floor(Math.random() * fruitImages.length)];
        img.alt = 'Dry Fruit';
        fruit.appendChild(img);

        // Random horizontal position
        fruit.style.left = Math.random() * 100 + '%';

        // Random animation duration
        const duration = 10 + Math.random() * 10; // 10-20 seconds
        fruit.style.animationDuration = duration + 's';

        // Random delay
        fruit.style.animationDelay = Math.random() * 5 + 's';

        // Random size variation - MUCH LARGER for visibility
        const size = 50 + Math.random() * 50; // 50-100px (increased from 30-60px)
        fruit.style.width = size + 'px';
        fruit.style.height = size + 'px';

        // Click to make it fall faster
        fruit.addEventListener('click', function () {
            if (!clickedFruits.includes(fruit)) {
                clickedFruits.push(fruit);
                fruit.style.animationDuration = '2s';
                fruit.style.animationTimingFunction = 'ease-in';
                fruit.classList.add('falling-fast');
            }
        });

        fallingFruitsContainer.appendChild(fruit);

        // Remove element after animation completes
        setTimeout(() => {
            fruit.remove();
            const index = clickedFruits.indexOf(fruit);
            if (index > -1) clickedFruits.splice(index, 1);
        }, (duration + 5) * 1000);
    }

    // Create MORE initial fruits for better visibility
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createFallingFruit();
        }, i * 400);
    }

    // Continuously create new fruits MORE FREQUENTLY
    setInterval(() => {
        createFallingFruit();
    }, 1500); // Reduced from 3000ms to 1500ms
})();

// ===================================
// Moving Orange Dots Background
// ===================================
(function () {
    const dotsContainer = document.getElementById('heroBgDots');
    if (!dotsContainer) return;

    const dotCount = 40;

    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'bg-dot';

        // Random position
        dot.style.left = Math.random() * 100 + '%';
        dot.style.top = Math.random() * 100 + '%';

        // Random size variation
        const size = 4 + Math.random() * 6;
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';

        // Random animation duration
        const duration = 15 + Math.random() * 20;
        dot.style.animationDuration = duration + 's';

        // Random delay
        dot.style.animationDelay = -(Math.random() * 20) + 's';

        // Random opacity
        dot.style.opacity = 0.1 + Math.random() * 0.4;

        dotsContainer.appendChild(dot);
    }
})();

// ===================================
// Shipping Banner Floating Elements
// ===================================
(function () {
    const container = document.getElementById('shippingFloatingElements');
    if (!container) return;

    const items = [
        { src: 'images/cashew nuts.png', type: 'cashew' },
        { src: 'images/premium almonds.jpeg', type: 'almond' }
    ];

    const elementCount = 20; // Number of floating items

    for (let i = 0; i < elementCount; i++) {
        const item = document.createElement('div');
        item.className = 'shipping-float-item';

        const randomItem = items[Math.floor(Math.random() * items.length)];

        if (randomItem.type === 'almond') {
            item.classList.add('round-shape');
        }

        const img = document.createElement('img');
        img.src = randomItem.src;
        img.alt = '';
        item.appendChild(img);

        // Random Size (Small small)
        const size = 15 + Math.random() * 25; // 15px to 40px
        item.style.width = `${size}px`;
        item.style.height = `${size}px`;

        // Random Position
        item.style.left = `${Math.random() * 100}%`;
        item.style.top = `${Math.random() * 100}%`;

        // Random Animation Props
        const duration = 8 + Math.random() * 15; // 8-23s
        const delay = -Math.random() * 20; // Start immediately but offset

        item.style.animationDuration = `${duration}s`;
        item.style.animationDelay = `${delay}s`;

        // Random direction for float
        const reverse = Math.random() > 0.5 ? 'reverse' : 'normal';
        item.style.animationDirection = reverse;

        // Random opacity variation
        item.style.opacity = 0.3 + Math.random() * 0.4;

        container.appendChild(item);
    }
})();
