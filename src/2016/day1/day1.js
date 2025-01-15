import {
  always,
  compose,
  equals,
  ifElse,
  juxt,
  map,
  match,
  nth,
  prop,
  slice,
  split,
  times,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    juxt([
      ifElse(compose(equals('R'), nth(0)), always(1), always(-1)),
      compose(Number, match(/\d+/), slice(1, Infinity)),
    ]),
  ),
  split(', '),
);

const dirs = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

const move = directions =>
  directions.reduce(
    ({ x, y, dir, location, visited }, [turn, dist]) => {
      const [byX, byY] = dirs.at((dir + turn + 4) % 4);
      times(() => {
        x += byX;
        y += byY;
        if (location) return; // already found
        const identifier = `${x}x${y}`;
        if (visited.has(identifier)) location = { x, y };
        visited.add(identifier);
      }, dist);
      return { x, y, dir: dir + turn, visited, location };
    },
    {
      x: 0,
      y: 0,
      dir: 0,
      visited: new Set(),
      location: null,
    },
  );

const distance = ({ x, y }) => Math.abs(x) + Math.abs(y);

const part1 = compose(distance, move, prepare);

const part2 = compose(distance, prop('location'), move, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
