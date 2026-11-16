// ===========================================================
// checkout.js (Phase 3: plan selection)
// - Reads the plan ID from the URL (checkout.html?plan=luxury-wig)
// - Shows one of five step panels at a time
// - Back / Next move between steps and never auto-advance
// - Keeps the answers in one `checkoutState` object so later
//   phases can store preferences and customer info in it.
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
  if (typeof PLANS === "undefined") return; // products.js failed to load

  const TOTAL_STEPS = 5;
  const STEP_NAMES = ["Subscription", "Hair preferences", "Your information", "Review", "Confirmation"];

  // All checkout answers live here, so going Back and Next never loses them.
  // TODO (Phase 4-5): add preferences and customer fields to this object.
  const checkoutState = {
    step: 1,
    plan: null, // the selected plan object from products.js
  };

  const planFromUrl = getPlanById(new URLSearchParams(window.location.search).get("plan"));
  const hadPlanInUrl = new URLSearchParams(window.location.search).get("plan") !== null;
  checkoutState.plan = planFromUrl;

  const panels = document.querySelectorAll(".step-panel");
  const progressSteps = document.querySelectorAll(".progress-step");
  const progressText = document.getElementById("progress-text");
  const backButton = document.getElementById("back-button");
  const nextButton = document.getElementById("next-button");
  const planBar = document.getElementById("plan-bar");

  // ---------- Step 1: plan cards ----------
  // Cards are built from PLANS in products.js, so prices and names
  // always match the rest of checkout. Each card is a radio button,
  // which gives "only one plan at a time" and keyboard use for free.
  const planGroups = document.getElementById("plan-groups");
  const planError = document.getElementById("plan-error");
  const planNotice = document.getElementById("plan-notice");

  function makePlanCard(plan) {
    const label = document.createElement("label");
    label.className = "plan-option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = "plan";
    input.value = plan.id;
    input.className = "sr-only";
    input.checked = !!checkoutState.plan && checkoutState.plan.id === plan.id;
    input.addEventListener("change", () => selectPlan(plan.id));

    const card = document.createElement("div");
    card.className = "plan-card";

    // No product photos exist yet, so this is a labelled placeholder.
    // TODO: replace with approved product photography.
    const photo = document.createElement("div");
    photo.className = "plan-photo";
    photo.setAttribute("aria-hidden", "true");
    photo.textContent = plan.hairType + " " + plan.category;

    const name = document.createElement("span");
    name.className = "plan-card-name";
    name.textContent = plan.name;

    const price = document.createElement("span");
    price.className = "plan-card-price";
    price.textContent = formatPlanPrice(plan);

    card.append(photo, name, price);

    if (plan.equivalent) {
      const eq = document.createElement("span");
      eq.className = "plan-card-equiv";
      eq.textContent = plan.equivalent;
      card.appendChild(eq);
    }

    const summary = document.createElement("span");
    summary.className = "plan-card-summary";
    summary.textContent = plan.summary;
    card.appendChild(summary);

    if (plan.note) {
      const note = document.createElement("span");
      note.className = "plan-card-note";
      note.textContent = plan.note;
      card.appendChild(note);
    }

    const list = document.createElement("ul");
    list.className = "check-list";
    plan.included.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
    card.appendChild(list);

    // Plain-language help for terms like "glueless", "closure" and "frontal"
    (plan.terms || []).forEach((key) => {
      if (!GLOSSARY[key]) return;
      const help = document.createElement("span");
      help.className = "plan-card-help";
      const term = document.createElement("strong");
      term.textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": ";
      help.append(term, GLOSSARY[key]);
      card.appendChild(help);
    });

    // Visible "Select plan" control. It shows "Selected" once chosen.
    const pick = document.createElement("span");
    pick.className = "plan-card-pick";
    pick.setAttribute("aria-hidden", "true");
    card.appendChild(pick);

    label.append(input, card);
    return label;
  }

  function renderPlanCards() {
    planGroups.textContent = "";
    [["wig", "Wigs", "Worn over your head. Choose your cap size on the next step."],
     ["weave", "Weaves", "New, unworn hair that is yours to keep, installed by your stylist."]]
      .forEach(([category, title, blurb]) => {
        const group = document.createElement("div");
        group.className = "plan-group";
        const heading = document.createElement("h2");
        heading.className = "plan-group-title";
        heading.textContent = title;
        const text = document.createElement("p");
        text.className = "plan-group-blurb";
        text.textContent = blurb;
        const grid = document.createElement("div");
        grid.className = "plan-grid";
        PLANS.filter((p) => p.category === category).forEach((p) => grid.appendChild(makePlanCard(p)));
        group.append(heading, text, grid);
        planGroups.appendChild(group);
      });

    if (hadPlanInUrl && !planFromUrl) {
      planNotice.textContent = "We couldn't find that plan. Please choose one below.";
      planNotice.hidden = false;
    }
    refreshPickLabels();
  }

  // Text on each card's control: "Select plan" or "Selected"
  function refreshPickLabels() {
    document.querySelectorAll(".plan-option").forEach((label) => {
      const chosen = label.querySelector("input").checked;
      label.querySelector(".plan-card-pick").textContent = chosen ? "\u2713 Selected" : "Select plan";
    });
  }

  function selectPlan(planId) {
    checkoutState.plan = getPlanById(planId);
    planError.hidden = true;
    refreshPickLabels();
    renderPlanBar();
    // Keep the URL in step with the choice so a refresh keeps the plan
    try {
      history.replaceState(null, "", "?plan=" + encodeURIComponent(planId));
    } catch (err) { /* not important if the browser refuses */ }
  }

  // ---------- Plan bar (visible on every step once a plan is chosen) ----------
  function renderPlanBar() {
    const plan = checkoutState.plan;
    planBar.hidden = !plan;
    if (!plan) return;
    document.getElementById("plan-bar-name").textContent = plan.name;
    document.getElementById("plan-bar-price").textContent = formatPlanPrice(plan);
  }

  // ---------- Progress indicator ----------
  function renderProgress() {
    progressSteps.forEach((li) => {
      const n = Number(li.dataset.step);
      const dot = li.querySelector(".progress-dot");
      li.classList.toggle("is-done", n < checkoutState.step);
      li.classList.toggle("is-current", n === checkoutState.step);
      // A check mark for finished steps, so progress is not shown by color alone
      dot.textContent = n < checkoutState.step ? "✓" : String(n);
      if (n === checkoutState.step) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    progressText.textContent =
      "Step " + checkoutState.step + " of " + TOTAL_STEPS + ": " + STEP_NAMES[checkoutState.step - 1];
  }

  // ---------- Show the current step ----------
  function showStep(step, moveFocus) {
    checkoutState.step = step;

    panels.forEach((panel) => {
      panel.hidden = Number(panel.dataset.step) !== step;
    });

    backButton.hidden = step === 1;
    // The final step is the end of the flow; later phases add the order button on step 4.
    nextButton.hidden = step === TOTAL_STEPS;
    if (step === TOTAL_STEPS) backButton.hidden = true;

    renderProgress();

    if (moveFocus) {
      // Move focus to the step heading so keyboard and screen reader users know the step changed
      const heading = document.querySelector("#step-" + step + " .step-title");
      if (heading) heading.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }
  }

  // ---------- Buttons ----------
  nextButton.addEventListener("click", () => {
    // Step 1 needs a plan. TODO (Phase 4-5): validate steps 2 and 3 too.
    if (checkoutState.step === 1 && !checkoutState.plan) {
      planError.textContent = "Please choose a plan to continue.";
      planError.hidden = false;
      const firstRadio = document.querySelector('input[name="plan"]');
      if (firstRadio) firstRadio.focus();
      return;
    }
    if (checkoutState.step < TOTAL_STEPS) showStep(checkoutState.step + 1, true);
  });

  backButton.addEventListener("click", () => {
    if (checkoutState.step > 1) showStep(checkoutState.step - 1, true);
  });

  // ---------- Footer year ----------
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  renderPlanCards();
  renderPlanBar();
  showStep(1, false);
});
