# She Blew My Money --- Claude Code Build Instructions

**Project:** She Blew My Money \| Weave & Wig Subscription\
**Existing deployment:** https://jcsmileyjr.github.io/wig/\
**Target environment:** GitHub Pages\
**Implementation stack:** HTML5, CSS3, vanilla JavaScript\
**Document purpose:** Phased implementation plan for Claude Code\
**Scope:** Customer-facing subscription checkout only. Email integration
and the admin dashboard are deferred.

------------------------------------------------------------------------

## 1. Project objective

Extend the existing She Blew My Money website with a polished,
mobile-first, five-screen guided subscription checkout.

The result should feel like a credible, easy-to-use online wig and weave
subscription experience, while remaining a class demonstration built
with basic web technologies.

The checkout must simulate order placement. It must **not** collect
payment-card details, process payments, or imply that a real payment
occurred.

The existing storefront is the starting point. Inspect it before
changing anything, preserve working features and brand content, and
integrate checkout with the existing subscription plan links.

## 2. Approved decisions and scope

### Approved visual direction

The visual direction is approved and should be treated as locked unless
implementation reveals a genuine usability or accessibility problem.

  Design element      Approved direction
  ------------------- -------------------------------------------------
  Overall aesthetic   Premium, feminine beauty-commerce experience
  Primary color       Burgundy `#650D20`
  Accent color        Champagne gold `#D8B56D`
  Background          Warm cream `#FFF4E9`
  Text                Charcoal `#292020`
  Imagery             High-quality wig and weave product photography
  Components          Rounded cards, subtle shadows, generous spacing
  Buttons             Burgundy, high contrast, clear text labels
  Layout              Mobile-first and responsive

Use the approved visual concept as a design reference: five distinct
checkout steps, clear progress, visual product choices, a review step,
and a polished confirmation screen. Do not copy illustrative sample
customer data, sample order totals, or invented policy language from the
mockup.

### Approved customer journey

1.  Choose your subscription.
2.  Hair preferences.
3.  Customer information.
4.  Review your order.
5.  Simulated order confirmation.

### Technology constraints

-   HTML5, CSS3, and vanilla JavaScript only.
-   No React, Vue, Angular, Svelte, jQuery, Node.js, build system, or
    frontend framework.
-   The project must remain deployable as a static site on GitHub Pages.
-   Use browser `localStorage` for demonstration order data and checkout
    state where appropriate.
-   External services may be considered later, but do not add them in
    this scope.
-   Do not add a database or backend.

### Explicitly deferred

Do **not** implement these features in this build:

-   EmailJS or any other email integration.
-   Customer email notifications.
-   Business-owner email notifications.
-   Admin dashboard or order-management interface.
-   Real payment processing, wallet payments, card forms, or
    payment-provider SDKs.
-   Customer accounts, login, passwords, or authentication.

Add clearly labelled TODO comments and sensible integration points for
future email and admin-dashboard work. Do not build incomplete screens
or nonfunctional buttons for these deferred features.

## 3. Existing business plans

Inspect the existing website and source code to verify the current plan
names, prices, descriptions, and links. The following are the plan
details established during planning; if the live source differs, report
the discrepancy before changing business content.

  -------------------------------------------------------------------------
  Plan                             Price Frequency        Customer-facing
                                                          summary
  ---------------- --------------------- ---------------- -----------------
  Everyday                          \$40 Monthly          One synthetic
  Synthetic Box                                           wig; customer
                                                          keeps it

  Luxury Wig                       \$110 Monthly          One human-hair
                                                          wig;
                                                          swap-and-return
                                                          model

  Luxury Swap                      \$200 Monthly          Two human-hair
                                                          wigs per month

  Synthetic Weave                   \$40 Monthly          Four synthetic
  Box                                                     hair packs;
                                                          customer keeps
                                                          them

  Complete Install                 \$350 Every 90 days    Bundles, closure,
  Box                                                     and frontal
  -------------------------------------------------------------------------

Represent plans as structured JavaScript data with stable IDs. Do not
use displayed plan names as the only identifiers.

