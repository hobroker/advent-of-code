import { read } from '../../../lib/read.js';
import {
  compose,
  curry,
  filter,
  findIndex,
  identity,
  juxt,
  length,
  gte,
  map,
  max,
  multiply,
  reduce,
  split,
  sum,
  lte,
} from 'ramda';

const data = read('input.txt');

const listMax = reduce(max, -Infinity);
const gridSlice = (x, y, grid) => [
  grid[x].slice(0, y).reverse(),
  grid
      .slice(0, x)
      .map((row) => row[y])
      .reverse(),
  grid[x].slice(y + 1, grid[x].length),
  grid.slice(x + 1, grid.length).map((row) => row[y]),
];

const isVisible = (x, y, data) =>
  gridSlice(x, y, data)
    .map(listMax)
    .some((max) => max < data[x][y]);

const scenic = compose(
  reduce(multiply, 1),
  map(([slice, idx]) => (idx === -1 ? slice.length : idx + 1)),
  (x, y, grid) =>
    gridSlice(x, y, grid).map(juxt([identity, findIndex(lte(grid[x][y]))])),
);

const walk = curry((fn, grid) =>
  grid.map((row, x) => row.map((_, y) => fn(x, y, grid))),
);

const prepare = compose(map(compose(map(Number), split(''))), split('\n'));

const part1 = compose(
  sum,
  map(compose(length, filter(Boolean))),
  walk(isVisible),
  prepare,
);

const part2 = compose(listMax, map(listMax), walk(scenic), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
