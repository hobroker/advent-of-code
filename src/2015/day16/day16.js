import { compose, evolve, last, map, split, findIndex, add } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      map(compose(evolve({ 1: Number }), split(': '))),
      split(', '),
      last,
      split(/Sue \d+: /),
    ),
  ),
  split('\n'),
);

const expect = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

const part1 = compose(
  add(1),
  findIndex(sue => sue.every(([key, value]) => value === expect[key])),
  prepare,
);

const part2 = compose(
  add(1),
  findIndex(sue =>
    sue.every(([key, value]) => {
      if (['trees', 'cats'].includes(key)) return value > expect[key];
      if (['pomeranians', 'goldfish'].includes(key)) return value < expect[key];
      return value === expect[key];
    }),
  ),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
