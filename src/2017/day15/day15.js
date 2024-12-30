import { compose, curry, map, match, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(compose(Number, match(/\d+/))), split('\n'));
const factors = [16807, 48271];
const go = (div, list) =>
  list.map((item, idx) => {
    do {
      item = (item * factors[idx]) % 2147483647;
    } while (item % div[idx]);
    return item;
  });

const run = curry((div, times, list) => {
  let count = 0;
  for (let i = 0; i < times; i++) {
    list = go(div, list);
    count += (list[0] & 0xffff) === (list[1] & 0xffff);
  }
  return count;
});

const part1 = compose(run([1, 1], 40_000_000), prepare);

const part2 = compose(run([4, 8], 5_000_000), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
