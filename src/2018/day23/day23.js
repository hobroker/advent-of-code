import {
  applySpec,
  compose,
  converge,
  count,
  curry,
  identity,
  last,
  map,
  match,
  maxBy,
  prop,
  slice,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      applySpec({
        pos: slice(0, 3),
        range: last,
      }),
      map(Number),
      match(/-?\d+/g),
    ),
  ),
  split('\n'),
);

const distance = (v1, v2) =>
  Math.abs(v1[0] - v2[0]) + Math.abs(v1[1] - v2[1]) + Math.abs(v1[2] - v2[2]);

const countInRangeFrom = curry((target, bots) =>
  count(({ pos }) => distance(target.pos, pos) <= target.range, bots),
);

const part1 = compose(
  converge(countInRangeFrom, [
    bots => bots.reduce(maxBy(prop('range'))),
    identity,
  ]),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
