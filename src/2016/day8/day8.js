import {
  chain,
  compose,
  concat,
  flatten,
  join,
  juxt,
  map,
  match,
  prop,
  slice,
  split,
  sum,
  test,
  times,
  when,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      chain(compose(map(when(test(/\d+/), Number)), slice(1, Infinity))),
      juxt([match(/(.*) (\d+)x(\d+)/), match(/(.*) (.*) .*=(\d+) by (\d+)/)]),
    ),
  ),
  split('\n'),
);

const logMatrix = compose(
  concat('\n'),
  join('\n'),
  map(
    compose(
      join(''),
      map(i => (i ? '#' : ' ')),
    ),
  ),
);

const move = steps =>
  steps.reduce(
    (matrix, [action, ...args]) => {
      if (action === 'rect') {
        const [x, y] = args;
        for (let i = 0; i < y; i++) {
          for (let j = 0; j < x; j++) {
            matrix[i][j] = 1;
          }
        }
      } else {
        const [type, x, amount] = args;
        if (type === 'row') {
          matrix[x] = matrix[x]
            .slice(-amount)
            .concat(matrix[x].slice(0, -amount));
        } else {
          matrix.map(prop(x)).forEach((_, i, copy) => {
            matrix[i][x] = copy[(i - amount + copy.length) % copy.length];
          });
        }
      }
      return matrix;
    },
    times(() => times(() => 0, 50), 6),
  );

const part1 = compose(sum, flatten, move, prepare);

const part2 = compose(logMatrix, move, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
