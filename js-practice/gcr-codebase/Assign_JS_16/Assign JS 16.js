/*
 * ASSIGNMENT 6 - PROMISES, ASYNC/AWAIT AND EVENT LOOP
 * Combined answers for Q1-Q10. Core JavaScript only.
 * Run with Node.js (Node 18+ for built-in fetch) or in a browser console.
 */
"use strict";

const randomDelay = (minimum = 1000, maximum = 2000) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

// Q1 - Startup Morning: asynchronous coffee maker using Promise chaining.
function boilWater() {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (Math.random() < 0.15) return reject(new Error("Water boiler failed."));
    console.log("Water boiled."); resolve("Hot water");
  }, randomDelay()));
}
function brewCoffee(water) {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (Math.random() < 0.15) return reject(new Error("Coffee brewing failed."));
    console.log(`Coffee brewed using ${water.toLowerCase()}.`); resolve("Fresh coffee");
  }, randomDelay()));
}
function pourIntoCup(coffee) {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (Math.random() < 0.15) return reject(new Error("Could not pour coffee."));
    console.log(`${coffee} poured into a cup.`); resolve("Coffee ready for the team!");
  }, randomDelay()));
}
function runCoffeeProcess() {
  console.log("\nQ1 - Coffee process started");
  return boilWater().then(brewCoffee).then(pourIntoCup)
    .then(message => console.log(message))
    .catch(error => console.error("Coffee process failed:", error.message));
}

// Q2 - Synchronous code runs first, then microtasks, then macrotasks.
function demonstrateMicrotaskMacrotaskOrder() {
  console.log("\nQ2 - Event loop task order");
  console.log("Start");
  setTimeout(() => console.log("setTimeout callback (macrotask)"), 0);
  Promise.resolve().then(() => console.log("Promise callback (microtask)"));
  console.log("Synchronous log");
  console.log("End");
  // Expected: Start, Synchronous log, End, Promise callback, setTimeout callback.
  // The microtask queue is drained after the current call stack, before the next macrotask.
}

// Q3 - Convert the callback-style bug fetcher to a Promise.
function getBugs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const apiFailed = Math.random() < 0.25;
      if (apiFailed) reject(new Error("Bug tracking API failed."));
      else resolve(["UI glitch", "API timeout", "Login failure"]);
    }, 1000);
  });
}
function runBugTracker() {
  console.log("\nQ3 - Bug tracker");
  return getBugs().then(bugs => console.table(bugs.map((bug, index) => ({ number: index + 1, bug }))))
    .catch(error => console.error("Unable to load bugs:", error.message));
}

// Q4 - Reuse the same server Promises for both Promise.all and Promise.race.
function requestServer(serverName, delay) {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (Math.random() < 0.2) reject(new Error(`${serverName} deployment failed`));
    else resolve(`${serverName} responded`);
  }, delay));
}
function runDeploymentRace() {
  console.log("\nQ4 - Deployment server race");
  const serverA = requestServer("Server A", 2000);
  const serverB = requestServer("Server B", 3000);
  const allResult = Promise.all([serverA, serverB])
    .then(() => console.log("Deployment completed for all servers"))
    .catch(error => console.error("Deployment batch error:", error.message));
  const fastestResult = Promise.race([serverA, serverB])
    .then(response => console.log("Fastest response:", response))
    .catch(error => console.error("Fastest response failed:", error.message));
  return Promise.all([allResult, fastestResult]);
}

// Q5 - The same five stages shown first with nested callbacks, then with async/await.
function runCallbackPipeline(done) {
  const stage = (name, callback) => setTimeout(() => { console.log(`Callback pipeline: ${name}`); callback(); }, 1000);
  stage("design", () => stage("build", () => stage("test", () => stage("deploy", () => stage("celebrate", done)))));
}
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
async function runAsyncPipeline() {
  for (const stage of ["design", "build", "test", "deploy", "celebrate"]) {
    await wait(1000);
    console.log(`Async/await pipeline: ${stage}`);
  }
}
function runPipelineComparison() {
  console.log("\nQ5 - Callback nesting versus async/await");
  // async/await reads like sequential code, centralizes error handling with try/catch,
  // and avoids deeply nested callback indentation while still using Promises.
  const callbackRun = new Promise(resolve => runCallbackPipeline(resolve));
  const asyncRun = runAsyncPipeline();
  return Promise.all([callbackRun, asyncRun]);
}

