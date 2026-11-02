/* =====================================================================
   ASSIGNMENT 1 - JavaScript Solutions (Q1 to Q10)
   Run with Node.js:  node Assign_JS_11.js
   Each solution is separated by a comment with its question number.
   ===================================================================== */


/* =====================================================================
   Q1. Personalized Login Greeting
   ===================================================================== */
{
  console.log("----- Q1 -----");

  const userName = "Aman";
  const currentHour = new Date().getHours(); // 0 - 23

  let greeting;

  if (currentHour < 12) {
    greeting = `Good Morning ${userName}!`;
  } else if (currentHour >= 12 && currentHour <= 17) {
    greeting = `Good Afternoon ${userName}!`;
  } else {
    greeting = `Good Evening ${userName}!`;
  }

  console.log(`Current hour: ${currentHour}`);
  console.log(greeting);
}


/* =====================================================================
   Q2. Multi-Type Data Summary
   ===================================================================== */
{
  console.log("\n----- Q2 -----");

  // Variables of different data types
  const userName = "Riya Sharma";               // string
  const userAge = 24;                           // number
  const isActive = true;                        // boolean
  const hobbies = ["reading", "coding"];        // array
  const address = { city: "Kashipur", pin: 244713 }; // object
  const middleName = null;                      // null
  let phoneNumber;                              // undefined (no value assigned)

  // Helper: arrays and null both report "object" with typeof, so check them first
  function getType(value) {
    if (Array.isArray(value)) return "array";
    if (value === null) return "null (typeof gives 'object')";
    return typeof value;
  }

  // ONE console.table() statement prints label + value + type
  console.table([
    { label: "userName",    value: userName,    type: getType(userName) },
    { label: "userAge",     value: userAge,     type: getType(userAge) },
    { label: "isActive",    value: isActive,    type: getType(isActive) },
    { label: "hobbies",     value: JSON.stringify(hobbies), type: getType(hobbies) },
    { label: "address",     value: JSON.stringify(address), type: getType(address) },
    { label: "middleName",  value: middleName,  type: getType(middleName) },
    { label: "phoneNumber", value: phoneNumber, type: getType(phoneNumber) }
  ]);
}


/* =====================================================================
   Q3. Monthly Expense Tracker
   ===================================================================== */
{
  console.log("\n----- Q3 -----");

  // Expenses for 5 categories: food, travel, rent, bills, leisure
  const categories = ["Food", "Travel", "Rent", "Bills", "Leisure"];
  const expenses = [6500, 2200, 12000, 3400, 1800];

  // Total using the += assignment operator
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i];
    console.log(`${categories[i]}: ${expenses[i].toFixed(2)}`);
  }

  const average = total / expenses.length;

  // Add 10% tax using arithmetic and assignment operators
  let finalAmount = total;
  finalAmount += total * 0.10;

  console.log(`
  ===== Expense Summary =====
  Total expenses       : ${total.toFixed(2)}
  Average per category : ${average.toFixed(2)}
  Final amount (+10%)  : ${finalAmount.toFixed(2)}
  ===========================`);
}


/* =====================================================================
   Q4. Academic Performance Evaluator
   ===================================================================== */
{
  console.log("\n----- Q4 -----");

  function evaluateStudent(marks) {
    const totalMarks = marks.reduce((sum, mark) => sum + mark, 0);
    const average = totalMarks / marks.length;
    const percentage = (totalMarks / (marks.length * 100)) * 100; // each subject out of 100

    // Validation: any subject below 35 -> automatically Detained
    const hasFailedSubject = marks.some(mark => mark < 35);

    let result;
    if (hasFailedSubject || percentage < 50) {
      result = "Detained";
    } else if (percentage >= 85) {
      result = "Promoted with Distinction";
    } else if (percentage >= 50 && percentage < 85) {
      result = "Promoted";
    }

    console.log(`Marks: [${marks}] | Average: ${average.toFixed(2)} | Percentage: ${percentage.toFixed(2)}% -> ${result}`);
  }

  evaluateStudent([92, 88, 90, 85, 87]); // Distinction
  evaluateStudent([70, 65, 72, 60, 68]); // Promoted
  evaluateStudent([40, 45, 38, 42, 44]); // Detained (below 50%)
  evaluateStudent([90, 95, 30, 88, 92]); // Detained (one subject < 35)
}


