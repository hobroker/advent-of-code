import { read } from '../../../lib/read.js';
import { any, compose, map, split, sum } from 'ramda';

const data = read('input.txt');

const prepare = compose(map(compose(map(Number), split(' '))), split('\n'));

const isSafe = arr => {
  let isIncreasing = true;
  let isDecreasing = true;

  for (let i = 1; i < arr.length; i++) {
    if (Math.abs(arr[i] - arr[i - 1]) > 3 || arr[i] === arr[i - 1]) {
      return false;
    }
    isIncreasing &&= arr[i] > arr[i - 1];
    isDecreasing &&= arr[i] < arr[i - 1];
  }

  return isIncreasing || isDecreasing;
};
const toVariations = arr => arr.map((_, i) => arr.filter((_, j) => j !== i));

const part1 = compose(sum, map(isSafe), prepare);

const part2 = compose(sum, map(compose(any(isSafe), toVariations)), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
