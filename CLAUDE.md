# Nodify AI - Project Documentation

## Project Overview

Nodify AI is a visual GUI for building AI agents without code. This landing page showcases the product through a clean, modern interface with animated node graphs and a clear value proposition.

## Architecture

### Current Structure (Modular)

```
nodify/
├── index.html                 # Original bundled version (385KB, kept for reference)
├── src/                       # Modular source files
│   ├── index.html            # Clean HTML structure
│   ├── css/
│   │   ├── fonts.css         # @font-face declarations (20 font variants)
│   │   └── styles.css        # All CSS styles
│   ├── js/
│   │   └── main.js          # All JavaScript
│   ├── fonts/               # 11 WOFF2 font files (~100KB total)
│   │   ├── font-1.woff2     # Bebas Neue (Latin-ext)
│   │   ├── font-2.woff2     # Bebas Neue (Latin)
│   │   ├── font-3.woff2     # Space Grotesk (Vietnamese)
│   │   ├── font-4.woff2     # Space Grotesk (Latin-ext)
│   │   ├── font-5.woff2     # Space Grotesk (Latin)
│   │   ├── font-6.woff2     # Space Mono (Vietnamese)
│   │   ├── font-7.woff2     # Space Mono (Latin-ext)
│   │   ├── font-8.woff2     # Space Mono (Latin)
│   │   ├── font-9.woff2     # Space Mono Bold (Vietnamese)
│   │   ├── font-10.woff2    # Space Mono Bold (Latin-ext)
│   │   └── font-11.woff2    # Space Mono Bold (Latin)
│   └── images/              # 2 JPEG images (~128KB total)
│       ├── image-1.jpg      # Founder photo 1 (94.5KB)
│       └── image-2.jpg      # Founder photo 2 (33.3KB)
├── assets/                   # Additional assets
│   ├── logo.svg
│   └── nodify-icon.svg
└── docs/                     # Documentation
    └── nodify_a16z_speedrun.pptx
```

## Previous Bundler Architecture (Reference)

### How the Original Bundled Version Worked

The original `index.html` (385KB) was a **self-contained single-file bundle** using a custom bundler/unpacker mechanism:

#### 1. Bundle Structure

```html
<!-- Part 1: Bootstrap & Loading UI -->
<html>
  <head>
    <style>/* Minimal loading spinner styles */</style>
  </head>
  <body>
    <div id="__bundler_thumbnail"><!-- Loading SVG --></div>
    <div id="__bundler_loading">Unpacking...</div>

<!-- Part 2: Asset Manifest (Base64-encoded assets) -->
<script type="__bundler/manifest">
{
  "uuid-1": { "mime": "font/woff2", "compressed": false, "data": "base64..." },
  "uuid-2": { "mime": "image/jpeg", "compressed": false, "data": "base64..." }
}
</script>

<!-- Part 3: HTML Template (Complete page as JSON string) -->
<script type="__bundler/template">
"<!DOCTYPE html><html>...<style>CSS here</style>...<script>JS here<\/script>...</html>"
</script>

<!-- Part 4: Bundler Engine (Unpacks everything) -->
<script>
document.addEventListener('DOMContentLoaded', async function() {
  // 1. Extract manifest & template
  // 2. Decode base64 assets → binary
  // 3. Create blob URLs for assets
  // 4. Replace UUID refs with blob URLs in template
  // 5. Inject processed HTML into DOM
  // 6. Re-execute scripts
});
</script>
  </body>
</html>
```

#### 2. Asset Reference System

**Before unpacking:**
```css
/* Template contains UUIDs */
@font-face {
  src: url("b6985c14-fc79-47be-920b-0991e2b5bb4b") format('woff2');
}
```

**After unpacking:**
```css
/* Bundler replaces with blob URLs */
@font-face {
  src: url("blob:null/92e73cb4-3d5e-4c4c-8e9f-abc123def456") format('woff2');
}
```

#### 3. Unpacking Process

1. **Extract**: Parse manifest and template from `<script>` tags
2. **Decode**: Base64 → Binary for all 13 assets
3. **Create Blobs**: `new Blob([bytes], {type: mime})`
4. **Generate URLs**: `URL.createObjectURL(blob)`
5. **Replace**: String replace UUIDs → blob URLs in template
6. **Inject**: Replace entire document with processed HTML
7. **Execute**: Re-run scripts (DOMParser creates inert scripts)

### Why It Was Bundled

**Pros:**
- ✅ Single-file distribution (easy to share)
- ✅ No external dependencies
- ✅ Works offline immediately
- ✅ No CORS issues

