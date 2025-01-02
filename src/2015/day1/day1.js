import { always, compose, equals, ifElse, map, split, sum } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(ifElse(equals('('), always(1), always(-1))),
  split(''),
);

const part1 = compose(sum, prepare);

const part2 = compose(list => {
  let floor = 0;
  for (let i = 0; i < list.length; i++) {
    floor += list[i];
    if (floor === -1) return i + 1;
  }
}, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
