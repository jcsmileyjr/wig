ChatGPT link: https://chatgpt.com/share/6ae8b981-741c-83ea-b98d-e9c5db00472f 
Claude (started, but finished on ChatGPT): https://claude.ai/share/9d8cd20a-435e-4ea9-a6d8-99b957f50ba4 

She Blew My Money — Final Implementation Blueprint
Architecture proposed
 Ready for design approval


Based on your three decisions, I recommend building a complete simulated subscription-commerce experience, not just an order form.

The project will have three connected parts:
1. Customer storefront: Customers explore subscription plans and start an order.
2. Guided checkout: Customers select their hair preferences, enter their information, review their order, and complete a simulated purchase.
3. Business admin dashboard: The owner can view orders, customer information, subscription selections, and order statuses.
Both customer and business emails will be supported through EmailJS.

The entire application will use vanilla HTML, CSS, and JavaScript and remain deployable through GitHub Pages.
1. Final technology architecture
She Blew My Money
Customer-facing website

Existing GitHub Pages website


Guided Checkout
Five screens

Admin Dashboard
Order management



JavaScript application logic

Validation · Pricing · Order creation · Status updates

localStorage
Demo order storage

EmailJS
Email notifications


All application functionality runs in the browser. EmailJS is the external email service.
Technology decisions
Technology	Responsibility
HTML5	Page structure and forms
CSS3	Branding, layout, responsive design
Vanilla JavaScript	Application functionality
localStorage	Demo orders and preferences
EmailJS	Customer and business emails
GitHub Pages	Website hosting

Important architectural limitation: localStorage only stores information in the browser that created the order. An admin dashboard on another device will not automatically see those orders. Email notifications can reach the business owner, but they aren't a shared order database.

For this class project, that's acceptable if we clearly label the dashboard as a local demonstration. A real multi-device business would eventually need a backend and shared database.

2. Customer experience: five-screen checkout
The checkout should be designed mobile-first. A customer should be able to complete an order without needing technical knowledge or understanding hair-industry terminology.
Screen 1 — Choose your subscription
Business conversion screen




















9










Purpose: Help the customer choose the subscription that matches their needs.

Display five large product cards:
Subscription	Price	Customer-friendly description
Everyday Synthetic Box	$40/month	A new synthetic wig to keep
Luxury Wig	$110/month	Premium human-hair wig swap
Luxury Swap	$200/month	Two premium wigs per month
Synthetic Weave Box	$40/month	Four synthetic hair packs
Complete Install Box	$350/90 days	Bundles, closure and frontal

Each card should include:
- Product image.
- Subscription name.
- Price and billing frequency.
- One-sentence explanation.
- What's included.
- Select Plan button.
Important functionality: When the customer arrives from an existing plan's Start My Subscription button, JavaScript should automatically select that plan.

No need to make customers select it twice.
Screen 2 — Hair preferences and product selection
Conditional form logic
This is where the experience becomes more intelligent.

The form changes depending on the selected subscription.

For wig customers:




















4










Question	Options
Cap size	Small / Medium / Large / Not Sure
Hair texture	Straight / Body Wave / Deep Wave / Curly
Length	10–24 inches
Color	Natural Black / 1B / Brown / Other
Style preference	Everyday / Glamorous / Professional

For weave customers:




















4










Question	Options
Texture	Straight / Body Wave / Deep Wave / Curly
Length	10–24 inches
Color	Natural Black / 1B / Brown / Other
Installation preference	Closure / Frontal / Not Sure

Use visual selection cards instead of requiring customers to understand technical product names.

Include a small "What's this?" explanation wherever necessary.

Important: Not Sure must always be a valid selection. We don't want customers abandoning checkout because they don't know their measurements.
Screen 3 — Customer information
Purpose: Collect the information needed to create a simulated customer order.

Fields:
- First name
- Last name
- Email address
- Phone number
- Street address
- Apartment/unit (optional)
- City
- State
- ZIP code
- Age confirmation
For customers under 18, provide a parent/guardian branch for the demonstration.

UX requirements:
- Large input fields.
- Clearly labeled fields.
- Inline validation.
- Automatically formatted phone numbers.
- ZIP code validation.
- No unnecessary questions.
We should also include a checkbox for email updates and a separate checkbox for optional marketing communications.
Screen 4 — Review your order
Pre-checkout confirmation
This screen should summarize the customer's decisions.
Review your order









