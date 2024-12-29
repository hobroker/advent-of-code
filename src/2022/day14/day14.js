import { read } from '../../../lib/read.js';
import {
  compose,
  curry,
  equals,
  filter,
  gte,
  length,
  map,
  reduce,
  split,
} from 'ramda';

const data = read('input.txt');
const SOURCE = 500;
const mapToArray = map => [...map.values()];
const flatMap = curry((fn, array) => array.flatMap(fn));

const parse = compose(
  reduce(
    ([map, max], cord) => [map.set(cord, '#'), Math.max(max, cord)],
    [new Map(), 0],
  ),
  map(([x, y]) => x | (y << 16)),
  flatMap(scan =>
    scan.reduce((coords, v, i) => {
      if (i === 0) return coords.concat([v]);
      let prev = coords.at(-1);
      const dir = prev.map((c, j) => Math.sign(v[j] - c));
      while (v.some((c, j) => c !== prev[j])) {
        prev = dir.map((d, j) => prev[j] + d);
        coords.push(prev);
      }
      return coords;
    }, []),
  ),
  map(compose(map(compose(map(Number), split(','))), split(' -> '))),
  split('\n'),
);

const update = (cave, pos, filter = () => true) => {
  const next = [0, -1, 1]
    .map(delta => delta + pos + (1 << 16))
    .filter(filter)
    .find(p => !cave.has(p));
  if (!next) {
    cave.set(pos, 'o');
  }
  return next || SOURCE;
};

const count = compose(length, filter(equals('o')), mapToArray);

const prepare = compose(parse);
const part1 = compose(
  count,
  ([cave, max]) => {
    let pos = SOURCE;
    while (pos && pos <= max) {
      pos = update(cave, pos);
    }
    return cave;
  },
  prepare,
);
const part2 = compose(
  count,
  ([cave, max]) => {
    let pos = SOURCE;
    const newMax = (max & 0xffff0000) + (2 << 16);
    while (!cave.has(SOURCE)) {
      pos = update(cave, pos, gte(newMax));
    }
    return cave;
  },
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
