import {
  compose,
  converge,
  identity,
  length,
  map,
  multiply,
  nth,
  split,
  splitEvery,
  sum,
  zipWith,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(Number), split(''));

const part1 = compose(
  sum,
  list => list.filter((n, i) => n === list[(i + 1) % list.length]),
  prepare,
);

const part2 = compose(
  sum,
  converge(
    zipWith((a, b) => (a == b ? a * 2 : 0)),
    [nth(0), nth(1)],
  ),
  converge(splitEvery, [compose(multiply(0.5), length), identity]),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
