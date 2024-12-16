import { read } from '../../../lib/read.js';
import { add, any, applySpec, compose, identity, map, split, sum } from 'ramda';

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

const identifyRegions = applySpec({
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
});

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
  identifyRegions,
  prepare,
);

const part2 = compose(
  sum,
  ({ matrix, regions }) =>
    regions.map(region => {
      const boundaries = region
        .flatMap(([x, y]) =>
          directions.map(([dx, dy]) =>
            matrix[x][y] !== matrix[x + dx]?.[y + dy]
              ? [
                  [x, y],
                  [x + dx, y + dy],
                ]
              : null,
          ),
        )
        .filter(Boolean);

      const perimeter = boundaries.filter(([[ix, iy], [jx, jy]]) => {
        if (ix === jx) {
          return !boundaries.some(
            ([otherInner, otherOuter]) =>
              ix + 1 === otherInner[0] &&
              jx + 1 === otherOuter[0] &&
              iy === otherInner[1] &&
              jy === otherOuter[1],
          );
        }
        if (iy === jy) {
          return !boundaries.some(
            ([otherInner, otherOuter]) =>
              iy + 1 === otherInner[1] &&
              jy + 1 === otherOuter[1] &&
              ix === otherInner[0] &&
              jx === otherOuter[0],
          );
        }
      });
      return region.length * perimeter.length;
    }),
  identifyRegions,
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
