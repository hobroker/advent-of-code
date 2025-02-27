import { compose, map, reduce, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(Number), split('\n'));

const part1 = compose(
  reduce((acc, x) => acc + Math.floor(x / 3) - 2, 0),
  prepare,
);

const fuel2 = (x, sum = 0) => {
  x = Math.floor(x / 3) - 2;
  if (x < 0) return sum;
  return fuel2(x, sum + x);
};

const part2 = compose(
  reduce((acc, x) => acc + fuel2(x), 0),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
