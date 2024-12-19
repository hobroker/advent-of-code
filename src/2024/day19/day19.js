import { read } from '../../../lib/read.js';
import {
  applySpec,
  compose,
  curry,
  head,
  last,
  split,
  length,
  sum,
} from 'ramda';

const data = read(`${import.meta.dirname}/input.txt`);

const prepare = compose(
  applySpec({
    patterns: compose(split(', '), head),
    designs: compose(split('\n'), last),
  }),
  split('\n\n'),
);

const isPossible = curry(
  (patterns, design) =>
    !design ||
    patterns.some(
      pattern =>
        design.startsWith(pattern) &&
        isPossible(patterns, design.slice(pattern.length)),
    ),
);

const countFormations = (patterns, design, memo = {}) => {
  if (!design) return 1;
  if (design in memo) return memo[design];

  return (memo[design] = patterns.reduce(
    (acc, pattern) =>
      design.startsWith(pattern)
        ? acc + countFormations(patterns, design.slice(pattern.length), memo)
        : acc,
    0,
  ));
};

const part1 = compose(
  length,
  ({ patterns, designs }) => designs.filter(isPossible(patterns)),
  prepare,
);

const part2 = compose(
  sum,
  ({ patterns, designs }) =>
    designs.map(design => countFormations(patterns, design)),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
