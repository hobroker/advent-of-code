import { compose, curryN, length, map, propEq, split, sum } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const findCombinations = curryN(
  2,
  (target, containers, combo = [], index = 0, result = []) => {
    const currentSum = sum(combo);
    if (currentSum === target) return result.push(combo);
    if (currentSum > target) return result;
    for (let i = index; i < containers.length; i++) {
      findCombinations(
        target,
        containers,
        [...combo, containers[i]],
        i + 1,
        result,
      );
    }
    return result;
  },
);

const prepare = compose(findCombinations(150), map(Number), split('\n'));

const part1 = compose(length, prepare);

const part2 = compose(
  length,
  results => results.filter(propEq(Math.min(...results.map(length)), 'length')),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
