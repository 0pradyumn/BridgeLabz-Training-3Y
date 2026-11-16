class student{
    constructor(name, age){
        this.name = name;
        this.age = age;
    }

    introduce(){
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }

}
const student1 = new student("Pradyumn Singh", 23);
const student2 = new student("John Doe", 22);
student1.introduce();
student2.introduce();