**Business-rule caution:** Do not invent or infer exact return
deadlines, deposit requirements, late fees, damage fees, shipping
charges, taxes, cancellation rules, or refund policies. If checkout
requires a policy decision that is not established in the existing site,
use a clearly marked TODO and report the missing decision. Do not
present placeholder terms as actual business policy.

------------------------------------------------------------------------

# 4. Required working method for Claude Code

## Inspect before editing

Before making code changes:

1.  Inspect the repository structure and identify the current entry
    page, stylesheets, scripts, assets, and existing navigation.
2.  Read the existing HTML, CSS, and JavaScript relevant to the
    storefront and subscription links.
3.  Check how the current GitHub Pages paths are structured. The project
    is hosted under `/wig/`, not necessarily at the domain root.
4.  Identify existing functionality that must be preserved.
5.  Verify the actual plan names, prices, descriptions, images, and
    current subscription links.
6.  Report the proposed file changes and any conflicts between the
    current website and this specification.

Do not replace the existing site with a new template. Do not delete or
rename existing files without a clear reason and an explanation.

## Work phase by phase

-   Implement only the current phase.
-   Run the phase's tests before moving forward.
-   Report files changed, tests performed, results, known issues, and
    any decisions needed.
-   Stop at the end of each phase and wait for approval before starting
    the next phase.
-   Do not silently skip a failed test.
-   Do not claim a test passed unless it was actually performed.
-   Keep changes small and understandable for learners studying HTML,
    CSS, and JavaScript.

## Code quality

-   Use semantic HTML and accessible labels.
-   Use descriptive class names and function names.
-   Keep data, presentation, and behavior reasonably separated.
-   Avoid unnecessary abstractions and overengineering.
-   Add comments for important logic and future integration points.
-   Avoid inline JavaScript event handlers; use `addEventListener`.
-   Validate user input in JavaScript.
-   Never use `eval`.
-   Do not put secrets, private keys, or credentials in frontend code.
-   Do not store payment details or passwords.
-   Handle missing, malformed, or unavailable localStorage data
    gracefully.
-   Keep the browser console free of avoidable errors and warnings.

------------------------------------------------------------------------

# 5. Phased implementation plan

## Phase 0 --- Repository inspection and implementation plan

**Goal:** Understand the existing site and produce a safe plan before
editing.

### Tasks

-   Inspect all relevant project files.
-   Identify current page structure, styles, scripts, assets, and
    subscription links.
-   Verify the existing five subscription plans against the source.
-   Identify whether each plan currently has a working call-to-action.
-   Check responsive behavior of the existing storefront.
-   Identify the best way to pass a selected plan into checkout,
    preferably through a URL query parameter such as
    `checkout.html?plan=everyday-synthetic`.
-   Propose the smallest set of changes needed to integrate checkout.
-   Identify any missing business decisions or unavailable assets.

### Do not

-   Make code changes during this phase.
-   Redesign the storefront.
-   Invent business policies or product details.

### Acceptance criteria

-   [ ] Existing project structure is documented.
-   [ ] Existing plan data and links are verified.
-   [ ] Existing functionality to preserve is identified.
-   [ ] Proposed checkout integration is explained.
-   [ ] Proposed files to add or modify are listed.
-   [ ] Questions or conflicts are reported.

**Stop and request approval before Phase 1.**

------------------------------------------------------------------------

## Phase 1 --- Storefront integration and plan selection

**Goal:** Connect the existing storefront to the new checkout without
disrupting the current site.

### Tasks

1.  Preserve the current storefront design and working content.
2.  Create or update a centralized plan data module, for example
    `js/products.js`.
3.  Give each plan a stable ID:
    -   `everyday-synthetic`
    -   `luxury-wig`
    -   `luxury-swap`
    -   `synthetic-weave`
    -   `complete-install`
4.  Update each existing subscription call-to-action to open checkout
    with the correct plan ID.
5.  Ensure checkout can read the plan ID from the URL.
6.  Handle missing or invalid plan IDs with a friendly plan-selection
    state rather than a broken page.
7.  Keep prices and plan descriptions consistent between the storefront
    and checkout by using one source of truth where practical.

