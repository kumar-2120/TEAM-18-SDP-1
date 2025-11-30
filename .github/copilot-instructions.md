# AI Coding Agent Guide for FARMER-SUPPORT

This repo is a Vite + React single-page app with a lightweight Express server for Razorpay payments. The front-end is mostly contained in `src/App.jsx` and styled via `src/styles.css`. The server exposes `/create-order` and `/verify` endpoints. There is no database; state persists in `localStorage`.

## Architecture
- **Client:** React 18 app bootstrapped by Vite (`vite.config.js`). Entry at `src/main.jsx`, root component in `src/App.jsx`. Styles from `src/styles.css` and `src/index.css`.
- **Server:** `server/index.js` runs Express + CORS, optional Razorpay integration. No ORM/DB; payments validated using HMAC with `RAZORPAY_KEY_SECRET`.
- **Assets:** Static images under `public/images/`. Product cards reference paths like `/images/<file>` and fall back to Unsplash placeholders on error.
- **State & Data Flow:**
  - Initial sample data constructed in `initializeSampleData()` within `App.jsx` and written to React state.
  - State slices: `products`, `orders`, `cart`, `reviews`, `notifications`, `valueRequests`, `currentUser`, etc.
  - Persistence via `localStorage` keys: `agri_products`, `agri_orders`, `agri_cart`, `agri_reviews`, `agri_notifications`, `agri_valueRequests`, `agri_farmers`, `agri_currentUser`, `agri_liked`.
  - Navigation is internal via `currentPage` state (e.g., `landing`, `marketplace`, `farmer-dashboard`). There is no router.
- **Payments:** Client uses Razorpay Checkout if `window.Razorpay` exists and `VITE_RAZORPAY_KEY_ID` is set. Server creates orders when `RAZORPAY_KEY_ID/SECRET` are present.

## Developer Workflows
- **Install & Dev:**
  - `npm install`
  - `npm run dev` to start Vite dev server.
- **Build & Preview:**
  - `npm run build` to generate production assets.
  - `npm run preview` to serve the built app.
- **Server:**
  - Start Express server manually (no script in `package.json`):
    - `node server/index.js`
  - Set env vars for payments:
    - `RAZORPAY_KEY_ID="..."; RAZORPAY_KEY_SECRET="..."; node server/index.js`
- **Razorpay client key:**
  - Provide `VITE_RAZORPAY_KEY_ID` to the Vite client:
    - Create `.env` with `VITE_RAZORPAY_KEY_ID=rzp_test_...` and restart `vite`.

## Conventions & Patterns
- **Single-file UI:** Most UI/logic lives in `src/App.jsx` with manual page switching via `currentPage`.
- **Styling:** CSS classes defined in `src/styles.css` and `src/index.css`. Avoid inline comments inside CSS.
- **Images & Fallbacks:** Product images resolve to `/images/...` and fallback logic is implemented by `handleImgError(e, small?)`.
- **Notifications & Toasts:** Use `addNotification(farmerId, message, type)` and `pushToast(message, type)` utilities in `App.jsx` rather than introducing new libraries.
- **Local Persistence:** Write through to `localStorage` in `useEffect` hooks. When editing state shapes, update corresponding persistence keys.
- **IDs:** New items use `Date.now()` + small random for uniqueness. Products have ids `>=1000` for local image samples; lower ids used for fallback examples.
- **Access Control:** Roles are simulated via `currentPage` and `currentUser.role` (e.g., farmer, buyer, employee, quality). There is no authentication backend.

## Integration Points
- **Server endpoints:**
  - `POST /create-order` accepts `{ amount }` (rupees) and returns `{ orderId, amount, currency }`.
  - `POST /verify` accepts Razorpay fields and returns `{ valid: boolean }`.
  - `GET /health` returns `{ ok: true }`.
- **Client payments:** `openRazorpayPayment(opts)` in `App.jsx` opens checkout. It requires `window.Razorpay` script loaded separately (not currently injected by Vite). Add the script tag in `index.html` if enabling payments.

## Gotchas
- **Dev server crash:** If `npm run dev` fails, check for malformed JSX (e.g., unmatched braces) in `src/App.jsx` due to its large size.
- **Image paths:** Local images must exist under `public/images/`. Broken paths will trigger Unsplash/placeholder fallback.
- **Razorpay readiness:** `isPaymentReady` depends on both the script and `VITE_RAZORPAY_KEY_ID`. UPI flows are disabled otherwise.
- **No router:** Navigation is purely state-based; adding `react-router` requires refactoring `currentPage` transitions.

## Examples
- **Add a new page:** Add a new `currentPage` branch in `App.jsx` and a button setting `setCurrentPage('new-page')`. Keep styles consistent with existing `.btn`, `.container`, `.productCard` classes.
- **Persist a new state slice:** Create `useState(...)`; add `useEffect(() => localStorage.setItem('agri_<key>', JSON.stringify(state)), [state])`.
- **Enable payments:** In `index.html`, include `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` and set `VITE_RAZORPAY_KEY_ID`.

## File Pointers
- Client: `src/App.jsx`, `src/main.jsx`, `src/styles.css`, `src/index.css`
- Server: `server/index.js`
- Static assets: `public/images/`

If any section is unclear or missing (e.g., exact CSS class semantics or desired new flows), let me know and I’ll refine this guide.