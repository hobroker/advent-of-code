import {
  always,
  compose,
  curry,
  equals,
  evolve,
  filter,
  ifElse,
  length,
  map,
  multiply,
  prop,
  propEq,
  reduce,
  split,
  sum,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  rows =>
    rows.reduce(
      ({ numbers, gears }, row, rowIdx) => ({
        numbers: [
          ...numbers,
          ...[...row.matchAll(/\d+/g)].map(({ 0: value, index }) => ({
            row: rowIdx,
            fromCol: index,
            toCol: index + value.length - 1,
            value: Number(value),
          })),
        ],
        gears: [
          ...gears,
          ...[...row.matchAll(/[^(.|\d)]/g)].map(({ 0: value, index }) => ({
            row: rowIdx,
            col: index,
            value,
          })),
        ],
      }),
      { numbers: [], gears: [] },
    ),
  split('\n'),
);

const findAdjacent = curry((numberMap, gearCoord) =>
  numberMap.filter(
    ({ row, fromCol, toCol }) =>
      ((row === gearCoord.row - 1 || row === gearCoord.row + 1) &&
        fromCol <= gearCoord.col + 1 &&
        gearCoord.col - 1 <= toCol) ||
      (row === gearCoord.row &&
        (toCol === gearCoord.col - 1 || fromCol === gearCoord.col + 1)),
  ),
);

const part1 = compose(
  sum,
  ({ numbers, gears }) =>
    gears.flatMap(compose(map(prop('value')), findAdjacent(numbers))),
  prepare,
);

const part2 = compose(
  sum,
  ({ numbers, gears }) =>
    gears.flatMap(
      compose(
        ifElse(
          compose(equals(2), length),
          compose(reduce(multiply, 1), map(prop('value'))),
          always([]),
        ),
        findAdjacent(numbers),
      ),
    ),
  evolve({
    gears: filter(propEq('value', '*')),
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