// Q6 - Fake Store API product fetcher; optional DOM cards are added in a browser.
async function fetchProducts() {
  console.log("\nQ6 - Fake Store products");
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const products = await response.json();
    products.forEach(product => {
      console.log(`Product: ${product.title}`);
      console.log(`Price: $${Number(product.price).toFixed(2)}`);
      console.log(`Image: ${product.image}`);
    });
    if (typeof document !== "undefined") {
      let container = document.getElementById("fake-store-product-cards");
      if (!container) { container = document.createElement("section"); container.id = "fake-store-product-cards"; document.body.appendChild(container); }
      container.innerHTML = "<h2>Fake Store Product Cards</h2>";
      products.forEach(product => {
        const card = document.createElement("article");
        card.style.cssText = "display:inline-flex;flex-direction:column;vertical-align:top;width:190px;min-height:250px;margin:8px;padding:12px;border:1px solid #ddd;border-radius:8px;font:14px Arial";
        const image = document.createElement("img"); image.src = product.image; image.alt = product.title; image.style.cssText = "width:100%;height:130px;object-fit:contain";
        const title = document.createElement("p"); title.textContent = product.title;
        const price = document.createElement("strong"); price.textContent = `$${Number(product.price).toFixed(2)}`;
        card.append(image, title, price); container.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Failed to load products. Please try again.", error.message);
  }
}

// Q7 - Promise.allSettled reports each module separately and measures elapsed time.
// Choose one module once, so exactly one of the three Promises rejects per run.
const failedDashboardModuleIndex = Math.floor(Math.random() * 3);
function loadProfile() {
  return new Promise((resolve, reject) => setTimeout(() => failedDashboardModuleIndex === 0 ? reject(new Error("Profile unavailable")) : resolve("Profile Loaded"), 2000));
}
function loadPosts() {
  return new Promise((resolve, reject) => setTimeout(() => failedDashboardModuleIndex === 1 ? reject(new Error("Posts unavailable")) : resolve("Posts Loaded"), 1500));
}
function loadMessages() {
  return new Promise((resolve, reject) => setTimeout(() => failedDashboardModuleIndex === 2 ? reject(new Error("Messages unavailable")) : resolve("Messages Loaded"), 1000));
}
async function runAllSettledDashboard() {
  console.log("\nQ7 - Dashboard module loading");
  const startedAt = Date.now();
  const results = await Promise.allSettled([loadProfile(), loadPosts(), loadMessages()]);
  ["Profile", "Posts", "Messages"].forEach((moduleName, index) => {
    const result = results[index];
    if (result.status === "fulfilled") console.log(`${moduleName}: success - ${result.value}`);
    else console.log(`${moduleName}: failed - ${result.reason.message}`);
  });
  console.log(`Total time: ${Date.now() - startedAt} ms`);
}

// Q8 - Retry an order submission up to three times.
function submitOrder() {
  return new Promise((resolve, reject) => setTimeout(() => {
    Math.random() < 0.5 ? reject(new Error("Temporary order API failure")) : resolve("Order accepted");
  }, 400));
}
async function processOrder() {
  console.log("\nQ8 - Order retry mechanism");
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await submitOrder();
      console.log(`Attempt ${attempt}: Success - ${result}`);
      return result;
    } catch (error) {
      console.log(`Attempt ${attempt}: Failed - ${error.message}`);
    }
  }
  throw new Error("Order could not be processed");
}
async function runOrderProcessing() {
  try { await processOrder(); }
  catch (error) { console.error(error.message); }
}

// Q9 - Predicted order is written before execution as requested.
function demonstrateEventLoopAgain() {
  console.log("\nQ9 - Predicted output order:");
  // 1. Script start
  // 2. Script end
  // 3. Promise callback
  // 4. Timeout callback
  console.log("Script start");
  setTimeout(() => console.log("Timeout callback"), 0);
  Promise.resolve().then(() => console.log("Promise callback"));
  console.log("Script end");
  // Promise reactions are microtasks and run after synchronous code but before timer macrotasks.
}

// Q10 - Delivery pipeline: every stage is a Promise with a random delay and chance of failure.
function deliveryStep(stepName, successMessage) {
  return new Promise((resolve, reject) => setTimeout(() => {
    if (Math.random() < 0.12) reject(new Error(`${stepName} failed`));
    else resolve(successMessage);
  }, randomDelay()));
}
async function runPipeline() {
  console.log("\nQ10 - Start Pipeline");
  try {
    console.log(`Step 1: ${await deliveryStep("takeOrder", "Order taken")}`);
    console.log(`Step 2: ${await deliveryStep("prepare", "Food prepared")}`);
    console.log(`Step 3: ${await deliveryStep("pack", "Package ready")}`);
    console.log(`Step 4: ${await deliveryStep("dispatch", "Out for delivery")}`);
    await deliveryStep("deliver", "Delivery completed!").then(console.log);
  } catch (error) {
    console.error("Pipeline failed!", error.message);
  }
  // Each await suspends this async function. Other queued work can run while a step's
  // timer is pending; after settlement, the continuation resumes as a Promise microtask.
}

// Run all exercises without blocking one another; timer examples therefore overlap.
async function runAssignment6Demos() {
  console.log("===== ASSIGNMENT 6: ASYNC JAVASCRIPT =====");
  await Promise.allSettled([
    runCoffeeProcess(),
    Promise.resolve().then(demonstrateMicrotaskMacrotaskOrder),
    runBugTracker(),
    runDeploymentRace(),
    runPipelineComparison(),
    fetchProducts(),
    runAllSettledDashboard(),
    runOrderProcessing(),
    Promise.resolve().then(demonstrateEventLoopAgain),
    runPipeline()
  ]);
  console.log("===== ASSIGNMENT 6 DEMOS FINISHED =====");
}

runAssignment6Demos();
