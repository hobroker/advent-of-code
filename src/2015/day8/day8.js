import { compose, reduce, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(split('\n'));

const part1 = compose(
  reduce((acc, item) => acc + item.length - eval(item).length, 0),
  prepare,
);

const part2 = compose(
  reduce((acc, item) => acc + JSON.stringify(item).length - item.length, 0),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