### Suggested URL pattern

``` text
checkout.html?plan=everyday-synthetic
checkout.html?plan=luxury-wig
checkout.html?plan=luxury-swap
checkout.html?plan=synthetic-weave
checkout.html?plan=complete-install
```

### Acceptance criteria

-   [ ] All five storefront calls to action open checkout.
-   [ ] Each call to action preselects the correct plan.
-   [ ] The selected plan name and price are correct.
-   [ ] An invalid plan ID is handled gracefully.
-   [ ] Existing storefront navigation and content still work.
-   [ ] No unrelated storefront redesign has occurred.
-   [ ] Site paths work when deployed under the `/wig/` GitHub Pages
    project path.

**Test before proceeding:** Click each of the five plan buttons and
verify the correct plan is selected in checkout.

**Stop and report results for approval.**

------------------------------------------------------------------------

## Phase 2 --- Checkout foundation and visual system

**Goal:** Build the checkout shell and reusable visual components before
adding all form logic.

### Tasks

Create the checkout page and its shared visual structure.

Recommended files, adjusted to fit the existing repository:

``` text
checkout.html
css/checkout.css
js/checkout.js
js/products.js
```

Do not duplicate existing shared styles unnecessarily. Reuse existing
files when that is cleaner.

### Visual requirements

-   Use the approved burgundy, champagne gold, cream, and charcoal
    palette.
-   Match the existing brand identity.
-   Create a clear checkout header with the brand.
-   Show a five-step progress indicator.
-   Use large, readable headings and form controls.
-   Use clear Back and Next buttons.
-   Keep the layout mobile-first.
-   Use visible focus states and sufficient color contrast.
-   Do not rely on color alone to communicate progress or errors.
-   Do not auto-advance when a customer makes a selection.
-   Preserve customer answers when navigating backward and forward.

### Acceptance criteria

-   [ ] Checkout loads directly and from the storefront.
-   [ ] The selected plan is visible.
-   [ ] Five-step progress is displayed clearly.
-   [ ] Back and Next navigation works between placeholder steps.
-   [ ] The layout works on narrow mobile screens and desktop.
-   [ ] Buttons and controls have visible keyboard focus.
-   [ ] No horizontal overflow on common mobile widths.
-   [ ] Existing storefront styling is not unintentionally broken.

**Test before proceeding:** Open checkout at mobile and desktop viewport
sizes and navigate all five placeholder steps.

**Stop and report results for approval.**

------------------------------------------------------------------------

## Phase 3 --- Screen 1: Choose your subscription

**Goal:** Let customers understand and select one of the five
subscription plans.

### Requirements

Display all five plans as clear cards containing:

-   Product image or approved product imagery.
-   Plan name.
-   Price.
-   Billing frequency.
-   Plain-language description.
-   What is included, where verified.
-   A clearly labelled Select Plan control.

If the customer arrived from a storefront plan button, preselect that
plan and visibly show the selection. The customer may change it.

Include a simple "Help me choose" explanation if it can be done without
creating an unnecessary quiz. Explain the difference between a wig and a
weave in plain language:

-   A wig is worn over the head and can be put on and removed.
-   A weave is hair installed into the customer's natural hair, usually
    by a stylist.

Avoid unexplained industry terms. If terms such as closure or frontal
appear, provide a short explanation or help text.

### Acceptance criteria

-   [ ] All five plans appear.
-   [ ] Plan names, prices, and frequencies match the verified source
    data.
-   [ ] Selecting a card produces a clear selected state.
-   [ ] Only one plan can be selected.
-   [ ] A preselected plan from the URL is shown correctly.
-   [ ] The customer cannot continue without selecting a plan.
-   [ ] The selected plan persists when moving between steps.

**Test before proceeding:** Select each plan and verify that the correct
plan remains selected through navigation.

**Stop and report results for approval.**

------------------------------------------------------------------------

## Phase 4 --- Screen 2: Hair preferences

**Goal:** Ask only the questions relevant to the selected subscription
and make product choices understandable to customers who are unfamiliar
with hair products.

