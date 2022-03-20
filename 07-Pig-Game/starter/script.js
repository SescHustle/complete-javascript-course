'use strict';

const player0El = document.querySelector('.player--0');
const player1El = document.querySelector('.player--1');
const score0El = document.getElementById('score--0');
const score1El = document.getElementById('score--1');
const current0El = document.getElementById('current--0');
const current1El = document.getElementById('current--1');

const diceEl = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

const WIN_POINTS = 20;
let [scores, currentScore, activePlayer, gameOn] = [[0,0], 0, 0, true];

const getRoll = function () {
    return Number(Math.trunc(Math.random() * 6)) + 1;
}

const init = function () {
    [scores, currentScore, activePlayer, gameOn] = [[0,0], 0, 0, true];
    [
        score0El.textContent, 
        score1El.textContent,
        current0El.textContent,
        current0El.textContent
    ] = [0, 0, 0, 0];
    diceEl.classList.add('hidden');
    player0El.classList.add('player--active');
    player1El.classList.remove('player--active');
    player0El.classList.remove('player--winner');
    player1El.classList.remove('player--winner');
    
}

const switchPlayer = function () {
    currentScore = 0;
    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
    activePlayer = (activePlayer === 1) ? 0 : 1;
    player0El.classList.toggle('player--active');
    player1El.classList.toggle('player--active');
}

// Game start.
init();

// Rolling a dice.
btnRoll.addEventListener('click', function () {
    if (!gameOn) {
        return;
    }
    
    let roll = getRoll();
    diceEl.src = `dice-${roll}.png`;
    diceEl.classList.remove('hidden');

    if (roll === 1) {
        switchPlayer();
        return;
    }
    currentScore += roll;
    document.getElementById(`current--${activePlayer}`).textContent = currentScore;
});

// Holding current score.
btnHold.addEventListener('click', function () {
    if (!gameOn) {
        return;
    }
    
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent = scores[activePlayer];

    if (!(scores[activePlayer] >= WIN_POINTS)) {
        switchPlayer();
        return;
    }
    
    gameOn = false;
    diceEl.classList.add('hidden');
    document.getElementById(`current--${activePlayer}`).textContent = 0;
    document.querySelector(`.player--${activePlayer}`).classList.add('player--winner');
    document.querySelector(`.player--${activePlayer}`).classList.remove('player--active');
});

// Reset the game.
btnNew.addEventListener('click', init);