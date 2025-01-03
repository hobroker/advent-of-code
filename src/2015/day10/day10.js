import {
  compose,
  concat,
  converge,
  curry,
  head,
  identity,
  length,
  map,
  match,
  reduce,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = identity;

const lookAndSay = compose(
  reduce(concat, ''),
  map(converge(concat, [compose(String, length), head])),
  match(/(.)\1*/g),
);

const lookAndSayN = curry(
  (n, value) => new Array(n).fill().reduce(lookAndSay, value).length,
);

const part1 = compose(lookAndSayN(40), prepare);

const part2 = compose(lookAndSayN(50), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
