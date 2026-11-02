/*
 * ASSIGNMENT 3 - TYPES, DEBUGGING, HOISTING, ERRORS AND JSON
 * Complete combined solutions for Q1-Q10. All output is shown with console.log().
 */
"use strict";

// Q1 - Dynamic Data Parser: report conversions and separate usable/invalid numeric values.
{
  const apiData = ["25", "true", "false", "NaN", "                     ", "100px", "3.14", null, undefined];
  const validNumericData = [];
  const invalidNumericData = [];
  console.log("\nQ1 - Dynamic data conversion report");
  apiData.forEach((value, index) => {
    const numericValue = Number(value);
    const booleanValue = Boolean(value);
    const stringValue = String(value);
    // Whitespace-only strings are deliberately treated as invalid even though Number(" ") is 0.
    const whitespaceOnly = typeof value === "string" && value.trim() === "";
    const isValidNumber = !whitespaceOnly && value !== undefined && !Number.isNaN(numericValue);
    const report = { index, original: value, number: numericValue, boolean: booleanValue, string: stringValue };
    if (isValidNumber) validNumericData.push({ original: value, number: numericValue });
    else invalidNumericData.push({ original: value, reason: whitespaceOnly ? "Whitespace-only value" : "Not a valid numeric value" });
    console.log(isValidNumber ? "VALID" : "INVALID", report);
  });
  console.log("Q1 valid numeric data:", validNumericData);
  console.log("Q1 invalid numeric data:", invalidNumericData);
}

// Q2 - Employee Bonus Calculator with safe conversion and missing-property checks.
{
  const employees = [
    { name: "Amit", salary: "45000", years: "5" },
    { name: "Sara", salary: "38000", years: "2" },
    { name: "Kiran", salary: "52000", years: "7" }
  ];
  console.log("\nQ2 - Employee bonus report");
  employees.forEach(employee => {
    try {
      if (!employee || !employee.name || employee.salary === undefined || employee.years === undefined) throw new Error("Employee data is incomplete.");
      const salary = Number(employee.salary); const years = Number(employee.years);
      if (!Number.isFinite(salary) || !Number.isFinite(years)) throw new TypeError("Salary and years must be numeric.");
      const bonus = salary * (years > 3 ? 0.10 : 0.05);
      console.log(`${employee.name}: Salary Rs. ${salary.toFixed(2)}, Experience ${years} years, Bonus Rs. ${bonus.toFixed(2)}`);
    } catch (error) { console.log("Employee record error:", error.message); }
  });
}

// Q3 - Transaction Validator: custom categorized errors and valid/invalid arrays.
{
  const transactions = [{ id: 1, amount: 2000 }, { id: 2, amount: -500 }, { id: 3 }, null];
  const validTransactions = []; const invalidTransactions = [];
  class TransactionValidationError extends Error { constructor(message, category) { super(message); this.name = "TransactionValidationError"; this.category = category; } }
  transactions.forEach((transaction, index) => {
    try {
      if (transaction === null) throw new TransactionValidationError("Null transaction entry", "null-entry");
      if (!transaction || transaction.id === undefined || transaction.amount === undefined) throw new TransactionValidationError("Missing transaction id or amount", "missing-data");
      if (transaction.amount < 0) throw new TransactionValidationError("Transaction amount cannot be negative", "negative-amount");
      validTransactions.push(transaction);
    } catch (error) {
      invalidTransactions.push({ index, transaction, category: error.category || "unexpected", message: error.message });
    }
  });
  console.log("\nQ3 valid transactions:", validTransactions);
  console.log("Q3 invalid transactions:", invalidTransactions);
  console.log(`Q3 counts: ${validTransactions.length} successful, ${invalidTransactions.length} failed`);
  // Debugging tip: set a breakpoint inside forEach and watch index, transaction and error.category.
}

