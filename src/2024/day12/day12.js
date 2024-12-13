import { read } from '../../../lib/read.js';
import {
  add,
  any,
  applySpec,
  compose,
  identity,
  map,
  reduce,
  split,
  sum,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(map(split('')), split('\n'));

const directions = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const xyEquals =
  ([x1, y1]) =>
  ([x2, y2]) =>
    x1 === x2 && y1 === y2;

const perimeter = ({ region, matrix }) =>
  region
    .flatMap(([x, y]) =>
      directions.map(([dx, dy]) => matrix[x][y] !== matrix[x + dx]?.[y + dy]),
    )
    .reduce(add, 0);

const part1 = compose(
  sum,
  ({ matrix, regions }) =>
    regions.map(region => region.length * perimeter({ region, matrix })),
  applySpec({
    matrix: identity,
    regions: matrix =>
      matrix.reduce((regions, row, i) => {
        row.forEach((block, j) => {
          if (regions.some(any(xyEquals([i, j])))) return;

          const plotsToExplore = [[i, j]];
          const region = [[i, j]];
          regions.push(region);

          while (plotsToExplore.length) {
            const plot = plotsToExplore.pop();
            const [x, y] = plot;
            directions.forEach(([dx, dy]) => {
              const [newX, newY] = [x + dx, y + dy];
              if (
                matrix[newX]?.[newY] === block &&
                !region.some(xyEquals([newX, newY]))
              ) {
                plotsToExplore.push([newX, newY]);
                region.push([newX, newY]);
              }
            });
          }
        });
        return regions;
      }, []),
  }),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
