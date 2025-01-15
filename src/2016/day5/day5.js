import { compose, curry, identity, join } from 'ramda';
import { read } from '../../../lib/read.js';
import { createHash } from 'crypto';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = identity;

const findHashUntil = curry((isDone, result, input) => {
  let suffix = 1;
  while (true) {
    const hash = createHash('md5')
      .update(input + suffix)
      .digest('hex');
    suffix++;
    if (hash.startsWith('00000') && isDone(hash, result)) {
      break;
    }
  }
  return result;
});

const part1 = compose(
  join(''),
  findHashUntil((hash, result) => {
    result.push(hash[5]);
    return result.length === 8;
  }, []),
  prepare,
);

const part2 = compose(
  join(''),
  findHashUntil((hash, result) => {
    if (hash[5] < 8 && !result[hash[5]]) {
      result[hash[5]] = hash[6];
    }
    return result.every(Boolean);
  }, Array(8).fill(null)),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
