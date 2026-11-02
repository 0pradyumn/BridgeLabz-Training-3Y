/*
 * ASSIGNMENT 4 - CLASSES, FORMS, REGULAR EXPRESSIONS AND OBJECTS
 * Complete combined solutions for Questions 1-9.
 * Q2, Q4, Q5, Q7 and Q8 also build browser forms when document is available.
 */
"use strict";

// Q1 - E-Commerce Product Manager (classes and filtering).
class Product {
  constructor(id, name, price, category) {
    this.id = id; this.name = name; this.price = Number(price); this.category = category;
  }
  applyDiscount(percent) {
    if (!Number.isFinite(percent) || percent < 0 || percent > 100) throw new RangeError("Discount must be from 0 to 100.");
    this.price = Number((this.price * (1 - percent / 100)).toFixed(2));
  }
  displayDetails() { return `#${this.id} | ${this.name} | ${this.category} | Rs. ${this.price.toFixed(2)}`; }
}
const products = [
  new Product(1, "Keyboard", 850, "Accessories"),
  new Product(2, "Monitor", 7200, "Electronics"),
  new Product(3, "Laptop", 58000, "Computers"),
  new Product(4, "Mouse", 450, "Accessories")
];
products[1].applyDiscount(10);
console.log("Q1 all products:"); products.forEach(product => console.log(product.displayDetails()));
console.log("Q1 products priced above Rs. 1000:", products.filter(product => product.price > 1000).map(product => product.displayDetails()));

// Helpers for the browser-only questions. These elements are created by JavaScript.
function createAssignment4Root() {
  if (typeof document === "undefined") return null;
  let root = document.getElementById("assignment-4-browser-demos");
  if (root) return root;
  const style = document.createElement("style");
  style.textContent = `#assignment-4-browser-demos{font:16px/1.5 Arial,sans-serif;max-width:900px;margin:24px auto;padding:16px;color:#202b3d}#assignment-4-browser-demos section{padding:18px;margin:18px 0;border:1px solid #dce2eb;border-radius:12px;background:#fff}#assignment-4-browser-demos label{display:block;margin:9px 0 3px}#assignment-4-browser-demos input{padding:9px;border:2px solid #b9c3d2;border-radius:7px;max-width:100%}#assignment-4-browser-demos button{padding:9px 14px;border:0;border-radius:7px;background:#5666d8;color:white;cursor:pointer;margin-top:10px}#assignment-4-browser-demos .field-error{color:#c62828;display:block;min-height:1.25em}#assignment-4-browser-demos .valid{border-color:#178451}#assignment-4-browser-demos .invalid{border-color:#c62828}#assignment-4-browser-demos .success{color:#178451;font-weight:bold}`;
  document.head.appendChild(style);
  root = document.createElement("main"); root.id = "assignment-4-browser-demos";
  root.innerHTML = "<h1>Assignment 4 - Browser Form Exercises</h1>";
  document.body.appendChild(root); return root;
}
function addFormSection(root, question, title) {
  const section = document.createElement("section"); section.innerHTML = `<h2>Q${question}. ${title}</h2>`; root.appendChild(section); return section;
}

