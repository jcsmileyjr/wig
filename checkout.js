// ===========================================================
// checkout.js (Phase 2: checkout shell)
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

  // ---------- Step 1 content (selected plan or plan list) ----------
  function renderStepOne() {
    const selected = document.getElementById("selected-plan");
    const picker = document.getElementById("plan-picker");
    const plan = checkoutState.plan;

    if (plan) {
      document.getElementById("selected-plan-type").textContent =
        (plan.category === "wig" ? "Wig" : "Weave") + " · " + plan.hairType;
      document.getElementById("selected-plan-heading").textContent = plan.name;
      document.getElementById("selected-plan-price").textContent = formatPlanPrice(plan);
      document.getElementById("selected-plan-summary").textContent = plan.summary;

      const list = document.getElementById("selected-plan-included");
      list.textContent = "";
      plan.included.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = item;
        list.appendChild(li);
      });
      selected.hidden = false;
      picker.hidden = true;
      return;
    }

    document.getElementById("plan-picker-message").textContent = hadPlanInUrl
      ? "We couldn't find that plan. Please pick one below."
      : "Pick the plan you'd like to start with.";

    const list = document.getElementById("plan-picker-list");
    list.textContent = "";
    PLANS.forEach((p) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "checkout.html?plan=" + encodeURIComponent(p.id);
      link.textContent = p.name + " (" + formatPlanPrice(p) + ")";
      li.appendChild(link);
      list.appendChild(li);
    });
    picker.hidden = false;
    selected.hidden = true;
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
    // TODO (Phase 3-5): validate the current step before moving on.
    if (checkoutState.step < TOTAL_STEPS) showStep(checkoutState.step + 1, true);
  });

  backButton.addEventListener("click", () => {
    if (checkoutState.step > 1) showStep(checkoutState.step - 1, true);
  });

  // ---------- Footer year ----------
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  renderStepOne();
  renderPlanBar();
  showStep(1, false);
});
