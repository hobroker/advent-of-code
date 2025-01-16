import {
  all,
  and,
  any,
  apply,
  complement,
  compose,
  converge,
  count,
  evolve,
  includes,
  juxt,
  map,
  match,
  slice,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    juxt([
      match(/(?<=^|\])([^[\]]+)(?=\[|$)/g),
      compose(map(slice(1, -1)), match(/\[(.*?)\]/g)),
    ]),
  ),
  split('\n'),
);

function* groupsOf(n, string) {
  for (let i = 0; i < string.length - n + 1; i++) {
    yield string.substring(i, i + n);
  }
}

const supportsTLS = string => {
  for (const group of groupsOf(4, string)) {
    if (
      group[0] === group[3] &&
      group[1] === group[2] &&
      group[0] !== group[1]
    ) {
      return true;
    }
  }
  return false;
};

const supportsSSL = (supernets, hypernets) => {
  for (const item of supernets) {
    for (const aba of groupsOf(3, item)) {
      if (
        aba[0] === aba[2] &&
        aba[0] !== aba[1] &&
        hypernets.some(includes(aba[1] + aba[0] + aba[1]))
      ) {
        return true;
      }
    }
  }
  return false;
};

const part1 = compose(
  count(
    converge(apply(and), [
      evolve({
        0: any(supportsTLS),
        1: all(complement(supportsTLS)),
      }),
    ]),
  ),
  prepare,
);

const part2 = compose(count(apply(supportsSSL)), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
