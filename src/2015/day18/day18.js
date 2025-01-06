import { compose, count, equals, map, reduce, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(split('')), split('\n'));

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const step = (matrix, skipCorners = false) => {
  const copy = matrix.map(row => [...row]);

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (
        skipCorners &&
        (i === 0 || i === matrix.length - 1) &&
        (j === 0 || j === matrix.length - 1)
      ) {
        continue;
      }
      const on = count(
        ([row, col]) => copy[row + i]?.[col + j] === '#',
        directions,
      );
      if (copy[i][j] === '#' && on !== 2 && on !== 3) {
        matrix[i][j] = '.';
      } else if (on === 3) {
        matrix[i][j] = '#';
      }
    }
  }
  return matrix;
};

const countLightsOn = reduce(
  (acc, row) => acc + row.filter(equals('#')).length,
  0,
);

const part1 = compose(
  countLightsOn,
  matrix => new Array(100).fill().reduce(matrix => step(matrix, false), matrix),
  prepare,
);

const part2 = compose(
  countLightsOn,
  matrix => new Array(100).fill().reduce(matrix => step(matrix, true), matrix),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
