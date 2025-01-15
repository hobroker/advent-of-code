import {
  compose,
  countBy,
  identity,
  join,
  map,
  nth,
  path,
  sortBy,
  split,
  toPairs,
  transpose,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(transpose, map(split('')), split('\n'));

const descipher = index =>
  compose(
    join(''),
    map(compose(path([index, 0]), sortBy(nth(1)), toPairs, countBy(identity))),
  );

const part1 = compose(descipher(-1), prepare);

const part2 = compose(descipher(0), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
