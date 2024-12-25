import {
  add,
  all,
  always,
  compose,
  count,
  curry,
  equals,
  groupBy,
  gt,
  ifElse,
  map,
  mapObjIndexed,
  split,
  startsWith,
  transpose,
  zipWith,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const prepare = compose(
  mapObjIndexed(
    map(
      compose(
        map(compose(add(-1), count(equals('#')))),
        transpose,
        split('\n'),
      ),
    ),
  ),
  groupBy(
    compose(
      ifElse(compose(startsWith('#####')), always('locks'), always('keys')),
    ),
  ),
  split('\n\n'),
);

const isValid = curry(compose(all(gt(6)), zipWith(add)));

const part1 = compose(
  ({ locks, keys }) =>
    locks.reduce((acc, lock) => acc + keys.filter(isValid(lock)).length, 0),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
