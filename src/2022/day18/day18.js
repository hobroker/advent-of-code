import { read } from '../../../lib/read.js';
import { applySpec, compose, curry, equals, identity, map, split } from 'ramda';

const reduce = curry((fn, acc, array) => array.reduce(fn, acc));
const data = read('input.txt');
const prepare = compose(map(compose(map(Number), split(','))), split('\n'));
const cubeDistance = curry((c1, c2) =>
  c1.reduce((acc, cube, i) => acc + Math.abs(cube - c2[i]), 0),
);

const part1 = compose(
  reduce(
    (acc, c1, _, cubes) =>
      acc + 6 - cubes.filter(compose(equals(1), cubeDistance(c1))).length,
    0,
  ),
  prepare,
);
const addCube = (c1, c2) => c1.map((v, i) => v + c2[i]);
const k = cube => cube.join('_');
const dirs = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

const part2 = compose(
  ({ cubes, min, max, cubeSet }) => {
    const inRange = cube => cube.every((v, i) => v >= min[i] && v <= max[i]);
    const processed = new Set();
    const water = [];

    const spread = cube => {
      if (processed.has(k(cube))) return;
      processed.add(k(cube));
      water.push(cube);
      for (let i = 0; i < dirs.length; i++) {
        const targetCube = addCube(cube, dirs[i]);
        if (inRange(targetCube) && !cubeSet.has(k(targetCube)))
          spread(targetCube);
      }
    };
    spread(min);

    return water.reduce(
      (acc, c1) => acc + cubes.filter(c2 => cubeDistance(c1, c2) === 1).length,
      0,
    );
  },
  applySpec({
    cubes: identity,
    cubeSet: reduce((acc, c1) => acc.add(k(c1)), new Set()),
    max: reduce(
      (acc, c1) => acc.map((v, d) => Math.max(v, c1[d] + 1)),
      [0, 0, 0],
    ),
    min: reduce(
      (acc, c1) => acc.map((v, d) => Math.min(v, c1[d] - 1)),
      [20, 20, 20],
    ),
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
