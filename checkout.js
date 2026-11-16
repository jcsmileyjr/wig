// ===========================================================
// checkout.js (Phase 1)
// Reads the plan ID from the URL (checkout.html?plan=luxury-wig)
// and shows that plan. If the ID is missing or unknown, shows a
// friendly list of plans to pick from instead.
// Later phases will add the five checkout steps here.
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {
  const selectedSection = document.getElementById("selected-plan");
  const pickerSection = document.getElementById("plan-picker");
  if (!selectedSection || !pickerSection || typeof PLANS === "undefined") return;

  const planId = new URLSearchParams(window.location.search).get("plan");
  const plan = getPlanById(planId);

  if (plan) {
    showSelectedPlan(plan);
  } else {
    // planId === null means no plan in the URL; otherwise it was not recognised
    showPlanPicker(planId !== null);
  }

  function showSelectedPlan(plan) {
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

    selectedSection.hidden = false;
    pickerSection.hidden = true;
  }

  function showPlanPicker(wasInvalid) {
    document.getElementById("plan-picker-message").textContent = wasInvalid
      ? "We couldn't find that plan. Please pick one below."
      : "Pick the plan you'd like to start with.";

    const list = document.getElementById("plan-picker-list");
    list.textContent = "";
    PLANS.forEach((plan) => {
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "checkout.html?plan=" + encodeURIComponent(plan.id);
      link.textContent = plan.name + " (" + formatPlanPrice(plan) + ")";
      li.appendChild(link);
      list.appendChild(li);
    });

    pickerSection.hidden = false;
    selectedSection.hidden = true;
  }
});
