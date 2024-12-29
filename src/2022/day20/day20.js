import { read } from '../../../lib/read.js';
import {
  compose,
  curry,
  evolve,
  juxt,
  map,
  multiply,
  objOf,
  propEq,
  split,
  sum,
} from 'ramda';

const data = read('input.txt');

const prepare = compose(map(compose(objOf('n'), Number)), split('\n'));
const mix = curry((times, input) => {
  const mixed = [...input];
  for (let idx = 0; idx < times; idx++) {
    input.forEach(number => {
      const mixedIndex = mixed.indexOf(number);
      mixed.splice(mixedIndex, 1);
      const newIndex = (mixedIndex + number.n) % mixed.length;
      mixed.splice(newIndex, 0, number);
    });
  }
  return mixed;
});
const cord = curry(
  (index, list) =>
    list[(list.findIndex(propEq('n', 0)) + index) % list.length].n,
);
const coordinates = compose(sum, juxt([cord(1000), cord(2000), cord(3000)]));
const part1 = compose(coordinates, mix(1), prepare);
const part2 = compose(
  coordinates,
  mix(10),
  map(evolve({ n: multiply(811589153) })),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
