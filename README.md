# She Blew My Money | Weave & Wig Subscription

A class demonstration website for a wig and weave subscription, built with plain HTML, CSS and JavaScript. It runs as a static site on GitHub Pages: <https://jcsmileyjr.github.io/wig/>

**The checkout is a simulation.** It never collects payment details, never processes a payment, and never sends email. Use made-up customer information.

## Pages and files

| File | Purpose |
|---|---|
| `index.html`, `services.html`, `about.html`, `contact.html` | The storefront |
| `style.css`, `script.js` | Storefront styles and behavior |
| `checkout.html` | The five-step demo checkout |
| `checkout.css` | Checkout look (burgundy, champagne gold, cream, charcoal) |
| `checkout.js` | Step navigation, forms, review, order placement, drafts |
| `products.js` | Plan data (single source of truth for checkout) and hair option lists |
| `validation.js` | Customer form validation rules |
| `storage.js` | Saving and loading demo orders and the checkout draft |

All paths are relative, so the site works under the `/wig/` GitHub Pages project path.

## Checkout flow

1. Choose your subscription (the storefront buttons open `checkout.html?plan=<plan-id>`).
2. Hair preferences (wig plans and weave plans ask different questions).
3. Customer information.
4. Review your order.
5. Demo confirmation.

Plan IDs: `everyday-synthetic`, `luxury-wig`, `luxury-swap`, `synthetic-weave`, `complete-install`.

## Browser storage (localStorage)

| Key | Holds |
|---|---|
| `sheBlewMyMoney.demoOrders` | Completed demo orders (status `Pending`, payment `Demo`, `paid: false`) |
| `sheBlewMyMoney.checkoutDraft` | Answers typed so far, removed once an order is placed |

localStorage belongs to one browser on one device. It is **not** secure and **not** shared, so a business owner on another device cannot see these orders. Never store payment details or passwords in it.

## Running locally

No build step. Serve the folder with any static server, for example:

```bash
python -m http.server 8000
```

then open `http://localhost:8000/checkout.html?plan=luxury-wig`.

## Deferred work (not built, TODOs are in the code)

- **Email integration.** Business-owner notification and customer confirmation through an approved service such as EmailJS. Notification status must be tracked separately from the order, and an email failure must never erase or duplicate a saved order. See the TODO in `checkout.js` (`placeDemoOrder`).
- **Admin dashboard.** A separate order-management page with search, filters, order details, status updates and CSV export. A real multi-user dashboard needs a backend, a shared database, and proper authentication. See the TODO in `storage.js`.
- **Customer accounts and login.**
- **Real payments.**

## Business decisions still needed

These are not established on the existing site, so checkout does not show them:

- Shipping charges, tax treatment, deposits, late and damage fees.
- Return windows, cancellation terms and refund terms (the FAQ answers are still placeholders).
- Whether an age confirmation or a parent/guardian flow is required.
- The real catalog of lengths, colors and textures (`HAIR_OPTIONS` in `products.js` comes from planning notes).
- Product and texture photography (checkout uses labelled placeholders).

## Known site issues outside checkout

- Many storefront links are root-absolute (`/account`, `/faq`, `/terms`, `/returns`, `/privacy`, `/about`, `/for-parents`, `/hygiene-quality`, `/pricing`, `/start`) and will 404 under `/wig/`.
- The "Take the Style Quiz" buttons on `services.html` point to `/start`, and no quiz exists.
- `script.js` keeps its own copy of the three wig prices for the savings calculator.
