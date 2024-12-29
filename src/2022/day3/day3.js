import { read } from '../../../lib/read.js';
import {
  compose,
  converge,
  head,
  identity,
  intersection,
  length,
  map,
  multiply,
  reduce,
  split,
  splitAt,
  splitEvery,
  sum,
  tail,
} from 'ramda';

const data = read('input.txt');

const toCode = letter => {
  const charCode = letter.charCodeAt(0);
  const result = charCode - 96;
  return result > 0 ? result : charCode - 38;
};

const sumChars = compose(sum, map(compose(toCode, head)));
const intersects = converge(reduce(intersection), [head, tail]);

const prepare = compose(map(split('')), split('\n'));

const part1 = compose(
  sumChars,
  map(intersects),
  map(converge(splitAt, [compose(multiply(0.5), length), identity])),
  prepare,
);

const part2 = compose(sumChars, map(intersects), splitEvery(3), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
