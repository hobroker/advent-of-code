import { read } from '../../../lib/read.js';
import { compose, map, reduce, split } from 'ramda';

const data = read('input.txt');

const winPoints = 6;
const tiePoints = 3;
const choiceScoreMap = {
  X: 1, // rock
  Y: 2, // paper
  Z: 3, // scissors
};
const winMap = {
  A: 'Y', // to win rock
  B: 'Z', // to win paper
  C: 'X', // to win scissors
};
const loseMap = {
  A: 'Z', // to lose rock
  B: 'X', // to lose paper
  C: 'Y', // to lose scissors
};
const tieMap = {
  A: 'X',
  B: 'Y',
  C: 'Z',
};

const prepare = compose(map(split(' ')), split('\n'));
const getScore = reduce((acc, [a, b]) => {
  if (winMap[a] === b) {
    return acc + choiceScoreMap[b] + winPoints;
  }
  if (tieMap[a] === b) {
    return acc + choiceScoreMap[b] + tiePoints;
  }
  return acc + choiceScoreMap[b];
}, 0);

const part1 = compose(getScore, prepare);
const part2 = compose(
  getScore,
  map(([a, b]) => [
    a,
    b === 'Y' ? tieMap[a] : b === 'X' ? loseMap[a] : winMap[a],
  ]),
  prepare,
);

console.log('part 1 ', part1(data));
console.log('part 2 ', part2(data));