/* =====================================================================
   Q5. Weather Activity Planner
   ===================================================================== */
{
  console.log("\n----- Q5 -----");

  function planActivity(temperature, isRaining, windSpeed) {
    let advice;

    if (isRaining) {
      advice = "Stay indoors with hot coffee.";
    } else if (temperature > 35) {
      advice = "Go swimming.";
    } else if (temperature < 15 && windSpeed > 20) {
      advice = "Too cold and windy - stay home.";
    } else {
      advice = "Perfect day for a walk.";
    }

    console.log(`Temp: ${temperature}C, Raining: ${isRaining}, Wind: ${windSpeed} km/h -> ${advice}`);
  }

  planActivity(25, true, 10);   // raining
  planActivity(38, false, 5);   // hot
  planActivity(10, false, 30);  // cold and windy
  planActivity(22, false, 8);   // pleasant
}


/* =====================================================================
   Q6. Progressive Discount System
   ===================================================================== */
{
  console.log("\n----- Q6 -----");

  function applyDiscount(totalAmount) {
    let discountPercent;

    if (totalAmount >= 10000) {
      discountPercent = 25;
    } else if (totalAmount >= 5000) {
      discountPercent = 15;
    } else if (totalAmount >= 2000) {
      discountPercent = 5;
    } else {
      discountPercent = 0;
    }

    const finalPrice = Math.round(totalAmount - (totalAmount * discountPercent) / 100);

    console.log(`Original total: ${totalAmount} | Discount: ${discountPercent}% | Final price: ${finalPrice}`);
  }

  applyDiscount(12000);
  applyDiscount(6500);
  applyDiscount(2499);
  applyDiscount(1200);
}


/* =====================================================================
   Q7. Smart Guessing Game (Number Range)
   ===================================================================== */
{
  console.log("\n----- Q7 -----");

  // Secret number between 1 and 50
  const secretNumber = Math.floor(Math.random() * 50) + 1;

  function checkGuess(userGuess) {
    const difference = Math.abs(userGuess - secretNumber);

    if (userGuess === secretNumber) {
      console.log(`Guess ${userGuess}: Correct guess!`);
    } else {
      // Nested if: first check "close", then high / low
      if (difference <= 3) {
        console.log(`Guess ${userGuess}: Very close!`);
      } else if (userGuess > secretNumber) {
        console.log(`Guess ${userGuess}: Too high`);
      } else {
        console.log(`Guess ${userGuess}: Too low`);
      }
    }
  }

  console.log(`(Secret number for testing: ${secretNumber})`);
  checkGuess(secretNumber);                          // exact
  checkGuess(Math.min(secretNumber + 2, 50));        // very close (may be exact at 50)
  checkGuess(1);                                     // test value
  checkGuess(50);                                    // test value
}


/* =====================================================================
   Q8. Employee Salary Projection
   ===================================================================== */
{
  console.log("\n----- Q8 -----");

  let currentSalary = 500000;      // starting salary
  const incrementRate = 8;         // annual increment in %

  const projection = [];

  for (let year = 1; year <= 5; year++) {
    currentSalary += (currentSalary * incrementRate) / 100; // assignment operator
    currentSalary = Math.round(currentSalary);               // rounding

    projection.push({ Year: year, "Increment (%)": incrementRate, Salary: currentSalary });
  }

  console.table(projection);
}


/* =====================================================================
   Q9. Random Math Quiz Generator
   ===================================================================== */
{
  console.log("\n----- Q9 -----");

  const operators = ["+", "-", "*", "/"];

  // Random numbers 1 - 20 and a random operator
  const num1 = Math.floor(Math.random() * 20) + 1;
  const num2 = Math.floor(Math.random() * 20) + 1;
  const operator = operators[Math.floor(Math.random() * operators.length)];

  let correctAnswer;

  // Calculate the answer using switch
  switch (operator) {
    case "+":
      correctAnswer = num1 + num2;
      break;
    case "-":
      correctAnswer = num1 - num2;
      break;
    case "*":
      correctAnswer = num1 * num2;
      break;
    case "/":
      correctAnswer = (num1 / num2).toFixed(2); // two decimals
      break;
  }

  console.log(`Question: What is ${num1} ${operator} ${num2} ?`);
  console.log(`Correct answer: ${correctAnswer}`);
}


/* =====================================================================
   Q10. Citizen Eligibility Validator
   ===================================================================== */
{
  console.log("\n----- Q10 -----");

  function checkEligibility(age, isCitizen) {
    if (isCitizen) {
      if (age >= 21) {
        console.log("Eligible for all services.");
      } else if (age >= 18 && age <= 20) {
        console.log("Eligible to vote only.");
      } else {
        console.log("Not eligible yet.");
      }
    } else {
      if (age >= 18) {
        console.log("Only age criteria met.");
      } else {
        console.log("Not eligible yet.");
      }
    }
  }

  const tests = [[25, true], [19, true], [16, true], [30, false], [15, false]];
  tests.forEach(([age, isCitizen]) => {
    process.stdout.write(`Age ${age}, citizen=${isCitizen}: `);
    checkEligibility(age, isCitizen);
  });
}