**Cons:**
- ❌ 385KB download before anything renders
- ❌ Difficult to edit/maintain
- ❌ Version control = huge diffs
- ❌ No browser caching of individual assets
- ❌ Can't lazy-load images/fonts

## Current Modular Architecture

### Benefits of Modularization

✅ **Maintainability**: Separate concerns (HTML, CSS, JS, assets)
✅ **Version Control**: Clear diffs, easy to review changes
✅ **Performance**: Browser can cache individual assets
✅ **Development**: Edit files directly, see changes immediately
✅ **GitHub Pages**: Works perfectly with multi-file structure
✅ **Scalability**: Easy to add new features, split code further

### File Organization

#### HTML (`src/index.html`)
Clean semantic HTML with external CSS/JS references. No inline styles or scripts.

#### CSS (`src/css/`)
- **fonts.css**: 20 `@font-face` declarations for 3 font families
  - Bebas Neue (display font for headlines)
  - Space Grotesk (body font, weights 300-600)
  - Space Mono (monospace for labels/code)

- **styles.css**: All page styles organized by section
  - CSS custom properties (`:root` variables)
  - Global reset and base styles
  - Section-specific styles (hero, problem, steps, etc.)
  - Component styles (buttons, cards, forms)
  - Animations and transitions
  - Responsive media queries

#### JavaScript (`src/js/main.js`)
Contains all interactive functionality:
- **Hero animation**: Animated node graph background
- **Scroll effects**: Reveal animations on scroll
- **Waitlist form**: Email submission handler
- **Tweaks panel**: Development/demo UI controls
- **Smooth scrolling**: Navigation link behavior

#### Assets

**Fonts** (`src/fonts/`): 11 WOFF2 files
- Latin, Latin-extended, and Vietnamese character sets
- Multiple weights per family
- Already compressed (WOFF2 native compression)

**Images** (`src/images/`): 2 JPEG files
- Founder photos for team section
- Optimized for web

## Typography System

### Font Families

1. **Bebas Neue** (Display)
   - Weight: 400 (Regular only)
   - Usage: Headlines, section titles
   - Character sets: Latin, Latin-extended
   - Size range: 48px-200px (responsive clamp)

2. **Space Grotesk** (Body)
   - Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold)
   - Usage: Body text, descriptions, UI labels
   - Character sets: Vietnamese, Latin, Latin-extended
   - Size range: 13px-26px

3. **Space Mono** (Monospace)
   - Weights: 400 (Regular), 700 (Bold)
   - Usage: Labels, technical details, code-like elements
   - Character sets: Vietnamese, Latin, Latin-extended
   - Size range: 9px-12px

### Font Loading Strategy

Fonts are loaded via `@font-face` with:
- `font-display: swap` - Show fallback text immediately, swap when loaded
- Unicode-range optimization - Only load needed character sets
- Format: WOFF2 only (universal modern browser support)

## Page Sections

1. **Navigation**: Fixed header with logo and CTA
2. **Hero**: Animated background, headline, tagline, CTAs
3. **Problem (01)**: Three persona cards showing pain points
4. **How It Works (02)**: Four-step process with node graph visualization
5. **Comparison (03)**: Feature comparison table vs competitors
6. **Founders (04)**: Team section with photos and bios
7. **CTA**: Waitlist signup form
8. **Footer**: Logo, copyright, tagline

## Interactive Features

### Animated Node Graph
- 18 nodes moving randomly across the hero background
- Nodes connect when within proximity (~220px)
- Animated edges with dashed flow effect
- Opacity and line weight based on distance
- Runs via `requestAnimationFrame` for performance

### Scroll Reveal Animations
- Sections fade and slide in using `IntersectionObserver`
- Staggered animations for grid children
- Blur effect during entrance
- CSS transitions with custom easing

### Waitlist Form
- Email validation
- Form submission handler (currently client-side only)
- Success message display
- Input focus states

## Color Scheme

```css
--black: #000000      /* Primary background */
--white: #ffffff      /* Primary text */
--gray-1: #f0f0f0     /* Light surfaces */
--gray-2: #e0e0e0     /* Secondary text */
--gray-3: #b0b0b0     /* Muted text */
--gray-4: #777777     /* Subtle text */
--gray-5: #1a1a1a     /* Dark accents */
--gray-6: #111111     /* Section backgrounds */
```

## Responsive Design

Breakpoints:
- **900px**: Tablet adjustments (grid → column layouts)
- **600px**: Mobile optimizations (single column, reduced padding)

Strategy:
- Fluid typography using `clamp()`
- Flexible grid layouts
- Adaptive spacing
- Touch-friendly hit targets (48px minimum)

## Development Workflow

### Local Development

