import {
  compose,
  count,
  evolve,
  lte,
  map,
  match,
  nth,
  prop,
  split,
  toPairs,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const matchNumbers = compose(
  map(compose(map(Number), match(/\d+/g))),
  split('\n'),
);
const prepare = compose(
  evolve({
    0: compose(map(matchNumbers), split('\n\n')),
    1: matchNumbers,
  }),
  split('\n\n\n\n'),
);

const operations = {
  addr: (input, [, a, b]) => input[a] + input[b],
  addi: (input, [, a, b]) => input[a] + b,
  mulr: (input, [, a, b]) => input[a] * input[b],
  muli: (input, [, a, b]) => input[a] * b,
  banr: (input, [, a, b]) => input[a] & input[b],
  bani: (input, [, a, b]) => input[a] & b,
  borr: (input, [, a, b]) => input[a] | input[b],
  bori: (input, [, a, b]) => input[a] | b,
  setr: (input, [, a]) => input[a],
  seti: (_, [, a]) => a,
  gtir: (input, [, a, b]) => (a > input[b] ? 1 : 0),
  gtri: (input, [, a, b]) => (input[a] > b ? 1 : 0),
  gtrr: (input, [, a, b]) => (input[a] > input[b] ? 1 : 0),
  eqir: (input, [, a, b]) => (a === input[b] ? 1 : 0),
  eqri: (input, [, a, b]) => (input[a] === b ? 1 : 0),
  eqrr: (input, [, a, b]) => (input[a] === input[b] ? 1 : 0),
};

const findPosibilities = samples => {
  const posibilities = {};
  const counts = [];
  samples.forEach(([input, instructions, output]) => {
    let count = 0;
    const [op, , , c] = instructions;
    for (const key in operations) {
      const operation = operations[key];
      if (!posibilities[key]) posibilities[key] = [];
      if (operation(input, instructions) === output[c]) {
        count++;
        if (!posibilities[key].includes(op)) {
          posibilities[key].push(op);
        }
      }
    }
    counts.push(count);
  });

  return { counts, posibilities };
};

const part1 = compose(
  count(lte(3)),
  prop('counts'),
  findPosibilities,
  nth(0),
  prepare,
);

const simplify = posibilities => {
  const knowns = Object.values(posibilities).reduce(
    (acc, value) => (value.length === 1 ? [...acc, value[0]] : acc),
    [],
  );
  let changed = false;
  for (const key in posibilities) {
    if (posibilities[key].length === 1) continue;
    posibilities[key] = posibilities[key].filter(
      value => !knowns.includes(value),
    );
    changed = true;
  }
  return changed;
};

const findOperationsMap = compose(
  codes => codes.reduce((acc, [op, [index]]) => ({ ...acc, [index]: op }), {}),
  toPairs,
  posibilities => {
    while (simplify(posibilities));
    return posibilities;
  },
  prop('posibilities'),
  findPosibilities,
);

const part2 = compose(
  nth(0),
  ([samples, program]) => {
    const codes = findOperationsMap(samples);
    const register = [0, 0, 0, 0];
    for (const instruction of program) {
      const [op, , , c] = instruction;
      const operation = operations[codes[op]];
      register[c] = operation(register, instruction);
    }
    return register;
  },
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
