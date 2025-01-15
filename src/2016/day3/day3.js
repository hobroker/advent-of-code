import {
  chain,
  compose,
  filter,
  length,
  map,
  match,
  split,
  splitEvery,
  transpose,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(compose(map(Number), match(/\d+/g))), split('\n'));

const filterValid = filter(([a, b, c]) => a + b > c && a + c > b && b + c > a);

const part1 = compose(length, filterValid, prepare);

const part2 = compose(
  length,
  filterValid,
  chain(transpose),
  splitEvery(3),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
