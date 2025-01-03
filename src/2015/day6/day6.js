import {
  add,
  chain,
  compose,
  curry,
  F,
  flatten,
  head,
  identity,
  juxt,
  map,
  match,
  max,
  not,
  split,
  sum,
  T,
  times,
  trim,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      chain(identity),
      juxt([
        compose(trim, head, split(/ \d/)),
        compose(map(compose(map(Number), split(','))), match(/\d+,\d+/g)),
      ]),
    ),
  ),
  split('\n'),
);

const count = curry((condition, instructions) => {
  const matrix = times(() => times(() => 0, 1000), 1000);
  for (const [action, from, to] of instructions) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (i >= from[0] && i <= to[0] && j >= from[1] && j <= to[1]) {
          matrix[i][j] = condition[action](matrix[i][j]);
        }
      }
    }
  }
  return matrix;
});

const part1 = compose(
  sum,
  flatten,
  count({
    toggle: not,
    'turn off': F,
    'turn on': T,
  }),
  prepare,
);

const part2 = compose(
  sum,
  flatten,
  count({
    toggle: add(2),
    'turn off': compose(max(0), add(-1)),
    'turn on': add(1),
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
