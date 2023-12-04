import { read } from '../../../lib/read.js';
import { compose, curry, map, prop, split } from 'ramda';

const data = read('input.txt');

const directions = {
  R: [1, 0],
  L: [-1, 0],
  U: [0, -1],
  D: [0, 1],
};
const solve = curry((ropeLength, moves) => {
  const rope = Array.from({ length: ropeLength }, () => [0, 0]);

  return moves.reduce((visited, move) => {
    let [direction, steps] = move;
    steps = +steps;

    for (let i = 0; i < steps; i++) {
      rope[0] = [
        rope[0][0] + directions[direction][0],
        rope[0][1] + directions[direction][1],
      ];
      for (let j = 1; j < ropeLength; j++) {
        const dx = rope[j - 1][0] - rope[j][0];
        const dy = rope[j - 1][1] - rope[j][1];
        if (Math.abs(dx) > 1) {
          rope[j][0] += dx > 0 ? 1 : -1;
          if (dy !== 0) {
            rope[j][1] += dy > 0 ? 1 : -1;
          }
        } else if (Math.abs(dy) > 1) {
          rope[j][1] += dy > 0 ? 1 : -1;
          if (dx !== 0) {
            rope[j][0] += dx > 0 ? 1 : -1;
          }
        }
      }
      visited.add(rope[ropeLength - 1].join('-'));
    }

    return visited;
  }, new Set());
});

const prepare = compose(map(compose(split(' '))), split('\n'));

const part1 = compose(prop('size'), solve(2), prepare);
const part2 = compose(prop('size'), solve(10), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
