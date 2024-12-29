import { read } from '../../../lib/read.js';
import {
  applySpec,
  compose,
  equals,
  identity,
  juxt,
  last,
  length,
  map,
  multiply,
  reduce,
  slice,
  split,
  sum,
  times,
} from 'ramda';

const data = read('input.txt');

const timesN = times(identity);

const buildSpace = (x, y) => robots => {
  const matrix = [];
  timesN(x).forEach(i => timesN(y).forEach(j => ((matrix[i] ||= [])[j] = [])));
  robots.forEach(robot => matrix[robot[0][1]][robot[0][0]].push(robot));
  return matrix;
};

const prepare = compose(
  applySpec({
    robots: identity,
    matrix: buildSpace(103, 101),
  }),
  map(
    compose(
      map(compose(map(Number), split(','), last, split('='))),
      split(' '),
    ),
  ),
  split('\n'),
);

const logMatrix = matrix =>
  console.log(
    matrix
      .map(row => row.map(cell => (cell.length ? '#' : '.')).join(''))
      .join('\n'),
  );

const splitToQuadrants = matrix => {
  const height = matrix.length / 2;
  const width = matrix[0].length / 2;
  return [matrix.slice(0, height), matrix.slice(height + 1)].flatMap(
    juxt([map(slice(0, width)), map(slice(width + 1, width * 2))]),
  );
};

const tick = ({ robots, matrix }) => {
  robots.forEach(robot => {
    const [[positionY, positionX], [velocityY, velocityX]] = robot;
    const cell = matrix[positionX][positionY];
    cell.splice(cell.findIndex(equals(robot)), 1);
    const nextX = (positionX + velocityX + matrix.length) % matrix.length;
    const nextY = (positionY + velocityY + matrix[0].length) % matrix[0].length;
    matrix[nextX][nextY].push(robot);
    robot[0] = [nextY, nextX];
  });
};

const loop =
  n =>
  ({ robots, matrix }) => {
    timesN(n).forEach(() => tick({ robots, matrix }));
    return matrix;
  };

const part1 = compose(
  reduce(multiply, 1),
  map(compose(sum, map(compose(sum, map(length))))),
  splitToQuadrants,
  loop(100),
  prepare,
);

const findTreeSecond = ({ matrix, robots }) => {
  let second = 0;
  while (true) {
    second++;
    tick({ robots, matrix });
    for (const row of matrix) {
      if (
        row
          .map(cell => (cell.length ? '#' : '.'))
          .join('')
          .includes('###############')
      ) {
        logMatrix(matrix);
        return second;
      }
    }
  }
};

const part2 = compose(findTreeSecond, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
