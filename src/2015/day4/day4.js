import { compose, curry, split } from 'ramda';
import { createHash } from 'node:crypto';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(split('\n'));

const findSuffix = curry((end, input) => {
  let i = 1;
  while (
    !createHash('md5')
      .update(input + i)
      .digest('hex')
      .startsWith(end)
  ) {
    i++;
  }
  return i;
});

const part1 = compose(findSuffix('00000'), prepare);
const part2 = compose(findSuffix('000000'), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
