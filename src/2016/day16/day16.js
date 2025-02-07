import { compose, curry, identity, join, splitEvery } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = identity;

const findDataOfSize = curry((size, input) => {
  input +=
    0 +
    input
      .split('')
      .reverse()
      .map(x => (x === '1' ? '0' : '1'))
      .join('');
  if (input.length < size) return findDataOfSize(size, input);
  return input.substr(0, size);
});

const checksumOf = input => {
  if (input.length % 2) return input;
  input = splitEvery(2, input).map(([a, b]) => +(a === b));
  return checksumOf(input);
};

const part1 = compose(join(''), checksumOf, findDataOfSize(272), prepare);

const part2 = compose(join(''), checksumOf, findDataOfSize(35651584), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
