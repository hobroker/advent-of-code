import { read } from '../../../lib/read.js';
import {
  always,
  assoc,
  call,
  compose,
  concat,
  evolve,
  fromPairs,
  map,
  mapObjIndexed,
  multiply,
  split,
  trim,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(
  mapObjIndexed((value) => {
    const list = value.split(/([+\-\/*])/);
    if (list.length > 1) return list.map(trim);
    return Number(value);
  }),
  fromPairs,
  map(compose(map(trim), split(': '))),
  split('\n'),
);
const evaluate = compose(call, Function, concat('return '));

const build = (map, key = 'root') => {
  const value = map[key] || key;
  return Array.isArray(value)
    ? `(${value.map((item) => build(map, item)).join(' ')})`
    : value;
};
const binarySearch = (compare, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  while (min !== max) {
    const pivot = Math.trunc((min + max) / 2);
    const value = compare(pivot);
    if (value === 0) return pivot;
    if (value < 0) {
      if (min === pivot) {
        return binarySearch(compose(multiply(-1), compare)) ?? NaN;
      }
      min = pivot;
    } else {
      max = Math.trunc((min + max) / 2);
    }
  }
  return NaN;
};
const part1 = compose(evaluate, build, prepare);
const part2 = compose(
  (expr) => binarySearch((x) => evaluate(expr.replace('x', x))),
  build,
  evolve({
    humn: always('x'),
    root: assoc(1, '-'),
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
