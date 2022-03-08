'use strict';

const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.querySelector('#score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

const getRoll = function () {
    return Number(Math.trunc(Math.random() * 6)) + 1;
}

const init = function () {
    diceEl.classList.add('hidden');
    score0El.textContent
        = score1El.textContent
        = current0El.textContent
        = current0El.textContent
        = 0;
}

init();
let currentScore = 0;
btnRoll.addEventListener('click', function() {
    let roll = getRoll();
    diceEl.src = `dice-${roll}.png`;
    diceEl.classList.remove('hidden');

    if (roll === 1) {
        // Switch player.
        return;
    }
    currentScore += roll;
    current0El.textContent = currentScore;
});