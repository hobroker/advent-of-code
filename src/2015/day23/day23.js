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
    registers: {
      a: always(0),
      b: always(0),
    },
  }),
  map(split(/, | /)),
  split('\n'),
);

const run = ({ registers, instructions }) => {
  const get = variable => Number(variable) || registers[variable];
  for (let i = 0; i < instructions.length; i++) {
    const [command, variable, offset] = instructions[i];
    switch (command) {
      case 'inc':
        registers[variable]++;
        break;
      case 'hlf':
        registers[variable] /= 2;
        break;
      case 'tpl':
        registers[variable] *= 3;
        break;
      case 'jmp':
        i += get(variable) - 1;
        break;
      case 'jie':
        if (registers[variable] % 2 === 0) i += get(offset) - 1;
        break;
      case 'jio':
        if (registers[variable] === 1) i += get(offset) - 1;
        break;
    }
  }

  return registers;
};

const part1 = compose(prop('b'), run, prepare);

const part2 = compose(
  prop('b'),
  run,
  evolve({
    registers: {
      a: always(1),
    },
  }),
  prepare,
);

console.log('part 1', part1(data));
console.log('part 2', part2(data));
