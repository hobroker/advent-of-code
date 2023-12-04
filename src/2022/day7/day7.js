import { read } from '../../../lib/read.js';
import {
  compose,
  filter,
  gte,
  head,
  lte,
  path,
  sort,
  split,
  subtract,
  sum,
} from 'ramda';

const data = read('input.txt');

const parse = (lines) => {
  let cd = [];
  return lines.reduce((acc, line) => {
    if (line.startsWith('$ cd ')) {
      const dir = line.replace('$ cd ', '');
      cd = dir === '/' ? [] : dir === '..' ? cd.slice(0, -1) : [...cd, dir];
    } else if (!line.startsWith('$')) {
      const [size, name] = line.split(' ');
      path(cd, acc)[name] = size === 'dir' ? {} : size;
    }
    return acc;
  }, {});
};

const calculate = (tree, list = []) => {
  const total = Object.values(tree).reduce((acc, value) => {
    if (isNaN(Number(value))) {
      const [subtotal] = calculate(value, list);
      list.unshift(subtotal);
      return acc + subtotal;
    }
    return acc + Number(value);
  }, 0);
  return [total, ...list];
};

const findCandidatesToDelete = (list) =>
  list.filter(lte(30000000 - (70000000 - list[0])));

const prepare = compose(calculate, parse, split('\n'));

const part1 = compose(sum, filter(gte(100000)), prepare);
const part2 = compose(head, sort(subtract), findCandidatesToDelete, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
