'use strict';

// Data needed for a later exercise
const flights =
  '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

// Data needed for first part of the section
const restaurant = {
  name: 'Classico Italiano',
  location: 'Via Angelo Tavanti 23, Firenze, Italy',
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
  mainMenu: ['Pizza', 'Pasta', 'Risotto'],

  openingHours: {
    thu: {
      open: 12,
      close: 22,
    },
    fri: {
      open: 11,
      close: 23,
    },
    sat: {
      open: 0, // Open 24 hours
      close: 24,
    },
  },
};

// Coding Challenge #1
console.log('---- CODING CHALLENGE #1 ----');
const game = {
  team1: 'Bayern Munich',
  team2: 'Borrussia Dortmund',
  players: [
    [
      'Neuer',
      'Pavard',
      'Martinez',
      'Alaba',
      'Davies',
      'Kimmich',
      'Goretzka',
      'Coman',
      'Muller',
      'Gnarby',
      'Lewandowski',
    ],
    [
      'Burki',
      'Schulz',
      'Hummels',
      'Akanji',
      'Hakimi',
      'Weigl',
      'Witsel',
      'Hazard',
      'Brandt',
      'Sancho',
      'Gotze',
    ],
  ],
  score: '4:0',
  scored: ['Lewandowski', 'Gnarby', 'Lewandowski', 'Hummels'],
  date: 'Nov 9th, 2037',
  odds: {
    team1: 1.33,
    x: 3.25,
    team2: 6.5,
  },
};

// 1.
const [players1, players2] = game.players;
console.log(players1, players2);
// 2.
const [gk, ...fieldPlayers] = players1;
console.log(gk, fieldPlayers);
// 3.
const allPlayers = [...players1, ...players2];
console.log(allPlayers);
// 4.
const players1Final = [...players1, 'Thiago', 'Coutinho', 'Perisic'];
console.log(players1Final);
// 5.
const {team1, x: draw, team2} = game.odds;
console.log(team1, draw, team2);
// 6.
const printGoals = function (...players) {
  console.log(players);
  console.log(`${players.length} goals were scored`);
};
printGoals(...game.scored);
// 7.
team1 < team2 && console.log('Team 1 is more likely to win');
team1 > team2 && console.log('Team 2 is more likely to win');

// Coding challenge #2 (uses the same object as #1)
console.log('---- CODING CHALLENGE #2 ----');
// 1.
for (const [goal, player] of game.scored.entries()){
  console.log(`Goal ${goal + 1} scored by ${player}`);
}
// 2.
let average = 0;
const odds = Object.values(game.odds);
for (const odd of odds){
  average += odd;
}
average /= odds.length;
console.log(average);
// 3.
for (const [team, odd] of Object.entries(game.odds)) {
  const teamStr = team === 'x' ? 'draw' : `victory ${game[team]}`;
  console.log(`Odd of ${teamStr} is ${odd}`);
}
// 4.
const scores = {};
for (const player of game.scored) {
  scores[player] ? scores[player]++ : (scores[player] = 1);
}
console.log(scores);

// Coding Challenge #3
console.log('---- CODING CHALLENGE #3 ----');
const gameEvents = new Map([
  [17, '⚽️ GOAL'],
  [36, '🔁 Substitution'],
  [47, '⚽️ GOAL'],
  [61, '🔁 Substitution'],
  [64, '🔶 Yellow card'],
  [69, '🔴 Red card'],
  [70, '🔁 Substitution'],
  [72, '🔁 Substitution'],
  [76, '⚽️ GOAL'],
  [80, '⚽️ GOAL'],
  [92, '🔶 Yellow card'],
]);
// 1.
const [...uniqueEvents] = new Set(gameEvents.values());
console.log(uniqueEvents);
// 2.
gameEvents.delete(64);
console.log(gameEvents);
// 3.
const time = [...gameEvents.keys()].pop();
console.log(`An event happend, on average, every ${time / gameEvents.size} minutes`);
// 4.
for (const [min, event] of gameEvents) {
  const half = min <=45 ? 'FIRST' : 'SECOND';
  console.log(`${half} HALF: ${min}\' - ${event}`);
}

// Coding Challenge #4
console.log('---- CODING CHALLENGE #4 ----');
document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));

const toCamelCase = function (input) {
  const words = input.toLowerCase().trim().split('_');
  let capitalizedWords = [];
  for (const word of words) {
    capitalizedWords.push(word.replace(word[0], word[0].toUpperCase()));
  }
  capitalizedWords[0] = capitalizedWords[0].toLowerCase();
  return capitalizedWords.join('');
}

document.querySelector('button').addEventListener('click', function () {
  const text = document.querySelector('textarea').value;
  const rows = text.split('\n');
  for (const row of rows){
    console.log(toCamelCase(row));
  }
});
