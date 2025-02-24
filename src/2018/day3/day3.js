import { compose, count, lt, map, match, slice, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      map(Number),
      slice(1, Infinity),
      match(/#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/),
    ),
  ),
  split('\n'),
);

const part1 = compose(
  count(lt(1)),
  instructions => {
    const visited = {};
    for (const [, fromX, fromY, sizeX, sizeY] of instructions) {
      for (let x = fromX; x < fromX + sizeX; x++) {
        for (let y = fromY; y < fromY + sizeY; y++) {
          visited[`${x}-${y}`] = (visited[`${x}-${y}`] || 0) + 1;
        }
      }
    }
    return Object.values(visited);
  },
  prepare,
);

const overlaps = (a, b) =>
  a[1] < b[1] + b[3] &&
  a[2] < b[2] + b[4] &&
  b[1] < a[1] + a[3] &&
  b[2] < a[2] + a[4];

const part2 = compose(instructions => {
  for (const a of instructions) {
    let clean = true;
    for (const b of instructions) {
      if (a[0] === b[0]) continue;
      if (overlaps(a, b)) {
        clean = false;
        break;
      }
    }
    if (clean) {
      return a[0];
    }
  }
}, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
