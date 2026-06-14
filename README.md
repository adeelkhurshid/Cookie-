# COOKIE Premium Bakery & Café Template

Welcome to the COOKIE Premium Bakery & Café website template! This is a high-performance, conversion-optimized, single-page HTML template designed for luxury bakeries, cafes, and dessert shops.

## Features

- **Ultra-Premium Design:** Crafted with high-end luxury aesthetics (glassmorphism, subtle shadows, fluid typography).
- **Cinematic Hero Section:** Advanced CSS-only motion picture effects including a Ken Burns zoom, film grain, light leaks, and realistic volumetric steam.
- **100% Vanilla Code:** Built with pure HTML5, CSS3, and JavaScript. No bulky frameworks (like Bootstrap or jQuery) ensuring lightning-fast load times.
- **Conversion Optimized:** Includes sticky mobile CTAs, a pulsating WhatsApp order button, and a dynamic countdown timer for special offers.
- **Fully Responsive:** Looks perfect on mobile, tablet, and desktop displays.
- **SEO & Accessibility Ready:** Includes Schema.org markup, semantic HTML, and proper ARIA labels.

## File Structure

```text
cookie-bakery/
├── index.html       # The main single-page HTML file
├── styles.css       # Complete design system and component styles (BEM methodology)
├── script.js        # Interactive features (animations, filters, cart logic)
├── README.md        # This documentation file
└── images/          # Directory containing all background and product images
```

## How to Customize

This template is designed to be easily customizable without needing a build step. 

### 1. Changing Colors
All colors are managed via CSS Custom Properties (Variables) at the very top of `styles.css`. Open `styles.css` and look for the `:root` block:

```css
:root {
  /* Change these hex codes to match your brand */
  --chocolate-dark: #2C1810;
  --gold: #C8A96E;
  --cream: #FFF8F0;
  /* ... */
}
```

### 2. Changing Fonts
The template uses Google Fonts (`Playfair Display` for headings, `Inter` for body text). 
To change them, go to the `<head>` of `index.html` and replace the Google Fonts link. Then, update the variables in `styles.css`:

```css
:root {
  --font-display: 'Your New Font', serif;
  --font-body: 'Your Other Font', sans-serif;
}
```

### 3. Replacing Images
Simply replace the `.png` files inside the `images/` folder with your own photos. For best results:
- **Hero Image (`hero-bakery.png`):** Use a high-resolution landscape photo (1920x1080px).
- **Product Images:** Use square (1:1 ratio) high-quality photos. 

### 4. Updating the Menu/Products
Open `index.html` and locate the `<!-- BEST SELLERS -->` and `<!-- CAKE COLLECTION -->` sections. You can duplicate the existing `<div class="product-card">` or `<div class="cake-card">` blocks to add more items, and edit the text inside them directly.

## How to Deploy

Because this is a static website, you can host it anywhere for free or very cheap. 
Simply upload the entire `cookie-bakery` folder to any web host.

**Free Hosting Options:**
- **Netlify:** Drag and drop the folder into [Netlify Drop](https://app.netlify.com/drop).
- **Vercel:** Drag and drop the folder into Vercel.
- **GitHub Pages:** Push the code to a GitHub repository and enable GitHub Pages.

## Support & Usage
This template is provided as-is. Feel free to use it for your own business or sell it to clients!
