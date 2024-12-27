import {
  compose,
  converge,
  intersection,
  length,
  map,
  match,
  nth,
  replace,
  split,
  sum,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      map(compose(map(Number), match(/\d+/g))),
      split('|'),
      replace(/Card\s+\d+: /, ''),
    ),
  ),
  split('\n'),
);

const doubleNumber = n => (!n ? 0 : n === 1 ? 1 : 2 ** (n - 1));
const wins = compose(length, converge(intersection, [nth(0), nth(1)]));

const part1 = compose(sum, map(compose(doubleNumber, wins)), prepare);

const part2 = compose(
  sum,
  Object.values,
  cards =>
    cards.reduce((copies, card, i) => {
      const count = wins(card);
      copies[i] = (copies[i] || 0) + 1;
      for (let j = i + 1; j <= i + count && j < cards.length; j++) {
        copies[j] = (copies[j] || 0) + copies[i];
      }
      return copies;
    }, {}),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
