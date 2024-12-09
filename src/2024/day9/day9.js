import { read } from '../../../lib/read.js';
import { addIndex, chain, compose, map, reduce, split } from 'ramda';

const data = read('input.txt');

const prepare = compose(map(Number), split(''));

const checksum = addIndex(reduce)(
  (acc, item, index) => acc + (isNaN(item) ? 0 : item) * index,
  0,
);
const setupBlocks = (item, index) =>
  Array(item).fill(index % 2 ? '.' : index / 2);

const lastNonDotElement = list => {
  while (list.length > 0) {
    let item = list.pop();
    if (item !== '.') return item;
  }
};

const part1 = compose(
  checksum,
  list => list.flatMap(item => [item !== '.' ? item : lastNonDotElement(list)]),
  addIndex(chain)(setupBlocks),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
