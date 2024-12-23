import {
  __,
  any,
  compose,
  filter,
  includes,
  join,
  last,
  length,
  map,
  prop,
  reduce,
  sort,
  sortBy,
  split,
  startsWith,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const prepare = compose(
  reduce((acc, [a, b]) => {
    (acc[a] ||= []).push(b);
    (acc[b] ||= []).push(a);
    return acc;
  }, {}),
  map(split('-')),
  split('\n'),
);

const part1 = compose(
  length,
  filter(any(startsWith('t'))),
  map =>
    Object.keys(map).reduce((acc, node1, i, nodes) => {
      nodes.slice(i + 1).forEach((node2, j) => {
        nodes.slice(i + j + 1).forEach(node3 => {
          if (
            map[node1].includes(node2) &&
            map[node2].includes(node3) &&
            map[node3].includes(node1)
          ) {
            acc.push([node1, node2, node3]);
          }
        });
      });
      return acc;
    }, []),
  prepare,
);

const part2 = compose(
  join(','),
  sort((a, b) => a.localeCompare(b)),
  last,
  sortBy(prop('length')),
  map =>
    Object.keys(map).reduce(
      (list, node) => {
        list.forEach(
          item => item.every(includes(__, map[node])) && item.push(node),
        );
        return list;
      },
      [...Object.keys(map).map(node => [node])],
    ),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
