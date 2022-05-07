'use strict';
// Coding Challenge #1
console.log('------ CODING CHALLENGE #1 ------');

const Car = function (make, speed)
{
    this.make = make;
    this.speed = speed;
}

Car.prototype.accelerate = function () {
    this.speed += 10;
    console.log(`${this.make} is moving at ${this.speed} km/h`);
}
Car.prototype.brake = function () {
    this.speed -= 5;
    console.log(`${this.make} is moving at ${this.speed} km/h`);
}

const bmw = new Car('BMW', 100);
const lada = new Car('LADA', 80);

bmw.accelerate();
bmw.accelerate();
bmw.brake();
bmw.brake();

lada.accelerate();
lada.accelerate();
lada.brake();
lada.accelerate();

// Coding Challenge #2
console.log('------ CODING CHALLENGE #2 ------');

class CarES6 {
    constructor(make, speed) {
        this.make = make;
        this.speed = speed;
    }

    accelerate() {
        this.speed += 10;
        console.log(`${this.make} is moving at ${this.speed} km/h`);
    }

    brake() {
        this.speed -= 5;
        console.log(`${this.make} is moving at ${this.speed} km/h`);
    }

    get speedUS() {
        return (this.speed / 1.6);
    }

    set speedUS(speed) {
        this.speed = speed * 1.6;
    }
}

const ford = new CarES6('FORD', 70);
ford.accelerate();
ford.accelerate();
ford.speedUS = 60;
console.log(ford.speedUS);
ford.accelerate();

// Coding Challenge #3
console.log('------ CODING CHALLENGE #3 ------');

const ElCar = function(make, speed, charge) {
    Car.call(this, make, speed);
    this.charge = charge;
}
ElCar.prototype = Object.create(Car.prototype);

ElCar.prototype.chargeTo = function(charge) {
    this.charge = charge;
}

ElCar.prototype.accelerate = function() {
    this.speed +=20;
    this.charge--;
    console.log(
        `${this.make} is going at ${this.speed} km/h, with a charge of ${this.charge}`
      );
}

const tesla = new ElCar('Tesla', 120, 23);
tesla.chargeTo(90);
tesla.brake();
tesla.accelerate();

// Coding Challenge #4
console.log('------ CODING CHALLENGE #4 ------');

CarES6.prototype.accelerate = function() {
    this.speed += 10;
    console.log(`${this.make} is moving at ${this.speed} km/h`)
    return this;
}
CarES6.prototype.brake = function() {
    this.speed-= 5;
    console.log(`${this.make} is moving at ${this.speed} km/h`)
    return this;
}

class ElCarES6 extends CarES6{
    #charge;
    
    constructor(make, speed, charge) {
        super(make, speed);
        this.#charge = charge;
    }

    chargeTo(charge) {
        this.#charge = charge;
        return this;
    }

    accelerate() {
        this.speed +=20;
        this.#charge--;
        console.log(
            `${this.make} is going at ${this.speed} km/h, with a charge of ${this.#charge}`
        );
        return this;
    }
}

const rivian = new ElCarES6('Rivian', 120, 23);
console.log(rivian);
rivian
  .accelerate()
  .accelerate()
  .accelerate()
  .brake()
  .chargeTo(50)
  .accelerate();
console.log(rivian.speedUS);