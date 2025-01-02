import {
  __,
  compose,
  curry,
  fromPairs,
  head,
  juxt,
  last,
  map,
  prop,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  fromPairs,
  map(compose(juxt([head, compose(split(', '), last)]), split(' <-> '))),
  split('\n'),
);

const count = curry((node, seen, nodes) => {
  if (seen.has(node)) return seen;
  seen.add(node);
  nodes[node].forEach(count(__, seen, nodes));
  return seen;
});

const part1 = compose(prop('size'), count('0', new Set()), prepare);

const part2 = compose(nodes => {
  let groups = 0;
  const seen = new Set();
  for (const node in nodes) {
    if (seen.has(node)) continue;
    count(node, seen, nodes);
    groups++;
  }
  return groups;
}, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
