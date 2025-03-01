import { compose, curry, equals, lte, map, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(Number), split('-'));

const isValid = curry((adjacentCountFn, number) => {
  const string = number.toString();
  if (string.length !== 6) return false;
  const seen = [];
  for (let i = 1; i < string.length; i++) {
    const a = +string.charAt(i);
    const b = +string.charAt(i - 1);
    if (a < b) return false;
    if (i === 1) seen[b] = 1;
    seen[a] = (seen[a] || 0) + 1;
  }
  return seen.some(adjacentCountFn);
});

const countValid = curry((isValid, [from, to]) => {
  let count = 0;
  while (from <= to) {
    if (isValid(from++)) count++;
  }
  return count;
});

const part1 = compose(countValid(isValid(lte(2))), prepare);
const part2 = compose(countValid(isValid(equals(2))), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
