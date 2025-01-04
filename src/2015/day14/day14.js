import {
  always,
  applySpec,
  compose,
  map,
  match,
  max,
  nth,
  prop,
  propEq,
  reduce,
  slice,
  split,
  times,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  deers => {
    times(i => {
      deers.forEach(deer => {
        if (i % (deer.fly + deer.rest) < deer.fly) {
          deer.distance += deer.speed;
        }
      });
      deers
        .filter(propEq(Math.max(...deers.map(prop('distance'))), 'distance'))
        .forEach(deer => deer.points++);
    }, 2503);
    return deers;
  },
  map(
    compose(
      applySpec({
        name: nth(0),
        speed: compose(Number, nth(1)),
        fly: compose(Number, nth(2)),
        rest: compose(Number, nth(3)),
        distance: always(0),
        points: always(0),
      }),
      slice(1, 5),
      match(/(.*) can.* (\d+) .* (\d+) .* (\d+) seconds./),
    ),
  ),
  split('\n'),
);

const part1 = compose(reduce(max, 0), map(prop('distance')), prepare);
const part2 = compose(reduce(max, 0), map(prop('points')), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
