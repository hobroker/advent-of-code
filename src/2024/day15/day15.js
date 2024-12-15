import { read } from '../../../lib/read.js';
import {
  addIndex,
  always,
  applySpec,
  chain,
  compose,
  cond,
  equals,
  evolve,
  head,
  identity,
  juxt,
  last,
  map,
  split,
  sum,
  T,
} from 'ramda';

const chainIndexed = addIndex(chain);

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

const calculate = char =>
  compose(
    sum,
    chainIndexed((row, i) =>
      row.map((cell, j) => cell === char && 100 * i + j),
    ),
  );

const execute = (matrix, moves) => {
  moves.forEach(({ from, to }) => {
    [matrix[from[0]][from[1]], matrix[to[0]][to[1]]] = [
      matrix[to[0]][to[1]],
      matrix[from[0]][from[1]],
    ];
  });
};

const move = (matrix, [dx, dy]) => {
  const positionX = matrix.findIndex(row => row.includes('@'));
  const positionY = matrix[positionX].indexOf('@');
  const nextX = positionX + dx;
  const nextY = positionY + dy;
  if (matrix[nextX][nextY] === '#') return;
  if (matrix[nextX][nextY] === 'O') {
    const moves = [{ from: [nextX, nextY], to: [nextX + dx, nextY + dy] }];
    while (matrix[moves[0].to[0]][moves[0].to[1]] === 'O') {
      const [{ from, to }] = moves;
      moves.unshift({
        from: [from[0] + dx, from[1] + dy],
        to: [to[0] + dx, to[1] + dy],
      });
    }
    if (moves.some(({ to: [x, y] }) => matrix[x][y] === '#')) return;
    execute(matrix, moves);
  }
  execute(matrix, [{ from: [positionX, positionY], to: [nextX, nextY] }]);
};

const move2 = (matrix, [dx, dy]) => {
  const positionX = matrix.findIndex(row => row.includes('@'));
  const positionY = matrix[positionX].indexOf('@');
  const nextX = positionX + dx;
  const nextY = positionY + dy;
  if (matrix[nextX][nextY] === '#') return;
  if (!['[', ']'].includes(matrix[nextX][nextY])) {
    return execute(matrix, [
      { from: [positionX, positionY], to: [nextX, nextY] },
    ]);
  }

  if (dx) {
    const queue = [[nextX, nextY]];
    const moves = [{ from: [positionX, positionY], to: [nextX, nextY] }];
    const visited = [];
    while (queue.length) {
      const [x, y] = queue.shift();
      if (matrix[x + dx][y] === '#') return;
      if (visited.includes(`${[x, y]}`)) continue;
      visited.push(`${[x, y]}`);
      if (matrix[x][y] === '[') queue.push([x, y + 1]);
      if (matrix[x][y] === ']') queue.push([x, y - 1]);
      if (matrix[x + dx][y] !== '.') queue.push([x + dx, y]);
      moves.unshift({ from: [x, y], to: [x + dx, y] });
    }

    return execute(matrix, moves);
  }
  const moves = [
    { from: [nextX, nextY], to: [nextX, nextY + dy] },
    { from: [positionX, positionY], to: [nextX, nextY] },
  ];
  while (['[', ']'].includes(matrix[moves[0].to[0]][moves[0].to[1]])) {
    const [{ from, to }] = moves;
    moves.unshift({ from: [from[0], from[1] + dy], to: [to[0], to[1] + dy] });
  }
  if (moves.some(({ to: [x, y] }) => matrix[x][y] === '#')) return;

  return execute(matrix, moves);
};

const run =
  fn =>
  ({ matrix, steps }) =>
    steps.forEach(step => fn(matrix, directions[step])) || matrix;

const part1 = compose(calculate('O'), run(move), prepare);

const part2 = compose(
  calculate('['),
  run(move2),
  evolve({
    matrix: map(
      chain(
        cond([
          [equals('O'), always(['[', ']'])],
          [equals('@'), always(['@', '.'])],
          [T, juxt([identity, identity])],
        ]),
      ),
    ),
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
