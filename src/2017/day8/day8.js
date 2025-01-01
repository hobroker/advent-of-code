import {
  __,
  add,
  applySpec,
  complement,
  compose,
  equals,
  gt,
  gte,
  head,
  lt,
  lte,
  map,
  nth,
  prop,
  split,
  subtract,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const comparisonOf = prop(__, {
  '==': equals,
  '!=': complement(equals),
  '<': lt,
  '<=': lte,
  '>': gt,
  '>=': gte,
});
const modifyOf = prop(__, {
  inc: add,
  dec: subtract,
});
const prepare = compose(
  map(
    compose(
      applySpec({
        variable: head,
        modify: applySpec({
          fn: compose(modifyOf, nth(1)),
          value: compose(Number, nth(2)),
        }),
        condition: applySpec({
          variable: nth(4),
          fn: compose(comparisonOf, nth(5)),
          value: compose(Number, nth(6)),
        }),
      }),
      split(/\s+/),
    ),
  ),
  split('\n'),
);

const run = operations => {
  let maxValue = -Infinity;
  const registry = operations.reduce(
    (registry, { variable, modify, condition }) => {
      if (condition.fn(registry[condition.variable] || 0, condition.value)) {
        registry[variable] = modify.fn(registry[variable] || 0, modify.value);
        if (registry[variable] > maxValue) {
          maxValue = registry[variable];
        }
      }
      return registry;
    },
    {},
  );

  return {
    maxEndValue: Math.max(...Object.values(registry)),
    maxValue,
  };
};

const part1 = compose(prop('maxEndValue'), run, prepare);

const part2 = compose(prop('maxValue'), run, prepare);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
