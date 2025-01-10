import { applySpec, compose, map, nth, prop, split } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  applySpec({
    replacements: compose(map(split(' => ')), split('\n'), nth(0)),
    molecule: nth(1),
  }),
  split('\n\n'),
);

const part1 = compose(
  prop('size'),
  ({ replacements, molecule }) =>
    replacements.reduce(
      (acc, [from, to]) =>
        [...molecule.matchAll(new RegExp(from, 'g'))].reduce(
          (acc, { index }) => {
            acc.add(
              molecule.slice(0, index) +
                to +
                molecule.slice(index + from.length),
            );
            return acc;
          },
          acc,
        ),
      new Set(),
    ),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
