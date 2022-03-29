'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
// APP
/**
 * Initializes the app.
 */
let currentAccount = {};
function init() {
  currentAccount = {};
  containerApp.style.opacity = 0;
  accounts.forEach(account => account.username = createUsername(account));
}

/**
 * Creates username for user (first letters of the owner names).
 * Ex. 'fs' for 'Firstname Secondname'
 * 
 * @param {*} account 
 * 
 * @returns void
 */
function createUsername(account) {
  return account.owner
    .trim()
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
}

/**
 * Logs into provided account.
 * 
 * @param {*} account 
 */
function logIn(account) {
  currentAccount = account;
  containerApp.style.opacity = 100;
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
  labelWelcome.textContent = `Welcome back, ${account.owner.split(' ')[0]}`;
  updateUI(account);
}

/**
 * Exits from account.
 */
function unlogin(){
  currentAccount = {};
  labelWelcome.textContent = "Log in to get started";
  containerApp.style.opacity = 0;
}

/**
 * Finds account with provided credentials.
 * 
 * @param {*} username 
 * @param {*} pin 
 */
function findAccount(username, pin) {
  const account = accounts.find(account => account.username === username);
  (account?.pin === pin) ?  logIn(account) : labelWelcome.textContent = 'Wrong username or password!';
}

// UI Updates
function updateUI(account) {
  displayMovements(account);
  calcDisplayBalance(account);
  calcDisplaySummary(account);

  // Update date.
  const options = {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  };
  let date = Intl.DateTimeFormat(account.locale, options).format(new Date());
  labelDate.textContent = date;
}

function calcDisplayBalance(account) {
  account.balance = account.movements.reduce((accumulator, mov) => accumulator + mov, 0);
  const formattedBalance = formatCur(account.balance, account.currency, account.locale);
  labelBalance.textContent = `${formattedBalance}`;
}

function calcDisplaySummary(account) {
  let income = account.movements
    .filter(mov => mov > 0)
    .reduce((accumulator, mov) => accumulator + mov, 0);
  income = formatCur(income, account.currency, account.locale);
  labelSumIn.textContent = `${income}`;

  let outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((accumulator, mov) => accumulator + Math.abs(mov), 0);
  outcome = formatCur(outcome, account.currency, account.locale);
  labelSumOut.textContent = `${outcome}`;

  let interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * account.interestRate / 100)
    .filter(interest => interest >= 1)
    .reduce((accumulator, interest) => accumulator + interest, 0);
  interest = formatCur(interest, account.currency, account.locale);
  labelSumInterest.textContent = `${interest}`;
}

function displayMovements(acc, sort = false) {
  let movements = sort ? acc.movements.slice().sort((a,b) => a-b) : acc.movements;
  containerMovements.innerHTML = '';
  movements.forEach((mov, i) => {
    const movDate = formatDate(new Date(acc.movementsDates[i]), acc.locale);
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const formattedMov = formatCur(mov, acc.currency, acc.locale);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${movDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  })
}

function formatDate(date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
}

function formatCur(value, currency, locale = 'en-US') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
}

// Bankig functions
function requestLoan(amount) {
  if (currentAccount.movements.some(mov => mov >= amount)) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
  }
  updateUI(currentAccount);
}

function transfer(receiver, amount) {
  currentAccount.movements.push(-amount);
  currentAccount.movementsDates.push(new Date().toISOString());
  
  receiver.movements.push(amount);
  receiver.movementsDates.push(new Date().toISOString());
  
  updateUI(currentAccount);
}

// APP LOGIC
init();
btnLogin.addEventListener('click', event => {
  event.preventDefault();
  const username = inputLoginUsername.value.trim().toLowerCase();
  const pin = +inputLoginPin.value;
  findAccount(username, pin);
});

btnTransfer.addEventListener('click', event => {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);
  
  // Transfer validation first.
  amount > 0 &&
  currentAccount.balance >= amount && 
  receiver && 
  receiver.username !== currentAccount.username &&
  transfer(receiver, amount);
  
  // Clear fields.
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();
});

btnClose.addEventListener('click', event => {
  event.preventDefault();
  const username = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  
  inputCloseUsername.value = inputClosePin.value = '';
  inputClosePin.blur();
  
  if (currentAccount.username === username && currentAccount.pin === pin) {
    const index = accounts.findIndex(acc => acc.username === username);
    unlogin();
    accounts.splice(index, 1);
  }
})

btnLoan.addEventListener('click', event => {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  amount > 0 && requestLoan(amount);
  inputLoanAmount.value = '' && inputLoanAmount.blur();
})

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});