import {
  allPass,
  complement,
  compose,
  filter,
  length,
  split,
  test,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(split('\n'));

const part1 = compose(
  length,
  filter(
    allPass([
      test(/([aeiou].*?){3}/i),
      test(/(.)\1/),
      complement(test(/ab|cd|pq|xy/)),
    ]),
  ),
  prepare,
);

const part2 = compose(
  length,
  filter(allPass([test(/(..).*\1/g), test(/(.).\1/)])),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
