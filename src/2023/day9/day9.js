import {
  all,
  compose,
  curry,
  equals,
  flip,
  map,
  reduce,
  reverse,
  split,
  subtract,
  sum,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(compose(map(Number), split(' '))), split('\n'));

const isEnd = all(equals(0));
const loop = curry((idx, list) => {
  const ends = [list.at(idx)];
  while (!isEnd(list)) {
    const result = [];
    for (let i = list.length - 1; i; i--) {
      result.unshift(list[i] - list[i - 1]);
    }
    ends.push(result.at(idx));
    list = result;
  }
  return ends;
});

const part1 = compose(sum, map(compose(sum, loop(-1))), prepare);

const part2 = compose(
  sum,
  map(compose(reduce(flip(subtract), 0), reverse, loop(0))),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