### Conditional behavior

The form must change according to the selected plan.

#### Wig plans

Potential fields:

-   Cap size: Small, Medium, Large, Not Sure.
-   Texture: Straight, Body Wave, Deep Wave, Curly.
-   Length: use the lengths supported by the existing business/product
    catalog.
-   Color: only use verified or approved options.
-   Optional style preference, if useful.

#### Weave plans

Potential fields:

-   Texture: Straight, Body Wave, Deep Wave, Curly.
-   Length: use lengths supported by the existing business/product
    catalog.
-   Color: only use verified or approved options.
-   Installation-related choices only where the selected plan actually
    includes or requires them.

Use visual cards with representative images for texture choices when
suitable images are available. Include readable text labels so the
selection does not depend on the image alone.

### Important rules

-   "Not Sure" should be available for cap size.
-   Do not force a customer to understand technical hair terminology.
-   Do not show wig-only questions for weave plans or weave-only
    questions for wig plans.
-   Do not invent inventory, colors, lengths, or product combinations.
-   If an option needs business confirmation, mark it as a TODO and
    report it.

### Acceptance criteria

-   [ ] Wig plans display wig-specific questions.
-   [ ] Weave plans display weave-specific questions.
-   [ ] Switching plans updates the visible questions.
-   [ ] Previous answers are retained when navigating backward and
    forward.
-   [ ] Required selections are validated.
-   [ ] "Not Sure" is accepted for cap size.
-   [ ] Visual choices have text labels and accessible names.
-   [ ] No unsupported product options are presented as guaranteed
    inventory.

**Test before proceeding:** Test at least one wig plan and one weave
plan. Switch between plan types and confirm the questions update
correctly.

**Stop and report results for approval.**

------------------------------------------------------------------------

## Phase 5 --- Screen 3: Customer information and validation

**Goal:** Collect the minimum information needed for a simulated order.

### Fields

-   First name --- required.
-   Last name --- required.
-   Email address --- required.
-   Phone number --- required if confirmed as a business requirement;
    otherwise optional.
-   Street address --- required if shipping is part of the selected
    plan.
-   Apartment/unit --- optional.
-   City --- required when shipping address is collected.
-   State --- required when shipping address is collected.
-   ZIP code --- required when shipping address is collected.
-   Age confirmation --- include only with approved wording and a
    defined business requirement.

Do not add a parent/guardian data collection flow unless the business
owner confirms the legal and operational requirements. Do not collect
unnecessary personal information.

### UX and validation

-   Use persistent labels, not placeholder-only labels.
-   Mark required fields clearly.
-   Show errors beside the relevant field in plain language.
-   Preserve values when navigating backward.
-   Use appropriate input types and autocomplete attributes.
-   Validate email format and ZIP code sensibly.
-   Do not over-restrict phone number formatting.
-   Do not clear the entire form when one field is invalid.

Include separate, unchecked-by-default consent controls if needed:

-   Order-related email communication.
-   Optional marketing communications.

Do not combine transactional and marketing consent.

### Acceptance criteria

-   [ ] Required fields are identified clearly.
-   [ ] Invalid or missing fields show helpful messages.
-   [ ] Valid information allows the customer to continue.
-   [ ] Values remain when navigating backward.
-   [ ] Marketing consent is optional and separate.
-   [ ] No payment-card or password fields exist.
-   [ ] No unnecessary personal data is collected.

**Test before proceeding:** Submit empty fields, malformed email, and
incomplete address data; verify clear field-level errors. Then submit
valid fictional customer information.

**Stop and report results for approval.**

------------------------------------------------------------------------

## Phase 6 --- Screen 4: Review order

**Goal:** Give customers a clear opportunity to verify their order
before placing the simulated order.

### Display

-   Selected subscription name.
-   Price and billing frequency.
-   Relevant hair preferences.
-   Customer name and contact information.
-   Shipping address, if collected.
-   Any verified shipping or other charges.
-   Clear indication that this is a demonstration and no payment will be
    collected.

Provide Edit or Back controls so customers can correct their
information.

### Business policy requirements

