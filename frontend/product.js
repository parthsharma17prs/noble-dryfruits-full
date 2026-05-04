// Product Page Specific JavaScript

// ===================================
// Image Gallery
// ===================================
const mainImage = document.getElementById('main-product-image');
const thumbnails = document.querySelectorAll('.thumbnail');

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', () => {
        // Remove active class from all thumbnails
        thumbnails.forEach(t => t.classList.remove('active'));

        // Add active class to clicked thumbnail
        thumbnail.classList.add('active');

        // Update main image
        const newImageSrc = thumbnail.querySelector('img').src.replace('w=150&h=150', 'w=600&h=600');
        mainImage.src = newImageSrc;
    });
});

// Quantity Controls (Delegated)
document.addEventListener('click', (e) => {
    const decBtn = e.target.closest('#decrease-qty');
    const incBtn = e.target.closest('#increase-qty');
    if (decBtn || incBtn) {
        const input = document.getElementById('qty-input');
        if (input) {
            let val = parseInt(input.value);
            if (decBtn && val > 1) val--;
            if (incBtn && val < 10) val++;
            input.value = val;
        }
    }
});

// ===================================
// Product Tabs
// ===================================
const tabNavBtns = document.querySelectorAll('.tab-nav-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        // Remove active class from all tabs and panels
        tabNavBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(panel => panel.classList.remove('active'));

        // Add active class to clicked tab and corresponding panel
        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ===================================
// Image Zoom on Click
// ===================================
if (mainImage) {
    mainImage.addEventListener('click', () => {
        // Create modal for zoomed image
        const modal = document.createElement('div');
        modal.className = 'image-zoom-modal';
        modal.innerHTML = `
            <div class="zoom-modal-content">
                <button class="zoom-close-btn">&times;</button>
                <img src="${mainImage.src}" alt="Zoomed Product Image">
            </div>
        `;

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        // Close modal
        const closeBtn = modal.querySelector('.zoom-close-btn');
        closeBtn.addEventListener('click', () => {
            modal.remove();
            document.body.style.overflow = '';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = '';
            }
        });
    });
}

// Add zoom modal styles
const zoomStyles = document.createElement('style');
zoomStyles.textContent = `
    .image-zoom-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease-out;
    }
    
    .zoom-modal-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }
    
    .zoom-modal-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
    }
    
    .zoom-close-btn {
        position: absolute;
        top: -40px;
        right: 0;
        background: white;
        color: #333;
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
    }
    
    .zoom-close-btn:hover {
        background: #f44336;
        color: white;
        transform: rotate(90deg);
    }
`;
document.head.appendChild(zoomStyles);

// ===================================
// Stock Bar Animation
// ===================================
window.addEventListener('load', () => {
    const stockFill = document.querySelector('.stock-fill');
    if (stockFill) {
        const targetWidth = stockFill.style.width;
        stockFill.style.width = '0%';

        setTimeout(() => {
            stockFill.style.width = targetWidth;
        }, 500);
    }
});

// ===================================
// Scroll to Reviews
// ===================================
const ratingCount = document.querySelector('.rating-count');
if (ratingCount) {
    ratingCount.addEventListener('click', () => {
        const reviewsTab = document.querySelector('[data-tab="reviews"]');
        if (reviewsTab) {
            reviewsTab.click();

            setTimeout(() => {
                document.querySelector('.product-info-tabs').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    });

    ratingCount.style.cursor = 'pointer';
    ratingCount.style.textDecoration = 'underline';
}

// ===================================
// Helper Function (if not in main script.js)
// ===================================
if (typeof showNotification === 'undefined') {
    function showNotification(message) {
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

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
}

console.log('Product page loaded successfully!');