1. **Edit source files** in `/src`:
   ```
   src/index.html    # Update structure
   src/css/styles.css  # Modify styles
   src/js/main.js    # Add/change functionality
   ```

2. **Test locally**: Open `src/index.html` in browser
   - Use browser DevTools for debugging
   - Check Network tab for asset loading
   - Test responsive layouts

3. **Commit changes**: Git tracks individual file changes
   ```bash
   git add src/
   git commit -m "Update hero section animation"
   ```

### Deployment (GitHub Pages)

**Current setup**: GitHub Pages serves from repository root

**To deploy modular version**:

Option A - Replace root index.html:
```bash
cp src/index.html index.html
cp -r src/css .
cp -r src/js .
cp -r src/fonts .
cp -r src/images .
git add .
git commit -m "Deploy modular version"
git push
```

Option B - Use `/docs` folder:
```bash
mkdir docs
cp -r src/* docs/
# Configure GitHub Pages to serve from /docs
git add docs/
git commit -m "Deploy to docs/"
git push
```

Option C - Keep bundled version (recommended for transition):
- Keep original bundled `index.html` in root for now
- Develop in `/src`
- Gradually transition

## Browser Compatibility

**Target**: Modern browsers (2020+)

Required features:
- ✅ CSS Grid & Flexbox
- ✅ CSS Custom Properties (variables)
- ✅ IntersectionObserver API
- ✅ requestAnimationFrame
- ✅ ES6 (let/const, arrow functions)
- ✅ Async/await (if used)
- ✅ CSS `clamp()` function

Fallbacks:
- Reduced motion support via `@media (prefers-reduced-motion)`
- Graceful degradation for animations

## Performance Considerations

### Current Metrics (Estimated)

**Initial Load**:
- HTML: ~5KB
- CSS: ~26KB
- JavaScript: ~5KB
- Fonts: ~100KB (11 files, only needed variants download)
- Images: ~128KB (2 files)
- **Total**: ~264KB (vs 385KB bundled)

**Optimizations**:
- ✅ WOFF2 font compression
- ✅ Optimized JPEGs
- ✅ Minifiable CSS/JS (future)
- ✅ Browser caching enabled
- ⚠️ No lazy loading yet (could add for images)
- ⚠️ No code splitting yet (single JS file)

### Future Improvements

1. **Lazy load images**: Only load founder photos when scrolling to that section
2. **Preload critical fonts**: `<link rel="preload">` for Bebas Neue
3. **Minify assets**: CSS/JS compression for production
4. **WebP images**: Serve modern format with JPEG fallback
5. **Font subsetting**: Include only used characters
6. **Critical CSS**: Inline above-the-fold styles

## Extraction Scripts

Two Node.js scripts were used to modularize the bundled file:

### 1. extract-assets.js
- Reads bundled `index.html`
- Parses manifest JSON
- Decodes base64 assets
- Saves fonts and images to disk
- Creates UUID → filename mapping

### 2. process-template.js
- Reads template HTML
- Extracts and splits CSS into `fonts.css` and `styles.css`
- Extracts JavaScript into `main.js`
- Replaces UUID references with file paths
- Creates clean `src/index.html` with external links

**These scripts are one-time tools** - you don't need to run them again unless rebuilding from a bundled version.

## Future Considerations

### Build Tool (Optional)

If you want to:
- Minify CSS/JS for production
- Create bundled single-file version again
- Add TypeScript or Sass support
- Enable hot module reloading (HMR)

Consider adding:
- **Vite**: Modern, fast, excellent DX
- **Webpack**: More established, highly configurable
- **Parcel**: Zero-config option

### Testing

Potential additions:
- End-to-end tests (Playwright, Cypress)
- Visual regression tests
- Accessibility audits (axe, Lighthouse)
- Performance monitoring

### Analytics

Currently no analytics. Could add:
- Google Analytics / Plausible
- Form submission tracking
- Scroll depth tracking
- CTA click tracking

## Key Takeaways

1. **Modular is better for development**: Easier to edit, maintain, and collaborate
2. **GitHub Pages works perfectly**: No changes needed for deployment
3. **Assets are separated**: Fonts and images are now cacheable
4. **Still single-repo**: Everything stays in one repository
5. **Backward compatible**: Can recreate bundled version if needed
6. **Performance improved**: Smaller initial payload, better caching

---

## Questions or Issues?

If you encounter any problems:
1. Check browser console for errors
2. Verify all asset paths are correct (relative to HTML file)
3. Ensure GitHub Pages is configured correctly
4. Check that fonts are loading (Network tab in DevTools)

For major changes, consider testing locally before pushing to production.