Display only terms that have been confirmed by the business owner and
verified in the existing website. Do not invent:

-   Return windows.
-   Deposit or authorization rules.
-   Damage or late fees.
-   Cancellation terms.
-   Refund terms.
-   Shipping charges or tax treatment.

If any of these are required but unavailable, add a TODO and report the
decision needed. Do not block the demo with invented legal language.

### Acceptance criteria

-   [ ] All selected plan details are accurate.
-   [ ] All selected preferences are accurate.
-   [ ] Customer details are accurate.
-   [ ] Price and billing frequency are clearly shown.
-   [ ] Edit/back navigation works.
-   [ ] The no-payment demonstration notice is visible.
-   [ ] No unapproved business policies are displayed.

**Test before proceeding:** Change a plan, preference, and customer
field; verify the review screen reflects the latest values.

**Stop and report results for approval.**

------------------------------------------------------------------------

## Phase 7 --- Screen 5: Simulated order placement and confirmation

**Goal:** Complete a realistic demonstration order without collecting
payment.

### Main action

Use a clear button label such as:

**Complete Demo Order**

Do not use "Pay Now," "Charge My Card," or language that implies an
actual payment.

### Order creation behavior

When the customer activates the button:

1.  Validate that required checkout data is complete.
2.  Prevent accidental duplicate submissions.
3.  Generate a unique demonstration order ID.
4.  Create an order record.
5.  Set the order status to `Pending`.
6.  Mark payment as `Demo` and `paid: false`.
7.  Save the order to localStorage.
8.  Display the confirmation screen.

The order should be saved before any future external notification
integration is attempted.

### Suggested order data structure

Adapt this structure to the actual verified fields and keep it
consistent across the application:

``` javascript
const order = {
  orderId: "SBM-DEMO-UNIQUE-ID",
  createdAt: new Date().toISOString(),

  customer: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    shippingAddress: {}
  },

  subscription: {
    id: "",
    name: "",
    price: 0,
    frequency: ""
  },

  preferences: {},

  status: "Pending",

  payment: {
    type: "Demo",
    paid: false
  },

  notifications: {
    businessEmail: "not-configured",
    customerEmail: "not-configured"
  }
};
```

Do not store payment credentials, passwords, or sensitive personal data.

### Confirmation screen

Show:

-   Confirmation heading.
-   Unique order ID.
-   Selected subscription.
-   Order summary.
-   Demonstration status.
-   Plain-language explanation that no payment was processed.

Do not promise shipment dates or real fulfillment. Any sample
fulfillment language must be clearly illustrative or based on verified
business information.

### Acceptance criteria

-   [ ] Completing a valid demo order generates an order ID.
-   [ ] The order is saved to localStorage.
-   [ ] The order status is `Pending`.
-   [ ] Payment is marked as demo and unpaid.
-   [ ] Repeated clicks do not create duplicate orders.
-   [ ] Confirmation details match the order.
-   [ ] No real payment is requested or processed.
-   [ ] A refresh does not erase the saved order.

**Test before proceeding:** Complete two separate fictional orders and
verify that each has a distinct ID and both remain saved.

**Stop and report results for approval.**

------------------------------------------------------------------------

## Phase 8 --- Persistence, recovery, and end-to-end testing

**Goal:** Make the demo reliable across navigation and page refreshes.

### Storage requirements

Create a small storage module, for example `js/storage.js`, responsible
for:

-   Saving an order.
-   Retrieving saved orders.
-   Retrieving an order by ID.
-   Saving and restoring in-progress checkout data where appropriate.
-   Clearing an individual checkout draft after successful completion.
-   Handling malformed or unavailable localStorage data gracefully.

Use a namespaced storage key, for example:

``` text
sheBlewMyMoney.demoOrders
sheBlewMyMoney.checkoutDraft
```

Do not store more customer information than necessary. Make clear in the
interface or project documentation that localStorage is browser-specific
and is not a secure or shared database.

### End-to-end test scenarios

