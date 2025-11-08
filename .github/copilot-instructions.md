# PetRecs Copilot Instructions

## Project Overview
PetRecs is a landing page for a pet healthcare CRM platform with an Express.js email API backend. The architecture combines a static frontend with a Node.js server for contact form submissions.

## Key Architecture Patterns

### Frontend Structure
- **Single-page landing site**: `index.html` with vanilla JS (`js/main.js`) and CSS (`css/styles.css`)
- **No build system**: Direct file serving, no bundling or compilation required
- **Progressive enhancement**: Works without JavaScript, enhanced with animations and form validation

### Backend API
- **Minimal Express server**: Single endpoint `/send-email` for contact form processing
- **Email-only functionality**: Uses nodemailer with SMTP for form submissions to hardcoded destination
- **Environment-driven config**: All SMTP settings via `.env` file

### Styling Approach
- **Custom CSS with CSS variables**: Design system defined in `:root` selector
- **Inter font family**: Google Fonts integration for typography
- **Intersection Observer animations**: Reveal-on-scroll effects for sections and hero text
- **Mobile-first responsive**: Grid layouts with CSS Grid and Flexbox

## Development Workflow

### Local Development
```bash
npm run dev    # Start with nodemon for auto-restart
npm start      # Production start
```

### File Organization
- **Static assets**: Serve `index.html`, `css/`, `js/` directly (no static middleware in server.js)
- **Server-only files**: `server.js`, `package.json`, `.env`, `node_modules/`
- **Frontend-only files**: `index.html`, `css/styles.css`, `js/main.js`

## Critical Implementation Details

### Contact Form Flow
1. Frontend validation in `js/main.js` (phone: 10-digit regex, email format)
2. POST to `/send-email` with JSON payload: `{name, email, phone, message}`
3. Server creates HTML email template with `escapeHtml()` utility
4. SMTP send via nodemailer to `aishwarya.gawande208@gmail.com`
5. Success/error response shown in form with `#formMsg` element

### Animation System
- **Intersection Observer**: Elements with `.appear` class fade in on scroll
- **Hero text reveal**: Character-by-character animation using individual `<span>` elements
- **Smooth scrolling**: Anchor links use `scrollIntoView({behavior: 'smooth'})`

### Environment Configuration
Required `.env` variables:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` (email sending)
- `FROM_EMAIL` (optional, defaults to SMTP_USER)
- `TZ` (timezone for timestamp, defaults to UTC)
- `PORT` (server port, defaults to 3001)

## Common Patterns

### Error Handling
- **Server**: Try-catch with 500 status and `{ok: false, error: string}` response format
- **Frontend**: Fetch error handling with fallback messages shown in `#formMsg`

### Validation Strategy
- **Client-side**: Immediate feedback for UX (phone number formatting, email regex)
- **Server-side**: Required field validation before email processing

### CSS Architecture
- **CSS Custom Properties**: Design tokens in `:root` for colors, spacing, shadows
- **BEM-like naming**: `.hero-headline`, `.contact-form`, `.nav-list` patterns
- **Utility classes**: `.container`, `.card`, `.btn`, `.appear` for reusable components

## When Making Changes

### Adding New Sections
1. Add HTML structure to `index.html`
2. Add `.appear` class for scroll animations
3. Style with CSS following existing naming conventions
4. Update navigation links if needed

### Modifying Contact Form
- Update both frontend validation in `js/main.js` and server validation in `server.js`
- Maintain consistent error message format: `{ok: boolean, error?: string}`
- Test email delivery with proper SMTP credentials

### Styling Updates
- Use existing CSS variables in `:root` for consistency
- Follow established naming patterns (component-element format)
- Test responsive behavior on mobile viewports