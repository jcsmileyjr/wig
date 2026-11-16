// ===========================================================
// checkout.js (Phase 8: drafts and recovery)
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
  const checkoutState = {
    step: 1,
    plan: null, // the selected plan object from products.js
    preferences: {}, // step 2 answers: capSize, texture, length, color, style
    customer: {      // step 3 answers (never any payment or password data)
      firstName: "", lastName: "", email: "", phone: "",
      street: "", apartment: "", city: "", state: "", zip: "",
      consentOrderEmail: false, // unchecked by default
      consentMarketing: false,  // unchecked by default, separate from order email
    },
  };

  const planFromUrl = getPlanById(new URLSearchParams(window.location.search).get("plan"));
  const hadPlanInUrl = new URLSearchParams(window.location.search).get("plan") !== null;

  // ---------- Draft: remember answers across a refresh ----------
  // Answers are saved as the customer types (see saveDraftNow) and restored
  // here. Anything unexpected in the saved draft is ignored, never trusted.
  const clean = (value, max) => (typeof value === "string" ? value.slice(0, max) : "");
  const isKnownOption = (list, value) => list.some((opt) => opt.value === value);

  function restoreDraft() {
    const draft = loadDraft();
    const restored = { planId: null, step: 1 };
    if (!draft) return restored;

    if (typeof draft.planId === "string" && getPlanById(draft.planId)) restored.planId = draft.planId;
    if (Number.isInteger(draft.step) && draft.step >= 1 && draft.step <= 4) restored.step = draft.step;

    const prefs = draft.preferences && typeof draft.preferences === "object" ? draft.preferences : {};
    if (isKnownOption(HAIR_OPTIONS.capSizes, prefs.capSize)) checkoutState.preferences.capSize = prefs.capSize;
    if (isKnownOption(HAIR_OPTIONS.textures, prefs.texture)) checkoutState.preferences.texture = prefs.texture;
    if (isKnownOption(HAIR_OPTIONS.colors, prefs.color)) checkoutState.preferences.color = prefs.color;
    if (isKnownOption(HAIR_OPTIONS.styles, prefs.style)) checkoutState.preferences.style = prefs.style;
    const len = Number(prefs.length);
    if (Number.isInteger(len) && len >= HAIR_OPTIONS.lengths.min && len <= HAIR_OPTIONS.lengths.max) {
      checkoutState.preferences.length = String(len);
    }

    const cust = draft.customer && typeof draft.customer === "object" ? draft.customer : {};
    ["firstName", "lastName", "email", "phone", "street", "apartment", "city", "zip"].forEach((f) => {
      checkoutState.customer[f] = clean(cust[f], 120);
    });
    if (US_STATES.some(([code]) => code === cust.state)) checkoutState.customer.state = cust.state;
    checkoutState.customer.consentOrderEmail = cust.consentOrderEmail === true;
    checkoutState.customer.consentMarketing = cust.consentMarketing === true;
    return restored;
  }

  const restoredDraft = restoreDraft();
  // A plan in the address bar wins over the draft. A bad plan in the address
  // bar means "let the customer choose again", so the draft's plan is not used.
  checkoutState.plan = planFromUrl || (hadPlanInUrl ? null : getPlanById(restoredDraft.planId));
  let draftReady = false; // set to true once the page has finished loading
  let orderPlaced = false; // blocks a second order after one succeeded

  function saveDraftNow() {
    // Never save an empty first load, or anything after the order is placed
    if (!draftReady || orderPlaced || checkoutState.step === TOTAL_STEPS) return;
    saveDraft({
      savedAt: new Date().toISOString(),
      planId: checkoutState.plan ? checkoutState.plan.id : null,
      step: checkoutState.step,
      preferences: checkoutState.preferences,
      customer: checkoutState.customer,
    });
  }

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

  // Step 1 needs a plan. Shows an error and focuses the cards if none is chosen.
  function validateStepOne() {
    if (checkoutState.plan) return true;
    planError.textContent = "Please choose a plan to continue.";
    planError.hidden = false;
    const firstRadio = document.querySelector('input[name="plan"]');
    if (firstRadio) firstRadio.focus();
    return false;
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

  // ---------- Step 2: hair preferences ----------
  // The questions depend on the plan type. Wig plans ask for a cap size
  // and an optional style; weave plans do not. Answers live in
  // checkoutState.preferences so they survive Back and Next.
  const preferencesForm = document.getElementById("preferences-form");
  const WIG_ONLY_FIELDS = ["capSize", "style"];

  function makeError(id) {
    const err = document.createElement("p");
    err.className = "field-error";
    err.id = id;
    err.hidden = true;
    return err;
  }

  // A group of visual choice cards (radio buttons) with a text label on each
  function makeChoiceGroup(field, legendText, options, config) {
    const fieldset = document.createElement("fieldset");
    fieldset.className = "pref-group";
    fieldset.dataset.field = field;

    const legend = document.createElement("legend");
    legend.textContent = legendText + (config.required ? " (required)" : " (optional)");
    fieldset.appendChild(legend);

    if (config.help) {
      const help = document.createElement("p");
      help.className = "pref-help";
      help.textContent = config.help;
      fieldset.appendChild(help);
    }

    const grid = document.createElement("div");
    grid.className = "choice-grid";
    options.forEach((opt) => {
      const label = document.createElement("label");
      label.className = "choice";
      const input = document.createElement("input");
      input.type = "radio";
      input.name = field;
      input.value = opt.value;
      input.className = "sr-only";
      input.checked = checkoutState.preferences[field] === opt.value;
      input.setAttribute("aria-describedby", "error-" + field);
      input.addEventListener("change", () => {
        checkoutState.preferences[field] = opt.value;
        clearPreferenceError(field);
      });
      const card = document.createElement("span");
      card.className = "choice-card";
      const name = document.createElement("span");
      name.className = "choice-label";
      name.textContent = opt.label;
      card.appendChild(name);
      if (opt.hint) {
        const hint = document.createElement("span");
        hint.className = "choice-hint";
        hint.textContent = opt.hint;
        card.appendChild(hint);
      }
      label.append(input, card);
      grid.appendChild(label);
    });
    fieldset.appendChild(grid);
    fieldset.appendChild(makeError("error-" + field));
    return fieldset;
  }

  function makeLengthSelect() {
    const wrap = document.createElement("div");
    wrap.className = "pref-group";
    wrap.dataset.field = "length";

    const label = document.createElement("label");
    label.className = "pref-label";
    label.htmlFor = "pref-length";
    label.textContent = "Length (required)";

    const select = document.createElement("select");
    select.id = "pref-length";
    select.name = "length";
    select.className = "pref-select";
    select.setAttribute("aria-describedby", "error-length");

    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Choose a length";
    select.appendChild(blank);
    for (let inches = HAIR_OPTIONS.lengths.min; inches <= HAIR_OPTIONS.lengths.max; inches++) {
      const opt = document.createElement("option");
      opt.value = String(inches);
      opt.textContent = inches + " inches";
      select.appendChild(opt);
    }
    select.value = checkoutState.preferences.length || "";
    select.addEventListener("change", () => {
      checkoutState.preferences.length = select.value;
      clearPreferenceError("length");
    });

    wrap.append(label, select, makeError("error-length"));
    return wrap;
  }

  function renderPreferences() {
    const plan = checkoutState.plan;
    if (!plan) return;
    const isWig = plan.category === "wig";

    // Switching from a wig plan to a weave plan drops wig-only answers
    if (!isWig) WIG_ONLY_FIELDS.forEach((f) => delete checkoutState.preferences[f]);

    document.getElementById("preferences-intro").textContent =
      "Tell us what you like for your " + plan.name + ". Everything you pick can be changed before you review your order.";

    preferencesForm.textContent = "";
    if (isWig) {
      preferencesForm.appendChild(makeChoiceGroup("capSize", "Cap size", HAIR_OPTIONS.capSizes, {
        required: true,
        help: "The cap is the inside of the wig. Measure around your head, or choose Not Sure.",
      }));
    }
    preferencesForm.appendChild(makeChoiceGroup("texture", "Hair texture", HAIR_OPTIONS.textures, { required: true }));
    preferencesForm.appendChild(makeLengthSelect());
    preferencesForm.appendChild(makeChoiceGroup("color", "Color", HAIR_OPTIONS.colors, { required: true }));
    if (isWig) {
      preferencesForm.appendChild(makeChoiceGroup("style", "Style preference", HAIR_OPTIONS.styles, { required: false }));
    }
  }

  function clearPreferenceError(field) {
    const err = document.getElementById("error-" + field);
    if (err) err.hidden = true;
  }

  // Returns true when every required answer is present. Otherwise shows an
  // error beside each missing question and moves focus to the first one.
  function validatePreferences() {
    const required = ["texture", "length", "color"];
    if (checkoutState.plan && checkoutState.plan.category === "wig") required.unshift("capSize");

    const labels = { capSize: "a cap size", texture: "a hair texture", length: "a length", color: "a color" };
    let firstBad = null;

    required.forEach((field) => {
      const err = document.getElementById("error-" + field);
      const value = checkoutState.preferences[field];
      if (value) { if (err) err.hidden = true; return; }
      if (err) {
        err.textContent = "Please choose " + labels[field] + ".";
        err.hidden = false;
      }
      if (!firstBad) firstBad = field;
    });

    if (firstBad) {
      const target = firstBad === "length"
        ? document.getElementById("pref-length")
        : document.querySelector('input[name="' + firstBad + '"]');
      if (target) target.focus();
      return false;
    }
    return true;
  }

  // ---------- Step 3: customer information ----------
  // The form is plain HTML in checkout.html. Here we fill the State
  // list, copy what the customer types into checkoutState.customer,
  // and show validation errors from validation.js beside each field.
  const customerForm = document.getElementById("customer-form");

  function setupCustomerForm() {
    const stateSelect = document.getElementById("cust-state");
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Choose your state";
    stateSelect.appendChild(blank);
    US_STATES.forEach(([code, name]) => {
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = name;
      stateSelect.appendChild(opt);
    });

    // Text inputs and the State list
    customerForm.querySelectorAll("[data-field]").forEach((el) => {
      const name = el.dataset.field;
      el.value = checkoutState.customer[name] || "";
      el.addEventListener("input", () => {
        checkoutState.customer[name] = el.value;
        // Once a field was flagged, re-check it as the customer fixes it
        if (!document.getElementById("error-" + name).hidden) showCustomerFieldError(name);
      });
      el.addEventListener("change", () => {
        checkoutState.customer[name] = el.value;
      });
    });

    // Consent checkboxes (kept separate on purpose)
    customerForm.querySelectorAll("[data-consent]").forEach((box) => {
      const name = box.dataset.consent;
      box.checked = !!checkoutState.customer[name];
      box.addEventListener("change", () => {
        checkoutState.customer[name] = box.checked;
      });
    });

    // Pressing Enter in a field should act like "Next", not reload the page
    customerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      nextButton.click();
    });
  }

  function showCustomerFieldError(name) {
    const input = document.getElementById("cust-" + name);
    const err = document.getElementById("error-" + name);
    const message = REQUIRED_CUSTOMER_FIELDS.includes(name)
      ? validateCustomerField(name, checkoutState.customer[name])
      : "";
    err.textContent = message;
    err.hidden = !message;
    if (message) input.setAttribute("aria-invalid", "true");
    else input.removeAttribute("aria-invalid");
    return message;
  }

  // Returns true when the form is valid. Otherwise shows an error beside
  // every problem field (keeping everything the customer typed) and moves
  // focus to the first one.
  function validateCustomerStep() {
    const errors = validateCustomer(checkoutState.customer);
    let firstBad = null;
    REQUIRED_CUSTOMER_FIELDS.forEach((name) => {
      showCustomerFieldError(name);
      if (errors[name] && !firstBad) firstBad = name;
    });
    if (firstBad) {
      document.getElementById("cust-" + firstBad).focus();
      return false;
    }
    return true;
  }

  // ---------- Step 4: review ----------
  // Built fresh from checkoutState every time the customer arrives, so it
  // always shows the latest answers. Text is added with textContent only.
  const reviewContent = document.getElementById("review-content");

  // Turns a stored value like "body-wave" into its label, "Body Wave"
  function optionLabel(list, value) {
    const match = list.find((opt) => opt.value === value);
    return match ? match.label : value;
  }

  // One block of the summary. Pass editStep = null for a read-only block.
  function makeReviewSection(title, editStep, rows) {
    const section = document.createElement("section");
    section.className = "card review-section";

    const head = document.createElement("div");
    head.className = "review-head";
    const heading = document.createElement("h2");
    heading.textContent = title;
    head.appendChild(heading);

    if (editStep) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "link-button";
      edit.textContent = "Edit";
      edit.setAttribute("aria-label", "Edit " + title.toLowerCase());
      edit.addEventListener("click", () => showStep(editStep, true));
      head.appendChild(edit);
    }

    const list = document.createElement("dl");
    list.className = "review-list";
    rows.forEach(([label, value]) => {
      if (!value) return;
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = value;
      list.append(dt, dd);
    });

    section.append(head, list);
    return section;
  }

  // Builds the order summary into `container`. Used by the review step
  // (editable) and by the confirmation (read-only), so both always match.
  // data = { planName, typeText, priceText, prefs, customer }
  function renderSummary(container, data, editable) {
    const prefs = data.prefs;
    const c = data.customer;
    container.textContent = "";

    container.appendChild(makeReviewSection("Subscription", editable ? 1 : null, [
      ["Plan", data.planName],
      ["Type", data.typeText],
      ["Price", data.priceText],
    ]));

    container.appendChild(makeReviewSection("Hair preferences", editable ? 2 : null, [
      ["Cap size", prefs.capSize ? optionLabel(HAIR_OPTIONS.capSizes, prefs.capSize) : ""],
      ["Texture", optionLabel(HAIR_OPTIONS.textures, prefs.texture)],
      ["Length", prefs.length ? prefs.length + " inches" : ""],
      ["Color", optionLabel(HAIR_OPTIONS.colors, prefs.color)],
      ["Style", prefs.style ? optionLabel(HAIR_OPTIONS.styles, prefs.style) : ""],
    ]));

    const cityLine = c.city.trim() + ", " + c.state + " " + c.zip.trim();
    container.appendChild(makeReviewSection("Your information", editable ? 3 : null, [
      ["Name", c.firstName.trim() + " " + c.lastName.trim()],
      ["Email", c.email.trim()],
      ["Phone", c.phone.trim()],
      ["Ship to", [c.street.trim(), c.apartment.trim(), cityLine].filter(Boolean).join(", ")],
      ["Order emails", c.consentOrderEmail ? "Yes" : "No"],
      ["Marketing emails", c.consentMarketing ? "Yes" : "No"],
    ]));

    // TODO: BUSINESS DECISION NEEDED. Shipping charges, taxes, return terms,
    // fees and cancellation rules have not been confirmed, so none are shown.
    const summary = document.createElement("section");
    summary.className = "card review-total";
    const label = document.createElement("p");
    label.className = "review-total-label";
    label.textContent = "Subscription price";
    const amount = document.createElement("p");
    amount.className = "review-total-amount";
    amount.textContent = data.priceText;
    const note = document.createElement("p");
    note.className = "review-total-note";
    note.textContent = "Shipping, tax and other charges are not set up in this demo. No payment is collected.";
    summary.append(label, amount, note);
    container.appendChild(summary);
  }

  function renderReview() {
    const plan = checkoutState.plan;
    if (!plan) { reviewContent.textContent = ""; return; }
    renderSummary(reviewContent, {
      planName: plan.name,
      typeText: (plan.category === "wig" ? "Wig" : "Weave") + " \u00b7 " + plan.hairType,
      priceText: formatPlanPrice(plan),
      prefs: checkoutState.preferences,
      customer: checkoutState.customer,
    }, true);
  }

  // ---------- Steps 4 and 5: place the demo order ----------
  const orderError = document.getElementById("order-error");
  let orderInProgress = false; // blocks double clicks while an order is being made

  // A short, unique demo ID such as SBM-DEMO-LZ3K9A-7QF2
  function generateOrderId() {
    const existing = getOrders().map((o) => o.orderId);
    let id;
    do {
      let random = "";
      if (window.crypto && window.crypto.getRandomValues) {
        const bytes = new Uint8Array(4);
        window.crypto.getRandomValues(bytes);
        random = Array.from(bytes, (b) => (b % 36).toString(36)).join("");
      } else {
        random = Math.random().toString(36).slice(2, 6).padEnd(4, "0");
      }
      id = "SBM-DEMO-" + Date.now().toString(36).toUpperCase() + "-" + random.toUpperCase();
    } while (existing.includes(id));
    return id;
  }

  // Checks all answers again. Returns the step number to send the customer
  // back to, or 0 when everything is complete.
  function findIncompleteStep() {
    const plan = checkoutState.plan;
    if (!plan) return 1;
    const prefs = checkoutState.preferences;
    const requiredPrefs = ["texture", "length", "color"];
    if (plan.category === "wig") requiredPrefs.unshift("capSize");
    if (requiredPrefs.some((f) => !prefs[f])) return 2;
    if (Object.keys(validateCustomer(checkoutState.customer)).length > 0) return 3;
    return 0;
  }

  function buildOrder() {
    const plan = checkoutState.plan;
    const c = checkoutState.customer;
    const prefs = checkoutState.preferences;
    return {
      orderId: generateOrderId(),
      createdAt: new Date().toISOString(),
      customer: {
        firstName: c.firstName.trim(),
        lastName: c.lastName.trim(),
        email: c.email.trim(),
        phone: c.phone.trim(),
        shippingAddress: {
          street: c.street.trim(),
          apartment: c.apartment.trim(),
          city: c.city.trim(),
          state: c.state,
          zip: c.zip.trim(),
        },
      },
      consent: { orderEmail: !!c.consentOrderEmail, marketing: !!c.consentMarketing },
      subscription: { id: plan.id, name: plan.name, price: plan.price, frequency: plan.frequency },
      preferences: Object.assign({}, prefs),
      status: "Pending",
      payment: { type: "Demo", paid: false },
      notifications: { businessEmail: "not-configured", customerEmail: "not-configured" },
    };
  }

  function placeDemoOrder() {
    if (orderInProgress || orderPlaced) return; // ignore repeated clicks
    orderInProgress = true;
    nextButton.disabled = true;
    orderError.hidden = true;

    try {
      const problemStep = findIncompleteStep();
      if (problemStep) {
        showStep(problemStep, true);
        if (problemStep === 1) validateStepOne();
        if (problemStep === 2) validatePreferences();
        if (problemStep === 3) validateCustomerStep();
        return;
      }

      const order = buildOrder();
      // Save FIRST. Nothing else (like future email) may happen before this.
      if (!saveOrder(order)) {
        orderError.textContent =
          "We couldn't save your demo order in this browser. Storage may be blocked or full. Please try again.";
        orderError.hidden = false;
        return;
      }
      orderPlaced = true;
      clearDraft(); // the draft is finished with, so remove it

      // TODO: FUTURE PHASE — EMAIL INTEGRATION
      // Integrate an approved email service (e.g. EmailJS).
      // Send a business-owner order notification.
      // Send a customer order confirmation.
      // Track notification success/failure separately from order creation.
      // Never allow email failure to erase or duplicate a saved order.
      // Do not add email credentials or templates in this build.

      // Put the order ID in the address, so refreshing shows the confirmation
      try { history.replaceState(null, "", "?order=" + encodeURIComponent(order.orderId)); } catch (err) { /* fine */ }
      renderConfirmation(order);
      showStep(5, true);
    } finally {
      orderInProgress = false;
      nextButton.disabled = false;
    }
  }

  // Shows the confirmation from the SAVED order, so it always matches it.
  function renderConfirmation(order) {
    document.getElementById("confirm-order-id").textContent = order.orderId;
    document.getElementById("confirm-status").textContent = order.status;
    document.getElementById("confirm-payment").textContent =
      order.payment && order.payment.type === "Demo" && order.payment.paid === false
        ? "Demo only. Nothing was charged."
        : "Demo";

    const planNow = getPlanById(order.subscription.id);
    const a = order.customer.shippingAddress || {};
    renderSummary(document.getElementById("confirmation-summary"), {
      planName: order.subscription.name,
      typeText: planNow ? (planNow.category === "wig" ? "Wig" : "Weave") + " \u00b7 " + planNow.hairType : "",
      priceText: planNow ? formatPlanPrice(planNow) : "$" + order.subscription.price + " " + order.subscription.frequency,
      prefs: order.preferences || {},
      customer: {
        firstName: order.customer.firstName, lastName: order.customer.lastName,
        email: order.customer.email, phone: order.customer.phone,
        street: a.street || "", apartment: a.apartment || "", city: a.city || "",
        state: a.state || "", zip: a.zip || "",
        consentOrderEmail: !!(order.consent && order.consent.orderEmail),
        consentMarketing: !!(order.consent && order.consent.marketing),
      },
    }, false);

    // Show the plan bar for the confirmed order
    checkoutState.plan = planNow || checkoutState.plan;
    renderPlanBar();
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

    if (step === 2) renderPreferences();
    if (step === 4) renderReview();

    backButton.hidden = step === 1;
    // Step 4 places the demo order, so its button says exactly that
    nextButton.textContent = step === 4 ? "Complete Demo Order" : "Next";
    nextButton.hidden = step === TOTAL_STEPS;
    if (step === TOTAL_STEPS) backButton.hidden = true;

    renderProgress();
    saveDraftNow();

    if (moveFocus) {
      // Move focus to the step heading so keyboard and screen reader users know the step changed
      const heading = document.querySelector("#step-" + step + " .step-title");
      if (heading) heading.focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }
  }

  // ---------- Buttons ----------
  nextButton.addEventListener("click", () => {
    // Each step checks its own answers before letting the customer continue.
    if (checkoutState.step === 1 && !validateStepOne()) return;
    if (checkoutState.step === 2 && !validatePreferences()) return;
    if (checkoutState.step === 3 && !validateCustomerStep()) return;
    if (checkoutState.step === 4) { placeDemoOrder(); return; }
    if (checkoutState.step < TOTAL_STEPS) showStep(checkoutState.step + 1, true);
  });

  backButton.addEventListener("click", () => {
    if (checkoutState.step > 1) showStep(checkoutState.step - 1, true);
  });

  // ---------- Footer year ----------
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  renderPlanCards();
  setupCustomerForm();
  renderPlanBar();

  // Coming back to ?order=ID (for example after a refresh) shows that saved order
  const orderIdInUrl = new URLSearchParams(window.location.search).get("order");
  const savedOrder = orderIdInUrl ? getOrderById(orderIdInUrl) : null;
  if (savedOrder) {
    orderPlaced = true; // this checkout is finished; start a new one from the link
    renderConfirmation(savedOrder);
    showStep(5, false);
  } else {
    if (orderIdInUrl) {
      planNotice.textContent = "We couldn't find that demo order in this browser. You can start a new one below.";
      planNotice.hidden = false;
    }
    // Return to the step the customer was on, but only for the same plan
    const sameDraftPlan = checkoutState.plan && restoredDraft.planId === checkoutState.plan.id;
    showStep(sameDraftPlan ? restoredDraft.step : 1, false);
  }

  // Save the draft after any typing or choosing (these run after the
  // fields' own handlers have updated checkoutState)
  document.addEventListener("input", saveDraftNow);
  document.addEventListener("change", saveDraftNow);

  // "Clear saved answers" gives the customer a clean start
  const clearButton = document.getElementById("clear-draft-button");
  if (clearButton) {
    clearButton.addEventListener("click", () => {
      draftReady = false; // stop anything saving again
      clearDraft();
      window.location.href = "checkout.html";
    });
  }
  draftReady = true;
});
