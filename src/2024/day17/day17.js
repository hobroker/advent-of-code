import { read } from '../../../lib/read.js';
import { applySpec, compose, head, join, last, map, match, split } from 'ramda';

const data = read('input.txt');

const prepare = compose(
  applySpec({
    registers: compose(map(Number), match(/\d+/g), head),
    program: compose(map(Number), match(/\d+/g), last),
  }),
  split('\n\n'),
);

const combo = ([a, b, c], operand) =>
  operand === 4 ? a : operand === 5 ? b : operand === 6 ? c : operand;

const instructions = [
  // adv
  (registers, operand) => {
    registers[0] = Math.floor(registers[0] / 2 ** combo(registers, operand));
  },

  // bxl
  (registers, operand) => {
    registers[1] = registers[1] ^ operand;
  },

  // bst
  (registers, operand) => {
    registers[1] = combo(registers, operand) % 8;
  },

  // jnz
  (registers, operand) => {
    return registers[0] === 0 ? undefined : operand;
  },

  // bxc
  registers => {
    registers[1] = registers[1] ^ registers[2];
  },

  // out
  (registers, operand, out) => {
    out.push(combo(registers, operand) % 8);
  },

  // bdv
  (registers, operand) => {
    registers[1] = Math.floor(registers[0] / 2 ** combo(registers, operand));
  },

  // cdv
  (registers, operand) => {
    registers[2] = Math.floor(registers[0] / 2 ** combo(registers, operand));
  },
];

const part1 = compose(
  join(','),
  ({ registers, program }) => {
    let p = 0;
    const out = [];
    while (p < program.length - 1) {
      const f = instructions[program[p]];
      p = f(registers, program[p + 1], out) ?? p + 2;
    }
    return out;
  },
  prepare,
);

// const part2 = compose(prepare);

console.log('part 1', part1(data));
// console.log('part 2', part2(data));
