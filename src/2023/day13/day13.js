import {
  compose,
  curry,
  join,
  juxt,
  map,
  multiply,
  split,
  sum,
  transpose,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(compose(map(split('')), split('\n'))),
  split('\n\n'),
);
const isMaxDiffOf = (max, s1, s2) => {
  let differences = 0;
  for (let i = 0; i < s1.length; i++) {
    if (s1[i] !== s2[i] && differences++ > max) return false;
  }
  return differences === max;
};
const findMirror = curry((diffs, block) => {
  for (let x = 1; x < block.length; x++) {
    const size = Math.min(x, block.length - x);
    const up = block.slice(0, x).slice(-size).map(join('')).join('\n');
    const down = block
      .slice(x, x + size)
      .reverse()
      .map(join(''))
      .join('\n');
    if (isMaxDiffOf(diffs, up, down)) return x;
  }
  return 0;
});

const countMirrors = diffs =>
  compose(
    sum,
    juxt([
      compose(multiply(100), sum, map(findMirror(diffs))),
      compose(sum, map(compose(findMirror(diffs), transpose))),
    ]),
  );

const part1 = compose(countMirrors(0), prepare);
const part2 = compose(countMirrors(1), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
