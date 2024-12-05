import { read } from '../../../lib/read.js';
import { compose, map, split } from 'ramda';

const data = read('input.txt');

const prepare = compose(map(split('')), split('\n'));

const directions = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

const part1 = compose(matrix => {
  let count = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] !== 'X') continue;
      for (const [x, y] of directions) {
        if (
          [1, 2, 3].map(k => matrix[i + k * x]?.[j + k * y]).join('') === 'MAS'
        ) {
          count++;
        }
      }
    }
  }
  return count;
}, prepare);

const directions2 = [
  [1, 1],
  [1, -1],
];

const part2 = compose(matrix => {
  let count = 0;
  for (let i = 1; i < matrix.length - 1; i++) {
    for (let j = 1; j < matrix[i].length - 1; j++) {
      if (matrix[i][j] !== 'A') continue;
      let valid = true;
      for (const [x, y] of directions2) {
        const a = matrix[i + x][j + y];
        const b = matrix[i - x][j - y];
        if (!'MS'.includes(a) || b !== { M: 'S', S: 'M' }[a]) valid = false;
      }
      if (valid) count++;
    }
  }
  return count;
}, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
