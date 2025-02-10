import { always, compose, times } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = Number;

const findNextIndex = (from, list) => {
  for (let i = from + 1; i < list.length; i++) if (list[i]) return i;
  for (let i = 0; i < from; i++) if (list[i]) return i;
  return -1;
};

const part1 = compose(
  list => {
    while (true) {
      for (let i = 0; i < list.length; i++) {
        if (!list[i]) continue;
        const nextIndex = findNextIndex(i, list);
        if (nextIndex === -1) return i + 1;
        list[i] += list[nextIndex];
        list[nextIndex] = 0;
      }
    }
  },
  times(always(1)),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