-   [ ] Start checkout from each of the five storefront plans.
-   [ ] Complete a wig order.
-   [ ] Complete a weave order.
-   [ ] Navigate backward and forward without losing selections.
-   [ ] Refresh during checkout and verify the intended draft behavior.
-   [ ] Complete an order and refresh the confirmation page.
-   [ ] Complete multiple orders and verify they are retained.
-   [ ] Test invalid or missing URL plan IDs.
-   [ ] Test empty and malformed stored data.
-   [ ] Test narrow mobile, tablet, and desktop layouts.
-   [ ] Verify there are no avoidable JavaScript console errors.
-   [ ] Verify all local asset paths work on GitHub Pages under `/wig/`.

### Completion criteria

-   [ ] All five subscription paths work.
-   [ ] All checkout screens work.
-   [ ] Form validation works.
-   [ ] Demo orders persist in the browser.
-   [ ] Confirmation information is accurate.
-   [ ] Mobile and desktop layouts are usable.
-   [ ] Existing storefront functionality remains intact.
-   [ ] No real payment or email integration has been introduced.

**Stop and provide a final test report before considering the current
scope complete.**

------------------------------------------------------------------------

# 6. Future integration TODOs --- do not implement now

Add these TODOs in the relevant source files and document them in a
short project README or implementation note.

## Future TODO A --- Email integration

Suggested location: order creation / post-order confirmation module.

``` javascript
// TODO: FUTURE PHASE — EMAIL INTEGRATION
// Integrate an approved email service (e.g. EmailJS).
// Send a business-owner order notification.
// Send a customer order confirmation.
// Track notification success/failure separately from order creation.
// Never allow email failure to erase or duplicate a saved order.
// Do not add email credentials or templates in this build.
```

Future email requirements:

-   Business-owner notification.
-   Customer confirmation.
-   Separate templates.
-   Clear demonstration wording.
-   Failure handling.
-   Separate notification status from order status.

## Future TODO B --- Admin dashboard

Suggested location: storage module and order data model.

``` javascript
// TODO: FUTURE PHASE — ADMIN DASHBOARD
// Build a separate order-management interface.
// Display saved orders, customer details, plan selections, and status.
// Add search, filtering, order details, status updates, and CSV export.
// Current localStorage data is browser-specific and is not shared
// across devices. A real multi-user dashboard will require a backend
// and shared database, plus proper authentication and authorization.
```

Future dashboard requirements:

-   Summary metrics.
-   Searchable order table.
-   Status filters.
-   Order details.
-   Status updates.
-   CSV export.
-   Appropriate authentication and shared persistence when moved beyond
    the local demo.

**Do not create `admin.html` or dashboard UI during this build.**

------------------------------------------------------------------------

# 7. Suggested final project structure

Adapt this to the existing repository rather than forcing a restructure:

``` text
wig/
│
├── index.html
├── checkout.html
├── confirmation.html
│
├── css/
│   ├── style.css
│   └── checkout.css
│
├── js/
│   ├── products.js
│   ├── checkout.js
│   ├── validation.js
│   └── storage.js
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── logo/
│
└── README.md
```

If the existing site already uses a different structure, preserve it
where practical and explain any proposed changes first.

------------------------------------------------------------------------

# 8. Final instructions to Claude Code

Treat this document as the approved build specification.

**Start with Phase 0 only.** Inspect the existing repository and report
your findings, proposed file changes, plan-data discrepancies, and any
missing business decisions. Do not modify code until the Phase 0 report
is reviewed and approved.

After approval, implement one phase at a time. At the end of each phase:

1.  Summarize what was implemented.
2.  List every file created or modified.
3.  List tests actually performed.
4.  Report pass/fail results against the phase acceptance criteria.
5.  Identify unresolved issues or business decisions.
6.  Wait for approval before continuing.

Do not implement the email integration or admin dashboard. Leave the
documented TODO integration points only.

Do not add real payment processing or collect payment-card information.

Preserve the existing website, approved branding, and five-screen
customer experience. The result must remain a straightforward,
understandable HTML/CSS/vanilla JavaScript project that can be hosted on
GitHub Pages.

**The priority is a reliable, testable, polished demonstration---not
unnecessary technical complexity.**