// Q4 - Debugging Mystery. Strict mode rejects assignment to an undeclared identifier.
{
  console.log("\nQ4 - Strict mode bug and correction");
  function brokenShowMessage() {
    try { greeting = "Welcome"; console.log(greeting); } // eslint-disable-line no-undef
    catch (error) { console.log("Expected strict-mode error:", error.name, error.message); }
  }
  brokenShowMessage();
  function fixedShowMessage() {
    const greeting = "Welcome"; // Declaration gives the variable a predictable function/block scope.
    console.log("Fixed output:", greeting);
  }
  fixedShowMessage();
  // Debugger: watch `greeting` inside each function and inspect the call stack while stepping.
}

// Q5 - Hoisting Lab: var is hoisted as undefined; function declarations are callable early.
{
  console.log("\nQ5 - Original hoisting sequence");
  function runOriginalHoisting() {
    console.log(score); // undefined: var declaration is hoisted, assignment is not.
    announce(); // Function declaration is hoisted with its body.
    var score = 50;
    function announce() { console.log("Game started"); }
    let status = "ready";
    startGame();
    function startGame() { console.log(status); } // Called after status initialization.
  }
  runOriginalHoisting();

  console.log("Q5 - Corrected declaration order");
  const correctedScore = 50;
  const correctedStatus = "ready";
  const correctedAnnounce = () => console.log("Game started");
  const correctedStartGame = () => console.log(correctedStatus);
  console.log(correctedScore); correctedAnnounce(); correctedStartGame();
  // Arrow functions are expressions assigned to variables; they cannot be called before initialization.
}

// Q6 - Pyramid Pattern Generator. Pass a row count as a Node argument or use the browser prompt.
{
  let requestedRows = 5;
  if (typeof process !== "undefined" && process.argv && process.argv[2] !== undefined) {
    const parsed = Number(process.argv[2]); if (Number.isInteger(parsed) && parsed > 0) requestedRows = parsed;
  } else if (typeof prompt === "function") {
    const response = prompt("Enter pyramid row count (default 5):");
    if (response && Number.isInteger(Number(response)) && Number(response) > 0) requestedRows = Number(response);
  }
  console.log(`\nQ6 - Pyramid with ${requestedRows} rows`);
  for (let row = 1; row <= requestedRows; row++) console.log("* ".repeat(row).trimEnd());

  // Q6 experiment: replacing `let` with `var` reuses one function-scoped variable.
  // The displayed pattern is still the same when logged immediately inside the loop.
  console.log("Q6 var version:");
  for (var legacyRow = 1; legacyRow <= Math.min(requestedRows, 5); legacyRow++) console.log("* ".repeat(legacyRow).trimEnd());
  console.log("Q6 var loop variable remains accessible after the loop:", legacyRow);
  // Unlike let, var is function-scoped and remains available after the loop finishes.
  // A debugger breakpoint in either loop lets you watch the row variable change each iteration.
}

// Q7 - Smart Calculator with switch and custom error classes.
{
  class InvalidOperationError extends Error { constructor(operation) { super(`Unknown operation: ${operation}`); this.name = "InvalidOperationError"; } }
  class CalculationError extends Error { constructor(message) { super(message); this.name = "CalculationError"; } }
  function calculate(operation, num1, num2) {
    switch (operation) {
      case "add": return num1 + num2;
      case "divide": if (num2 === 0) throw new CalculationError("Cannot divide by zero"); return num1 / num2;
      case "power": return num1 ** num2;
      case "root": if (num1 < 0) throw new CalculationError("Square root of a negative number is not supported here"); return Math.sqrt(num1);
      case "subtract": return num1 - num2;
      default: throw new InvalidOperationError(operation);
    }
  }
  console.log("\nQ7 - Smart calculator summary");
  const operations = ["add", "divide", "power", "root", "subtract", "multiply"];
  const num1 = 25, num2 = 0;
  operations.forEach(operation => {
    try { console.log(`${operation}: ${calculate(operation, num1, num2)}`); }
    catch (error) { console.log(`${operation}: ERROR - ${error.name}: ${error.message}`); }
  });
}

