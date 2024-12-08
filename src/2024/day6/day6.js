import { read } from '../../../lib/read.js';
import { compose, equals, map, reduce, split, tap } from 'ramda';

const data = read('input.txt');

const prepare = compose(map(split('')), split('\n'));

const directions = [
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
];

const findGuardXY = matrix => {
  const guard = matrix.find(row => row.includes('^'));
  return {
    x: matrix.indexOf(guard),
    y: guard.indexOf('^'),
  };
};

const logMatrix = matrix =>
  console.log(matrix.map((row, i) => `${i} ` + row.join('')).join('\n'));

const findNextDirection = direction => {
  const index = directions.findIndex(
    ({ x, y }) => x === direction.x && y === direction.y,
  );
  return directions[(index + 1) % directions.length];
};

const walk = (matrix, position, direction) => {
  let nextDirection = direction;
  let next = {
    x: position.x + direction.x,
    y: position.y + direction.y,
  };

  while (matrix[next.x]?.[next.y] === '#') {
    nextDirection = findNextDirection(nextDirection);
    next = {
      x: position.x + nextDirection.x,
      y: position.y + nextDirection.y,
    };
  }

  if (!matrix[next.x]?.[next.y]) return;

  return {
    next: true,
    position: next,
    direction: nextDirection,
  };
};

const countChars = char =>
  reduce((acc, row) => acc + row.filter(equals(char)).length, 0);

const part1 = compose(
  countChars('X'),
  // tap(logMatrix),
  matrix => {
    const guardXY = findGuardXY(matrix);

    matrix[guardXY.x][guardXY.y] = 'X';
    let result = walk(matrix, guardXY, directions[0]);
    while (result) {
      matrix[result.position.x][result.position.y] = 'X';
      result = walk(matrix, result.position, result.direction);
    }

    return matrix;
  },
  prepare,
);

const search = (originalMatrix, position, direction, obstacle) => {
  const matrix = originalMatrix.map(row => [...row]);
  matrix[obstacle.x][obstacle.y] = '#';

  const visited = {};
  visited[[position.x, position.y, direction.x, direction.y]] = 1;

  let result = walk(matrix, position, direction);
  let loop = false;
  while (result && !loop) {
    const { position, direction } = result;
    if (visited[[position.x, position.y, direction.x, direction.y]]) {
      loop = true;
    }

    visited[[position.x, position.y, direction.x, direction.y]] = true;

    result = walk(matrix, position, direction);
  }

  return loop;
};

const part2 = compose(
  countChars('O'),
  // tap(logMatrix),
  matrix => {
    const guardXY = findGuardXY(matrix);

    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === '#' || (i === guardXY.x && j === guardXY.y)) {
          continue;
        }

        if (search(matrix, guardXY, directions[0], { x: i, y: j })) {
          matrix[i][j] = 'O';
        }
      }
    }

    return matrix;
  },
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
