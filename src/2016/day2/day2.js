import {
  always,
  applySpec,
  compose,
  equals,
  identity,
  includes,
  map,
  prop,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(compose(split(''))), split('\n'));

const directions = {
  U: [-1, 0],
  R: [0, 1],
  D: [1, 0],
  L: [0, -1],
};

const positionOf = (value, keypad) => {
  const row = keypad.findIndex(includes(value));
  return [row, keypad[row].findIndex(equals(value))];
};

const findCode = compose(prop('code'), ({ groups, keypad }) =>
  groups.reduce(
    ({ code, pos }, instructions) => {
      instructions.forEach(instruction => {
        const dir = directions[instruction];
        pos[0] = keypad[pos[0] + dir[0]]?.[pos[1]] ? pos[0] + dir[0] : pos[0];
        pos[1] = keypad[pos[0]]?.[pos[1] + dir[1]] ? pos[1] + dir[1] : pos[1];
      });
      return {
        pos,
        code: code + keypad[pos[0]][pos[1]],
      };
    },
    { code: '', pos: positionOf(5, keypad) },
  ),
);

const part1 = compose(
  findCode,
  applySpec({
    groups: identity,
    keypad: always([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]),
  }),
  prepare,
);

const part2 = compose(
  findCode,
  applySpec({
    groups: identity,
    keypad: always([
      [0, 0, 1, 0, 0],
      [0, 2, 3, 4, 0],
      [5, 6, 7, 8, 9],
      [0, 'A', 'B', 'C', 0],
      [0, 0, 'D', 0, 0],
    ]),
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
