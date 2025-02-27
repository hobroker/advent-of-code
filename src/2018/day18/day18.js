import {
  compose,
  converge,
  equals,
  join,
  map,
  multiply,
  reduce,
  split,
} from 'ramda';
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

const adjacentsOf = (matrix, i, j) =>
  directions.map(([x, y]) => matrix[i + x]?.[j + y]);

const tick = matrix => {
  const original = matrix.map(row => [...row]);
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const acre = original[i][j];
      const adjacents = key =>
        adjacentsOf(original, i, j).filter(item => item === key).length;
      if (acre === '.' && adjacents('|') >= 3) {
        matrix[i][j] = '|';
      } else if (acre === '|' && adjacents('#') >= 3) {
        matrix[i][j] = '#';
      } else if (acre === '#' && (adjacents('#') < 1 || adjacents('|') < 1)) {
        matrix[i][j] = '.';
      }
    }
  }
};

const calcTrees = converge(multiply, [
  reduce((acc, row) => acc + row.filter(equals('|')).length, 0),
  reduce((acc, row) => acc + row.filter(equals('#')).length, 0),
]);

const loop = minutes => matrix => {
  const seen = new Map();
  for (let i = 0; i < minutes; i++) {
    const key = matrix.map(join('')).join('\n');
    if (seen.has(key)) {
      const loopStart = seen.get(key);
      const loopSize = i - loopStart;
      const targetStep = loopStart + ((minutes - i) % loopSize);
      for (const [state, step] of seen) {
        if (step === targetStep) return prepare(state);
      }
    }
    seen.set(key, i);
    tick(matrix);
  }
  return matrix;
};

const part1 = compose(calcTrees, loop(10), prepare);
const part2 = compose(calcTrees, loop(1_000_000_000), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
