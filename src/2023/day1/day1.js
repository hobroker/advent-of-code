import { read } from '../../../lib/read.js';
import {
  compose,
  concat,
  converge, find,
  head,
  last,
  map,
  match,
  split,
  sum,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(split('\n'));
const toNumber = (value) => {
  if (value === 'one') return 1;
  if (value === 'two') return 2;
  if (value === 'three') return 3;
  if (value === 'four') return 4;
  if (value === 'five') return 5;
  if (value === 'six') return 6;
  if (value === 'seven') return 7;
  if (value === 'eight') return 8;
  if (value === 'nine') return 9;
  return value;
};

const part1 = compose(
  sum,
  map(compose(Number, converge(concat, [head, last]), match(/\d/g))),
  prepare,
);

const part2 = compose(
  sum,
  map(compose(Number, converge(concat, [head, last]), match(/\d/g))),
  map((item) => {
    const matcher =
      /[0-9]|(?=(one))|(?=(two))|(?=(three))|(?=(four))|(?=(five))|(?=(six))|(?=(seven))|(?=(eight))|(?=(nine))/g;
    const matches = [...item.matchAll(matcher)];
    return [matches[0], matches[matches.length - 1]]
      .map(find(Boolean))
      .map(toNumber)
      .join('');
  }),
  prepare,
);

// console.log('part 1', part1(data));
console.log('part 2', part2(data));
