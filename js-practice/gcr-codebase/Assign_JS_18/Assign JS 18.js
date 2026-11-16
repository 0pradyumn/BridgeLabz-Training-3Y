// ============================================================
// ASSIGNMENT 8 - OOP in JavaScript (Complete Solutions)
// ============================================================

// ============================================================
// Q1. Student Result Processing (reduce + Classes)
// ============================================================
console.log("===== Q1. Student Result Processing =====");

class Student {
    constructor(name, marks) {
        this.name = name;
        this.marks = marks;
    }

    // Calculate average using reduce()
    calculateAverage() {
        const total = this.marks.reduce((sum, mark) => sum + mark, 0);
        return total / this.marks.length;
    }

    // Return grade based on average: A/B/C/F
    getGrade() {
        const avg = this.calculateAverage();
        if (avg >= 90) return "A";
        if (avg >= 75) return "B";
        if (avg >= 50) return "C";
        return "F";
    }
}

// Testing the class with 3 students
const students = [
    new Student("Pradyumn", [85, 90, 88, 92]),
    new Student("Rahul", [70, 65, 80, 72]),
    new Student("Aman", [40, 35, 45, 30])
];

students.forEach(student => {
    console.log(`${student.name} -> Average: ${student.calculateAverage().toFixed(2)}, Grade: ${student.getGrade()}`);
});

// ============================================================
// Q2. Online Food Ordering (map + Error Handling)
// ============================================================
console.log("\n===== Q2. Online Food Ordering =====");

const menu = [
    { item: "Burger", price: 120 },
    { item: "Pizza", price: 250 },
    { item: "Pasta", price: 180 },
    { item: "Sandwich", price: 90 }
];

function calculateBill(orderItems) {
    // Use map() to get the price list
    const priceList = orderItems.map(orderItem => {
        const menuItem = menu.find(m => m.item === orderItem);
        if (!menuItem) {
            throw new Error(`"${orderItem}" is not a valid item on the menu.`);
        }
        return menuItem.price;
    });

    // Use reduce() to calculate the total
    const total = priceList.reduce((sum, price) => sum + price, 0);
    return total;
}

// Valid order
try {
    const order = ["Burger", "Pizza", "Sandwich"];
    console.log(`Order: ${order.join(", ")}`);
    console.log(`Total Bill: Rs. ${calculateBill(order)}`);
} catch (error) {
    console.error("Order failed:", error.message);
}

// Invalid order (handled using try-catch)
try {
    const badOrder = ["Burger", "Sushi", "Pasta"];
    console.log(`Order: ${badOrder.join(", ")}`);
    console.log(`Total Bill: Rs. ${calculateBill(badOrder)}`);
} catch (error) {
    console.error("Order failed:", error.message);
}

// ============================================================
// Q3. Product Discount System
// ============================================================
console.log("\n===== Q3. Product Discount System =====");

// Constructor function
function Product(name, price) {
    this.name = name;
    this.price = price;
}

// Prototype method: returns new price after discount
Product.prototype.applyDiscount = function (percent) {
    const discountAmount = (this.price * percent) / 100;
    return this.price - discountAmount;
};

// Create 3 products and apply different discounts
const p1 = new Product("Laptop", 60000);
const p2 = new Product("Headphones", 2000);
const p3 = new Product("Smartwatch", 5000);

console.log(`${p1.name}: Rs. ${p1.price} -> after 10% discount: Rs. ${p1.applyDiscount(10)}`);
console.log(`${p2.name}: Rs. ${p2.price} -> after 25% discount: Rs. ${p2.applyDiscount(25)}`);
console.log(`${p3.name}: Rs. ${p3.price} -> after 50% discount: Rs. ${p3.applyDiscount(50)}`);

// Abstraction: the user simply calls applyDiscount() without worrying
// about the discount formula (percentage calculation logic is hidden).

// ============================================================
// Q4. Employee Inheritance
// ============================================================
console.log("\n===== Q4. Employee Inheritance =====");

class Employee {
    constructor(name, department) {
        this.name = name;
        this.department = department;
    }

    work() {
        return `${this.name} is working in the ${this.department} department.`;
    }
}

// Manager inherits from Employee
class Manager extends Employee {
    constructor(name, department, teamSize) {
        super(name, department);
        this.teamSize = teamSize;
    }

