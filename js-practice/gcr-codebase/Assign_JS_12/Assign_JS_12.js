/* =====================================================================
   ASSIGNMENT 2 - JavaScript Solutions (Q1 to Q10)
   Run with Node.js:  node Assign_JS_12.js
   Each solution is separated by a comment with its question number.
   ===================================================================== */


/* =====================================================================
   Q1. Scope Conflict Resolver
   ===================================================================== */

// Global variable - visible everywhere in the file
var bonus = 5000;

function calculateSalary(permanentStatus) {
  // Local variables - exist only inside this function
  let salary = 40000;
  let isPermanent = permanentStatus; // local boolean
  let totalSalary = salary;

  // Add the global bonus only for permanent employees
  if (isPermanent) {
    totalSalary = totalSalary + bonus;
  }

  console.log(`isPermanent = ${isPermanent} -> Total salary: ${totalSalary}`);
  return totalSalary;
}

console.log("----- Q1 -----");
calculateSalary(true);   // salary + bonus
calculateSalary(false);  // salary only

// Demonstration: changing isPermanent never changes the global bonus,
// and local variables are NOT accessible outside the function.
console.log("Global bonus after both calls:", bonus);
console.log("Is 'salary' visible outside the function?", typeof salary); // undefined
console.log("Is 'isPermanent' visible outside the function?", typeof isPermanent); // undefined


/* =====================================================================
   Q2. String Manipulation Report
   ===================================================================== */
{
  console.log("\n----- Q2 -----");

  const productName = "  wireless headphones PRO  ";

  // 1. Remove extra spaces and convert to lowercase
  const cleaned = productName.trim().toLowerCase();

  // 2. Capitalize the first letter of every word
  const capitalized = cleaned
    .split(" ")                                          // split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each
    .join(" ");                                          // join back together

  // 3. Replace the word "pro" (any case) with "Pro Edition"
  const finalTitle = capitalized.replace(/\bpro\b/i, "Pro Edition");

  console.log("Original      :", `"${productName}"`);
  console.log("Cleaned title :", finalTitle);
  console.log("Title length  :", finalTitle.length);
}


/* =====================================================================
   Q3. Math Utility Dashboard
   ===================================================================== */
{
  console.log("\n----- Q3 -----");

  const x = 16.75;

  const rounded = Math.round(x);                       // nearest integer
  const squareRoot = Math.sqrt(x);                     // square root
  const power = Math.pow(x, 3);                        // x cubed
  const randomNum = Math.floor(Math.random() * 41) + 10; // random 10 - 50

  // Template literal for the formatted summary
  console.log(`
  ===== Math Dashboard =====
  Number            : ${x}
  Rounded value     : ${rounded}
  Square root       : ${squareRoot.toFixed(4)}
  Power (x^3)       : ${power.toFixed(4)}
  Random (10 - 50)  : ${randomNum}
  ==========================`);
}


/* =====================================================================
   Q4. Array Performance Analyzer
   ===================================================================== */
{
  console.log("\n----- Q4 -----");

  // Array of 8 random scores between 30 and 100 (built with map)
  const scores = Array.from({ length: 8 }, () => 0)
    .map(() => Math.floor(Math.random() * 71) + 30);

  const highest = Math.max(...scores);
  const lowest = Math.min(...scores);
  const total = scores.reduce((sum, score) => sum + score, 0); // reduce
  const average = total / scores.length;
  const passedStudents = scores.filter(score => score >= 50); // filter

  console.log(`
  ===== Performance Summary =====
  Scores           : ${scores.join(", ")}
  Highest score    : ${highest}
  Lowest score     : ${lowest}
  Average score    : ${average.toFixed(2)}
  Students passed  : ${passedStudents.length} out of ${scores.length}
  ===============================`);
}


/* =====================================================================
   Q5. Boolean Logic Access System
   ===================================================================== */
{
  console.log("\n----- Q5 -----");

  // Returns "Secure" only if ALL conditions are satisfied
  function checkSecurity(isDoorLocked, isWindowClosed, isAlarmOn, isOwnerInside) {
    const doorAndWindowClosed = isDoorLocked && isWindowClosed;
    if (isAlarmOn && doorAndWindowClosed && isOwnerInside) {
      return "Secure";
    }
    return "Unsafe";
  }

  // Test several combinations: [door, window, alarm, owner]
  const testCases = [
    [true, true, true, true],     // everything fine
    [false, true, true, true],    // door not locked
    [true, false, true, true],    // window open
    [true, true, false, true],    // alarm off
    [true, true, true, false],    // owner not inside
    [false, false, false, false]  // nothing satisfied
  ];

  testCases.forEach(([door, windowClosed, alarm, owner], index) => {
    console.log(
      `Test ${index + 1}: door=${door}, window=${windowClosed}, alarm=${alarm}, owner=${owner} -> ${checkSecurity(door, windowClosed, alarm, owner)}`
    );
  });

  // Example using ! and || as well: warn if the alarm is off OR the door is unlocked
  const isAlarmOn = false, isDoorLocked = true;
  console.log("Warning needed?", !isAlarmOn || !isDoorLocked);
}


