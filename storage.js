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
  // Phase 8 adds: sheBlewMyMoney.checkoutDraft
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