    // Overriding the work() method
    work() {
        return `${this.name} is managing the ${this.department} department with a team of ${this.teamSize} people.`;
    }
}

const emp1 = new Employee("Suresh", "Development");
const mgr1 = new Manager("Mahesh", "Engineering", 15);

// Runtime polymorphism: the same method call behaves differently
// depending on the actual object type
console.log(emp1.work()); // Employee's version
console.log(mgr1.work()); // Manager's overridden version

// ============================================================
// Q5. Ride-Sharing Application
// ============================================================
console.log("\n===== Q5. Ride-Sharing Application =====");

class User {
    constructor(name, rating) {
        this.name = name;
        this.rating = rating;
    }
}

// Driver inherits from User
class Driver extends User {
    constructor(name, rating, vehicleDetails) {
        super(name, rating);
        this.vehicleDetails = vehicleDetails;
    }
}

class Trip {
    constructor(fromLocation, toLocation, distance) {
        this.fromLocation = fromLocation;
        this.toLocation = toLocation;
        this.distance = distance;
    }

    // Fare = base fare + rate per km
    calculateFare() {
        if (this.distance === undefined || this.distance === null) {
            throw new Error("Distance is not provided for this trip.");
        }
        if (this.distance < 0) {
            throw new Error("Distance cannot be negative.");
        }
        const baseFare = 50;
        const ratePerKm = 12;
        return baseFare + this.distance * ratePerKm;
    }
}

const driver1 = new Driver("Vikram", 4.8, "Swift Dzire - UP32 AB 1234");
console.log(`Driver: ${driver1.name}, Rating: ${driver1.rating}, Vehicle: ${driver1.vehicleDetails}`);

// Valid trip
try {
    const trip1 = new Trip("Lucknow", "Kanpur", 90);
    console.log(`Trip ${trip1.fromLocation} -> ${trip1.toLocation} (${trip1.distance} km): Fare = Rs. ${trip1.calculateFare()}`);
} catch (error) {
    console.error("Trip error:", error.message);
}

// Invalid trip: negative distance
try {
    const trip2 = new Trip("Lucknow", "Delhi", -20);
    trip2.calculateFare();
} catch (error) {
    console.error("Trip error:", error.message);
}

// Invalid trip: distance not provided
try {
    const trip3 = new Trip("Lucknow", "Varanasi");
    trip3.calculateFare();
} catch (error) {
    console.error("Trip error:", error.message);
}

// ============================================================
// Q6. E-Commerce Inventory System
// ============================================================
console.log("\n===== Q6. E-Commerce Inventory System =====");

const inventory = [
    { id: 1, name: "Laptop", category: "Electronics", price: 60000, stock: 5 },
    { id: 2, name: "Mouse", category: "Electronics", price: 500, stock: 2 },
    { id: 3, name: "T-Shirt", category: "Clothing", price: 800, stock: 25 },
    { id: 4, name: "Jeans", category: "Clothing", price: 1500, stock: 8 },
    { id: 5, name: "Rice (5kg)", category: "Grocery", price: 400, stock: 3 },
    { id: 6, name: "Keyboard", category: "Electronics", price: 1200, stock: 12 }
];

// 1. Get low stock products using filter()
function getLowStockProducts(products, threshold = 5) {
    return products.filter(p => p.stock < threshold);
}

// 2. Sort products by price using sort()
function sortProductsByPrice(products) {
    return [...products].sort((a, b) => a.price - b.price);
}

// 3. Calculate total inventory value using reduce()
function calculateTotalInventoryValue(products) {
    return products.reduce((total, p) => total + p.price * p.stock, 0);
}

// 4. Group by category using reduce() + object grouping
function groupByCategory(products) {
    return products.reduce((groups, p) => {
        if (!groups[p.category]) {
            groups[p.category] = [];
        }
        groups[p.category].push(p);
        return groups;
    }, {});
}

console.log("Low stock products:", getLowStockProducts(inventory).map(p => p.name));
console.log("Sorted by price:", sortProductsByPrice(inventory).map(p => `${p.name} (Rs. ${p.price})`));
console.log("Total inventory value: Rs.", calculateTotalInventoryValue(inventory));
console.log("Grouped by category:", groupByCategory(inventory));

// ============================================================
// Q7. Banking Application
// ============================================================
console.log("\n===== Q7. Banking Application =====");

