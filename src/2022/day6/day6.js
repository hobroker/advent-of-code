import { read } from '../../../lib/read.js';
import { add, compose, split } from 'ramda';

const data = read('input.txt');

const findWindowIndex = (size) =>
  compose(add(size), (list) =>
    list.findIndex(
      (_, idx) => new Set(list.slice(idx, idx + size)).size === size,
    ),
  );

const prepare = compose(split(''));

const part1 = compose(findWindowIndex(4), prepare);
const part2 = compose(findWindowIndex(14), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
