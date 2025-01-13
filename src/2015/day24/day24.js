import {
  compose,
  curry,
  descend,
  equals,
  map,
  multiply,
  reduce,
  split,
  sum,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(map(Number), split('\n'));

function combinations(array, size) {
  const results = [];

  function doCombination(offset, combo) {
    if (combo.length === size) return results.push(combo);
    for (let i = offset; i < array.length; i++) {
      doCombination(i + 1, [...combo, array[i]]);
    }
  }

  doCombination(0, []);
  return results;
}

const findCombination = (list, weight, n = 2) => {
  const perms = combinations(list, n).filter(compose(equals(weight), sum));
  return perms.length ? perms : findCombination(list, weight, n + 1);
};

const findQE = curry(
  (groups, list) =>
    findCombination(list, sum(list) / groups)
      .map(reduce(multiply, 1))
      .sort(descend)[0],
);

const part1 = compose(findQE(3), prepare);
const part2 = compose(findQE(4), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
