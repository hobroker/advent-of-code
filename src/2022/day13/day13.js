import { read } from '../../../lib/read.js';
import {
  addIndex,
  compose,
  concat,
  converge,
  equals,
  findIndex,
  head,
  identity,
  inc,
  last,
  map,
  multiply,
  reduce,
  sort,
  split,
  splitEvery,
} from 'ramda';

const data = read('input.txt');
const DECODERS = [[[2]], [[6]]];

const flatten1 = (list) => list.flatMap(identity);
const reduceIndexed = addIndex(reduce);

const compare = (a, b) => {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  if (typeof a === 'number') a = [a];
  if (typeof b === 'number') b = [b];
  for (let i = 0; i < a.length && i < b.length; i++) {
    const result = compare(a[i], b[i]);
    if (result !== 0) return result;
  }

  return a.length - b.length;
};

const findDecodersIndexes = converge(compose(map(inc), Array.of), [
  findIndex(equals(DECODERS[0])),
  findIndex(equals(DECODERS[1])),
]);

const prepare = compose(
  flatten1,
  map(compose(map(JSON.parse), split('\n'))),
  split('\n\n'),
);
const part1 = compose(
  reduceIndexed((acc, item, index) => (item < 0 ? acc + index + 1 : acc), 0),
  map(converge(compare, [head, last])),
  splitEvery(2),
  prepare,
);
const part2 = compose(
  reduce(multiply, 1),
  findDecodersIndexes,
  sort(compare),
  concat(DECODERS),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
