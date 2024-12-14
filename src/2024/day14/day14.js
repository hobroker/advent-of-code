import { read } from '../../../lib/read.js';
import {
  applySpec,
  compose,
  equals,
  identity,
  last,
  length,
  map,
  multiply,
  reduce,
  split,
  sum,
  tap,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(
  map(
    compose(
      map(compose(map(Number), split(','), last, split('='))),
      split(' '),
    ),
  ),
  split('\n'),
);

const buildSpace = (x, y) => robots => {
  const matrix = [];
  for (let i = 0; i < x; i++) {
    matrix[i] = [];
    for (let j = 0; j < y; j++) {
      matrix[i][j] = [];
    }
  }
  robots.forEach(robot => matrix[robot[0][1]][robot[0][0]].push(robot));
  return matrix;
};

const logMatrix = tap(matrix => {
  matrix.forEach(row => {
    console.log(row.map(cell => cell.length || '.').join(''));
  });
});

const splitToQuadrants = matrix => [
  matrix
    .slice(0, Math.floor(matrix.length / 2))
    .map(row => row.slice(0, Math.floor(row.length / 2))),
  matrix
    .slice(0, Math.floor(matrix.length / 2))
    .map(row => row.slice(Math.ceil(row.length / 2))),
  matrix
    .slice(Math.ceil(matrix.length / 2))
    .map(row => row.slice(0, row.length / 2)),
  matrix
    .slice(Math.ceil(matrix.length / 2))
    .map(row => row.slice(Math.ceil(row.length / 2))),
];

const loop =
  n =>
  ({ robots, matrix }) => {
    for (let i = 0; i < n; i++) {
      robots.forEach(robot => {
        const [[positionY, positionX], [velocityY, velocityX]] = robot;
        const cell = matrix[positionX][positionY];
        cell.splice(cell.findIndex(equals(robot)), 1);
        let nextX = (positionX + velocityX + matrix.length) % matrix.length;
        let nextY =
          (positionY + velocityY + matrix[0].length) % matrix[0].length;

        matrix[nextX][nextY].push(robot);
        robot[0] = [nextY, nextX];
      });
    }
    return matrix;
  };

const part1 = compose(
  reduce(multiply, 1),
  map(compose(sum, map(compose(sum, map(length))))),
  splitToQuadrants,
  loop(100),
  applySpec({
    // matrix: buildSpace(103, 101),
    matrix: buildSpace(7, 11),
    robots: identity,
  }),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