// Q8 - Strict Mode Showdown. Function constructor strings isolate strict/non-strict parsing.
{
  console.log("\nQ8 - Strict mode showdown");
  try {
    // Without strict mode: duplicate parameter names are permitted in a simple function.
    const nonStrictDemo = Function("a", "a", "total = 10; return { lastA: a, total: total };");
    console.log("Non-strict duplicate-parameter example:", nonStrictDemo(5, 10));
  } catch (error) { console.log("Non-strict example error:", error.name, error.message); }
  try {
    // Strict mode disallows duplicate parameter names at parse time.
    Function("'use strict'; return function (a, a) { return a; };");
  } catch (error) { console.log("Strict duplicate-parameter error:", error.name, error.message); }
  try {
    const strictUndeclared = Function("'use strict'; undeclaredTotal = 10;");
    strictUndeclared();
  } catch (error) { console.log("Strict undeclared-assignment error:", error.name, error.message); }
  try {
    // In sloppy mode this creates a global property and deleting the identifier succeeds.
    const sloppyDeleteDemo = Function("deleteDemoTotal = 10; const deleted = delete deleteDemoTotal; return deleted;");
    console.log("Non-strict delete of implicit global:", sloppyDeleteDemo());
  } catch (error) { console.log("Non-strict delete example error:", error.name, error.message); }
  try {
    // Strict mode rejects delete applied to an unqualified identifier during parsing.
    Function("'use strict'; return function () { let localTotal = 10; delete localTotal; };");
  } catch (error) { console.log("Strict delete-identifier error:", error.name, error.message); }
  const correctVersion = (first, second) => { const total = first + second; return total; };
  console.log("Correct ES6 version:", correctVersion(5, 10));
  // Strict mode catches silent mistakes: duplicate formal parameters, accidental globals,
  // and deleting unqualified variable bindings are not allowed.
}

// Q9 - JSON Audit: parse safely, report line numbers, validate required fields and age.
{
  const rawData = [
    '{"user":"Alex","age":25}',
    '{"id":2}',
    "{invalid}",
    '{"user":"Mina","age":"22"}'
  ];
  const cleanData = []; const auditErrors = []; const under18Users = [];
  rawData.forEach((entry, index) => {
    const lineNumber = index + 1;
    try {
      const parsed = JSON.parse(entry);
      if (!Object.prototype.hasOwnProperty.call(parsed, "user") || !Object.prototype.hasOwnProperty.call(parsed, "age")) {
        throw new Error("Missing required key: user or age");
      }
      const age = Number(parsed.age);
      if (!Number.isFinite(age)) throw new Error("Age must be numeric");
      const normalized = { user: String(parsed.user), age };
      cleanData.push(normalized);
      if (age < 18) under18Users.push(normalized);
    } catch (error) {
      auditErrors.push({ lineNumber, message: error.message, entry });
      console.log(`Q9 line ${lineNumber} error: ${error.message}`);
    }
  });
  console.log("\nQ9 clean JSON data:", cleanData);
  console.log("Q9 audit errors:", auditErrors);
  console.log("Q9 under-18 users:", under18Users);
  // Debugger tip: place a breakpoint in catch to observe how one bad line is skipped.
}

// Q10 - Nested Hoisting and Closures: separate function scopes have separate hoisted vars.
{
  console.log("\nQ10 - Original nested hoisting output");
  function outer() {
    console.log(count); // undefined: outer's var is hoisted but not assigned yet.
    var count = 5;
    function inner() {
      console.log(count); // undefined: inner's local var shadows outer count and is hoisted.
      var count = 10;
    }
    inner();
  }
  outer();

  console.log("Q10 - Arrow closure version (reads outer count)");
  function outerWithArrow() {
    const outerCount = 5;
    const inner = () => console.log(outerCount); // No inner declaration shadows outerCount.
    inner();
  }
  outerWithArrow();
  // An arrow function still has its own function scope for local `var` declarations;
  // this version demonstrates lexical closure by intentionally reading the outer binding.
  // Call stack: outerWithArrow -> inner arrow -> return to outerWithArrow.
}
