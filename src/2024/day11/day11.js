import { read } from '../../../lib/read.js';
import {
  always,
  compose,
  cond,
  curry,
  equals,
  map,
  multiply,
  split,
  sum,
  T,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(map(Number), split(' '));

const isEvenNumberOfDigits = x => `${x}`.length % 2 === 0;
const splitNumberInTwo = num => {
  const str = num.toString();
  const midIndex = str.length / 2;
  return [Number(str.slice(0, midIndex)), Number(str.slice(midIndex))];
};
const add = fn => (a, b) => a + fn(b);
const step = cond([
  [equals(0), always(1)],
  [isEvenNumberOfDigits, splitNumberInTwo],
  [T, multiply(2024)],
]);

const cache = {};
const countBlinks = curry((n, value) => {
  if (!n) return 1;
  if (cache[value]?.[n]) return cache[value][n];

  return ((cache[value] ||= {})[n] = []
    .concat(step(value))
    .reduce(add(countBlinks(n - 1)), 0));
});

const part1 = compose(sum, map(countBlinks(25)), prepare);

const part2 = compose(sum, map(countBlinks(75)), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
