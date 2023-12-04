import { read } from '../../../lib/read.js';
import {
  add,
  addIndex,
  always,
  compose,
  converge,
  equals,
  head,
  join,
  last,
  map,
  reduce,
  repeat,
  reverse,
  split,
  sum,
  toPairs,
} from 'ramda';

const data = read('input.txt');

const reduceIndexed = addIndex(reduce);
const snafuMap = { 2: 2, 1: 1, 0: 0, '-': -1, '=': -2 };
const snafu2dec = compose(
  reduceIndexed(
    (acc, value, index) => acc + Math.pow(5, index) * snafuMap[value],
    0,
  ),
  reverse,
  split(''),
);
const maxSnafu = compose(
  snafu2dec,
  join(''),
  converge(repeat, [always('2'), add(1)]),
);
const snafuVal = compose(head, head, (d) =>
  toPairs(snafuMap).find(compose(equals(d), last)),
);
const dec2snafu = (dec, snafu = '') => {
  let i = 0,
    lastI;
  while (dec !== 0) {
    lastI = i;
    i = 0;
    while (maxSnafu(i) < Math.abs(dec)) i++;
    const inc = Math.round(dec / Math.pow(5, i));
    snafu += '0'.repeat(Math.max(0, lastI - (i + 1))) + snafuVal(inc);
    dec -= inc * Math.pow(5, i);
  }
  return snafu + '0'.repeat(i);
};

const prepare = compose(split('\n'));

const part1 = compose(dec2snafu, sum, map(snafu2dec), prepare);

console.log('part 1', part1(data));
