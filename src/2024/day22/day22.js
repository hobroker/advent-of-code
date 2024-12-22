import {
  __,
  compose,
  curry,
  divide,
  identity,
  map,
  multiply,
  reduce,
  split,
  sum,
  times,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const prepare = compose(map(BigInt), split('\n'));

const mix = curry((fn, value) => (fn(value) ^ value) % 16777216n);
const evolveSecret = compose(
  mix(multiply(2048n)),
  mix(divide(__, 32n)),
  mix(multiply(64n)),
);

const part1 = compose(
  sum,
  map(reduce(evolveSecret, __, times(identity, 2000))),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