class BankAccount {
    #balance; // private field

    constructor(initialBalance = 0) {
        this.#balance = initialBalance;
    }

    deposit(amount) {
        if (amount <= 0) {
            throw new Error("Deposit amount must be greater than zero.");
        }
        this.#balance += amount;
        console.log(`Deposited Rs. ${amount}. New balance: Rs. ${this.#balance}`);
    }

    withdraw(amount) {
        if (amount <= 0) {
            throw new Error("Withdrawal amount must be greater than zero.");
        }
        if (amount > this.#balance) {
            throw new Error("Insufficient balance!");
        }
        this.#balance -= amount;
        console.log(`Withdrew Rs. ${amount}. New balance: Rs. ${this.#balance}`);
    }

    getBalance() {
        return this.#balance;
    }
}

const account = new BankAccount(1000);
console.log(`Initial balance: Rs. ${account.getBalance()}`);

// Valid deposits
try {
    account.deposit(500);
    account.deposit(200);
} catch (error) {
    console.error("Deposit failed:", error.message);
}

// Valid withdrawal
try {
    account.withdraw(300);
} catch (error) {
    console.error("Withdrawal failed:", error.message);
}

// Invalid withdrawal (handled using try-catch)
try {
    account.withdraw(5000);
} catch (error) {
    console.error("Withdrawal failed:", error.message);
}

console.log(`Final balance: Rs. ${account.getBalance()}`);

// ============================================================
// Q8. Movie Ticket Booking System
// ============================================================
console.log("\n===== Q8. Movie Ticket Booking System =====");

class MovieTicket {
    constructor(movieName, seatNo, price) {
        this.movieName = movieName;
        this.seatNo = seatNo;
        this.price = price;
    }

    // Method defined on the parent class
    showTicketDetails() {
        return `Movie: ${this.movieName}, Seat: ${this.seatNo}, Price: Rs. ${this.price}`;
    }
}

// OnlineTicket inherits from MovieTicket
class OnlineTicket extends MovieTicket {
    constructor(movieName, seatNo, price, convenienceFee) {
        super(movieName, seatNo, price);
        this.convenienceFee = convenienceFee;
    }

    getTotalAmount() {
        return this.price + this.convenienceFee;
    }
}

const ticket1 = new OnlineTicket("Avengers", "A12", 300, 20);
const ticket2 = new OnlineTicket("Spider-Man", "B5", 250, 20);

// Calling the parent method on OnlineTicket objects
// (demonstrates the prototype chain: OnlineTicket -> MovieTicket)
console.log(ticket1.showTicketDetails());
console.log(`Total amount (with convenience fee): Rs. ${ticket1.getTotalAmount()}`);
console.log(ticket2.showTicketDetails());
console.log(`Total amount (with convenience fee): Rs. ${ticket2.getTotalAmount()}`);

// ============================================================
// Q9. Fitness App Analytics
// ============================================================
console.log("\n===== Q9. Fitness App Analytics =====");

class FitnessAnalytics {
    constructor(data) {
        if (!data || data.length === 0) {
            throw new Error("Dataset is empty! Cannot perform analytics.");
        }
        this.data = data;
    }

    // Users with steps > 7000 using filter()
    getActiveUsers() {
        return this.data.filter(user => user.steps > 7000);
    }

    // Average calories using reduce()
    getAverageCalories() {
        const totalCalories = this.data.reduce((sum, user) => sum + user.calories, 0);
        return totalCalories / this.data.length;
    }

    // Format as messages using map()
    getUserSummary() {
        return this.data.map(user =>
            `User ${user.user}: ${user.steps} steps, ${user.calories} calories burned.`
        );
    }
}

try {
    const workoutData = [
        { user: "A", steps: 8000, calories: 300 },
        { user: "B", steps: 12000, calories: 500 },
        { user: "C", steps: 4000, calories: 200 }
    ];

    const analytics = new FitnessAnalytics(workoutData);

    console.log("Active users:", analytics.getActiveUsers().map(u => u.user));
    console.log("Average calories:", analytics.getAverageCalories());
    console.log("User summaries:");
    analytics.getUserSummary().forEach(msg => console.log("  " + msg));

    // Empty dataset -> throws error
    new FitnessAnalytics([]);
} catch (error) {
    console.error("Analytics error:", error.message);
}
