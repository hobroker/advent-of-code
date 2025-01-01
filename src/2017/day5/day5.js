import { always, compose, curry, ifElse, lte, map, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(Number), split('\n'));

const jump = curry((incFn, offsets) => {
  let index = 0;
  let steps = 0;
  while (offsets[index] !== undefined) {
    steps++;
    const prevIndex = index;
    index += offsets[index];
    offsets[prevIndex] += incFn(offsets[prevIndex]);
  }

  return steps;
});

const part1 = compose(jump(always(1)), prepare);

const part2 = compose(jump(ifElse(lte(3), always(-1), always(1))), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
