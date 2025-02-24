import { compose, map, split, sum } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(Number), split('\n'));

const part1 = compose(sum, prepare);

const part2 = compose(list => {
  const visited = new Set();
  let frequency = 0;
  while (true) {
    for (const value of list) {
      frequency += value;
      if (visited.has(frequency)) return frequency;
      visited.add(frequency);
    }
  }
}, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
