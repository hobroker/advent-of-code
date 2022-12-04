import { read } from '../../lib/read.js';
import { compose, filter, length, map, split } from 'ramda';

const data = read('input.txt');

const prepare = compose(
  map(compose(map(compose(map(Number), split('-'))), split(','))),
  split('\n'),
);

const contains = ([[a, b], [c, d]]) => (a >= c && b <= d) || (c >= a && d <= b);
const overlaps = ([[a, b], [c, d]]) => a <= d && c <= b;

const part1 = compose(length, filter(contains), prepare);
const part2 = compose(length, filter(overlaps), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
