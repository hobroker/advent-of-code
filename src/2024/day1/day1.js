import { read } from '../../../lib/read.js';
import { compose, equals, map, sort, split, sum, transpose } from 'ramda';

const data = read('input.txt');

const prepare = compose(transpose, map(split('   ')), split('\n'));

const part1 = compose(
  sum,
  ([a, b]) => a.map((x, i) => Math.abs(x - b[i])),
  map(sort((a, b) => a - b)),
  prepare,
);

const part2 = compose(
  sum,
  ([a, b]) => a.map(x => x * b.filter(equals(x)).length),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
