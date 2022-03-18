'use strict';

// Coding challenge #1.
console.log('---- CODING CHALLENGE #1 ----');

const poll = {
    question: 'What is your favorite programming language?',
    options: [
        'c++',
        'java',
        'python',
        'javascript',
    ],
    answers: new Array(4).fill(0),
    registerNewAnswer() {
        const answer = prompt(`${this.question}\n${this.options.join('\n')}`).trim().toLowerCase();
        // Add new answer if such option exists
        this.options.indexOf(answer) >= 0 && this.answers[this.options.indexOf(answer)]++;
        this.displayAnswers();
        this.displayAnswers('string');
    },
    displayAnswers(type = 'array') {
        switch (type) {
            case 'array':
                console.log(this.answers);
                break;
            case 'string':
                alert(`Poll results are ${this.answers.join(', ')}`);
                break;
            default:
                alert('Wrong display type!');
                break;
        }
    }
}

document.querySelector('.poll').addEventListener('click', poll.registerNewAnswer.bind(poll));
poll.displayAnswers.call({ answers: [5, 2, 3] }, 'string');
poll.displayAnswers.call({ answers: [1, 5, 3, 9, 6, 1] }, 'string');
poll.displayAnswers.call({ answers: [1, 5, 3, 9, 6, 1] });