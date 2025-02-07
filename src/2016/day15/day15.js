import { append, compose, map, match, slice, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      map(Number),
      slice(2, Infinity),
      match(
        /Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)./,
      ),
    ),
  ),
  split('\n'),
);

const findTime = discs => {
  let time = 0;
  while (
    ++time &&
    !discs.every(
      ([positions, position], index) =>
        (time + index + 1 + position) % positions === 0,
    )
  );
  return time;
};

const part1 = compose(findTime, prepare);

const part2 = compose(findTime, append([11, 0]), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
