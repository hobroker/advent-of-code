import {
  compose,
  countBy,
  curry,
  equals,
  evolve,
  filter,
  find,
  identity,
  includes,
  join,
  juxt,
  map,
  match,
  nth,
  reduce,
  slice,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    compose(
      evolve({
        0: split(''),
        1: Number,
        2: split(''),
      }),
      slice(1, 4),
      match(/(.*)-(\d+)\[(.*)\]/),
    ),
  ),
  split('\n'),
);

const countOccurences = enc => {
  const occ = Object.entries(countBy(identity, enc)).reduce(
    (acc, [letter, occurences]) => {
      if (letter === '-') return acc;
      return {
        ...acc,
        [occurences]: [...(acc[occurences] || []), letter],
      };
    },
    {},
  );
  return Object.entries(occ)
    .sort(([a], [b]) => b - a)
    .map(nth(1));
};

const part1 = compose(
  reduce((acc, [, id]) => acc + id, 0),
  filter(([enc, , checksum]) => {
    const occ = countOccurences(enc);
    return checksum.every(key => {
      for (let i = 0; i < occ.length; i++) {
        const item = occ[i];
        if (!item.length) continue;
        const index = item.findIndex(equals(key));
        if (index === -1) return false;
        item.splice(index, 1);
        return true;
      }
    });
  }),
  prepare,
);

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
const nextChar = curry(
  (id, letter) => alphabet[(alphabet.indexOf(letter) + id) % alphabet.length],
);

const part2 = compose(
  find(compose(includes('northpole'), nth(1))),
  map(juxt([nth(1), compose(join(''), ([enc, id]) => enc.map(nextChar(id)))])),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
