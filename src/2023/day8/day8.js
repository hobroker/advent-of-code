import {
  __,
  applySpec,
  compose,
  converge,
  curry,
  endsWith,
  equals,
  filter,
  fromPairs,
  head,
  keys,
  last,
  map,
  mapObjIndexed,
  match,
  prop,
  reduce,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data1 = read(`${import.meta.dirname}/input.txt`);
const data2 = read(`${import.meta.dirname}/input2.txt`);
const prepare = compose(
  applySpec({
    steps: compose(map(compose(Number, equals('R'))), split(''), head),
    nodes: compose(
      mapObjIndexed(match(/[A-Z0-9]+/g)),
      fromPairs,
      map(split(' = ')),
      split('\n'),
      last,
    ),
  }),
  split('\n\n'),
);

const gcd = (x, y) => (!y ? x : gcd(y, x % y));
const lcm = (x, y) => Math.abs(x * y) / gcd(x, y);
const findPath = curry((isValid, node, { steps, nodes }) => {
  let i = 0;
  while (!isValid(node)) node = nodes[node][steps[i++ % steps.length]];
  return i;
});

const part1 = compose(findPath(equals('ZZZ'), 'AAA'), prepare);

const part2 = compose(
  reduce(lcm, 1),
  converge(map, [
    args => findPath(endsWith('Z'), __, args),
    compose(filter(endsWith('A')), keys, prop('nodes')),
  ]),
  prepare,
);

console.log('part 1', part1(data1));
console.log('part 2', part2(data2));
