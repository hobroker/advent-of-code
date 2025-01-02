import { compose, evolve, lte, map, match, split, when } from 'ramda';
import { read } from '../../../lib/read.js';

const data = read(`${import.meta.dirname}/input.txt`);
const possibleNumber = when(compose(lte(0), match(/[a-z]/)), Number);
const prepare = compose(
  map(
    compose(
      evolve({
        1: possibleNumber,
        2: possibleNumber,
      }),
      split(' '),
    ),
  ),
  split('\n'),
);

const part1 = compose(instructions => {
  const register = {};
  let yell = null;
  const get = value =>
    typeof value === 'string' ? (register[value] ?? 0) : value;
  for (let i = 0; i < instructions.length; i++) {
    const [command, variable, value] = instructions[i];
    if (command === 'set') register[variable] = get(value);
    if (command === 'add') register[variable] = get(variable) + get(value);
    if (command === 'mul') register[variable] = get(variable) * get(value);
    if (command === 'mod') register[variable] = get(variable) % get(value);
    if (command === 'snd') yell = get(variable);
    if (command === 'rcv' && get(variable)) return yell;
    if (command === 'jgz' && get(variable) > 0) i += get(value) - 1;
  }
}, prepare);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
