import { compose, equals, map, split, tap } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(split('')), split('\n'));

const roll = (matrix, i, j) => {
  if (matrix[i][j] !== 'O') return;
  while (matrix[i - 1]?.[j] === '.') {
    [matrix[i][j], matrix[i - 1][j]] = [matrix[i - 1][j], matrix[i][j]];
    i--;
  }
};

const part1 = compose(
  matrix =>
    matrix.reduce(
      (weight, row, i) =>
        weight + row.filter(equals('O')).length * (matrix.length - i),
      0,
    ),
  tap(matrix => {
    matrix.forEach((row, i) => row.forEach((_, j) => roll(matrix, i, j)));
  }),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
