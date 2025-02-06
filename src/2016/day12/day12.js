import {
  always,
  applySpec,
  compose,
  evolve,
  identity,
  map,
  prop,
  split,
} from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const prepare = compose(
  applySpec({
    instructions: identity,
    registers: () => ({ a: 0, b: 0, c: 0, d: 0 }),
  }),
  map(split(' ')),
  split('\n'),
);

const run = ({ registers, instructions }) => {
  const get = variable => Number(variable) || registers[variable];
  for (let i = 0; i < instructions.length; i++) {
    const [command, a, b] = instructions[i];
    if (command === 'cpy') registers[b] = get(a);
    else if (command === 'inc') registers[a]++;
    else if (command === 'dec') registers[a]--;
    else if (command === 'jnz' && get(a) !== 0) i += get(b) - 1;
  }

  return registers;
};

const part1 = compose(prop('a'), run, prepare);

const part2 = compose(
  prop('a'),
  run,
  evolve({
    registers: {
      c: always(1),
    },
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
