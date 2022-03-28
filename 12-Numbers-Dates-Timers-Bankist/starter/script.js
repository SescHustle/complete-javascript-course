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
// Functions
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
  labelWelcome.textContent = `Welcome back, ${account.owner.split(' ')[0]}`;
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
function displayMovements(movements, sort = false) {
  movements = sort ? movements.slice().sort((a,b) => a-b) : movements;
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
btnTransfer.addEventListener('click', function(event) {
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
function transfer(receiver, amount) {
  currentAccount.movements.push(-amount);
  receiver.movements.push(amount);
  updateUI(currentAccount);
}
function unlogin(){
  currentAccount = {};
  labelWelcome.textContent = "Log in to get started";
  containerApp.style.opacity = 0;
}
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

function requestLoan(amount) {
  if (currentAccount.movements.some(mov => mov >= amount)) {
    currentAccount.movements.push(amount);
  }
  updateUI(currentAccount);
}

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