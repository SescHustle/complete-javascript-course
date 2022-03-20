'use strict';
/////////////////////////////////////////////////
// Coding Challenges

// Coding Challenge #1
console.log('---- CODING CHALLENGE #1 ----');
const checkDogs = function(dogs1, dogs2) {
  // 1.
  dogs1.splice(0, 1);
  dogs1.splice(-2);
  // 2.
  const allDogs = dogs1.concat(dogs2);
  // 3.
  allDogs.forEach((dogAge, i) => {
    dogAge >= 3 ?
    console.log(`Dog number ${i + 1} is an adult, and is ${dogAge} years old`) :
    console.log(`Dog number ${i + 1} is still a puppy 🐶`);
  });
}
// 4.
console.log('---- TEST DATA 1 ----');
checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
console.log('---- TEST DATA 2 ----');
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// Coding Challenge #2 and #3
console.log('\n---- CODING CHALLENGE #2 AND #3 ----');
function calcAverageHumanAge(ages) {
  const average = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))                            // 1.
    .filter(age => age >= 18)                                                   // 2.
    .reduce((accumulator, age, _ , arr) => accumulator + age / arr.length, 0);  // 3.
  console.log(average);
}
// 4.
console.log('---- TEST DATA 1 ----');
calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
console.log('---- TEST DATA 2 ----');
calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
let currentAccount = {};
function init() {
  currentAccount = {};
  containerApp.style.opacity = 0;
  accounts.forEach(account => account.username = createUsername(account));
}
function createUsername(account) {
  return account.owner
    .trim()
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
}
function logIn(account) {
  currentAccount = account;
  containerApp.style.opacity = 100;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  updateUI(account);
}
function findAccount(username, pin) {
  const account = accounts.find(account => account.username === username);
  (account?.pin === pin) ?  logIn(account) : labelWelcome.textContent = 'Wrong username or password!';
}
function calcDisplayBalance(account) {
  account.balance = account.movements.reduce((accumulator, mov) => accumulator + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
}
function calcDisplaySummary(account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((accumulator, mov) => accumulator + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((accumulator, mov) => accumulator + Math.abs(mov), 0);
  labelSumOut.textContent = `${outcome}€`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * account.interestRate / 100)
    .filter(interest => interest >= 1)
    .reduce((accumulator, interest) => accumulator + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
}
function displayMovements(movements) {
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}
function displayMovement(movement) {

}
function updateUI(account) {
  displayMovements(account.movements);
  calcDisplayBalance(account);
  calcDisplaySummary(account);
}
init();
btnLogin.addEventListener('click', event => {
  event.preventDefault();
  const username = inputLoginUsername.value.trim().toLowerCase();
  const pin = Number(inputLoginPin.value);
  findAccount(username, pin);
});