Everyday Synthetic Box
$40/month
Illustrative order


Your preferences
Texture

Body Wave

Length

20 inches

Cap size

Medium


Customer information

Example customer · Memphis, TN

Subscription total
$40

No actual payment will be collected. This is a simulated order.
Allow customers to edit their information or go back to change their preferences.

Before proceeding, display the important subscription terms:
- What the customer keeps.
- What must be returned.
- Billing frequency.
- Return expectations.
- Late or damage fee policies, if applicable.
These policies need to be defined by the business rather than invented by the application.
Screen 5 — Simulated checkout and order confirmation
This is where we simulate the actual purchase.

The customer sees:

Your order is ready!
- Selected subscription.
- Order total.
- Billing frequency.
- Customer information.
- Demo checkout disclosure.
The main button:
Complete Your Order
This is a demonstration checkout. No payment information is required.
Complete Demo OrderIllustrative button — not an active checkout.
When clicked, JavaScript should:
1. Validate the completed order.
2. Generate a unique order ID.
3. Set the order status to Pending.
4. Save the order to localStorage.
5. Trigger the business notification email.
6. Trigger the customer confirmation email.
7. Display the confirmation screen.
The confirmation page should display:
- Order number.
- Customer name.
- Subscription purchased.
- Order status.
- Confirmation message.
- What happens next.
Email failures should not erase the order. The dashboard should still retain the locally saved demo order.

3. Business owner experience: Admin dashboard
This is the feature that takes the project beyond a simple customer form.

The owner needs a place to manage incoming orders.

I'd create a separate page:

/admin.html







dribbble.com


Dashboard overview
At the top, display four summary cards:
Total orders24
Demo metric

Pending orders8
Awaiting processing

Active subscriptions12
Demo metric

Demo order value$2,450
Illustrative total


These figures are example dashboard data, not actual sales.
Order management table
Order	Customer	Subscription	Status
#SBM1001	Jane Smith	Luxury Wig	Pending
#SBM1002	Lisa Brown	Synthetic Box	Processing
#SBM1003	Mary Jones	Luxury Swap	Shipped
#SBM1004	Tina Davis	Weave Box	Completed

Each order should have a View Order button.
Individual order details
When the owner opens an order, display:
- Order number.
- Customer contact information.
- Shipping address.
- Subscription selected.
- Hair preferences.
- Order date.
- Order total.
- Email notification status.
- Current order status.
Admin functionality
I recommend implementing these features:
Feature	Functionality
Search	Search by customer or order number
Filter	Filter by order status
View	Open full order details
Update	Change order status
Delete	Remove demonstration orders
Export	Download orders as CSV
Reset	Clear demo orders

Order statuses:
- Pending
- Processing
- Shipped
- Completed
- Cancelled
Changing an order's status should immediately update the dashboard and saved order record.

Important: The admin dashboard is a demonstration interface, not a secure business management system. Without a backend, browser storage is not shared across devices and a client-side admin page cannot provide real access control. We should use fictional customer data for public demonstrations.

4. Email architecture
Since you've selected both customer and business notifications, I recommend two separate EmailJS templates.
Email 1: Business notification

Automatic

Subject: New Demo Order Received — #SBM1001

The business owner receives:
- Customer name.
- Customer email.
- Order number.
- Subscription plan.
- Product preferences.
- Order total.
- Shipping information.
  
  Email 2: Customer confirmation
  
  Automatic
  
  Subject: Your She Blew My Money Order Confirmation!
The customer receives:
- Thank-you message.
- Order number.
- Subscription selected.
- Order summary.
- What happens next.
- Contact information.
  Both emails should identify the transaction as a demonstration order, not a real purchase.

EmailJS setup
We will need:
1. EmailJS account.
2. Email service connection.
3. Business notification template.
4. Customer confirmation template.
5. Public key and template configuration.
We should also test what happens when one or both emails fail. The order should remain saved, and the dashboard should indicate the email delivery status is unknown or failed.

