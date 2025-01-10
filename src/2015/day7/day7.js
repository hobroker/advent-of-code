import {
  __,
  always,
  applySpec,
  assoc,
  compose,
  converge,
  curry,
  fromPairs,
  identity,
  map,
  split,
  test,
  when,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);

const prepare = compose(
  fromPairs,
  map(instruction => {
    const args = instruction.match(/[a-z0-9]+/g);
    return [
      args.pop(),
      [
        instruction.match(/[A-Z]+/g)?.[0],
        args.map(when(test(/^\d+$/), Number)),
      ],
    ];
  }),
  split('\n'),
);

const ops = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  NOT: a => ~a,
  LSHIFT: (a, b) => a << b,
  RSHIFT: (a, b) => a >> b,
};

const calc = curry((key, { wires, register }) => {
  const wire = wires[key];

  if (typeof key === 'number') return key;
  if (typeof wire === 'number') return wire;
  if (register[key] !== undefined) return register[key];
  if (!wire) return;

  const args = wire[1];
  if (!wire[0]) {
    register[key] = calc(args[0], { wires, register });
  } else {
    register[key] = ops[wire[0]](...args.map(calc(__, { wires, register })));
  }

  return register[key];
});

const evaluate = key =>
  compose(
    calc(key),
    applySpec({
      wires: identity,
      register: always({}),
    }),
  );

const part1 = compose(evaluate('a'), prepare);

const part2 = compose(
  evaluate('a'),
  converge(assoc('b'), [evaluate('a'), identity]),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