// Q2 - Student Form Validator. Name/Email/Phone/Password each has a RegExp rule.
if (typeof document !== "undefined") {
  const root = createAssignment4Root();
  const section = addFormSection(root, 2, "Student Form Validator");
  const form = document.createElement("form"); form.noValidate = true;
  const rules = [
    { name: "Name", regex: /^[A-Za-z ]+$/, message: "Use alphabetic characters and spaces only." },
    { name: "Email", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter an email such as example@domain.com." },
    { name: "Phone", regex: /^\d{10}$/, message: "Phone must contain exactly 10 digits." },
    { name: "Password", regex: /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, message: "Include one uppercase letter, one number and one special character." }
  ];
  const controls = {};
  rules.forEach(rule => {
    const label = document.createElement("label"); label.textContent = rule.name;
    const input = document.createElement("input"); input.name = rule.name.toLowerCase(); input.type = rule.name === "Password" ? "password" : "text"; input.required = true;
    const error = document.createElement("small"); error.className = "field-error";
    form.append(label, input, error); controls[rule.name] = { input, error, rule };
    input.addEventListener("input", () => validateField(controls[rule.name]));
  });
  function validateField(control) {
    const valid = control.rule.regex.test(control.input.value);
    control.input.classList.toggle("valid", valid); control.input.classList.toggle("invalid", !valid);
    control.error.textContent = valid ? "" : control.rule.message; return valid;
  }
  const submit = document.createElement("button"); submit.textContent = "Validate Registration";
  const result = document.createElement("p"); result.className = "success"; form.append(submit, result);
  form.addEventListener("submit", event => { event.preventDefault(); const allValid = Object.values(controls).map(validateField).every(Boolean); result.textContent = allValid ? "Student details are valid." : "Please correct the highlighted fields."; });
  section.appendChild(form);
}

// Q3 - Library Management System with issue and return methods.
class Book {
  constructor(title, author, isbn, isIssued = false) { this.title = title; this.author = author; this.isbn = String(isbn); this.isIssued = isIssued; }
  issueBook() { if (this.isIssued) return false; this.isIssued = true; return true; }
  returnBook() { if (!this.isIssued) return false; this.isIssued = false; return true; }
}
const library = [
  new Book("The Alchemist", "Paulo Coelho", "ISBN-1001"),
  new Book("Clean Code", "Robert C. Martin", "ISBN-1002"),
  new Book("Atomic Habits", "James Clear", "ISBN-1003", true)
];
console.log("Q3 available books:", library.filter(book => !book.isIssued).map(book => `${book.title} (${book.isbn})`));
const requestedBook = library.find(book => book.isbn === "ISBN-1002");
console.log("Q3 issue by ISBN:", requestedBook ? requestedBook.issueBook() : "Book not found", requestedBook);
if (typeof document !== "undefined") {
  const root = createAssignment4Root();
  const section = addFormSection(root, 3, "Library Search and Issue by ISBN");
  const form = document.createElement("form");
  const isbnInput = document.createElement("input"); isbnInput.placeholder = "Enter book ISBN"; isbnInput.required = true;
  const issueButton = document.createElement("button"); issueButton.textContent = "Search and Issue";
  const libraryOutput = document.createElement("p");
  form.append(isbnInput, issueButton, libraryOutput);
  form.addEventListener("submit", event => {
    event.preventDefault();
    const foundBook = library.find(book => book.isbn.toLowerCase() === isbnInput.value.trim().toLowerCase());
    if (!foundBook) libraryOutput.textContent = "No book found for that ISBN.";
    else if (foundBook.issueBook()) libraryOutput.textContent = `Issued: ${foundBook.title} by ${foundBook.author}.`;
    else libraryOutput.textContent = `${foundBook.title} is already issued.`;
  });
  const availableList = document.createElement("p");
  availableList.textContent = `Available now: ${library.filter(book => !book.isIssued).map(book => book.title).join(", ")}`;
  section.append(form, availableList);
}

// Q4 - Custom Form Builder. `innerHTML` creates the fields from the supplied configuration.
class FormBuilder {
  constructor(fields) { this.fields = fields; }
  render(container) {
    const controlsMarkup = this.fields.map((field, index) => `<label for="builder-field-${index}">${field.label}</label><input id="builder-field-${index}" name="${field.name || `field${index}`}" type="${field.type}" required>`).join("");
    container.innerHTML = `<form class="generated-form">${controlsMarkup}<button type="submit">Submit</button></form><pre class="form-output"></pre>`;
    const form = container.querySelector("form");
    form.addEventListener("submit", event => {
      event.preventDefault(); const data = this.getFormData(form);
      container.querySelector(".form-output").textContent = JSON.stringify(data, null, 2);
    });
  }
  getFormData(form) { return Object.fromEntries(new FormData(form).entries()); }
}
if (typeof document !== "undefined") {
  const root = createAssignment4Root(); const section = addFormSection(root, 4, "Custom Form Builder");
  const mount = document.createElement("div"); section.appendChild(mount);
  new FormBuilder([{ type: "text", label: "Username", name: "username" }, { type: "email", label: "Email", name: "email" }]).render(mount);
}

// Q5 - Movie Ticket Booking: validate fields and save the resulting booking object.
if (typeof document !== "undefined") {
  const root = createAssignment4Root(); const section = addFormSection(root, 5, "Movie Ticket Booking");
  const form = document.createElement("form"); form.noValidate = true;
  const configs = [
    { name: "name", label: "Name", type: "text", regex: /^[A-Za-z ]+$/, error: "Name must contain alphabets only." },
    { name: "email", label: "Email", type: "email", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, error: "Enter a valid email address." },
    { name: "seats", label: "Seats (1-10)", type: "number", regex: /^(?:[1-9]|10)$/, error: "Choose between 1 and 10 seats." }
  ];
  const fields = {};
  configs.forEach(config => { const label = document.createElement("label"); label.textContent = config.label; const input = document.createElement("input"); input.type = config.type; input.name = config.name; const error = document.createElement("small"); error.className = "field-error"; form.append(label, input, error); fields[config.name] = { input, error, config }; });
  const button = document.createElement("button"); button.textContent = "Book Tickets"; const output = document.createElement("pre"); form.append(button, output);
  form.addEventListener("submit", event => {
    event.preventDefault(); let valid = true;
    Object.values(fields).forEach(({ input, error, config }) => { const okay = config.regex.test(input.value.trim()); error.textContent = okay ? "" : config.error; input.classList.toggle("valid", okay); input.classList.toggle("invalid", !okay); valid = valid && okay; });
    if (valid) { const booking = { name: fields.name.input.value.trim(), email: fields.email.input.value.trim(), seats: Number(fields.seats.input.value) }; output.textContent = `Booking confirmed:\n${JSON.stringify(booking, null, 2)}`; }
  });
  section.appendChild(form);
}

// Q6 - Employee Management System with annual salary, bonus and reduce().
class Employee {
  constructor(id, name, department, salary) { this.id = id; this.name = name; this.department = department; this.salary = Number(salary); }
  getAnnualSalary() { return this.salary * 12; }
  applyBonus(percent) { this.salary *= 1 + Number(percent) / 100; return this.salary; }
}
const employees = [
  new Employee(1, "Amit", "Engineering", 50000), new Employee(2, "Sara", "Finance", 45000),
  new Employee(3, "Kiran", "Design", 42000), new Employee(4, "Neha", "HR", 40000), new Employee(5, "Ravi", "Sales", 48000)
];
employees[0].applyBonus(10);
employees.forEach(employee => console.log(`Q6 ${employee.name}: annual salary Rs. ${employee.getAnnualSalary().toFixed(2)}`));
const annualPayout = employees.reduce((total, employee) => total + employee.getAnnualSalary(), 0);
console.log("Q6 total annual payout:", annualPayout.toFixed(2));

// Q7 - Login form RegExp checks: username length and password complexity.
if (typeof document !== "undefined") {
  const root = createAssignment4Root(); const section = addFormSection(root, 7, "Login Form Validation");
  const form = document.createElement("form"); form.noValidate = true;
  const username = document.createElement("input"); username.placeholder = "Username (min 5 characters)"; username.autocomplete = "username";
  const password = document.createElement("input"); password.type = "password"; password.placeholder = "Password (min 8 characters)"; password.autocomplete = "current-password";
  const errors = document.createElement("div"); errors.className = "field-error"; const button = document.createElement("button"); button.textContent = "Log in";
  form.append(username, password, button, errors);
  form.addEventListener("submit", event => {
    event.preventDefault(); const messages = [];
    if (username.value.trim().length < 5) messages.push("Username must contain at least 5 characters.");
    if (password.value.length < 8) messages.push("Password must contain at least 8 characters.");
    if (!/[0-9]/.test(password.value)) messages.push("Password needs a number.");
    if (!/[A-Z]/.test(password.value)) messages.push("Password needs an uppercase letter.");
    if (!/[a-z]/.test(password.value)) messages.push("Password needs a lowercase letter.");
    if (!/[^A-Za-z0-9]/.test(password.value)) messages.push("Password needs a special character.");
    errors.textContent = messages.length ? messages.join(" ") : "Login details are valid.";
    errors.className = messages.length ? "field-error" : "success";
  }); section.appendChild(form);
}

// Q8 - Dynamic Object Updater: form submission updates the original object and DOM output.
const user = { name: "John", email: "john@mail.com", age: 21 };
if (typeof document !== "undefined") {
  const root = createAssignment4Root(); const section = addFormSection(root, 8, "Dynamic Object Updater");
  const form = document.createElement("form");
  const nameInput = document.createElement("input"); nameInput.value = user.name; nameInput.placeholder = "Name";
  const emailInput = document.createElement("input"); emailInput.value = user.email; emailInput.placeholder = "Email"; emailInput.type = "email";
  const ageInput = document.createElement("input"); ageInput.value = user.age; ageInput.placeholder = "Age"; ageInput.type = "number";
  const button = document.createElement("button"); button.textContent = "Update user";
  const output = document.createElement("pre"); output.textContent = JSON.stringify(user, null, 2);
  form.append(nameInput, emailInput, ageInput, button); form.addEventListener("submit", event => { event.preventDefault(); Object.assign(user, { name: nameInput.value.trim(), email: emailInput.value.trim(), age: Number(ageInput.value) }); output.textContent = JSON.stringify(user, null, 2); });
  section.append(form, output);
}

// Q9 - Shopping Cart class and coupon-code RegExp (SAVE20 or DISC10).
class Cart {
  constructor() { this.items = []; }
  addItem(name, price, quantity = 1) {
    if (!name || !Number.isFinite(Number(price)) || Number(price) < 0 || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) throw new Error("Invalid cart item.");
    this.items.push({ name, price: Number(price), quantity: Number(quantity) });
  }
  getTotal() { return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0); }
  applyCoupon(code) {
    if (!/^(SAVE20|DISC10)$/.test(code)) throw new Error("Coupon must be SAVE20 or DISC10.");
    const discountPercent = code === "SAVE20" ? 20 : 10;
    return this.getTotal() * (1 - discountPercent / 100);
  }
}
const cart = new Cart(); cart.addItem("Notebook", 100, 2); cart.addItem("Pen", 20, 3);
console.log("Q9 cart total:", cart.getTotal().toFixed(2));
try { console.log("Q9 total after SAVE20:", cart.applyCoupon("SAVE20").toFixed(2)); }
catch (error) { console.error("Q9 coupon error:", error.message); }
