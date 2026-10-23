// ===========================================================
// Homepage behavior: mobile nav, header shadow, savings
// calculator, scroll reveal, footer year.
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
  // --- Settings you can change in one place ---
  const PLAN_PRICE = 100;      // monthly subscription price
  const PIECES_PER_MONTH = 2;  // wigs or weaves included each month

  // Business hours (used by the "open now" badge on the contact page)
  const HOURS_TIMEZONE = "America/Chicago";            // Central Time
  const BUSINESS_HOURS = { days: [1, 2, 3, 4, 5], open: 8, close: 17 }; // Mon-Fri, 8am-5pm

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

  // --- Highlight the nav link for the section being viewed ---
  const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  const spyTargets = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && spyTargets.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            if (link.getAttribute("href") === "#" + entry.target.id) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    spyTargets.forEach((section) => spy.observe(section));
  }

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

  // --- Business hours badge and today's row (contact page) ---
  const statusBadge = document.getElementById("hours-status");
  if (statusBadge) {
    const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const hourLabel = (h) => (h % 12 || 12) + ":00 " + (h < 12 ? "am" : "pm");

    const getNow = () => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: HOURS_TIMEZONE,
        weekday: "long",
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h23",
      }).formatToParts(new Date());
      const get = (type) => parts.find((p) => p.type === type).value;
      return {
        day: DAY_NAMES.indexOf(get("weekday")),
        minutes: parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10),
      };
    };

    const renderHours = () => {
      let now;
      try {
        now = getNow();
      } catch (err) {
        return; // Older browser: keep the static text in the page
      }

      const isOpenDay = BUSINESS_HOURS.days.includes(now.day);
      const isOpen =
        isOpenDay &&
        now.minutes >= BUSINESS_HOURS.open * 60 &&
        now.minutes < BUSINESS_HOURS.close * 60;

      let text;
      if (isOpen) {
        text = "We're open now, until " + hourLabel(BUSINESS_HOURS.close) + " CT";
      } else {
        let when = null;
        if (isOpenDay && now.minutes < BUSINESS_HOURS.open * 60) {
          when = "today";
        } else {
          for (let i = 1; i <= 7; i++) {
            const d = (now.day + i) % 7;
            if (BUSINESS_HOURS.days.includes(d)) {
              when = i === 1 ? "tomorrow" : DAY_NAMES[d];
              break;
            }
          }
        }
        text = "We're closed right now. We reopen " + when + " at " + hourLabel(BUSINESS_HOURS.open) + " CT";
      }

      statusBadge.setAttribute("data-state", isOpen ? "open" : "closed");
      const textEl = statusBadge.querySelector(".status-text");
      if (textEl) textEl.textContent = text;

      document.querySelectorAll("[data-days]").forEach((row) => {
        const days = row.getAttribute("data-days").split(",").map(Number);
        row.classList.toggle("is-today", days.includes(now.day));
      });
    };

    renderHours();
    setInterval(renderHours, 60000);
  }

  // --- Copy-to-clipboard buttons (shown only when JavaScript runs) ---
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const original = btn.textContent;
    btn.hidden = false;

    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      let copied = false;

      try {
        await navigator.clipboard.writeText(value);
        copied = true;
      } catch (err) {
        // Fallback for browsers or contexts without the clipboard API
        const box = document.createElement("textarea");
        box.value = value;
        box.setAttribute("readonly", "");
        box.style.position = "fixed";
        box.style.opacity = "0";
        document.body.appendChild(box);
        box.select();
        try { copied = document.execCommand("copy"); } catch (e) { copied = false; }
        box.remove();
      }

      btn.textContent = copied ? "Copied!" : "Press Ctrl+C to copy";
      setTimeout(() => { btn.textContent = original; }, 2000);
    });
  });

  // --- Style filter chips (services page) ---
  const filterButtons = document.querySelectorAll("[data-filter]");
  const styleGroups = document.querySelectorAll("[data-group]");

  if (filterButtons.length && styleGroups.length) {
    // The chips start hidden in the HTML so the page works without JavaScript
    const filterBar = filterButtons[0].closest(".style-filter");
    if (filterBar) filterBar.hidden = false;

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = btn.getAttribute("data-filter");
        filterButtons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        styleGroups.forEach((group) => {
          group.hidden = !(choice === "all" || group.getAttribute("data-group") === choice);
        });
      });
    });
  }

  // --- Footer year ---
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
