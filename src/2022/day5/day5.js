import { read } from '../../../lib/read.js';
import {
  clone,
  compose,
  filter,
  head,
  identity,
  join,
  juxt,
  last,
  map,
  match,
  reverse,
  split,
  splitEvery,
  transpose,
} from 'ramda';

const data = read('input.txt');

const prepareRows = compose(
  map(compose(filter(Boolean), map(compose(head, match(/[A-Z]/))))),
  transpose,
  map(splitEvery(4)),
  split('\n'),
);
const prepareSteps = compose(
  map(
    compose(
      ([move, from, to]) => [move, from - 1, to - 1],
      filter(Boolean),
      map(Number),
      split(/(move | from | to )/),
    ),
  ),
  split('\n'),
);
const prepare = compose(
  juxt([compose(prepareRows, head), compose(prepareSteps, last)]),
  split('\n\n'),
);

const moveCrates =
  fn =>
  ([rows, steps]) => {
    const result = clone(rows);
    steps.forEach(([move, from, to]) =>
      result[to].unshift(...fn(result[from].splice(0, move))),
    );

    return result;
  };

const part1 = compose(join(''), map(head), moveCrates(reverse), prepare);
const part2 = compose(join(''), map(head), moveCrates(identity), prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
