import {
  addIndex,
  all,
  applySpec,
  compose,
  curry,
  equals,
  map,
  max,
  min,
  reduce,
  slice,
  split,
  sum,
  transpose,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const reduceIndexed = addIndex(reduce);
const manhattan = ([[x1, x2], [y1, y2]]) =>
  Math.abs(x1 - y1) + Math.abs(x2 - y2);
const pairsFromArray = arr =>
  arr.flatMap((x, i) => arr.slice(i + 1).map(y => [x, y]));
const inRange = curry(
  (v1, v2, i) => v1 !== v2 && i > min(v1, v2) && i < max(v1, v2),
);
const expanse2 = curry((dots, v1, v2) => dots.filter(inRange(v1, v2)).length);
const isEmpty = all(equals('.'));
const pairDistance = curry(
  (expandBy, dotRows, dotCols, [p1, p2]) =>
    expandBy *
      (expanse2(dotRows, p1[0], p2[0]) + expanse2(dotCols, p1[1], p2[1])) +
    manhattan([
      [p1[0], p1[1]],
      [p2[0], p2[1]],
    ]),
);
const findDotRows = matrix =>
  matrix.reduce((acc, row, i) => (isEmpty(row) ? [...acc, i] : acc), []);

const prepare = compose(
  applySpec({
    dotRows: findDotRows,
    dotCols: compose(findDotRows, transpose),
    pairs: compose(
      pairsFromArray,
      reduceIndexed(
        (acc, row, rowIdx) =>
          row.reduce(
            (acc, cell, cellIdx) =>
              cell === '#' ? [...acc, [rowIdx, cellIdx]] : acc,
            acc,
          ),
        [],
      ),
    ),
  }),
  map(split('')),
  split('\n'),
);

const part1 = compose(
  sum,
  ({ pairs, dotRows, dotCols }) =>
    pairs.map(pairDistance(2 - 1, dotRows, dotCols)),
  prepare,
);

const part2 = compose(
  sum,
  ({ pairs, dotRows, dotCols }) =>
    pairs.map(pairDistance(1000000 - 1, dotRows, dotCols)),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