/* =====================================================================
   Q6. Event-Based Counter Simulation
   ===================================================================== */
{
  console.log("\n----- Q6 -----");

  let count = 0;

  function increment() {
    // Nested function: it can read/update 'count' from the outer scope
    function updateAndLog(change) {
      count = count + change;
      console.log(`Current count: ${count}`);
    }
    updateAndLog(1);
  }

  function decrement() {
    function updateAndLog(change) {
      count = count + change;
      console.log(`Current count: ${count}`);
    }
    updateAndLog(-1);
  }

  // Simulate "click" events by calling the functions manually
  console.log("Click + button 3 times:");
  increment();
  increment();
  increment();
  console.log("Click - button 2 times:");
  decrement();
  decrement();
}


/* =====================================================================
   Q7. Customer Feedback Processor
   ===================================================================== */
{
  console.log("\n----- Q7 -----");

  const feedback = "Great product! Fast delivery and amazing sound quality!";

  // Count words: trim, then split by one or more spaces
  const wordCount = feedback.trim().split(/\s+/).length;

  // Check for negative words (lowercase so the check is case-insensitive)
  const lowerFeedback = feedback.toLowerCase();
  const hasNegativeWords = lowerFeedback.includes("bad") || lowerFeedback.includes("poor");

  console.log("Feedback   :", feedback);
  console.log("Word count :", wordCount);

  if (!hasNegativeWords) {
    console.log("Positive Feedback");
  } else {
    console.log("Needs Improvement");
  }
}


/* =====================================================================
   Q8. Dynamic Discount Evaluator
   ===================================================================== */
{
  console.log("\n----- Q8 -----");

  const cart = [
    { item: "Laptop", category: "electronics", price: 45000 },
    { item: "Shoes", category: "fashion", price: 2500 },
    { item: "Book", category: "education", price: 600 }
  ];

  function evaluateCart(cartItems) {
    // Original total (before any discount) - used for the 50000 rule
    const originalTotal = cartItems.reduce((sum, product) => sum + product.price, 0);

    // Loop through items and apply category discounts
    const discountedItems = [];
    for (const product of cartItems) {
      let discountRate = 0;
      if (product.category === "electronics") {
        discountRate = 0.10;
      } else if (product.category === "fashion") {
        discountRate = 0.05;
      }
      const finalPrice = product.price - product.price * discountRate;
      discountedItems.push({ ...product, finalPrice });
      console.log(`${product.item}: ${product.price} -> ${finalPrice} (${discountRate * 100}% off)`);
    }

    // Sum the discounted prices with reduce()
    let finalTotal = discountedItems.reduce((sum, product) => sum + product.finalPrice, 0);

    // Extra 5% overall discount if cart value is more than 50000
    if (originalTotal > 50000) {
      finalTotal = finalTotal * 0.95;
      console.log("Extra 5% overall discount applied!");
    }

    console.log(`Original total: ${originalTotal} | Final total: ${finalTotal.toFixed(2)}`);
    return finalTotal;
  }

  console.log("Cart 1 (total 48100, no extra discount):");
  evaluateCart(cart);

  console.log("\nCart 2 (extra item pushes total above 50000):");
  evaluateCart([...cart, { item: "Headphones", category: "electronics", price: 5000 }]);
}


/* =====================================================================
   Q9. Odd-Even Number Analyzer
   ===================================================================== */
{
  console.log("\n----- Q9 -----");

  const numbers = [];
  const results = [];

  // Fill the array with numbers 1 to 30 using a loop
  for (let i = 1; i <= 30; i++) {
    numbers.push(i);
  }

  // Classify every number
  for (const num of numbers) {
    if (num % 3 === 0 && num % 5 === 0) {
      results.push("FizzBuzz");
    } else if (num % 2 === 0) {
      results.push("Even");
    } else {
      results.push("Odd");
    }
  }

  console.log("Results array:", results);
  numbers.forEach((num, index) => console.log(`${num} -> ${results[index]}`));
}


/* =====================================================================
   Q10. Departmental Employee Evaluator
   ===================================================================== */
{
  console.log("\n----- Q10 -----");

  const departments = [
    ["HR", 72],
    ["Finance", 88],
    ["Tech", 95],
    ["Support", 63]
  ];

  for (const [department, score] of departments) {
    let rating;

    // Nested if-else with comparison operators
    if (score >= 75) {
      if (score >= 90) {
        rating = "Excellent";
      } else {
        rating = "Good";          // 75 - 89
      }
    } else {
      if (score >= 60) {
        rating = "Average";       // 60 - 74
      } else {
        rating = "Needs Improvement";
      }
    }

    console.log(`${department} (${score}) -> ${rating}`);
  }
}
