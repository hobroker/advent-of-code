import {
  apply,
  compose,
  intersection,
  keys,
  map,
  min,
  nth,
  path,
  reduce,
  sortBy,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(split(',')), split('\n'));

const directions = {
  R: [0, 1],
  L: [0, -1],
  U: [-1, 0],
  D: [1, 0],
};

const manhattan = ([x1, x2], [y1, y2]) => Math.abs(x1 - y1) + Math.abs(x2 - y2);

const trace = steps => {
  const position = [0, 0];
  const history = {};
  let count = 0;
  for (const step of steps) {
    const direction = directions[step.charAt(0)];
    const distance = Number(step.substring(1));
    for (let i = 0; i < distance; i++) {
      count++;
      const x = position[0] + direction[0];
      const y = position[1] + direction[1];
      position[0] = x;
      position[1] = y;
      const key = `${x}x${y}`;
      if (!history[key]) history[key] = count;
    }
  }

  return history;
};

const part1 = compose(
  reduce(min, Infinity),
  map(item => manhattan([0, 0], item.split('x'))),
  apply(intersection),
  map(compose(keys, trace)),
  prepare,
);

const part2 = compose(
  path([0, 1]),
  sortBy(nth(1)),
  histories => {
    const crosses = intersection(...histories.map(Object.keys));
    return crosses.reduce(
      (acc, key) => [
        ...acc,
        [key, histories.reduce((acc, item) => acc + item[key], 0)],
      ],
      [],
    );
  },
  map(trace),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
