import { compose, countBy, identity, map, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(split('')), split('\n'));

const part1 = compose(
  list => {
    let twos = 0;
    let threes = 0;
    for (const item of list) {
      if (item.includes(2)) twos++;
      if (item.includes(3)) threes++;
    }
    return twos * threes;
  },
  map(compose(Object.values, countBy(identity))),
  prepare,
);

const hasDiffOfOne = (a, b) => {
  let isDiff = false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      if (isDiff) return false;
      isDiff = true;
    }
  }
  return isDiff;
};

const withoutDiff = (a, b) =>
  a.map((char, index) => (char === b[index] ? char : '')).join('');

const part2 = compose(list => {
  for (const a of list) {
    for (const b of list) {
      if (hasDiffOfOne(a, b)) {
        return withoutDiff(a, b);
      }
    }
  }
}, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
