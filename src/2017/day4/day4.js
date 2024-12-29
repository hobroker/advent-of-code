import {
  compose,
  converge,
  equals,
  filter,
  join,
  length,
  map,
  sort,
  split,
  uniq,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(split(' ')), split('\n'));

const hasDuplicates = converge(equals, [compose(length, uniq), length]);

const part1 = compose(length, filter(hasDuplicates), prepare);

const part2 = compose(
  length,
  filter(
    compose(
      hasDuplicates,
      map(
        compose(
          join(''),
          sort((a, b) => a.localeCompare(b)),
          split(''),
        ),
      ),
    ),
  ),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
