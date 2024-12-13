import { read } from '../../../lib/read.js';
import {
  add,
  applySpec,
  compose,
  evolve,
  map,
  match,
  nth,
  reduce,
  split,
  sum,
} from 'ramda';

const data = read('input.txt');

const matchNumbers = compose(map(Number), match(/\d+/g));
const prepare = compose(
  map(
    compose(
      applySpec({
        a: compose(matchNumbers, nth(0)),
        b: compose(matchNumbers, nth(1)),
        prize: compose(matchNumbers, nth(2)),
      }),
      split('\n'),
    ),
  ),
  split('\n\n'),
);

const maxTokens = (paths, { prize: [x, y], a: [ax, ay], b: [bx, by] }) => {
  const times_a = (bx * y - by * x) / (ay * bx - ax * by);
  const times_b = (x - ax * times_a) / bx;

  if (
    (bx * y - by * x) % (ay * bx - ax * by) !== 0 ||
    (x - ax * times_a) % bx !== 0
  ) {
    return paths;
  }

  return [...paths, times_a * 3 + times_b];
};

const part1 = compose(sum, reduce(maxTokens, []), prepare);

const part2 = compose(
  sum,
  reduce(maxTokens, []),
  map(evolve({ prize: map(add(10000000000000)) })),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
