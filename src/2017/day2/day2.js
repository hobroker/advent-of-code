import {
  chain,
  compose,
  converge,
  juxt,
  map,
  max,
  min,
  nth,
  reduce,
  split,
  subtract,
  sum,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(compose(map(Number), split(/\s+/))), split('\n'));

const part1 = compose(
  sum,
  map(
    compose(
      converge(subtract, [nth(0), nth(1)]),
      juxt([reduce(max, -Infinity), reduce(min, Infinity)]),
    ),
  ),
  prepare,
);

const part2 = compose(
  sum,
  chain(list =>
    list.reduce((acc, n, i) => {
      const result = list.find((m, j) => i !== j && !(n % m));
      return result ? [...acc, n / result] : acc;
    }, []),
  ),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
