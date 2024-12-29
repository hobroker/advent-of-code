import { compose, equals, flatten, join, map, split, tap } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(split('')), split('\n'));

const rollCell = (direction, matrix, i, j) => {
  if (matrix[i][j] !== 'O') return;
  let [toI, toJ] = [i, j];
  while (matrix[toI + direction[0]]?.[toJ + direction[1]] === '.') {
    toI += direction[0];
    toJ += direction[1];
  }

  [matrix[i][j], matrix[toI][toJ]] = [matrix[toI][toJ], matrix[i][j]];
};

const roll = matrix => {
  // roll North
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      rollCell([-1, 0], matrix, i, j);
    }
  }
  // roll West
  for (let j = 0; j < matrix.length; j++) {
    for (let i = matrix.length - 1; i >= 0; i--) {
      rollCell([0, -1], matrix, i, j);
    }
  }
  // roll South
  for (let i = matrix.length - 1; i >= 0; i--) {
    for (let j = matrix.length - 1; j >= 0; j--) {
      rollCell([1, 0], matrix, i, j);
    }
  }
  // roll East
  for (let j = matrix.length - 1; j >= 0; j--) {
    for (let i = 0; i < matrix.length; i++) {
      rollCell([0, 1], matrix, i, j);
    }
  }
};

const countLoad = matrix =>
  matrix.reduce(
    (weight, row, i) =>
      weight + row.filter(equals('O')).length * (matrix.length - i),
    0,
  );

const matrixToString = compose(join(''), flatten);

const part1 = compose(
  countLoad,
  tap(matrix => {
    return matrix.forEach((row, i) =>
      row.forEach((_, j) => {
        rollCell([-1, 0], matrix, i, j);
      }),
    );
  }),
  prepare,
);

const part2 = compose(
  countLoad,
  tap(matrix => {
    let cycle = 0;
    const visited = new Set();

    while (true) {
      cycle++;
      roll(matrix);
      const key = matrixToString(matrix);
      if (visited.has(key)) break;
      visited.add(key);
    }
    const periodicStates = new Set();
    while (!periodicStates.has(matrixToString(matrix))) {
      periodicStates.add(matrixToString(matrix));
      roll(matrix);
    }

    const cyclesLeft = (1_000_000_000 - cycle) % periodicStates.size;
    for (let i = 0; i < cyclesLeft; i++) {
      roll(matrix);
    }
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
