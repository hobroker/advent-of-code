import { read } from '../../lib/read.js';
import {
  compose,
  flip,
  head,
  map,
  slice,
  sort,
  split,
  subtract,
  sum,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(
  sort(flip(subtract)),
  map(compose(sum, split('\n'))),
  split('\n\n'),
);

const part1 = compose(head, prepare);
const part2 = compose(sum, slice(0, 3), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
