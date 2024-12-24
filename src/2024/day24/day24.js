import {
  and,
  applySpec,
  compose,
  curry,
  descend,
  fromPairs,
  head,
  join,
  juxt,
  last,
  map,
  mapObjIndexed,
  nth,
  nthArg,
  or,
  pickBy,
  sortWith,
  split,
  startsWith,
  toPairs,
  xor,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const prepare = compose(
  applySpec({
    inputs: compose(
      map(Number),
      fromPairs,
      map(split(': ')),
      split('\n'),
      head,
    ),
    gates: compose(
      fromPairs,
      map(compose(juxt([last, compose(split(' '), head)]), split(' -> '))),
      split('\n'),
      last,
    ),
  }),
  split('\n\n'),
);

const ops = { AND: and, OR: or, XOR: xor };

const solve = curry(
  ({ inputs, gates }, identifier) =>
    inputs[identifier] ??
    (([a, op, b]) =>
      ops[op](solve({ inputs, gates }, a), solve({ inputs, gates }, b)))(
      gates[identifier],
    ),
);

const part1 = compose(
  value => parseInt(value, 2),
  join(''),
  map(compose(Number, nth(1))),
  sortWith([descend(nth(0))]),
  toPairs,
  pickBy(compose(startsWith('z'), nthArg(1))),
  ({ inputs, gates }) =>
    mapObjIndexed(compose(solve({ inputs, gates }), nthArg(1)), gates),
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
