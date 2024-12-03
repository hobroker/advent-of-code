import { read } from '../../../lib/read.js';
import { compose, map, match, multiply, prop, reduce, sum } from 'ramda';

const data = read('input.txt');

const calculate = compose(
  sum,
  map(compose(reduce(multiply, 1), match(/\d+/g))),
);

const part1 = compose(calculate, match(/mul\(\d+,\d+\)/g));

const part2 = compose(
  calculate,
  prop('list'),
  reduce(
    (acc, item) => {
      if (item.includes('do')) return { ...acc, ignore: item.includes('t') };
      return acc.ignore ? acc : { ...acc, list: [...acc.list, item] };
    },
    { ignore: false, list: [] },
  ),
  match(/(mul\(\d+,\d+\)|don't\(\)|do\(\))/g),
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
