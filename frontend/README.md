# Lotus Dryfruits - E-Commerce Website

A fully functional, premium e-commerce website for selling dry fruits, nuts, spices, and organic products. This is a complete replica of the Swaad Ambarsar De website with the brand name changed to "Lotus Dryfruits".

## 🌟 Features

### Pages
- **Homepage (index.html)** - Complete landing page with hero section, product tabs, testimonials, FAQs, and newsletter
- **About Us (about.html)** - Company story, products, process, and core values
- **Collection (collection.html)** - Product listing page with filters and sorting
- **Product Detail (product.html)** - Detailed product page with image gallery, reviews, and related products

### Key Features
✅ Fully responsive design (mobile, tablet, desktop)
✅ Sticky navigation header with dropdown menus
✅ Off-canvas panels for search, cart, and wishlist
✅ Product tabs with smooth transitions
✅ FAQ accordion
✅ Testimonial slider with auto-play
✅ Image gallery with zoom functionality
✅ Product variant selection
✅ Quantity controls
✅ Stock progress bar
✅ Customer reviews section
✅ Related products
✅ WhatsApp floating button
✅ Newsletter subscription
✅ Smooth scroll animations
✅ Premium aesthetics with modern design

### Design Elements
- **Color Scheme**: Leafy green (#2d5f3f), warm orange/gold accents, white/light grey backgrounds
- **Typography**: Montserrat font family
- **Animations**: Smooth transitions, fade-ins, hover effects
- **Icons**: Font Awesome 6.4.0

## 📁 File Structure

```
lotus-dryfruits/
├── index.html          # Homepage
├── about.html          # About Us page
├── collection.html     # Product collection page
├── product.html        # Product detail page
├── styles.css          # Main stylesheet
├── about.css           # About page styles
├── collection.css      # Collection page styles
├── product.css         # Product page styles
├── script.js           # Main JavaScript
├── product.js          # Product page JavaScript
└── README.md           # This file
```

## 🚀 Getting Started

### Option 1: Open Directly
Simply open `index.html` in your web browser.

### Option 2: Use a Local Server
For better performance and to avoid CORS issues:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000`

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-green: #2d5f3f;
    --accent-orange: #e67e22;
    --accent-gold: #d4a574;
    /* ... other variables */
}
```

### Changing Content
- **Company Name**: Search and replace "Lotus Dryfruits" in all HTML files
- **Contact Info**: Update footer contact details in all HTML files
- **Products**: Modify product cards in HTML files
- **Images**: Replace placeholder images with actual product images

### Adding Products
1. Copy a product card from `collection.html` or `index.html`
2. Update the image, title, price, and variants
3. Ensure the "Add to Cart" button has the class `btn-add-cart`

## 📱 Responsive Breakpoints

- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px

## 🔧 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with Grid and Flexbox
- **Vanilla JavaScript** - No frameworks, pure JS
- **Font Awesome** - Icons
- **Google Fonts** - Montserrat typography

## ✨ Interactive Features

### Navigation
- Sticky header with scroll effect
- Dropdown menus with hover states
- Mobile-responsive hamburger menu

### Product Features
- Image gallery with thumbnail selection
- Zoom on click
- Variant selection (weight/size)
- Quantity controls with validation
- Add to cart with visual feedback
- Wishlist toggle
- Stock progress indicator

### User Experience
- Smooth scroll animations
- Lazy loading images
- Auto-sliding testimonials
- Accordion FAQs
- Off-canvas panels for cart/wishlist/search
- Notification system for user actions

## 📞 Contact Information

- **Phone**: +91 947977041
- **Email**: info@lotusdryfruits.com
- **Address**: 123 Market Street, New Delhi, India
- **Hours**: Mon - Sat: 9:00 AM - 8:00 PM

## 🎯 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 License

This is a demonstration project created for educational purposes.

## 🙏 Credits

Design inspired by Swaad Ambarsar De (https://swaadambarsarde.com/)
Recreated as Lotus Dryfruits with enhanced features and modern aesthetics.

---

**Built with ❤️ for premium e-commerce experience**
