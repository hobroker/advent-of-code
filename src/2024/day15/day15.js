import { read } from '../../../lib/read.js';
import { applySpec, chain, compose, head, last, map, split } from 'ramda';

const data = read('input.txt');

const prepare = compose(
  applySpec({
    matrix: compose(map(split('')), split('\n'), head),
    steps: compose(chain(split('')), split('\n'), last),
  }),
  split('\n\n'),
);

const directions = {
  '<': [0, -1],
  '>': [0, 1],
  '^': [-1, 0],
  v: [1, 0],
};

const move = ({ matrix, direction: [dx, dy] }) => {
  const positionX = matrix.findIndex(row => row.includes('@'));
  const positionY = matrix[positionX].indexOf('@');
  const nextX = positionX + dx;
  const nextY = positionY + dy;
  if (matrix[nextX]?.[nextY] === '#') return;
  if (matrix[nextX]?.[nextY] === 'O') {
    const boxesToMove = [
      { from: [nextX, nextY], to: [nextX + dx, nextY + dy] },
    ];
    if (matrix[boxesToMove[0].to[0]]?.[boxesToMove[0].to[1]] === '#') return;
    while (matrix[boxesToMove[0].to[0]]?.[boxesToMove[0].to[1]] === 'O') {
      const [{ from, to }] = boxesToMove;
      if (matrix[to[0] + dx][to[1] + dy] === '#') return;
      boxesToMove.unshift({
        from: [from[0] + dx, from[1] + dy],
        to: [to[0] + dx, to[1] + dy],
      });
    }
    boxesToMove.forEach(({ from, to }) => {
      matrix[from[0]][from[1]] = '.';
      matrix[to[0]][to[1]] = 'O';
    });
  }
  matrix[positionX][positionY] = '.';
  matrix[nextX][nextY] = '@';
};

const part1 = compose(
  matrix =>
    matrix.reduce(
      (acc, row, i) =>
        row.reduce(
          (acc, cell, j) => (cell === 'O' ? acc + 100 * i + j : acc),
          acc,
        ),
      0,
    ),
  ({ matrix, steps }) =>
    steps.reduce(
      (matrix, step) => move({ matrix, direction: directions[step] }) || matrix,
      matrix,
    ),
  prepare,
);

const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
