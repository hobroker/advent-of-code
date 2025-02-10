import { compose, count, equals, identity, map, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(equals('.')), split(''));

const isTrap = value => (value === undefined ? false : !value);

const nextRow = row =>
  row.map((_, idx, row) => isTrap(row[idx - 1]) === isTrap(row[idx + 1]));

const countSafeTiles = count(identity);
const evaluate = count => row => {
  let sum = countSafeTiles(row);
  for (let i = 0; i < count; i++) {
    row = nextRow(row);
    sum += countSafeTiles(row);
  }
  return sum;
};

const part1 = compose(evaluate(40 - 1), prepare);

const part2 = compose(evaluate(400000 - 1), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
