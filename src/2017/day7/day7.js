import {
  always,
  applySpec,
  chain,
  compose,
  head,
  identity,
  ifElse,
  map,
  match,
  nth,
  prop,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  map(
    applySpec({
      name: compose(head, match(/(\w+)/)),
      weight: compose(Number, head, match(/\d+/)),
      leaves: compose(
        ifElse(identity, split(', '), always([])),
        nth(1),
        match(/ -> (.*)/),
      ),
    }),
  ),
  split('\n'),
);

const part1 = compose(
  ({ roots, leaves }) => roots.find(root => !leaves.includes(root)),
  applySpec({
    leaves: chain(prop('leaves')),
    roots: chain(prop('name')),
  }),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
