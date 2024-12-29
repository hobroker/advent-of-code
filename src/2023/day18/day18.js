import { applySpec, compose, map, nth, prop, replace, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      applySpec({
        dir: nth(0),
        count: compose(Number, nth(1)),
        color: compose(replace(/\(|\)/g, ''), nth(2)),
      }),
      split(' '),
    ),
  ),
  split('\n'),
);

const directions = {
  L: ([x, y], count) => [x - count, y],
  R: ([x, y], count) => [x + count, y],
  U: ([x, y], count) => [x, y - count],
  D: ([x, y], count) => [x, y + count],
};

const calcArea = steps => {
  let position = [0, 0];
  let outline = 0;
  let area = 0;
  for (const { dir, count } of steps) {
    const next = directions[dir](position, count);
    area += (position[0] * next[1] - position[1] * next[0]) / 2;
    outline += count;
    position = next;
  }
  return Math.abs(area) - (outline / 2 - 1) + outline;
};

const part1 = compose(calcArea, prepare);

const part2 = compose(
  calcArea,
  map(
    compose(
      applySpec({
        count: hex => parseInt(hex.slice(1, -1), 16),
        dir: hex => 'RDLU'[hex.slice(-1)],
      }),
      prop('color'),
    ),
  ),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