5. Recommended project file structure
I'd organize the project so that students can understand how the pieces connect.
wig/
│
├── index.html
├── checkout.html
├── confirmation.html
├── admin.html
│
├── css/
│   ├── style.css
│   ├── checkout.css
│   └── admin.css
│
├── js/
│   ├── products.js
│   ├── checkout.js
│   ├── validation.js
│   ├── storage.js
│   ├── email.js
│   └── admin.js
│
└── assets/
    ├── images/
    ├── icons/
    └── logo/


What each JavaScript file does
File	Responsibility
products.js	Stores the five subscription plans and pricing
checkout.js	Controls checkout navigation and selections
validation.js	Validates customer input
storage.js	Saves and retrieves orders
email.js	Handles EmailJS notifications
admin.js	Handles dashboard functionality

This separation is intentional. It demonstrates modular JavaScript without introducing frameworks.
6. Order data structure
Every completed demonstration order should follow the same structure.

For example:
const order = {
  orderId: "SBM1001",
  createdAt: new Date().toISOString(),

  customer: {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    phone: "555-555-5555"
  },

  subscription: {
    id: "everyday-synthetic",
    name: "Everyday Synthetic Box",
    price: 40,
    frequency: "monthly"
  },

  preferences: {
    texture: "Body Wave",
    length: "20 inches",
    capSize: "Medium",
    color: "1B"
  },

  status: "Pending",

  payment: {
    type: "Demo",
    paid: false
  },

  emailStatus: {
    business: "Pending",
    customer: "Pending"
  }
};


This is a fictional example.

One important distinction: we should only store the customer fields needed for the demo. Avoid storing real addresses, sensitive information, payment details, or passwords in localStorage.

7. Implementation roadmap
I would build this in six phases, testing each phase before moving on.
1. Phase 1 — Storefront integration
   - Review existing website.
   - Fix subscription links.
   - Establish product IDs.
   - Pass selected plans into checkout.
   - Preserve existing branding.
   Foundation
2. Phase 2 — Guided checkout
   - Build five screens.
   - Create conditional product questions.
   - Add navigation and progress indicators.
   - Add form validation.
   - Build review screen.
3. Phase 3 — Simulated order processing
   - Generate order IDs.
   - Calculate subscription totals.
   - Save orders in localStorage.
   - Build confirmation page.
   - Handle duplicate submissions.
4. Phase 4 — Email integration
   - Configure EmailJS.
   - Build business email.
   - Build customer email.
   - Test successful and failed delivery.
5. Phase 5 — Admin dashboard
   - Dashboard overview.
   - Order table.
   - Search and filtering.
   - Individual order details.
   - Status updates.
   - CSV export.
6. Phase 6 — Testing and deployment
   - Test all five subscription plans.
   - Test mobile and desktop.
   - Test form validation.
   - Test email delivery.
   - Test dashboard persistence.
   - Deploy to GitHub Pages.
8. Definition of done
Before calling this project complete, I would require these demonstrations:
Test	Expected result
Select each of five plans	Correct plan appears in checkout
Change subscription	Product questions update
Leave required fields empty	Clear validation messages
Go backward in checkout	Previous answers remain
Complete an order	Unique order number generated
Complete another order	Both orders are retained
Check business email	New order notification received
Check customer email	Correct order confirmation received
Open admin dashboard	Saved orders appear
Update order status	New status persists
Export CSV	Download contains order records
Refresh website	Saved demo orders remain


9. Final decisions and scope
Here is the implementation scope I would lock in before coding.
Area	Final decision
Frontend	HTML, CSS, JavaScript
Framework	None
Hosting	GitHub Pages
Checkout	Five-screen guided experience
Payment	Simulated; no card collection
Products	Existing five subscription plans
Customer data	Demo-only localStorage
Email	EmailJS, two templates
Dashboard	Separate admin page
Order management	Search, filter, view, update, delete
Reporting	CSV export
Backend	None
Database	None

One feature I would deliberately postpone: customer login and account management. They introduce complexity without improving the core class demonstration. We can simulate customer order confirmation without building authentication.
My final recommendation
I would approach this as a miniature e-commerce application.

The customer should feel like they're ordering from an actual wig subscription company. The business owner should feel like they have an actual order management system.

And from a development perspective, students should be able to see how HTML, CSS, and JavaScript work together to create an application with multiple pages, shared data, conditional logic, and external integrations.

I would approve this architecture and move to visual design approval before writing code.