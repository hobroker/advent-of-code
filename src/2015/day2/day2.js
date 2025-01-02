import { compose, map, sort, split, subtract, sum } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(compose(sort(subtract), map(Number), split('x'))),
  split('\n'),
);

const part1 = compose(
  sum,
  map(([l, w, h]) => 2 * l * w + 2 * l * h + 2 * w * h + l * w),
  prepare,
);

const part2 = compose(
  sum,
  map(([l, w, h]) => 2 * l + 2 * w + l * w * h),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
