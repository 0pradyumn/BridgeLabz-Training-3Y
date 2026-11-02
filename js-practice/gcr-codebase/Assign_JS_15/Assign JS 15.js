/*
 * ASSIGNMENT 5 - CALLBACKS, THIS, PROTOTYPES AND CLOSURES
 * Combined JavaScript solutions for Q1-Q9. No external libraries.
 */

// Q1 - Callback flow: greet first, then execute the supplied callback.
function showEndMessage() {
  console.log("Welcome to the course!");
}
function greetUser(name, callback) {
  console.log(`Hello ${name}`);
  if (typeof callback === "function") callback();
}
greetUser("Aarav", showEndMessage);

// Q2 - Higher-order function applies a callback operation to every array element.
function applyOperation(numbers, operation) {
  if (!Array.isArray(numbers) || typeof operation !== "function") {
    throw new TypeError("Pass an array and a callback function.");
  }
  return numbers.map(operation);
}
const originalNumbers = [1, 2, 3, 4];
console.log("Q2 doubled:", applyOperation(originalNumbers, number => number * 2));
console.log("Q2 squared:", applyOperation(originalNumbers, number => number ** 2));

// Q3 - Arrow functions do not receive their own `this`; it is captured lexically.
function createArrowThisDemo() {
  "use strict";
  return {
    name: "Aarav",
    // This arrow captures the factory's `this`. A plain strict-mode call sets that
    // value to undefined, so the demonstration reports undefined instead of borrowing
    // the object's `name` property (and catches the property-access TypeError).
    showName: () => {
      try { console.log("Arrow function this.name:", this.name); }
      catch { console.log("Arrow function this.name:", undefined); }
    }
  };
}
const user = createArrowThisDemo();
user.showName();
const fixedUser = {
  name: "Aarav",
  showName() { console.log("Normal method this.name:", this.name); }
};
fixedUser.showName(); // A normal method gets `this` from the object before the dot.

// Q4 - Constructor function and shared prototype method.
function Car(brand, model) {
  this.brand = brand;
  this.model = model;
}
Car.prototype.getDetails = function () {
  return `${this.brand} ${this.model}`;
};
const carOne = new Car("Toyota", "Corolla");
const carTwo = new Car("Honda", "City");
console.log("Q4 cars:", carOne.getDetails(), "|", carTwo.getDetails());
console.log("Shared prototype method:", carOne.getDetails === carTwo.getDetails);

// Q5 - Person -> Student prototype inheritance.
function Person(name) { this.name = name; }
Person.prototype.getName = function () { return this.name; };
function Student(name, branch) {
  Person.call(this, name); // Reuse Person's constructor to initialize inherited data.
  this.branch = branch;
}
Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;
Student.prototype.getBranch = function () { return this.branch; };
const student = new Student("Meera", "Computer Science");
console.log("Q5 student:", student.getName(), student.getBranch());
console.log("Student inherits Person:", student instanceof Student && student instanceof Person);

// Q6 - Person -> Faculty -> Professor prototype chain.
function PersonBase(name) { this.name = name; }
PersonBase.prototype.introduce = function () { return `Name: ${this.name}`; };
function Faculty(name, department) {
  PersonBase.call(this, name);
  this.department = department;
}
Faculty.prototype = Object.create(PersonBase.prototype);
Faculty.prototype.constructor = Faculty;
Faculty.prototype.describeDepartment = function () { return `Department: ${this.department}`; };
function Professor(name, department, subject) {
  Faculty.call(this, name, department);
  this.subject = subject;
}
Professor.prototype = Object.create(Faculty.prototype);
Professor.prototype.constructor = Professor;
Professor.prototype.describeSubject = function () { return `Subject: ${this.subject}`; };
const professor = new Professor("Dr. Iyer", "Computer Science", "Operating Systems");
console.log("Q6:", professor.introduce(), professor.describeDepartment(), professor.describeSubject());

// Q7 - Closure: the returned function retains access to the multiplier parameter.
function makeMultiplier(multiplier) {
  return function (number) { return number * multiplier; };
}
const triple = makeMultiplier(3);
console.log("Q7 triple(5):", triple(5)); // 15; multiplier remains in the closure's lexical environment.

// Q8 - A map-like Array prototype method. It preserves sparse array slots and supports thisArg.
if (!Object.prototype.hasOwnProperty.call(Array.prototype, "myMap")) {
  Object.defineProperty(Array.prototype, "myMap", {
    configurable: true,
    writable: true,
    enumerable: false,
    value: function (callback, thisArg) {
      if (this == null) throw new TypeError("myMap called on null or undefined");
      if (typeof callback !== "function") throw new TypeError("Callback must be a function");
      const source = Object(this);
      const length = source.length >>> 0;
      const result = new Array(length);
      for (let index = 0; index < length; index++) {
        if (index in source) result[index] = callback.call(thisArg, source[index], index, source);
      }
      return result;
    }
  });
}
console.log("Q8 myMap:", [1, 2, 3].myMap(number => number * 2));

// Q9 - The same Person -> Student inheritance written with ES6 classes.
class PersonClass {
  constructor(name) { this.name = name; }
  getName() { return this.name; }
}
class StudentClass extends PersonClass {
  constructor(name, branch) {
    super(name); // super() must initialize `this` before it is used in a derived constructor.
    this.branch = branch;
  }
  getBranch() { return this.branch; }
}
const classStudent = new StudentClass("Meera", "Computer Science");
console.log("Q9 class version:", classStudent.getName(), classStudent.getBranch());
console.log("Class and prototype versions match:", student.getName() === classStudent.getName() && student.getBranch() === classStudent.getBranch());
