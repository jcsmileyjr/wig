// ===========================================================
// validation.js: checks for the customer information form.
// These functions only check values and return messages.
// They never touch the page, so they are easy to test.
// ===========================================================

// US states plus DC, for the State drop-down and for validation.
const US_STATES = [
  ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
  ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
  ["DC", "District of Columbia"], ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"],
  ["ID", "Idaho"], ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"],
  ["KS", "Kansas"], ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"],
  ["MD", "Maryland"], ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"],
  ["MS", "Mississippi"], ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"],
  ["NV", "Nevada"], ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"],
  ["NY", "New York"], ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"],
  ["OK", "Oklahoma"], ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"],
  ["SC", "South Carolina"], ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"],
  ["UT", "Utah"], ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"],
  ["WV", "West Virginia"], ["WI", "Wisconsin"], ["WY", "Wyoming"],
];

// Returns an error message for one field, or "" when the value is fine.
function validateCustomerField(field, rawValue) {
  const value = (rawValue || "").trim();

  switch (field) {
    case "firstName":
      return value ? "" : "Please enter your first name.";
    case "lastName":
      return value ? "" : "Please enter your last name.";
    case "email":
      if (!value) return "Please enter your email address.";
      // Something@something.something, with no spaces. Not perfect, but sensible.
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
        ? ""
        : "Please enter a valid email address, like name@example.com.";
    case "phone": {
      if (!value) return "Please enter your phone number.";
      // Allow any common formatting: spaces, dashes, dots, brackets, a leading +
      if (!/^[\d\s().+-]+$/.test(value)) return "Phone numbers can only use digits and ( ) - . + characters.";
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15 ? "" : "Please enter a phone number with 7 to 15 digits.";
    }
    case "street":
      return value ? "" : "Please enter your street address.";
    case "city":
      return value ? "" : "Please enter your city.";
    case "state":
      if (!value) return "Please choose your state.";
      return US_STATES.some(([code]) => code === value) ? "" : "Please choose a state from the list.";
    case "zip":
      if (!value) return "Please enter your ZIP code.";
      return /^\d{5}(-\d{4})?$/.test(value) ? "" : "Please enter a 5-digit ZIP code, like 38103.";
    default:
      return ""; // apartment and the consent boxes are optional
  }
}

const REQUIRED_CUSTOMER_FIELDS = ["firstName", "lastName", "email", "phone", "street", "city", "state", "zip"];

// Checks every required field. Returns an object like { email: "message" }.
// An empty object means everything is valid.
function validateCustomer(customer) {
  const errors = {};
  REQUIRED_CUSTOMER_FIELDS.forEach((field) => {
    const message = validateCustomerField(field, customer[field]);
    if (message) errors[field] = message;
  });
  return errors;
}
