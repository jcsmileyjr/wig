// ===========================================================
// storage.js: saves and loads demo orders in the browser.
//
// IMPORTANT: localStorage belongs to ONE browser on ONE device.
// It is not a secure or shared database. Never store payment
// details or passwords here, and use made-up customer data.
//
// Every function handles missing, blocked, or damaged storage
// without throwing, so checkout never breaks because of it.
// ===========================================================

const STORAGE_KEYS = {
  orders: "sheBlewMyMoney.demoOrders",
  draft: "sheBlewMyMoney.checkoutDraft", // answers typed so far, so a refresh doesn't lose them
};

// TODO: FUTURE PHASE — ADMIN DASHBOARD
// Build a separate order-management interface.
// Display saved orders, customer details, plan selections, and status.
// Add search, filtering, order details, status updates, and CSV export.
// Current localStorage data is browser-specific and is not shared
// across devices. A real multi-user dashboard will require a backend
// and shared database, plus proper authentication and authorization.

// Returns the saved orders as an array. Anything unreadable gives [].
function getOrders() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.orders);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((o) => o && typeof o === "object") : [];
  } catch (err) {
    return []; // storage blocked, or the saved text is damaged
  }
}

// Returns one order, or null when it isn't saved.
function getOrderById(orderId) {
  if (typeof orderId !== "string" || !orderId) return null;
  return getOrders().find((order) => order.orderId === orderId) || null;
}

// Adds an order to the saved list. Returns true only if it was really saved.
function saveOrder(order) {
  try {
    const orders = getOrders();
    // Never save the same order ID twice
    if (orders.some((existing) => existing.orderId === order.orderId)) return false;
    orders.push(order);
    window.localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
    // Read it back, so we know it really stuck
    return !!getOrderById(order.orderId);
  } catch (err) {
    return false; // storage full or blocked
  }
}

// ---------- Checkout draft (in-progress answers) ----------
// Saved while the customer fills in checkout and removed once the demo
// order is placed. It holds only what the forms ask for: no payment
// details and no passwords.

// Saves the draft. Returns true if it was stored.
function saveDraft(draft) {
  try {
    window.localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(draft));
    return true;
  } catch (err) {
    return false; // blocked or full: checkout still works, it just won't be remembered
  }
}

// Returns the saved draft object, or null if none or unreadable.
function loadDraft() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.draft);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
}

function clearDraft() {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.draft);
  } catch (err) { /* nothing to clear if storage is blocked */ }
}
