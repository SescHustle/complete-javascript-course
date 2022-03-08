'use strict';
let secretNumber = Number(Math.trunc(Math.random() * 20)) + 1;
let score = 20;
let highscore = 0;

const messageUpdate = function (message) {
    document.querySelector('.message').textContent = message;
}
const scoreUpdate = function (score) {
    document.querySelector('.score').textContent = score;
}
const highscoreUpdate = function (highscore) {
    document.querySelector('.highscore').textContent = highscore;
}
const getGuess = function () {
    return Number(document.querySelector('.guess').value);
}

const playAgain = function () {
    stylesUpdate(false);
    secretNumber = resetValues();
}

const stylesUpdate = function (win = true) {
    let backgroundColor = '#60b347';
    let size = '30rem';
    let textContent = secretNumber;
    if (!win) {
        backgroundColor = '#222';
        size = '15rem';
        textContent = '?';
    }
    document.querySelector('body').style.backgroundColor = backgroundColor;
    document.querySelector('.number').style.width = size;
    document.querySelector('.number').textContent = textContent;
}

const resetValues = function () {
    // Reset values.
    score = 20;
    document.querySelector('.guess').value = null;
    document.querySelector('.score').textContent = score;

    // Return new secret number.
    return Number(Math.trunc(Math.random() * 20)) + 1;
}

document.querySelector('.again').addEventListener('click', playAgain);

document.querySelector('.check').addEventListener('click', function () {
    const guess = getGuess();
    
    // No input.
    if (!guess) {
        messageUpdate('No number provided!');
        return;
    }

    // Comparison
    if (guess !== secretNumber) {
        if (--score <= 0) {
            messageUpdate('You lost!');
            scoreUpdate(0);
            return;
        }
        let message = guess > secretNumber ? 'Too high!' : 'Too low!';
        messageUpdate(message);
        scoreUpdate(score);
        return;
    }

    // Player wins.
    highscore = (score > highscore) ? score : highscore;
    highscoreUpdate(highscore);
    messageUpdate('Correct Number!');
    stylesUpdate(true);
});