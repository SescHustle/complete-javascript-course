'use strict';
let secretNumber = Number(Math.trunc(Math.random() * 20)) + 1;
let score = 20;
let highscore = 0;


document.querySelector('.check').addEventListener('click', function () {
    const guess = Number(document.querySelector('.guess').value);

    // No input.
    if (!guess) {
        document.querySelector('.message').textContent = 'No number provided!';
        return;
    }

    // Comparison
    if (guess > secretNumber) {
        if (--score <= 0) {
            document.querySelector('.message').textContent = 'You lost!';
            document.querySelector('.score').textContent = 0;
            return;
        }
        document.querySelector('.message').textContent = 'Too high!';
        document.querySelector('.score').textContent = score;
    }
    if (guess < secretNumber) {
        if (--score <= 0) {
            document.querySelector('.message').textContent = 'You lost!';
            document.querySelector('.score').textContent = 0;
            return;
        }
        document.querySelector('.message').textContent = 'Too low!';
        document.querySelector('.score').textContent = score;
    }

    // Player wins.
    if (guess === secretNumber) {
        highscore = (score > highscore) ? score : highscore;
        document.querySelector('.highscore').textContent = highscore;
        document.querySelector('.message').textContent = 'Correct Number!';
        document.querySelector('body').style.backgroundColor = '#60b347';
        document.querySelector('.number').style.width = '30rem';
        document.querySelector('.number').textContent = secretNumber;
    }
});

document.querySelector('.again').addEventListener('click', function () {
    document.querySelector('body').style.backgroundColor = '#222';
    document.querySelector('.number').style.width = '15rem';
    document.querySelector('.number').textContent = '?';
    score = 20;
    document.querySelector('.guess').value = null;
    document.querySelector('.score').textContent = score;
    secretNumber = Number(Math.trunc(Math.random() * 20)) + 1;
});