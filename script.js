// ===========================================================
// Homepage behavior: mobile nav, header shadow, savings
// calculator, scroll reveal, footer year.
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
  // --- Settings you can change in one place ---
  const PLAN_PRICE = 100;      // monthly subscription price
  const PIECES_PER_MONTH = 2;  // wigs or weaves included each month

  // --- Mobile navigation ---
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");

  if (toggle && nav) {
    const setOpen = (open) => {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close the menu after tapping a link
    nav.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    // Close with the Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });
  }

  // --- Header shadow on scroll ---
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // --- Savings calculator ---
  const priceInput = document.getElementById("retail-price");
  const buyTotal = document.getElementById("buy-total");
  const result = document.getElementById("savings-result");

  const money = (n) => "$" + Math.round(n).toLocaleString("en-US");

  const updateSavings = () => {
    if (!priceInput || !buyTotal || !result) return;

    const retail = parseFloat(priceInput.value);

    if (!Number.isFinite(retail) || retail <= 0) {
      buyTotal.textContent = "$0";
      result.textContent = "Enter a price to compare.";
      return;
    }

    const buying = retail * PIECES_PER_MONTH;
    const savings = buying - PLAN_PRICE;
    buyTotal.textContent = money(buying);

    if (savings > 0) {
      result.textContent = "You could save " + money(savings) + " a month.";
    } else if (savings === 0) {
      result.textContent = "About the same price, with new looks every two weeks.";
    } else {
      // Be honest when buying is cheaper, so the page stays trustworthy
      result.textContent =
        "At that price, buying costs less, but you wouldn't get a new look every two weeks.";
    }
  };

  if (priceInput) {
    priceInput.addEventListener("input", updateSavings);
    updateSavings();
  }

  // --- Scroll reveal ---
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealItems.forEach((el) => observer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add("visible"));
  }

  // --- Footer year ---
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
